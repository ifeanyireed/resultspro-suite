"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';

const getWsUrl = () => {
  if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_WS_URL || 'wss://localhost:8080/ws';
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  
  // If we are in the browser and not on localhost, use the current host with /ws
  if (!window.location.hostname.includes('localhost')) {
    return `${protocol}//${window.location.host}/ws`;
  }
  
  return process.env.NEXT_PUBLIC_WS_URL || `${protocol}//localhost:8080/ws`;
};

const WS_URL = getWsUrl();

export const useLiveGame = (roomId: string) => {
  const { user, token } = useAuthStore();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [gameStatus, setGameStatus] = useState<'pending' | 'active' | 'finished'>('pending');
  const [playersCount, setPlayersCount] = useState(0);
  const [winners, setWinners] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isTerminated, setIsTerminated] = useState(false);
  
  // Use a ref for guestId to keep it stable
  const guestIdRef = useRef(`guest_${Math.random().toString(36).slice(2, 7)}`);

  const fetchRoomDetails = useCallback(async () => {
    if (!roomId) return;
    try {
      const res = await api.get(`/live/rooms/${roomId}`);
      
      if (res.data.status) setGameStatus(res.data.status);
      if (typeof res.data.currentQuestionIndex === 'number') {
        setQuestionIndex(res.data.currentQuestionIndex);
      }
      if (res.data.currentQuestion) {
        setCurrentQuestion(res.data.currentQuestion);
      }
      if (res.data.participants) {
        const sorted = [...res.data.participants].sort((a, b) => (b.score || 0) - (a.score || 0));
        setLeaderboard(sorted);
      }

      if (res.data.chatMessages) {
        const history = res.data.chatMessages.map((m: any) => ({
          user: m.userId === user?.id ? 'You' : (m.user?.name || `User ${m.userId.slice(0,4)}`),
          text: m.content,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userId: m.userId
        }));
        setChatMessages(prev => {
          const existingIds = new Set(prev.map(p => `${p.userId}-${p.time}-${p.text}`));
          const newHistory = history.filter((h: any) => !existingIds.has(`${h.userId}-${h.time}-${h.text}`));
          return [...newHistory, ...prev];
        });
      }
    } catch (error) {
      console.error('Error refreshing room details:', error);
    }
  }, [roomId, user?.id]);

  const connect = useCallback(() => {
    if (!roomId) return;
    
    // Close existing if any
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        return; // Already active or connecting
      }
    }

    const isAdmin = user?.role === 'ADMIN';
    const url = user 
      ? `${WS_URL}?userId=${user.id}&token=${token}&roomId=${roomId}${isAdmin ? '&isAdmin=true' : ''}`
      : `${WS_URL}?guestId=${guestIdRef.current}&roomId=${roomId}`;

    console.log('[WS] Connecting to:', url);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[WS] Connected to room:', roomId);
      setIsConnected(true);
      ws.send(JSON.stringify({
        event: 'join_room',
        data: { roomId }
      }));
    };

    ws.onmessage = (event) => {
      const { event: ev, data } = JSON.parse(event.data);
      console.log('[WS] Event Received:', ev, data);

      const playSound = (soundName: string) => {
        const audio = new Audio(`/sounds/${soundName}`);
        audio.play().catch(err => console.log("Sound play error:", err));
      };

      switch (ev) {
        case 'live:room_sync':
          setPlayersCount(data.count);
          break;
        case 'live:player_joined':
          playSound('joined_game.mp3');
          fetchRoomDetails();
          break;
        case 'game:started':
          setGameStatus('active');
          playSound('game_starts.mp3');
          break;
        case 'game:question_reveal':
          setCurrentQuestion(data.question);
          setQuestionIndex(data.questionIndex);
          break;
        case 'game:leaderboard_update':
          const sorted = [...data].sort((a, b) => (b.score || 0) - (a.score || 0));
          setLeaderboard(sorted);
          break;
        case 'game:finished':
          setGameStatus('finished');
          setWinners(data.winners);
          break;
        case 'room:terminated':
          setIsTerminated(true);
          break;
        case 'chat:message':
          setChatMessages((prev) => [...prev, {
            user: data.userId === user?.id ? 'You' : (data.userName || `User ${data.userId?.slice(0,4)}`),
            text: data.text,
            time: data.time,
            userId: data.userId,
            system: data.system
          }]);
          break;
      }
    };

    ws.onclose = () => {
      console.log('[WS] Disconnected from room:', roomId);
      setIsConnected(false);
      wsRef.current = null;
    };

    ws.onerror = (err) => {
      console.error('[WS] Socket Error:', err);
      ws.close();
    };
  }, [roomId, user?.id, user?.role, token, fetchRoomDetails]);

  // Handle initial connection and room changes
  useEffect(() => {
    fetchRoomDetails();
    connect();

    return () => {
      if (wsRef.current) {
        console.log('[WS] Cleaning up socket for room:', roomId);
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [roomId, connect]); // roomId and connect are the only stable dependencies we need

  // Separate effect for auto-reconnect to avoid loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isConnected && roomId) {
      interval = setInterval(() => {
        console.log('[WS] Attempting auto-reconnect...');
        connect();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isConnected, roomId, connect]);

  const submitAnswer = useCallback((isCorrect: boolean, timeLeftSec: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && user) {
      wsRef.current.send(JSON.stringify({
        event: 'game:submit_answer',
        data: {
          roomId,
          userId: user.id,
          isCorrect,
          timeLeftSec
        }
      }));
    }
  }, [roomId, user?.id]);

  const pushQuestion = useCallback((index: number, question: any) => {
    console.log('[WS] pushQuestion called:', { index, questionId: question?.id });
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        event: 'admin:push_question',
        data: {
          roomId,
          questionIndex: index,
          question
        }
      };
      wsRef.current.send(JSON.stringify(payload));
      setQuestionIndex(index);
      setCurrentQuestion(question);
    } else {
      console.error('[WS] Cannot push question: Socket not open', { state: wsRef.current?.readyState });
    }
  }, [roomId]);

  const startMatch = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        event: 'admin:start_match',
        data: { roomId }
      }));
      setGameStatus('active');
    }
  }, [roomId]);

  const endMatch = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        event: 'admin:end_match',
        data: { roomId }
      }));
    }
  }, [roomId]);

  const sendChatMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        event: 'chat:message',
        data: { roomId, text }
      }));
    }
  }, [roomId]);

  const broadcast = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        event: 'admin:room_broadcast',
        data: { roomId, text }
      }));
    }
  }, [roomId]);

  return {
    isConnected,
    currentQuestion,
    questionIndex,
    leaderboard,
    gameStatus,
    playersCount,
    winners,
    chatMessages,
    submitAnswer,
    pushQuestion,
    startMatch,
    endMatch,
    sendChatMessage,
    broadcast,
    isTerminated
  };
};
