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

export const useBattle = (initialBattleId: string | null = null) => {
  const { user } = useAuthStore();
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'ready' | 'active' | 'finished'>('idle');
  const [battleId, setBattleId] = useState<string | null>(initialBattleId);
  const [opponent, setOpponent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Persistence logic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('active_battle');
      if (saved && !initialBattleId) {
        const data = JSON.parse(saved);
        setBattleId(data.battleId);
        setOpponent(data.opponent);
        setQuestions(data.questions);
        setStatus('active');
      }
    }
  }, [initialBattleId]);

  useEffect(() => {
    if (battleId && opponent && questions.length > 0) {
      localStorage.setItem('active_battle', JSON.stringify({ battleId, opponent, questions }));
    }
    if (status === 'finished') {
      localStorage.removeItem('active_battle');
    }
  }, [battleId, opponent, questions, status]);

  useEffect(() => {
    if (!user) return;

    const context = battleId ? 'battle-match' : 'battle-lobby';
    const url = `${WS_URL}?userId=${user.id}${battleId ? `&roomId=${battleId}` : ''}&context=${context}`;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Battle socket connected', { battleId });
      if (battleId) {
        socket.send(JSON.stringify({
          event: 'join_room',
          data: { roomId: battleId }
        }));

        // Re-fetch room data to get questions and participants if we're re-joining
        api.get(`/battles/${battleId}`).then(res => {
          // If we joined via room code, sync to the actual UUID
          if (res.data.id && res.data.id !== battleId) {
            console.log('Syncing battleId to UUID:', res.data.id);
            setBattleId(res.data.id);
          }
          if (res.data.participants) {
            setParticipants(res.data.participants);
          }
          if (res.data.questions && res.data.questions.length > 0) {
            setQuestions(res.data.questions);
            if (res.data.status === 'active') {
              setStatus('active');
            } else if (res.data.status === 'completed') {
              setStatus('finished');
              setFinalResult(res.data);
            }
            
            const opp = res.data.participants?.find((p: any) => p.userId !== user.id)?.user;
            if (opp) setOpponent(opp);
          }
        }).catch(err => console.error("Error re-syncing battle", err));
      }
    };

    socket.onmessage = (event) => {
      try {
        const { event: ev, data } = JSON.parse(event.data);
        console.log('WS message received:', ev, data);

        switch (ev) {
          case 'battle:found':
          case 'battle:started':
            if (data.battleId) setBattleId(data.battleId);
            if (data.opponent) setOpponent(data.opponent);
            if (data.questions) setQuestions(data.questions);
            if (data.participants) setParticipants(data.participants);
            else if (data.opponent) setParticipants([{ userId: user.id, user: user }, { userId: data.opponent.id, user: data.opponent }]);
            
            // Sync battleId for persistence and fetching
            if (data.battleId) {
              localStorage.setItem('active_battle_id', data.battleId);
            }

            // Only trigger start sequence if we aren't already in the arena
            if (status !== 'active' && status !== 'ready' && status !== 'found') {
              setStatus('found');
              
              // Join the actual battle room
              socket.send(JSON.stringify({
                event: 'join_room',
                data: { roomId: data.battleId || battleId }
              }));
              
              // Progression timeline
              setTimeout(() => {
                setStatus('ready');
                setTimeout(() => setStatus('active'), 2000);
              }, 3000);
            } else if (status === 'active' && !questions.length && data.questions) {
               // If we are active but questions were missing (re-sync), just update them
               setQuestions(data.questions);
            }
            break;

          case 'battle:player_joined':
            if (data.participant) {
              setParticipants(prev => {
                const exists = prev.some(p => p.userId === data.participant.userId);
                if (exists) return prev;
                return [...prev, data.participant];
              });
              setOnlineUsers(prev => new Set(prev).add(data.participant.userId));
              if (data.participant.userId !== user.id) {
                setOpponent(data.participant.user);
              }
            }
            break;

          case 'battle:player_left':
            if (data.userId) {
              setParticipants(prev => prev.filter(p => p.userId !== data.userId));
              setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(data.userId);
                return next;
              });
            }
            break;

          case 'battle:player_offline':
            if (data.userId) {
              setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(data.userId);
                return next;
              });
            }
            break;

          case 'battle:player_online':
            if (data.userId) {
              setOnlineUsers(prev => new Set(prev).add(data.userId));
            }
            break;

          case 'battle:progress':
            if (data.userId !== user.id) {
              setOpponentProgress(data.progress || 0);
              setOpponentScore(data.score || 0);
            }
            break;

          case 'battle:completed':
          case 'battle:finished':
            setStatus('finished');
            setFinalResult(data);
            break;
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    socket.onclose = () => {
      console.log('Battle socket disconnected');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user, battleId]);

  const joinQueue = async (subjectId: string | number, stake: number) => {
    setStatus('searching');
    try {
      await api.post('/battles/queue', { subjectId: Number(subjectId), stake: Number(stake) });
    } catch (error) {
      console.error('Failed to join queue', error);
      setStatus('idle');
      throw error;
    }
  };

  const updateProgress = useCallback((score: number, progress: number) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && battleId && user) {
      socketRef.current.send(JSON.stringify({
        event: 'battle:update_progress',
        data: {
          battleId,
          userId: user.id,
          score,
          progress
        }
      }));
    }
  }, [battleId, user]);

  const submitFinalScore = async (score: number, botScore: number = 0) => {
    if (battleId) {
      await api.post('/battles/submit-score', { battleId, score, botScore });
    }
  };

  const finish = useCallback(() => {
    setStatus('finished');
  }, []);

  const startBattle = async () => {
    if (battleId) {
      try {
        await api.post(`/battles/${battleId}/start`);
        // Optionally update status or notify user
        console.log('Battle started successfully');
      } catch (err: any) {
        console.error('Failed to start battle', err);
        // Show toast if available
        if (typeof window !== 'undefined') {
          // Dynamically import toast to avoid circular deps
          import('react-hot-toast').then(({ toast }) => {
            toast.error(err?.response?.data?.error || 'Failed to start battle');
          });
        }
      }
    }
  };

  return {
    status,
    battleId,
    opponent,
    participants,
    questions,
    opponentProgress,
    opponentScore,
    finalResult,
    joinQueue,
    updateProgress,
    submitFinalScore,
    startBattle,
    finish
  };
};
