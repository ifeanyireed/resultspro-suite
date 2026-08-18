'use client';

import React from 'react';
import { Tick02Icon, AlertCircleIcon } from 'hugeicons-react';
import styles from './Dashboard.module.css';

export default function HomeworkSidebar() {
  return (
    <div className={styles.sidebarArea}>
      <div className={styles.sidebarHeader}>
        <h2>Homework progress</h2>
        <select style={{ border: 'none', fontWeight: '700', color: '#1e293b', outline: 'none', background: 'none' }}>
          <option>All</option>
        </select>
      </div>

      <div className={styles.sectionTitle}>To do</div>
      <div className={styles.taskList}>
        {[
          { title: 'Rational inequalities. AI Assessment #5', date: '30 Mar, 2024' },
          { title: 'All about Homestas. Quize', date: '28 Mar, 2024' },
          { title: 'Shapes and Structures', date: '03 Apr, 2024' },
          { title: 'Word Wonders: Unraveling Language', date: '03 Apr, 2024' },
        ].map((task, i) => (
          <div key={i} className={styles.taskItem}>
            <div className={styles.checkbox} />
            <div className={styles.taskInfo}>
              <div className={styles.taskHeader}>
                <h4>{task.title}</h4>
                <span className={styles.taskDate}>{task.date}</span>
              </div>
              <div className={styles.taskMeta}>
                <AlertCircleIcon size={12} color="#ef4444" />
                <span className={styles.taskDeadline}>Deadline</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionTitle}>On review</div>
      <div className={styles.taskList}>
        {[
          { title: 'Historical Chronicles: Exploring the Past', date: '30 Mar, 2024' },
          { title: 'Epoch Explorations: Unraveling Timelines', date: '30 Mar, 2024' },
        ].map((task, i) => (
          <div key={i} className={styles.taskItem}>
            <div className={styles.checkbox} />
            <div className={styles.taskInfo}>
              <div className={styles.taskHeader}>
                <h4>{task.title}</h4>
                <span className={styles.taskDate}>{task.date}</span>
              </div>
              <div className={styles.taskMeta}>
                <AlertCircleIcon size={12} color="#ef4444" />
                <span className={styles.taskDeadline}>Deadline</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionTitle}>Completed</div>
      <div className={styles.taskList}>
        {[
          { title: 'Physics Phantoms: Unraveling the Laws of Nature', date: '25 Mar, 2024' },
          { title: 'Language Landscapes: Exploring Vocabulary', date: '24 Mar, 2024' },
        ].map((task, i) => (
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
                <span>Deadline</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
