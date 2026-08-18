'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Book02Icon, 
  Task01Icon, 
  UserGroupIcon,
  Calendar03Icon,
  Tick02Icon,
  AlertCircleIcon
} from 'hugeicons-react';
import WelcomeBanner from './WelcomeBanner';
import styles from './Dashboard.module.css';
import api from '@/lib/api';

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/teacher/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch teacher dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className={styles.container}>Loading Dashboard...</div>;
  if (!data) return <div className={styles.container}>Failed to load dashboard data.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <WelcomeBanner 
          title={`Good morning, ${data.teacher_name || 'Teacher'}`} 
          description={`You have ${data.today_classes?.length || 0} classes today. Your first class starts in 15 minutes. Have a great day teaching!`} 
          monsterSrc="/monster_meditating.png" 
          backgroundColor="#10b981"
        />

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {data.stats?.map((stat: any, i: number) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statTitle}>{stat.label}</div>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ color: stat.color, background: stat.bg }}>
                  {stat.icon === 'book' && <Book02Icon />}
                  {stat.icon === 'task' && <Task01Icon />}
                  {stat.icon === 'users' && <UserGroupIcon />}
                </div>
                <div className={styles.statInfo}><h3>{stat.value}</h3></div>
              </div>
              <div className={styles.statInfo}><p>{stat.sub}</p></div>
              {stat.link && <a href="#" className={styles.statLink} style={{ color: stat.color }}>{stat.link}</a>}
            </div>
          ))}
        </div>

        {/* Bottom Widgets */}
        <div className={styles.bottomGrid}>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar03Icon size={18} color="#10b981" />
                <h2>Today&apos;s Classes</h2>
              </div>
              <span className={styles.widgetDate}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            
            <div className={styles.calendarView}>
              {/* Hours Grid */}
              {['08:00', '09:00', '10:00', '11:00', '12:00'].map((hour) => (
                <div key={hour} className={styles.hourRow}>
                  <span className={styles.hourLabel}>{hour}</span>
                  <div className={styles.hourContent} />
                </div>
              ))}

              {/* Events Overlay */}
              <div className={styles.eventsOverlay}>
                {data.today_classes?.map((cls: any) => (
                  <div 
                    key={cls.id} 
                    className={styles.calendarEvent} 
                    style={{ 
                      top: cls.top, 
                      height: cls.height, 
                      background: cls.bg, 
                      borderColor: cls.border 
                    }}
                  >
                    <div className={styles.eventHeader}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className={styles.className} style={{ color: cls.color === '#94a3b8' ? '#64748b' : undefined }}>{cls.name}</span>
                        <span className={styles.classTime}>{cls.time}</span>
                      </div>
                      <div className={styles.studentAvatars}>
                        {cls.students?.map((src: string, i: number) => (
                          <div key={i} className={styles.avatarMini}>
                             <Image src={src} alt="Student" width={24} height={24} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.eventFooter}>
                      <span className={styles.subjectTag} style={{ background: cls.color }}>{cls.status} • {cls.room}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Time Indicator */}
              <div className={styles.currentTimeIndicator} style={{ top: '233px' }}>
                <div className={styles.currentTimeBubble}>10:15</div>
              </div>
            </div>
          </div>

          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Task01Icon size={18} color="#f59e0b" />
                <h2>Recent Assessments</h2>
              </div>
              <a href="#" style={{ fontSize: '0.75rem', color: '#146ef5', fontWeight: '700', textDecoration: 'none' }}>View All</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
              {data.assessments?.map((item: any, i: number) => (
                <div key={i} className={styles.assessmentItem}>
                  <div className={styles.assessmentIcon}>
                    <Task01Icon size={20} />
                  </div>
                  <div className={styles.assessmentInfo}>
                    <h4 className={styles.assessmentTitle}>{item.title}</h4>
                    <span className={styles.assessmentSub}>{item.class} • {item.date}</span>
                  </div>
                  <div className={styles.assessmentBadge}>
                    <span className={styles.badgeValue}>{item.graded}</span>
                    <span className={styles.badgeLabel}>{item.status}</span>
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
          <h2>Teacher Tasks</h2>
        </div>

        <div className={styles.sectionTitle}>High Priority</div>
        <div className={styles.taskList}>
          {data.tasks?.high_priority?.map((task: any, i: number) => (
            <div key={i} className={styles.taskItem}>
              <div className={styles.checkbox} />
              <div className={styles.taskInfo}>
                <div className={styles.taskHeader}>
                  <h4>{task.title}</h4>
                  <span className={styles.taskDate}>{task.date}</span>
                </div>
                <div className={styles.taskMeta}>
                  <AlertCircleIcon size={12} color="#ef4444" />
                  <span className={styles.taskDeadline}>Due</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sectionTitle}>General</div>
        <div className={styles.taskList}>
          {data.tasks?.general?.map((task: any, i: number) => (
            <div key={i} className={styles.taskItem}>
              <div className={styles.checkbox} />
              <div className={styles.taskInfo}>
                <div className={styles.taskHeader}>
                  <h4>{task.title}</h4>
                  <span className={styles.taskDate}>{task.date}</span>
                </div>
                <div className={styles.taskMeta}>
                  <Calendar03Icon size={12} />
                  <span>{task.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sectionTitle}>Completed</div>
        <div className={styles.taskList}>
          {data.tasks?.completed?.map((task: any, i: number) => (
            <div key={i} className={styles.taskItem}>
              <div className={`${styles.checkbox} ${styles.completed}`}>
                <Tick02Icon size={12} color="white" />
              </div>
              <div className={styles.taskInfo}>
                <div className={styles.taskHeader}>
                  <h4 style={{ color: '#94a3b8', textDecoration: 'line-through' }}>{task.title}</h4>
                  <span className={styles.taskDate}>{task.date}</span>
                </div>
                <div className={styles.taskMeta}>
                  <Tick02Icon size={12} color="#10b981" />
                  <span>Done</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
