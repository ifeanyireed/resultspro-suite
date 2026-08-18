'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserGroupIcon, Plus01Icon, Activity04Icon, StarIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminEnrollmentPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/enrollment');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin enrollment data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Enrollment Analytics...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load enrollment data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Enrollment Analytics
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Track student population trends, manage grade capacity, and monitor admissions pipeline health.
          </p>
        </div>
        <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
          <Plus01Icon size={20} />
          New Enrollment
        </button>
      </header>

      {/* Stats Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.stats?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.75rem', borderRadius: '2rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'users' && <UserGroupIcon size={32} />}
              {stat.icon === 'activity' && <Activity04Icon size={32} />}
              {stat.icon === 'star' && <StarIcon size={32} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#10b981', background: '#f0fdf4', padding: '0.1rem 0.4rem', borderRadius: '0.4rem' }}>{stat.trend}</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginTop: '0.25rem' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.5rem' }}>
         {/* Grade Breakdown */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '2rem' }}>Grade Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               {data.grades?.map((item: any, i: number) => (
                 <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                       <span style={{ fontWeight: '700', color: '#1e293b' }}>{item.grade}</span>
                       <span style={{ fontWeight: '800', color: '#1e293b' }}>{item.count}</span>
                    </div>
                    <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(item.count / 450) * 100}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         style={{ height: '100%', background: item.color, borderRadius: '6px' }} 
                       />
                    </div>
                 </div>
               ))}
            </div>
            <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
               <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Total Capacity</div>
               <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>1,240 / 1,400</div>
               <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Current enrollment is at 88% of physical infrastructure limit.</p>
            </div>
         </div>

         {/* Growth Chart (Placeholder Visual) */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Growth Trends</h2>
               <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
               </select>
            </div>
            
            <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '0 1rem' }}>
               {data.growth?.data?.map((val: number, i: number) => (
                 <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      style={{ width: '100%', background: 'linear-gradient(to top, #0ea5e9, #38bdf8)', borderRadius: '0.5rem 0.5rem 0 0' }} 
                    />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8' }}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                 </div>
               ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
               <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>New Leads</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{data.growth?.leads}</div>
               </div>
               <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Conversion</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{data.growth?.conversion}</div>
               </div>
               <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Attrition</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ef4444' }}>{data.growth?.attrition}</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
