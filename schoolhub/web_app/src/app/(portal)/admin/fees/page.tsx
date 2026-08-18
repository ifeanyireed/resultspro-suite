'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Invoice01Icon, Plus01Icon, CreditCardIcon, DollarCircleIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminFeesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/fees');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin fees data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Fees Management...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load fees data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Fee Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Monitor institutional revenue, manage automated billing, and track collection efficiency.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
             Report Center
           </button>
           <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
             <Plus01Icon size={20} />
             Generate Invoices
           </button>
        </div>
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
              {stat.icon === 'dollar' && <DollarCircleIcon size={32} />}
              {stat.icon === 'invoice' && <Invoice01Icon size={32} />}
              {stat.icon === 'card' && <CreditCardIcon size={32} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444', background: stat.trend.startsWith('+') ? '#f0fdf4' : '#fef2f2', padding: '0.1rem 0.4rem', borderRadius: '0.4rem' }}>{stat.trend}</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginTop: '0.25rem' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Transaction Log */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Recent Transactions</h2>
               <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '700', cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {data.recent_transactions?.map((txn: any) => (
                 <div key={txn.id} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#146ef5', border: '1px solid #e2e8f0' }}>
                          <CreditCardIcon size={20} />
                       </div>
                       <div>
                          <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>{txn.parent}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{txn.method} • {txn.date}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontWeight: '800', color: '#1e293b' }}>{txn.amount}</div>
                       <span style={{ fontSize: '0.65rem', fontWeight: '800', color: txn.status === 'Success' ? '#10b981' : '#f59e0b', background: txn.status === 'Success' ? '#f0fdf4' : '#fffbeb', padding: '0.2rem 0.5rem', borderRadius: '0.5rem' }}>
                         {txn.status.toUpperCase()}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Collection Goal */}
         <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '2rem', padding: '2rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
               <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Collection Goal</h2>
               <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{data.collection_goal?.target}</div>
               <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.6 }}>Target collection for Term 3. You are currently at {data.collection_goal?.progress}% of your goal.</p>
            </div>
            <div style={{ marginTop: '2.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: '700' }}>
                  <span>Progress</span>
                  <span>{data.collection_goal?.progress}%</span>
               </div>
               <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.collection_goal?.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ height: '100%', background: '#146ef5', borderRadius: '4px' }} 
                  />
               </div>
               <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                 Send Reminders
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
