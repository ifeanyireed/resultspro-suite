"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function LeaderboardPage() {
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Global');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let type = 'elo';
      if (activeTab === 'Wealth') type = 'coins';
      if (activeTab === 'Streaks') type = 'streak';

      const response = await api.get(`/user/leaderboard?type=${type}`);
      let lbData = response.data;
      if (!Array.isArray(lbData)) {
        if (lbData && Array.isArray(lbData.leaderboard)) lbData = lbData.leaderboard;
        else if (lbData && Array.isArray(lbData.data)) lbData = lbData.data;
        else lbData = [];
      }
      setLeaderboard(lbData);

      if (currentUser) {
        const rankResponse = await api.get('/user/rank');
        setMyRank(rankResponse.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, currentUser]);

  const getScoreLabel = () => {
    if (activeTab === 'Wealth') return 'Coins';
    if (activeTab === 'Streaks') return 'Streak Days';
    return 'ELO Rating';
  };

  const getScoreValue = (user: any) => {
    if (activeTab === 'Wealth') return user.coinBalance;
    if (activeTab === 'Streaks') return user.streakCurrent;
    return user.eloRating;
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-nets-navy)' }}>
      <Navbar />
      
      <section style={{ paddingTop: '160px', paddingBottom: '60px', background: 'var(--color-nets-navy-dark)' }}>
        <div className="container-nets" style={{ textAlign: 'center' }}>
          <span className="overline" style={{ color: 'var(--color-nets-red)', marginBottom: '1rem', display: 'inline-block' }}>Hall of Fame</span>
          <h1 className="h1" style={{ color: 'white', marginBottom: '2rem' }}>
            {activeTab.toUpperCase()} RANKINGS
          </h1>
          
          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Global', 'Wealth', 'Streaks'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: activeTab === tab ? 'var(--color-nets-red)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.6)',
                  border: activeTab === tab ? '1px solid var(--color-nets-red)' : '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderRadius: '2px'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0 100px 0', background: 'var(--color-nets-navy)', flex: 1 }}>
        <div className="container-nets">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(255,255,255,0.5)' }}>
                Loading rankings...
              </div>
            ) : (
              <div style={{ background: 'var(--color-nets-navy-dark)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                
                {/* Header Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="overline" style={{ color: 'rgba(255,255,255,0.5)' }}>Rank</div>
                  <div className="overline" style={{ color: 'rgba(255,255,255,0.5)' }}>Student</div>
                  <div className="overline" style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>Score</div>
                </div>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {Array.isArray(leaderboard) && leaderboard.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                      No players found in this category.
                    </div>
                  )}
                  {Array.isArray(leaderboard) && leaderboard.map((user, index) => {
                    const isTop3 = index < 3;
                    return (
                      <div 
                        key={user.id}
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '60px 1fr 120px', 
                          padding: '1.5rem 2rem', 
                          alignItems: 'center',
                          borderBottom: index !== leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          background: isTop3 ? 'rgba(255,255,255,0.02)' : 'transparent',
                          transition: 'background 0.2s',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = isTop3 ? 'rgba(255,255,255,0.02)' : 'transparent')}
                      >
                        {isTop3 && (
                          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--color-nets-red)' }} />
                        )}
                        <div style={{ fontSize: isTop3 ? '1.5rem' : '1.125rem', fontWeight: 900, color: isTop3 ? 'white' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-display)' }}>
                          #{index + 1}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img src={`/avatars/character${ (String(user.id).charCodeAt(0) % 20) || 1 }.jpg`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{user.name || 'Anonymous'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>{getScoreValue(user).toLocaleString()}</div>
                          <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-nets-red)' }}>{getScoreLabel()}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* My Rank Footer */}
                <div style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                  {currentUser && myRank ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px', alignItems: 'center' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>
                        #{myRank.rank}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={`/avatars/character${ (String(currentUser.id).charCodeAt(0) % 20) || 1 }.jpg`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>You</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{myRank.nextRankGap > 0 ? `Next Rank in ${myRank.nextRankGap} pts` : 'Top Ranked!'}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>
                          {(activeTab === 'Global' ? (myRank.user?.eloRating ?? currentUser?.eloRating ?? 0) : 
                            activeTab === 'Wealth' ? (myRank.user?.coinBalance ?? currentUser?.coinBalance ?? 0) : 
                            activeTab === 'Streaks' ? (myRank.user?.streakCurrent ?? currentUser?.streakCurrent ?? 0) : 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-nets-red)' }}>{getScoreLabel()}</div>
                      </div>
                    </div>
                  ) : !currentUser && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Sign in to see your global rank and compete.</div>
                      <button onClick={() => window.location.href = '/login'} className="btn btn-red">Login to Play</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
