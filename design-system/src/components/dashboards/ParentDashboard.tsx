'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  UserGroupIcon, 
  CreditCardIcon, 
  Calendar03Icon,
  Message01Icon,
  CheckmarkCircle02Icon,
  AnalyticsUpIcon
} from 'hugeicons-react';
import api from '@/lib/api';
import WelcomeBanner from './WelcomeBanner';
import styles from './Dashboard.module.css';

export default function ParentDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    api.get('/parent/dashboard')
      .then(res => setDashboardData(res.data))
      .catch(err => console.error('Failed to load parent dashboard:', err));
  }, []);

  if (!dashboardData) {
    return <div className={styles.container}><div style={{ color: 'white', padding: '2rem' }}>Loading Parent Portal...</div></div>;
  }

  const { parent_name, banner, stats, children_progress, messages, events, future_events } = dashboardData;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <WelcomeBanner 
          title={`Hello, ${parent_name}`} 
          description={banner.description} 
          monsterSrc={banner.monster_img} 
        />

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Children</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ color: '#6366f1', background: '#eef2ff' }}><UserGroupIcon /></div>
              <div className={styles.statInfo}><h3>{stats.children_count}</h3></div>
            </div>
            <div className={styles.statInfo}><p>{stats.children_names}</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>School Fees</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ color: '#f59e0b', background: '#fffbeb' }}><CreditCardIcon /></div>
              <div className={styles.statInfo}><h3>{stats.pending_fees}</h3></div>
            </div>
            <div className={styles.statInfo}><p>Pending fees for Term 3</p></div>
            <a href="/payments" className={styles.statLink} style={{ color: '#f59e0b' }}>Pay Now</a>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Attendance</div>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ color: '#10b981', background: '#f0fdf4' }}><CheckmarkCircle02Icon /></div>
              <div className={styles.statInfo}><h3>{stats.attendance}</h3></div>
            </div>
            <div className={styles.statInfo}><p>Average Attendance</p></div>
          </div>
        </div>

        {/* Bottom Widgets */}
        <div className={styles.bottomGrid}>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AnalyticsUpIcon size={18} color="#6366f1" />
                <h2>Academic Progress</h2>
              </div>
              <a href="/parent/reports" style={{ fontSize: '0.75rem', color: '#146ef5', fontWeight: '700', textDecoration: 'none' }}>Full Reports</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0' }}>
              {children_progress.map((child: any, i: number) => (
                <div key={i} className={styles.classCard} style={{ borderLeft: 'none', background: 'transparent', padding: 0 }}>
                  <div className={styles.childHeader}>
                    <div className={styles.childAvatar}>
                      <Image src={child.photo} alt={child.name} width={32} height={32} style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={styles.childInfo}>
                      <h4>{child.name}</h4>
                      <p>{child.grade}</p>
                    </div>
                    <span className={`${styles.trendIndicator} ${child.up ? styles.trendUp : styles.trendDown}`}>
                      {child.trend}
                    </span>
                  </div>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressFill} style={{ width: `${child.score}%`, background: child.color }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                    <span>Progress: {child.score}%</span>
                    <span>Goal: 95%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Message01Icon size={18} color="#f59e0b" />
                <h2>Messages from School</h2>
              </div>
              <a href="/communications" style={{ fontSize: '0.75rem', color: '#146ef5', fontWeight: '700', textDecoration: 'none' }}>Inbox</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
              {messages.map((msg: any, i: number) => (
                <div key={i} className={styles.assessmentItem} style={{ padding: '0.75rem 1rem' }}>
                   <div className={styles.assessmentIcon} style={{ background: msg.color + '15', color: msg.color, borderRadius: '50%', width: '40px', height: '40px', fontSize: '0.85rem', fontWeight: '800' }}>
                      {msg.initial}
                   </div>
                   <div className={styles.assessmentInfo}>
                      <h4 className={styles.assessmentTitle}>{msg.subject}</h4>
                      <span className={styles.assessmentSub}>{msg.sender}</span>
                   </div>
                   <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {msg.time}
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={styles.sidebarArea}>
        <div className={styles.sidebarHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar03Icon size={18} color="#6366f1" />
            <h2>Upcoming Events</h2>
          </div>
        </div>

        <div className={styles.sectionTitle}>This Week</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {events.map((event: any, i: number) => (
            <div key={i} className={styles.eventCard} style={{ height: '110px' }}>
              <Image 
                src={event.img} 
                alt={event.title} 
                fill 
                style={{ objectFit: 'cover' }} 
                sizes="(max-width: 768px) 100vw, 340px"
                priority={i === 0}
              />
              <div className={styles.eventDateBadge} style={{ top: '0.75rem', left: '0.75rem', padding: '0.3rem' }}>
                <span className={styles.dateMonth}>{event.month}</span>
                <span className={styles.dateDay} style={{ fontSize: '0.85rem' }}>{event.day}</span>
              </div>
              <div className={styles.eventOverlay} style={{ padding: '1rem' }}>
                <h4 className={styles.eventTitle} style={{ fontSize: '0.9rem' }}>{event.title}</h4>
                <div className={styles.eventMeta}>
                  <span className={styles.eventTime} style={{ fontSize: '0.65rem' }}>{event.time}</span>
                  <span className={styles.moreDetails} style={{ fontSize: '0.6rem' }}>Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sectionTitle}>Next Week</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {future_events.map((event: any, i: number) => (
            <div key={i} className={styles.eventCard} style={{ height: '110px' }}>
              <Image 
                src={event.img} 
                alt={event.title} 
                fill 
                style={{ objectFit: 'cover' }} 
                sizes="(max-width: 768px) 100vw, 340px"
              />
              <div className={styles.eventDateBadge} style={{ top: '0.75rem', left: '0.75rem', padding: '0.3rem' }}>
                <span className={styles.dateMonth}>{event.month}</span>
                <span className={styles.dateDay} style={{ fontSize: '0.85rem' }}>{event.day}</span>
              </div>
              <div className={styles.eventOverlay} style={{ padding: '1rem' }}>
                <h4 className={styles.eventTitle} style={{ fontSize: '0.9rem' }}>{event.title}</h4>
                <div className={styles.eventMeta}>
                  <span className={styles.eventTime} style={{ fontSize: '0.65rem' }}>{event.time}</span>
                  <span className={styles.moreDetails} style={{ fontSize: '0.6rem' }}>Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
