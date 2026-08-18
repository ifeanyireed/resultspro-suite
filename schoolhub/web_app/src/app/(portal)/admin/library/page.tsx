'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book02Icon, Plus01Icon, AnalyticsUpIcon, UserGroupIcon, Search01Icon, ArrowRight01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminLibraryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/library');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin library data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Library...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load library data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Library Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Catalog institutional resources, track book issuance/returns, and manage digital archives.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Search catalog..." style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '250px', outline: 'none' }} />
              <Search01Icon size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
           </div>
           <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
             <Plus01Icon size={20} />
             Add New Resource
           </button>
        </div>
      </header>

      {/* Stats Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.stats?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.75rem', borderRadius: '2rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'book' && <Book02Icon size={32} />}
              {stat.icon === 'users' && <UserGroupIcon size={32} />}
              {stat.icon === 'analytics' && <AnalyticsUpIcon size={32} />}
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginTop: '0.25rem' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Issuance Log */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Recent Issuance</h2>
               <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '700', cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {data.recent_issues?.map((issue: any) => (
                 <div key={issue.id} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', border: '1px solid #e2e8f0' }}>
                          <Book02Icon size={20} />
                       </div>
                       <div>
                          <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>{issue.book}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Student: {issue.student} • Due: {issue.due}</div>
                       </div>
                    </div>
                    <div>
                       <span style={{ fontSize: '0.7rem', fontWeight: '800', color: issue.color, background: `${issue.color}10`, padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: `1px solid ${issue.color}20` }}>
                         {issue.status.toUpperCase()}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Categories */}
         <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Collection Health</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {data.categories?.map((cat: any, i: number) => (
                 <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                       <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.85rem' }}>{cat.name}</span>
                       <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.85rem' }}>{cat.count}</span>
                    </div>
                    <div style={{ height: '6px', background: 'white', borderRadius: '3px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${cat.score}%` }}
                         style={{ height: '100%', background: cat.color, borderRadius: '3px' }} 
                       />
                    </div>
                 </div>
               ))}
            </div>
            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
               Inventory Audit
               <ArrowRight01Icon size={18} />
            </button>
         </div>
      </div>
    </div>
  );
}
