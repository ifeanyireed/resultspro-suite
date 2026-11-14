"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  VideoCameraIcon, 
  ChatBubbleBottomCenterTextIcon, 
  HandRaisedIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowPathIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  HandRaisedIcon as HandRaisedSolid 
} from '@heroicons/react/24/solid';
import DailyIframe, { DailyCall, DailyEventObjectAppMessage } from '@daily-co/daily-js';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

interface ChatMessage {
  id?: string;
  sender: string;
  text: string;
  isSelf: boolean;
  time?: string;
}

interface ParticipantInfo {
  id: string;
  name: string;
  isLocal: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
  handRaised?: boolean;
}

export default function ClassroomPage() {
  const { user } = useAuthStore();
  const videoRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'ROSTER'>('CHAT');
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Cohort Session metadata
  const [sessionMeta, setSessionMeta] = useState<{
    cohortId?: string;
    cohortTitle?: string;
    schedule?: string;
    userName?: string;
  }>({});

  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (callObject) {
        callObject.leave();
        callObject.destroy();
      }
    };
  }, [callObject]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const updateParticipantsList = (frame: DailyCall) => {
    const raw = frame.participants();
    const list: ParticipantInfo[] = Object.entries(raw).map(([key, p]: [string, any]) => ({
      id: key,
      name: p.user_name || (key === 'local' ? (sessionMeta.userName || 'Me') : 'Cohort Student'),
      isLocal: key === 'local',
      hasAudio: p.audio,
      hasVideo: p.video,
    }));
    setParticipants(list);
  };

  const joinSession = async () => {
    if (callObject) return;
    setIsLoading(true);

    try {
      const res = await coursesApi.get('/api/student/classroom/session');
      const { room_url, token, conversation_id, cohort_title, schedule, user_name } = res.data;

      setSessionMeta({
        cohortTitle: cohort_title || 'Cohort Live Studio',
        schedule: schedule || 'Scheduled Cohort Sessions',
        userName: user_name || (user as any)?.name || 'Student',
      });

      setConversationId(conversation_id);

      // Load previous conversation history from service_coursespro
      if (conversation_id) {
        coursesApi.get(`/api/messages/conversations/${conversation_id}`)
          .then((msgRes) => {
            if (msgRes.data?.messages) {
              const history: ChatMessage[] = msgRes.data.messages.map((m: any) => ({
                id: m.id,
                sender: m.sender_id === user?.id ? 'Me' : (m.sender_name || 'Student'),
                text: m.content,
                isSelf: m.sender_id === user?.id,
                time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }));
              setMessages(history);
            }
          })
          .catch((e) => console.error("Failed to fetch message history", e));
      }

      if (videoRef.current) {
        const frame = DailyIframe.createFrame(videoRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '1.5rem',
            backgroundColor: '#0f172a',
          },
          showLeaveButton: true,
          showFullscreenButton: true,
          showUserNameChangeUI: false,
          theme: {
            colors: {
              accent: '#146ef5',
              background: '#0f172a',
              accentText: '#ffffff',
              mainText: '#f8fafc',
            } as any,
          },
        });

        frame.on('joined-meeting', () => {
          setIsJoined(true);
          setIsLoading(false);
          updateParticipantsList(frame);
          toast.success("Connected to live classroom!");
        });

        frame.on('left-meeting', () => {
          setIsJoined(false);
          setIsHandRaised(false);
          setCallObject(null);
          frame.destroy();
          toast("Left classroom session");
        });

        frame.on('participant-joined', () => updateParticipantsList(frame));
        frame.on('participant-left', () => updateParticipantsList(frame));
        frame.on('participant-updated', () => updateParticipantsList(frame));

        frame.on('app-message', (e: DailyEventObjectAppMessage) => {
          if (e.data?.type === 'HAND_RAISE') {
            toast(`${e.data.name || 'A student'} raised their hand!`, { icon: '✋' });
          } else if (e.data?.message) {
            setMessages((prev) => [
              ...prev,
              {
                sender: e.fromId === 'local' ? 'Me' : (frame.participants()[e.fromId]?.user_name || 'Student'),
                text: e.data.message,
                isSelf: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }
        });

        frame.on('error', (err) => {
          console.error("Daily meeting error:", err);
          toast.error("Classroom stream encountered an error");
          setIsLoading(false);
        });

        setCallObject(frame);
        await frame.join({ url: room_url, token });
      }
    } catch (err: any) {
      console.error("Failed to join session", err);
      setIsLoading(false);
      const msg = err.response?.data?.error || "Failed to join live classroom. Please verify your enrollment status.";
      toast.error(msg);
    }
  };

  const leaveSession = () => {
    if (callObject) {
      callObject.leave();
      callObject.destroy();
      setCallObject(null);
      setIsJoined(false);
      setIsHandRaised(false);
    }
  };

  const toggleHandRaise = () => {
    if (!callObject || !isJoined) return;
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);

    callObject.sendAppMessage({
      type: 'HAND_RAISE',
      name: sessionMeta.userName || (user as any)?.name || 'Student',
      active: nextState,
    });

    if (nextState) {
      toast("You raised your hand. Your mentor will be notified.", { icon: '✋' });
    } else {
      toast("Hand lowered");
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !callObject) return;

    const msg = chatMessage.trim();
    setChatMessage("");

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Broadcast instantly to other live participants via WebRTC data channel
    callObject.sendAppMessage({ message: msg });

    // Add to local chat feed
    setMessages((prev) => [
      ...prev,
      { sender: 'Me', text: msg, isSelf: true, time: timestamp },
    ]);

    // Persist to central conversation in service_coursespro
    if (conversationId) {
      coursesApi.post(`/api/messages/conversations/${conversationId}`, { content: msg })
        .catch((e) => console.error("Failed to persist classroom message", e));
    }
  };

  return (
    <MotionRise className="max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Live Classroom & Coworking
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isJoined 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {isJoined ? 'Live · In Session' : 'Standby Mode'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Collaborate with peers, participate in live mentor workshops, and ask architectural questions in real-time.
          </p>
        </div>

        {/* Live Controls Button */}
        <div className="flex items-center gap-3">
          {isJoined ? (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleHandRaise}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-colors ${
                  isHandRaised
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Raise Hand for Question"
              >
                <HandRaisedSolid className="w-4 h-4" />
                {isHandRaised ? 'Hand Raised' : 'Raise Hand'}
              </button>

              <button
                onClick={leaveSession}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs transition-colors flex items-center gap-1.5"
              >
                <XMarkIcon className="w-4 h-4" />
                Leave Session
              </button>
            </div>
          ) : (
            <button
              onClick={joinSession}
              disabled={isLoading}
              className="bg-[#146ef5] hover:bg-[#105bd1] disabled:opacity-70 text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-xs transition-colors flex items-center gap-2"
            >
              <VideoCameraIcon className="w-4 h-4" />
              {isLoading ? "Connecting to Daily..." : "Join Live Classroom"}
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[640px]">
        {/* Left: Video Canvas Area */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-md border border-slate-800">
          {!isJoined && (
            <div className="text-center z-10 px-6 py-12 max-w-lg">
              {/* Sleek SVG Camera Ring Avatar */}
              <div className="w-20 h-20 rounded-3xl bg-slate-900/90 border border-slate-700/80 text-blue-500 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <VideoCameraIcon className="w-10 h-10 animate-pulse" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Daily.co WebRTC Video Engine Ready
              </span>

              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                {sessionMeta.cohortTitle || 'Cohort Live Studio'}
              </h2>
              
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Click &ldquo;Join Live Classroom&rdquo; to turn on your camera and microphone, engage in code reviews, and work alongside mentors.
              </p>

              {sessionMeta.schedule && (
                <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs px-4 py-2 rounded-xl mb-6">
                  <ClockIcon className="w-4 h-4 text-blue-400" />
                  <span>Scheduled Session: {sessionMeta.schedule}</span>
                </div>
              )}

              <div>
                <button
                  onClick={joinSession}
                  disabled={isLoading}
                  className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-bold px-7 py-3 rounded-full transition-all shadow-md inline-flex items-center gap-2"
                >
                  <VideoCameraIcon className="w-4 h-4" />
                  {isLoading ? 'Establishing Connection...' : 'Enter Classroom Now'}
                </button>
              </div>
            </div>
          )}

          {/* Daily Iframe Injection Container */}
          <div 
            ref={videoRef} 
            className={`w-full h-full absolute inset-0 z-20 ${isJoined ? 'block' : 'hidden'}`}
          />
        </div>

        {/* Right: Interactive Communication & Participant Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
          {/* Header Tab Switcher */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('CHAT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'CHAT'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ChatBubbleBottomCenterTextIcon className="w-3.5 h-3.5" />
                Live Chat
              </button>

              <button
                onClick={() => setActiveTab('ROSTER')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'ROSTER'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserGroupIcon className="w-3.5 h-3.5" />
                Peers ({participants.length})
              </button>
            </div>

            {isJoined && (
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                {participants.length} Online
              </span>
            )}
          </div>

          {/* Tab 1: Live Chat Area */}
          {activeTab === 'CHAT' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/40">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-16 px-4">
                    <ChatBubbleBottomCenterTextIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                    <p className="font-medium text-slate-600 mb-1">
                      {isJoined ? "No messages yet in this session." : "Join the session to chat."}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Share insights, GitHub repositories, or questions for your mentor.
                    </p>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div
                      key={m.id || i}
                      className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-bold text-slate-600">
                          {m.sender}
                        </span>
                        {m.time && (
                          <span className="text-[10px] text-slate-400">{m.time}</span>
                        )}
                      </div>
                      <div
                        className={`text-xs px-3.5 py-2.5 rounded-2xl max-w-[85%] leading-relaxed shadow-xs ${
                          m.isSelf
                            ? 'bg-[#146ef5] text-white rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Box */}
              <div className="p-3 border-t border-slate-200/80 bg-white">
                <form onSubmit={sendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={isJoined ? "Type message or code question..." : "Connect to session to participate"}
                    disabled={!isJoined}
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-4 pr-11 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#146ef5] disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!isJoined || !chatMessage.trim()}
                    className="absolute right-1.5 p-2 rounded-full text-white bg-[#146ef5] hover:bg-[#105bd1] disabled:opacity-30 disabled:bg-slate-300 transition-colors shadow-xs"
                    title="Send Message"
                  >
                    <PaperAirplaneIcon className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: Participants Roster Area */}
          {activeTab === 'ROSTER' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-slate-50/40">
              {participants.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-16 px-4">
                  <UserGroupIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                  <p className="font-medium text-slate-600 mb-1">Roster is offline</p>
                  <p className="text-[11px] text-slate-400">
                    Connect to the room to see who else is in attendance today.
                  </p>
                </div>
              ) : (
                participants.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{p.name}</span>
                          {p.isLocal && (
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-sm">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">Cohort Member</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className={`w-2 h-2 rounded-full ${p.hasAudio ? 'bg-emerald-500' : 'bg-slate-300'}`} title={p.hasAudio ? 'Microphone Active' : 'Muted'} />
                      <span className={`w-2 h-2 rounded-full ${p.hasVideo ? 'bg-blue-500' : 'bg-slate-300'}`} title={p.hasVideo ? 'Video Active' : 'Camera Off'} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Classroom Etiquette & Guidelines Footer */}
      <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MicrophoneIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-0.5">Mute When Not Speaking</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Help keep the audio clear for everyone by keeping your microphone muted while instructors or peers present.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <HandRaisedIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-0.5">Raise Hand for Questions</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Use the in-app &ldquo;Raise Hand&rdquo; button to queue up for live code reviews and architectural questions.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheckIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-0.5">All Sessions Recorded</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Recordings and chat highlights will automatically appear in your Shared Resources archive within 24 hours.
            </p>
          </div>
        </div>
      </MotionStagger>
    </MotionRise>
  );
}
