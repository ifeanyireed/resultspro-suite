'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCardIcon, Invoice01Icon, DollarCircleIcon, CheckmarkCircle02Icon, ArrowRight01Icon } from 'hugeicons-react';
import api from '@/lib/api';

export default function PaymentsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/parent/payments');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch parent payment data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Fee Management...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load fee management data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Fee Management
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Securely manage tuition fees, view invoices, and track your payment history.
        </p>
      </header>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.stats?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '1.25rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'dollar' && <DollarCircleIcon size={28} />}
              {stat.icon === 'check' && <CheckmarkCircle02Icon size={28} />}
              {stat.icon === 'card' && <CreditCardIcon size={28} />}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Invoice History</h2>
           <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: '700', cursor: 'pointer' }}>
             Make a Payment
           </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Invoice ID</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Student</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Description</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Amount</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1.25rem 2rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.invoices?.map((inv: any) => (
                <tr key={inv.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{inv.id}</td>
                  <td style={{ padding: '1.25rem 2rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>{inv.child}</td>
                  <td style={{ padding: '1.25rem 2rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{inv.description}</td>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#1e293b', fontSize: '0.9rem' }}>${inv.amount.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem 2rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>{inv.date}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: inv.color, background: `${inv.color}10`, padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: `1px solid ${inv.color}20` }}>
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Details <ArrowRight01Icon size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f115', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Invoice01Icon size={20} />
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', margin: 0 }}>
          Looking for old records? You can request a full statement of account from the <a href="#" style={{ color: '#146ef5', textDecoration: 'none', fontWeight: '800' }}>Bursar Office</a>.
        </p>
      </div>
    </div>
  );
}
