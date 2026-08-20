"use client";

import Navbar from '@/components/Navbar';
import { IconSword as Sword, IconUsers as Users, IconTrophy as Trophy, IconSearch as Search, IconPlayerPlay as Play, IconBolt as Zap, IconPlus as Plus, IconChevronRight as ChevronRight, IconShield as Shield, IconCoins as Coins, IconLoader2 as Loader2, IconGlobe as Globe, IconLock as Lock, IconCopy as Copy, IconCheck as Check } from '@tabler/icons-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import LoginPromptModal from '@/components/LoginPromptModal';
import { useBattle } from '@/hooks/useBattle';

interface Battle {
  id: string;
  subject?: { name: string };
  participants: Array<{ user: { name: string } }>;
  stakePerPlayer: number;
  status: string;
  maxParticipants: number;
}

export default function BattleLobbyPage() {
  const { user, fetchUser } = useAuthStore();
  const router = useRouter();
  const { status, joinQueue, battleId } = useBattle();
  const [activeBattles, setActiveBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [onlineStats, setOnlineStats] = useState({ onlineCount: 0, totalUsers: 0, activeBattles: 0, battleModeCount: 0 });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinCodeModalOpen, setIsJoinCodeModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joiningByCode, setJoiningByCode] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  const [createSubjects, setCreateSubjects] = useState<any[]>([]);
  const [quickSubjects, setQuickSubjects] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  // Quick Match CTA State
  const [qmExam, setQmExam] = useState<string>("");
  const [qmSubject, setQmSubject] = useState<string>("");

  // Create Battle Form State
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [stake, setStake] = useState<number>(10);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [maxParticipants, setMaxParticipants] = useState<number>(2);
  const [isPublic, setIsPublic] = useState(true);
  const [duration, setDuration] = useState<number>(60);
  const [randomizeOrder, setRandomizeOrder] = useState(true);
  const [soundActivated, setSoundActivated] = useState(true);

  // Helper to open modal with specific type
  const openCreateModal = (mode: 'private' | 'public') => {
    setIsPublic(mode === 'public');
    setMaxParticipants(mode === 'private' ? 2 : 4);
    setIsCreateModalOpen(true);
  };

  // Tournament State
  const [tournamentInfo, setTournamentInfo] = useState<any>(null);
  const [registering, setRegistering] = useState(false);

  const fetchSubjects = async (examId: string, type: 'create' | 'quick', shouldSetDefault = false) => {
    try {
      const res = await api.get(`/exams/${examId}/subjects`);
      const list = res.data.subjects || [];
      if (type === 'create') {
        setCreateSubjects(list);
        if (shouldSetDefault && list.length > 0) setSelectedSubject(list[0].id.toString());
      } else {
        setQuickSubjects(list);
        if (shouldSetDefault && list.length > 0) setQmSubject(list[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // 1. Initial Load (Exams, User, Settings) - Only once
    const initData = async () => {
      try {
        const [examsRes, settingsRes] = await Promise.all([
          api.get('/exams?battleReady=true'),
          api.get('/public/settings').catch(() => ({ data: {} })),
          fetchUser()
        ]);

        if (settingsRes.data && settingsRes.data['battle_mode_enabled'] === 'false') {
          router.push('/dashboard');
          return;
        }

        const rawExams = examsRes.data || [];
        const flatExams = Array.isArray(rawExams) && rawExams.length > 0 && rawExams[0].exams 
          ? rawExams.flatMap((cat: any) => cat.exams || [])
          : rawExams;

        setExams(flatExams);
        
        if (flatExams.length > 0) {
          const firstExam = flatExams[0].id?.toString() || flatExams[0].ID?.toString();
          if (firstExam) {
            // Only set if not already selected by user (safety)
            setSelectedExam(prev => prev || firstExam);
            setQmExam(prev => prev || firstExam);
            
            // Fetch initial subjects
            fetchSubjects(firstExam, 'create', true);
            fetchSubjects(firstExam, 'quick', true);
          }
        }
      } catch (err) {
        console.error("Failed to initialize lobby:", err);
      }
    };

    // 2. Polling Load (Battles, Metrics, Tournaments) - Every 10s
    const pollData = async () => {
      try {
        const [battlesRes, metricsRes, tournamentRes] = await Promise.all([
          api.get('/battles/active'),
          api.get('/public/metrics'),
          api.get('/tournaments/current').catch(() => ({ data: null })),
        ]);

        setActiveBattles(battlesRes.data);
        setOnlineStats(metricsRes.data);
        setTournamentInfo(tournamentRes.data);
      } catch (error) {
        console.error('Failed to poll battle lobby data:', error);
      } finally {
        setLoading(false);
      }
    };

    initData();
    pollData();
    
    const interval = setInterval(pollData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickMatch = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    
    if (!qmSubject) return toast.error("Please select a subject");
    const subject = quickSubjects.find(s => s.id.toString() === qmSubject);

    router.push(`/battle-mode/matchmaking?subjectId=${qmSubject}&stake=10&subjectName=${encodeURIComponent(subject?.name || "Battle")}`);
  };

  const handleCreateBattle = async () => {
    if (!user) return setIsLoginModalOpen(true);
    if (!selectedSubject) return toast.error("Please select a subject");
    
    setCreating(true);
    try {
      const subject = createSubjects.find(s => s.id.toString() === selectedSubject);
      const res = await api.post('/battles/create', {
        subjectId: parseInt(selectedSubject),
        stake,
        questionCount,
        maxParticipants,
        isPublic,
        duration,
        randomizeOrder,
        soundActivated
      });
      setIsCreateModalOpen(false);
      toast.success("Battle Created!");
      fetchUser();
      router.push(`/battle-mode/matchmaking?battleId=${res.data.id}&subjectName=${encodeURIComponent(subject?.name || "")}&stake=${stake}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create battle");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateBotBattle = async () => {
    if (!user) return setIsLoginModalOpen(true);
    if (!qmSubject) return toast.error("Please select a subject");

    setCreating(true);
    try {
      const res = await api.post('/battles/create-bot', {
        subjectId: parseInt(qmSubject),
        stake: 0 // Bot battles are free for now
      });
      toast.success("Bot Battle Started!");
      router.push(`/battle-mode/screen?battleId=${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to start bot battle");
    } finally {
      setCreating(false);
    }
  };

  const handleTournamentRegister = async () => {
    if (!user) return setIsLoginModalOpen(true);
    if (!tournamentInfo?.tournament) return;

    setRegistering(true);
    try {
      await api.post(`/battles/tournament/register/${tournamentInfo.tournament.id}`);
      toast.success("Successfully registered for Tournament! 🎉");
      setTournamentInfo({ ...tournamentInfo, isRegistered: true });
      fetchUser();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const handleJoinBattle = async (battle: any) => {
    if (!user) return setIsLoginModalOpen(true);
    try {
      await api.post(`/battles/join/${battle.id}`);
      fetchUser();
      const subjectName = battle.subject?.name || "Unknown";
      router.push(`/battle-mode/matchmaking?battleId=${battle.id}&subjectName=${encodeURIComponent(subjectName)}&stake=${battle.stakePerPlayer}`);
    } catch (error) {
      alert("Failed to join battle.");
    }
  };

  const handleJoinByCode = async () => {
    if (!user) return setIsLoginModalOpen(true);
    if (!joinCode) return toast.error("Please enter a room code");
    
    setJoiningByCode(true);
    try {
      // First, get battle details to know subject and stake
      const res = await api.get(`/battles/${joinCode}`);
      const battle = res.data;
      
      // If already a participant, just redirect to matchmaking
      const isParticipant = battle.participants.some((p: any) => (p.user?.id || p.userId) === user.id);
      if (isParticipant) {
        setIsJoinCodeModalOpen(false);
        const subjectName = battle.subject?.name || "Unknown";
        router.push(`/battle-mode/matchmaking?battleId=${battle.id}&subjectName=${encodeURIComponent(subjectName)}&stake=${battle.stakePerPlayer}`);
        return;
      }

      await api.post(`/battles/join/${battle.id}`);
      setIsJoinCodeModalOpen(false);
      toast.success("Joined Battle!");
      fetchUser();
      const subjectName = battle.subject?.name || "Unknown";
      router.push(`/battle-mode/matchmaking?battleId=${battle.id}&subjectName=${encodeURIComponent(subjectName)}&stake=${battle.stakePerPlayer}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Battle not found or cannot be joined");
    } finally {
      setJoiningByCode(false);
    }
  };

  const filteredBattles = activeBattles.filter(b => {
    if (!b || !b.subject || !b.subject.name) return false;
    return b.subject.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 italic tracking-tighter">
              BATTLE <span className="text-green">MODE</span>
            </h1>
            <p className="text-gray-400 max-w-md">
              Real-time head-to-head quiz battles. Stake coins, win big, 
              and climb the global ELO rankings.
            </p>
          </div>
          
          {mounted && user && (
            <div className="flex gap-4">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-center min-w-[140px]">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Your ELO</div>
                <div className="text-3xl font-display font-black text-white">
                  {user?.eloRating || 1000}
                </div>
                <div className="text-[10px] font-bold text-green mt-1 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  Active
                </div>
              </div>
              
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-center min-w-[140px]">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Balance</div>
                <div className="text-3xl font-display font-black text-blue">
                  {user?.coinBalance || 0}
                </div>
                <div className="text-[10px] font-bold text-gray-500 mt-1">Coins</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Match CTA */}
        <div className="relative p-1 rounded-[40px] bg-gradient-to-r from-green via-blue to-purple mb-16 group overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
          <div className="relative bg-navy rounded-[38px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
                <span className="text-xs font-bold text-green uppercase tracking-widest">{mounted ? (onlineStats.battleModeCount || onlineStats.onlineCount) : '--'} Students Online</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">
                QUICK <span className="text-green">MATCH</span>
              </h2>
              <p className="text-gray-400 max-w-sm mb-8">
                Instant matchmaking with an opponent of similar skill level. 
                10 questions, 60 seconds each.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-md">
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Target Exam</Label>
                   <Select value={qmExam} onValueChange={(v) => { setQmExam(v); fetchSubjects(v, 'quick', true); }}>
                    <SelectTrigger className="bg-white/5 border-white/[0.1] border-t-white/[0.15] h-11 rounded-xl text-white">
                      <SelectValue placeholder="Select Exam" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      {exams.map((e) => (
                        <SelectItem key={e.id || e.ID} value={(e.id || e.ID)?.toString()}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Subject</Label>
                   <Select value={qmSubject} onValueChange={setQmSubject}>
                    <SelectTrigger className="bg-white/5 border-white/[0.1] border-t-white/[0.15] h-11 rounded-xl text-white">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      {quickSubjects.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                  <Coins className="w-4 h-4 text-amber" />
                  <span className="text-sm font-bold text-white">Stake: 10 Coins</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                  <Shield className="w-4 h-4 text-blue" />
                  <span className="text-sm font-bold text-white">ELO Protected</span>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 flex flex-col gap-3">
              <Button 
                onClick={handleQuickMatch}
                disabled={status === 'searching' || creating}
                className="h-20 px-12 rounded-[32px] bg-green text-navy hover:bg-green/90 transition-all hover:scale-105 flex flex-col items-center justify-center gap-1 group/btn min-w-[240px]"
              >
                {status === 'searching' ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current group-hover/btn:scale-110 transition-transform" />
                    <span className="text-lg font-black tracking-tighter uppercase">Battle Now</span>
                  </>
                )}
              </Button>

              <Button 
                onClick={handleCreateBotBattle}
                disabled={status === 'searching' || creating}
                variant="outline"
                className="h-16 px-12 rounded-[24px] border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 flex items-center justify-center gap-2 group/bot min-w-[240px]"
              >
                {creating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue" />
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-blue fill-current group-hover/bot:animate-pulse" />
                    <span className="text-sm font-bold uppercase tracking-widest">VS Computer</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Battle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Create / Join Custom */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-green" />
                Custom Battle
              </h3>
              <p className="text-sm text-gray-500 mb-8">
                Challenge a friend or create a public battle with custom stakes and subjects.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => openCreateModal('private')}
                  className="w-full py-6 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/10 font-bold"
                >
                  Challenge a Friend
                </Button>
                <Button 
                  onClick={() => openCreateModal('public')}
                  variant="outline" 
                  className="w-full py-6 rounded-2xl border-white/10 text-gray-400 hover:text-white font-bold"
                >
                  Create Public Room
                </Button>
                <Button 
                  onClick={() => setIsJoinCodeModalOpen(true)}
                  variant="ghost" 
                  className="w-full py-6 rounded-2xl text-blue hover:text-blue-400 font-black italic tracking-tighter"
                >
                  Join via Room Code
                </Button>
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-gradient-to-br from-amber/10 to-transparent border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="w-16 h-16 text-amber" />
              </div>
              <Trophy className="w-8 h-8 text-amber mb-4 relative z-10" />
              <h3 className="text-xl font-display font-bold text-white mb-2 relative z-10">
                {tournamentInfo?.tournament?.title || 'Regional Tournament'}
              </h3>
              <p className="text-sm text-gray-500 mb-6 relative z-10">
                {tournamentInfo?.tournament?.description || 'Join the ₦50,000 prize pool tournament starting this Saturday.'}
              </p>
              
              {tournamentInfo?.isRegistered ? (
                <div className="w-full py-4 rounded-2xl bg-green/10 border border-green/20 text-green flex items-center justify-center gap-2 font-bold animate-in zoom-in-95">
                  <Check className="w-5 h-5" /> Registered
                </div>
              ) : (
                <Button 
                  onClick={handleTournamentRegister}
                  disabled={registering || !tournamentInfo?.tournament}
                  className="w-full bg-amber text-navy hover:bg-amber/90 font-bold py-6 rounded-2xl relative z-10"
                >
                  {registering ? <Loader2 className="w-5 h-5 animate-spin" /> : `Register Now (${tournamentInfo?.tournament?.registrationFee || '500'} Coins)`}
                </Button>
              )}
            </div>
          </div>

          {/* Active Battles List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Sword className="w-5 h-5 text-red-500" />
                Live Battles
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by subject..."
                  className="bg-white/[0.02] border border-white/[0.1] border-t-white/[0.15] rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-green/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue animate-spin" />
                </div>
              ) : filteredBattles.length > 0 ? filteredBattles.map((battle) => (
                <div 
                  key={battle.id}
                  className="group p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] hover:border-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex -space-x-3">
                      {battle.participants.map((p, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-navy bg-white/5 flex items-center justify-center text-[10px] font-bold text-green overflow-hidden">
                          {p.user?.name?.charAt(0) || 'P'}
                        </div>
                      ))}
                      {battle.participants.length < 2 && (
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5 text-gray-600">
                          ?
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{battle.subject?.name} Challenge</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {battle.participants.length}/2
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber">
                          <Coins className="w-3 h-3" />
                          {battle.stakePerPlayer} Stake
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className={`text-[10px] font-bold uppercase tracking-widest ${battle.status === 'waiting' ? 'text-green' : 'text-blue'}`}>
                        {battle.status === 'waiting' ? (battle.participants.length >= battle.maxParticipants ? 'Room Full' : 'Waiting') : 'In Progress'}
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        const isParticipant = battle.participants.some((p: any) => (p.userId || p.user?.id) === user?.id);
                        if (isParticipant) {
                           router.push(`/battle-mode/matchmaking?battleId=${battle.id}&subjectName=${encodeURIComponent(battle.subject?.name || "Unknown")}&stake=${battle.stakePerPlayer}`);
                        } else if (battle.status === 'waiting') {
                          if (battle.participants.length >= battle.maxParticipants) {
                            toast.error("This room is full");
                          } else {
                            handleJoinBattle(battle);
                          }
                        } else {
                          router.push(`/spectate/room?roomId=${battle.id}`);
                        }
                      }}
                      variant={battle.status === 'waiting' && battle.participants.length < battle.maxParticipants ? 'default' : 'ghost'}
                      className={`rounded-xl px-6 ${battle.status === 'waiting' && battle.participants.length < battle.maxParticipants ? 'bg-green text-navy hover:bg-green/90' : 'text-gray-500 hover:text-white'}`}
                    >
                      {battle.participants.some((p: any) => (p.userId || p.user?.id) === user?.id) ? 'Rejoin' : 
                       battle.status === 'waiting' ? (battle.participants.length >= battle.maxParticipants ? 'Full' : 'Join') : 'Watch'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-white/[0.05] border-t-white/[0.1] border-dashed">
                  <p className="text-gray-500 text-sm font-medium italic">No active battles found. Start one!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginPromptModal 
        show={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      {/* Create Battle Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-navy border-white/10 text-white rounded-[32px] max-w-sm max-h-[90vh] overflow-hidden flex flex-col p-0 shadow-2xl">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="text-2xl font-display font-black flex items-center gap-2">
              <Plus className="w-6 h-6 text-green" />
              CREATE BATTLE
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Set your stakes and challenge other players.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-6 scrollbar-hide">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Exam</Label>
              <Select value={selectedExam} onValueChange={(v) => { setSelectedExam(v); fetchSubjects(v, 'create', true); }}>
                <SelectTrigger className="bg-white/5 border-white/[0.1] border-t-white/[0.15] h-12 rounded-xl focus:ring-green/50 text-white">
                  <SelectValue placeholder="Choose an exam" />
                </SelectTrigger>
                <SelectContent className="bg-navy border-white/10 text-white">
                  {exams.map((e) => (
                    <SelectItem key={e.id || e.ID} value={(e.id || e.ID)?.toString()}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-white/5 border-white/[0.1] border-t-white/[0.15] h-12 rounded-xl focus:ring-green/50 text-white">
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent className="bg-navy border-white/10 text-white">
                  {createSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                  {createSubjects.length === 0 && <SelectItem value="none" disabled>No subjects found</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stake (Coins)</Label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber" />
                  <Input 
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(parseInt(e.target.value))}
                    className="bg-white/5 border-white/[0.1] border-t-white/[0.15] h-12 rounded-xl pl-12 focus-visible:ring-green/50"
                    min={10}
                  />
                </div>
              </div>

              {isPublic && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contestants</Label>
                  <Select value={maxParticipants.toString()} onValueChange={(v) => setMaxParticipants(parseInt(v))}>
                    <SelectTrigger className="bg-white/5 border-white/[0.1] border-t-white/[0.15] h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-white/10 text-white">
                      <SelectItem value="4">4 Players</SelectItem>
                      <SelectItem value="6">6 Players</SelectItem>
                      <SelectItem value="8">8 Players</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Question Count</Label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, 60].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`py-2 rounded-xl border font-bold text-xs transition-all ${questionCount === count ? 'bg-green border-green text-navy' : 'bg-white/5 border-white/[0.1] border-t-white/[0.15] text-gray-400 hover:bg-white/10'}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Duration (Secs)</Label>
              <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                <SelectTrigger className="bg-white/5 border-white/[0.1] border-t-white/[0.15] h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy border-white/10 text-white">
                  <SelectItem value="60">60s</SelectItem>
                  <SelectItem value="120">120s</SelectItem>
                  <SelectItem value="300">300s</SelectItem>
                  <SelectItem value="600">600s</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Random</span>
                  <span className="text-[8px] text-white opacity-50 uppercase">Order</span>
                </div>
                <Switch checked={randomizeOrder} onCheckedChange={setRandomizeOrder} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Sounds</span>
                  <span className="text-[8px] text-white opacity-50 uppercase">Audio</span>
                </div>
                <Switch checked={soundActivated} onCheckedChange={setSoundActivated} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15]">
              <div className="flex items-center gap-3">
                {isPublic ? <Globe className="w-5 h-5 text-blue" /> : <Lock className="w-5 h-5 text-amber" />}
                <div>
                  <div className="text-sm font-bold">{isPublic ? 'Public Battle' : 'Private Battle'}</div>
                  <div className="text-[10px] text-gray-500">{isPublic ? 'Visible to everyone' : 'Join via Link/ID only'}</div>
                </div>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>

          <div className="p-8 pt-4 border-t border-white/5 bg-navy/50 backdrop-blur-md">
            <Button 
              onClick={handleCreateBattle}
              disabled={creating}
              className="w-full py-6 rounded-2xl bg-green text-navy hover:bg-green/90 font-bold text-lg"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Battle'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join via Code Modal */}
      <Dialog open={isJoinCodeModalOpen} onOpenChange={setIsJoinCodeModalOpen}>
        <DialogContent className="bg-navy border-white/10 text-white rounded-[32px] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-black flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue" />
              JOIN BATTLE
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the Room ID shared by your friend.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Room ID</Label>
              <Input 
                placeholder="Enter ID (e.g. 5A3B1)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="bg-white/5 border-white/[0.1] border-t-white/[0.15] h-12 rounded-xl focus-visible:ring-blue/50 text-center font-display font-bold tracking-widest uppercase"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={handleJoinByCode}
              disabled={joiningByCode || !joinCode}
              className="w-full py-6 rounded-2xl bg-blue text-white hover:bg-blue/90 font-bold text-lg"
            >
              {joiningByCode ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Arena'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
