import React, { useState, useEffect } from 'react';
import { Download01, Share01, Trophy, Target, Calendar, Star, Medal, Award } from '@/lib/hugeicons-compat';
import axiosInstance from '@/lib/axiosConfig';
import { useStudentLeaderboard } from '@/hooks/useAnalytics';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const LeaderboardManagement: React.FC = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedInstance, setSelectedInstance] = useState('');
  
  const [classes, setClasses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [instances, setInstances] = useState<any[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  // Fetch filter metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setMetaLoading(true);
        const schoolId = localStorage.getItem('schoolId');
        
        const [classesRes, schoolRes, instancesRes] = await Promise.all([
          axiosInstance.get('/onboarding/classes'),
          axiosInstance.get(`/onboarding/school/${schoolId}`),
          axiosInstance.get('/results-setup/instances')
        ]);

        const classesData = classesRes.data.data?.classes || classesRes.data.data || [];
        setClasses(classesData);
        
        const sessionsData = schoolRes.data.data?.academicSessions || [];
        setSessions(sessionsData);

        const instancesData = instancesRes.data.data || [];
        setInstances(instancesData);

        // Auto-select defaults
        if (classesData.length > 0) setSelectedClass(classesData[0].id);
        if (sessionsData.length > 0) {
          const current = sessionsData[0];
          setSelectedSession(current.id);
          setTerms(current.terms || []);
          if (current.terms?.length > 0) setSelectedTerm(current.terms[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard metadata', err);
      } finally {
        setMetaLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleInstanceChange = (instanceId: string) => {
    setSelectedInstance(instanceId);
    if (instanceId) {
      const instance = instances.find(i => i.id === instanceId);
      if (instance) {
        setSelectedClass(instance.classId);
        setSelectedSession(instance.sessionId);
        setSelectedTerm(instance.termId);
      }
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      const response = await axiosInstance.get('/analytics/leaderboard/share', {
        params: {
          classId: selectedClass,
          sessionId: selectedSession,
          termId: selectedTerm,
          instanceId: selectedInstance
        },
        responseType: 'blob'
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Leaderboard_Card.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: 'Success',
        description: 'Leaderboard social card generated and downloaded.',
      });
    } catch (err) {
      console.error('Failed to share leaderboard', err);
      toast({
        title: 'Error',
        description: 'Failed to generate leaderboard card.',
        variant: 'destructive'
      });
    } finally {
      setSharing(false);
    }
  };

  const { data: leaderboard, loading: leaderboardLoading } = useStudentLeaderboard({
    classId: selectedClass,
    sessionId: selectedSession,
    termId: selectedTerm,
    instanceId: selectedInstance,
    limit: 20
  });

  const isLoading = metaLoading || leaderboardLoading;

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Leaderboard Management</h2>
          <p className="text-gray-400 text-sm mt-1">Celebrate top performing students</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            disabled={sharing || !leaderboard || leaderboard.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-lg text-purple-400 font-medium transition-colors disabled:opacity-50"
          >
            {sharing ? <InlineLoadingSpinner size="sm" /> : <Share01 className="w-4 h-4" />}
            Social Card
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors">
            <Download01 className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-[rgba(255,255,255,0.02)] p-6 rounded-[20px] border border-[rgba(255,255,255,0.07)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Results Instance</label>
            <select 
              value={selectedInstance} 
              onChange={(e) => handleInstanceChange(e.target.value)}
              className="w-full px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-100 outline-none focus:border-blue-500/50"
            >
              <option value="" className="bg-gray-900 text-white">Pull from Published Data</option>
              {instances.map(inst => (
                <option key={inst.id} value={inst.id} className="bg-gray-900 text-white">
                  {inst.instanceName} ({inst.status})
                </option>
              ))}
            </select>
          </div>

          {!selectedInstance && (
            <>
              <div className="w-[150px]">
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Class</label>
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-blue-500/50"
                >
                  {classes.map(c => <option key={c.id} value={c.id} className="bg-gray-900 text-white">{c.name}</option>)}
                </select>
              </div>
              
              <div className="w-[150px]">
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Session</label>
                <select 
                  value={selectedSession} 
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-blue-500/50"
                >
                  {sessions.map(s => <option key={s.id} value={s.id} className="bg-gray-900 text-white">{s.name}</option>)}
                </select>
              </div>
              
              <div className="w-[150px]">
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Term</label>
                <select 
                  value={selectedTerm} 
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-blue-500/50"
                >
                  {terms.map(t => <option key={t.id} value={t.id} className="bg-gray-900 text-white">{t.name}</option>)}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-white/5">
          <InlineLoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400">Ranking top performers...</p>
        </div>
      ) : !leaderboard || leaderboard.length === 0 ? (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-dashed border-[rgba(255,255,255,0.15)] p-20 text-center">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400">No Data for Leaderboard</h3>
          <p className="text-gray-500 mt-2">Select a class or result instance with valid scores to generate rankings.</p>
        </div>
      ) : (
        <>
          {/* Podium / Top 3 Shine */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10 pb-6">
            {/* Rank 2 */}
            {leaderboard[1] && (
              <div className="order-2 md:order-1 bg-gradient-to-b from-gray-400/10 to-transparent rounded-t-[30px] border-x border-t border-gray-400/20 p-8 text-center relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-gray-300">🥈</div>
                <h3 className="text-xl font-bold text-white mb-1">{leaderboard[1].name}</h3>
                <p className="text-gray-400 text-xs mb-4">{leaderboard[1].admissionNumber}</p>
                <div className="bg-white/5 inline-block px-4 py-2 rounded-2xl border border-white/10">
                  <span className="text-2xl font-black text-white">{leaderboard[1].average.toFixed(1)}%</span>
                </div>
              </div>
            )}

            {/* Rank 1 */}
            {leaderboard[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-500/20 to-transparent rounded-t-[40px] border-x border-t border-yellow-500/30 p-10 text-center relative shadow-[0_-20px_50px_-12px_rgba(234,179,8,0.15)] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-yellow-300 animate-bounce">🥇</div>
                <Star className="absolute top-10 right-10 text-yellow-500/40 w-8 h-8 animate-pulse" />
                <Star className="absolute top-20 left-8 text-yellow-500/20 w-4 h-4 animate-pulse" />
                <h3 className="text-2xl font-black text-white mb-1">{leaderboard[0].name}</h3>
                <p className="text-gray-400 text-sm mb-6">{leaderboard[0].admissionNumber}</p>
                <div className="bg-yellow-500/20 inline-block px-6 py-3 rounded-3xl border border-yellow-500/40">
                  <span className="text-4xl font-black text-yellow-500">{leaderboard[0].average.toFixed(1)}%</span>
                </div>
                <div className="mt-4 text-xs text-yellow-500 font-bold uppercase tracking-widest">Overall Champion</div>
              </div>
            )}

            {/* Rank 3 */}
            {leaderboard[2] && (
              <div className="order-3 bg-gradient-to-b from-orange-700/10 to-transparent rounded-t-[30px] border-x border-t border-orange-700/20 p-8 text-center relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-700 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-orange-600">🥉</div>
                <h3 className="text-xl font-bold text-white mb-1">{leaderboard[2].name}</h3>
                <p className="text-gray-400 text-xs mb-4">{leaderboard[2].admissionNumber}</p>
                <div className="bg-white/5 inline-block px-4 py-2 rounded-2xl border border-white/10">
                  <span className="text-2xl font-black text-white">{leaderboard[2].average.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/2.5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Rankings Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/5 bg-white/2.5">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Rank</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Student</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Average Performance</th>
                    <th className="text-center py-4 px-6 text-gray-400 font-medium">Subjects</th>
                    <th className="text-right py-4 px-6 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row, i) => (
                    <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-all ${i < 3 ? 'bg-white/2.5' : ''}`}>
                      <td className="py-4 px-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          i === 0 ? 'bg-yellow-500 text-black' : 
                          i === 1 ? 'bg-gray-400 text-black' : 
                          i === 2 ? 'bg-orange-700 text-white' : 
                          'bg-white/10 text-gray-400'
                        }`}>
                          {i + 1}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-white font-bold">{row.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{row.admissionNumber}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 max-w-[200px] bg-white/5 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                i === 0 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 
                                i === 1 ? 'bg-gray-400' : 
                                i === 2 ? 'bg-orange-700' : 
                                'bg-blue-500'
                              }`} 
                              style={{width: `${row.average}%`}} 
                            />
                          </div>
                          <span className={`font-black ${i === 0 ? 'text-yellow-500 text-lg' : 'text-white'}`}>
                            {row.average.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-gray-400 font-medium">{row.subjects}</td>
                      <td className="py-4 px-6 text-right">
                        {i === 0 && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded font-black uppercase">Top Performer</span>}
                        {i > 0 && i < 3 && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-bold uppercase">Podium</span>}
                        {i >= 3 && <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-1 rounded font-medium uppercase">Stable</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardManagement;
