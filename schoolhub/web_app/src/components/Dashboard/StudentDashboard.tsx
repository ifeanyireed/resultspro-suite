'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  TimeQuarterIcon, 
  Home01Icon, 
  StarIcon, 
  Calendar03Icon
} from 'hugeicons-react';
import api from '@/lib/api';
import WelcomeBanner from './WelcomeBanner';
import HomeworkSidebar from './HomeworkSidebar';
import styles from './Dashboard.module.css';

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // In a real flow, the token would be in localStorage after login.
    // For this restructuring phase, we assume the backend handles it or returns mock if missing.
    api.get('/student/dashboard')
      .then(res => setDashboardData(res.data))
      .catch(err => console.error('Failed to load student dashboard:', err));
  }, []);

  if (!dashboardData) {
    return (
      <div className={styles.container}>
        <div style={{ color: 'white', padding: '2rem' }}>Loading Student Portal...</div>
      </div>
    );
  }

  const { stats, future_skills } = dashboardData;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <WelcomeBanner 
          title="Welcome back!" 
          description={`You've made great progress in ${future_skills.active_pathway}. Keep it up and improve your progress.`} 
          monsterSrc="/monster_studying.png" 
        />

        {/* Stats Grid - Now Dynamic */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Attendance</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#146ef515', color: '#146ef5' }}>
                <TimeQuarterIcon />
              </div>
              <div className={styles.statInfo}><h3>{stats.attendance}</h3></div>
            </div>
            <div className={styles.statInfo}><p>Well done! You&apos;re attending all lessons.</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Homework</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#10b98115', color: '#10b981' }}>
                <Home01Icon />
              </div>
              <div className={styles.statInfo}><h3>{stats.pending_tasks} Pending</h3></div>
            </div>
            <div className={styles.statInfo}><p>Don&apos;t forget about your next homework.</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Academic Rating</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ background: '#f59e0b15', color: '#f59e0b' }}>
                <StarIcon />
              </div>
              <div className={styles.statInfo}><h3>{stats.overall_average}/100</h3></div>
            </div>
            <div className={styles.statInfo}><p>Your current academic rating.</p></div>
            <a href="/student/results" className={styles.statLink}>Go to report</a>
          </div>
        </div>

        {/* Bottom Widgets */}
        <div className={styles.bottomGrid}>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.headerIcon} style={{ background: '#146ef515' }}>
                  <Calendar03Icon size={18} color="#146ef5" />
                </div>
                <h2>Timetable</h2>
              </div>
              <span className={styles.widgetDate}>June 12, 2026</span>
            </div>
            <div className={styles.timetable}>
              <div className={styles.daysRow}>
                {[
                  { name: 'Mon', date: '08' },
                  { name: 'Tue', date: '09' },
                  { name: 'Wed', date: '10' },
                  { name: 'Thu', date: '11' },
                  { name: 'Fri', date: '12', active: true },
                  { name: 'Sat', date: '13' },
                  { name: 'Sun', date: '14' },
                ].map((d, i) => (
                  <div key={i} className={`${styles.day} ${d.active ? styles.activeDay : ''}`}>
                    <span className={styles.dayName}>{d.name}</span>
                    <span className={styles.dayDate}>{d.date}</span>
                  </div>
                ))}
              </div>
              <div className={styles.calendarView}>
                {['08:00', '09:00', '10:00', '11:00'].map((hour) => (
                  <div key={hour} className={styles.hourRow}>
                    <span className={styles.hourLabel}>{hour}</span>
                    <div className={styles.hourContent} />
                  </div>
                ))}

                <div className={styles.eventsOverlay}>
                  {dashboardData.timetable?.map((event: any) => (
                    <div key={event.id} className={styles.calendarEvent} style={{ top: event.top, height: event.height }}>
                      <div className={styles.eventHeader}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className={styles.className}>{event.name}</span>
                          <span className={styles.classTime}>{event.time}</span>
                        </div>
                      </div>
                      <div className={styles.eventFooter}>
                        <span className={styles.subjectTag} style={{ background: event.color }}>{event.subject}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.headerIcon} style={{ background: '#f59e0b15' }}>
                  <StarIcon size={18} color="#f59e0b" />
                </div>
                <h2>Future Skills Progress</h2>
              </div>
              <a href="/student/future-skills" style={{ fontSize: '0.75rem', color: '#146ef5', fontWeight: '700', textDecoration: 'none' }}>View Pathway</a>
            </div>
            <div style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', marginTop: '1rem' }}>
              <h3>{future_skills.active_pathway}</h3>
              <div style={{ height: '8px', width: '100%', background: '#f1f5f9', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${future_skills.progress}%`, background: 'var(--color-sky-blue)' }}></div>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                You have earned {future_skills.certificates} certificates so far.
              </p>
            </div>
          </div>
        </div>
      </div>

      <HomeworkSidebar />
    </div>
  );
}
