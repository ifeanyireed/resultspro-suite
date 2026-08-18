'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AnalyticsUpIcon, 
  CreditCardIcon, 
  UserGroupIcon,
  Activity04Icon,
  Pulse01Icon,
  ArrowUp01Icon
} from 'hugeicons-react';
import api from '@/lib/api';
import WelcomeBanner from './WelcomeBanner';
import styles from './Dashboard.module.css';

export default function PrincipalDashboard() {
  const [pulseData, setPulseData] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/pulse')
      .then(res => setPulseData(res.data))
      .catch(err => console.error('Failed to load pulse data:', err));
  }, []);

  if (!pulseData) {
    return (
      <div className={styles.container}>
        <div style={{ color: 'white', padding: '2rem' }}>Loading Institutional Intelligence...</div>
      </div>
    );
  }

  const { admissions, academic_health, engagement, revenue, school_name } = pulseData;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <WelcomeBanner 
          title={`${school_name} Pulse`} 
          description="Institutional health metrics are synthesized from all specialist services. You're doing a great job leading!" 
          monsterSrc="/monster_winner.png" 
        />

        {/* Stats Grid - Now Dynamic */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Admissions</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#0ea5e915', color: '#0ea5e9' }}><UserGroupIcon /></div>
              <div className={styles.statInfo}><h3>{admissions.pipeline_value}</h3></div>
            </div>
            <div className={styles.statInfo}><p>Active Applications ({admissions.conversion} Conv.)</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Revenue</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#10b98115', color: '#10b981' }}><CreditCardIcon /></div>
              <div className={styles.statInfo}><h3>{revenue.fees_collected}</h3></div>
            </div>
            <div className={styles.statInfo}><p>Fees Collected this term</p></div>
            <a href="/admin/fees" className={styles.statLink}>Financials</a>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Engagement</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#6366f115', color: '#6366f1' }}><Activity04Icon /></div>
              <div className={styles.statInfo}><h3>{engagement.active_parents}</h3></div>
            </div>
            <div className={styles.statInfo}><p>Parent Active Rate</p></div>
          </div>
        </div>

        {/* Bottom Widgets */}
        <div className={styles.bottomGrid}>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.headerIcon} style={{ background: '#6366f115' }}>
                  <Pulse01Icon size={18} color="#6366f1" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>Academic Health</h2>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Aggregated from ResultsPRO</span>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '2rem', textAlign: 'center' }}>
               <div style={{ fontSize: '3rem', fontWeight: '800', color: '#1e293b' }}>{academic_health.average_performance}%</div>
               <p style={{ color: '#64748b', marginTop: '0.5rem' }}>School-wide Average Performance</p>
               <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                 <p style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: '700' }}>Top Performing Class: {academic_health.top_performing_class}</p>
                 <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700', marginTop: '0.5rem' }}>{academic_health.intervention_needed} students require academic intervention</p>
               </div>
            </div>
          </div>

          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.headerIcon} style={{ background: '#10b98115' }}>
                  <AnalyticsUpIcon size={18} color="#10b981" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>Admissions Pipeline</h2>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Leads & Funnel Status</span>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>New Inquiries</span>
                <span style={{ fontWeight: '700' }}>{admissions.new_inquiries}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Tours Booked</span>
                <span style={{ fontWeight: '700' }}>{admissions.active_tours}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Conversion Rate</span>
                <span style={{ fontWeight: '700', color: '#10b981' }}>{admissions.conversion}</span>
              </div>
              <a href="/admin/admissions" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}>Open CRM</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={styles.sidebarArea}>
        <div className={styles.sidebarHeader} style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Strategic Insights</h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
            <h4 style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Snapshot</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginTop: '0.5rem' }}>₦{revenue.overdue_total.toLocaleString()}</div>
            <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700', marginTop: '0.25rem' }}>Overdue Fees Outstanding</p>
          </div>

          <div style={{ padding: '1.5rem', background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
            <h4 style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Future Skills Participation</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6366f1', marginTop: '0.5rem' }}>{engagement.future_skills}</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginTop: '0.25rem' }}>Enrolled in ScholarsNG</p>
          </div>
        </div>
      </div>
    </div>
  );
}
