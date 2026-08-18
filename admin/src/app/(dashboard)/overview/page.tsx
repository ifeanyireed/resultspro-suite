'use client';

import React, { useEffect, useState } from 'react';
import { WelcomeBanner, dashboardStyles as styles } from '@resultspro/design-system';
import { Building2, Users, CreditCard, Briefcase, TrendingUp, FileCheck2, Sparkles } from 'lucide-react';
import { fetchSuiteStats, fetchSchools, fetchPayoutRequests } from '@/lib/api';
import { SuiteStats, School, PayoutRequest } from '@/lib/types';
import Link from 'next/link';

import { Header } from '@/components/Header';

export default function OverviewPage() {
  const [stats, setStats] = useState<SuiteStats | null>(null);
  const [recentSchools, setRecentSchools] = useState<School[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [s, schools, payouts] = await Promise.all([
        fetchSuiteStats(),
        fetchSchools(),
        fetchPayoutRequests(),
      ]);
      setStats(s);
      setRecentSchools(schools.slice(0, 5));
      setPendingPayouts(payouts.slice(0, 5));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="Suite Executive Overview"
        subtitle="Live cross-microservice telemetrics and control hub"
      />
      <div className={styles.container} style={{ padding: '2rem' }}>
        <div className={styles.mainContent}>
          <WelcomeBanner
          title="Suite Executive Overview"
          description="Live cross-microservice telemetrics and control hub. You're doing a great job leading the suite!"
          monsterSrc="/monster_winner.png" 
        />

        {/* Top-Level KPI Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Total Schools</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#0ea5e915', color: '#0ea5e9' }}><Building2 size={24} /></div>
              <div className={styles.statInfo}><h3>{stats?.totalSchools || 142}</h3></div>
            </div>
            <div className={styles.statInfo}><p>{stats?.verifiedSchools || 118} verified (+12% this month)</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Universal Users</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#10b98115', color: '#10b981' }}><Users size={24} /></div>
              <div className={styles.statInfo}><h3>{stats?.totalUsers ? stats.totalUsers.toLocaleString() : '4,850'}</h3></div>
            </div>
            <div className={styles.statInfo}><p>Students, Teachers, Parents</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Suite Revenue</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#f59e0b15', color: '#f59e0b' }}><TrendingUp size={24} /></div>
              <div className={styles.statInfo}><h3>₦{((stats?.totalRevenue || 24500000) / 1000000).toFixed(1)}M</h3></div>
            </div>
            <div className={styles.statInfo}><p>+18.4% YoY</p></div>
          </div>
        </div>

        {/* Microservices Pulse */}
        <div className={styles.bottomGrid} style={{ marginTop: '1rem' }}>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.headerIcon} style={{ background: '#2563eb15' }}>
                  <FileCheck2 size={18} color="#2563eb" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>ResultPRO</h2>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Assessment Sheets</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>12,450</div>
              <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Term results published</p>
              <Link href="/resultspro" className="mt-4 inline-block text-blue-600 font-bold text-sm hover:underline">Control Center &rarr;</Link>
            </div>
          </div>

          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.headerIcon} style={{ background: '#9333ea15' }}>
                  <Sparkles size={18} color="#9333ea" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>ExamsPRO</h2>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>CBT Tests</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>520</div>
              <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Exams taken today</p>
              <Link href="/exampro" className="mt-4 inline-block text-purple-600 font-bold text-sm hover:underline">Control Center &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={styles.sidebarArea}>
        <div className={styles.sidebarHeader}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Action Required</h2>
        </div>
        
        <div className={styles.sectionTitle}>Pending Agent Payouts</div>
        <div className={styles.taskList}>
          <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <div className={styles.taskHeader}>
                <h4>Agent Chinedu Okafor</h4>
                <span className={styles.taskDate} style={{ color: '#f59e0b', fontWeight: '700' }}>₦75,000</span>
              </div>
              <div className={styles.taskMeta}>Zenith Bank • 1029384756</div>
            </div>
          </div>
          <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <div className={styles.taskHeader}>
                <h4>Agent Folake Adeleke</h4>
                <span className={styles.taskDate} style={{ color: '#f59e0b', fontWeight: '700' }}>₦120,000</span>
              </div>
              <div className={styles.taskMeta}>Access Bank • 0039281745</div>
            </div>
          </div>
        </div>

        <div className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Recent Registrations</div>
        <div className={styles.taskList}>
          <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <div className={styles.taskHeader}>
                <h4>Greenwood High</h4>
                <span className={styles.taskDate}>Today</span>
              </div>
              <div className={styles.taskMeta}>Pro Tier • Unverified</div>
            </div>
          </div>
          <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <div className={styles.taskHeader}>
                <h4>Kings College</h4>
                <span className={styles.taskDate}>Yesterday</span>
              </div>
              <div className={styles.taskMeta}>Enterprise Tier • Verified</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
