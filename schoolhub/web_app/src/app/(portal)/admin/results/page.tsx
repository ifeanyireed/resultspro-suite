'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award01Icon, 
  AnalyticsUpIcon, 
  ArrowUp01Icon, 
  ArrowDown01Icon, 
  CheckmarkCircle02Icon,
  Book02Icon
} from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminResultsCenter() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/results');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin results data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Results Center...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load results data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#8b5cf6', background: '#f5f3ff', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>ResultsPRO</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Results & Performance
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Institutional academic overview, department audits, and official result publication management.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
             Export All Results
           </button>
           <button style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.25)' }}>
             Approve Publication
           </button>
        </div>
      </header>

      {/* Institutional KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.kpis?.map((stat: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.75rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon === 'award' && <Award01Icon />}
              {stat.icon === 'check' && <CheckmarkCircle02Icon />}
              {stat.icon === 'book' && <Book02Icon />}
              {stat.icon === 'analytics' && <AnalyticsUpIcon />}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Department Performance */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Departmental Performance</h2>
               <button style={{ background: 'none', border: 'none', color: '#146ef5', fontWeight: '700', fontSize: '0.85rem' }}>Compare Classes</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {data.departments?.map((dept: any, i: number) => (
                 <div key={i} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{dept.department}</div>
                       <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Pass Rate: {dept.passRate}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                       <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{dept.avg}</div>
                          <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8' }}>AVG SCORE</span>
                       </div>
                       <div style={{ textAlign: 'right', width: '60px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem', color: dept.trend.startsWith('+') ? '#10b981' : '#ef4444', fontWeight: '800', fontSize: '0.9rem' }}>
                             {dept.trend.startsWith('+') ? <ArrowUp01Icon size={14} /> : <ArrowDown01Icon size={14} />}
                             {dept.trend}
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Historical Audit */}
         <div style={{ background: '#f8fafc', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' }}>Audit Log</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {data.audit?.map((item: any, i: number) => (
                 <div key={i} style={{ background: 'white', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: '700', marginBottom: '0.4rem' }}>{item.title}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.status}</span>
                       <span style={{ fontSize: '0.75rem', fontWeight: '700', color: item.color }}>{item.result}</span>
                    </div>
                 </div>
               ))}
            </div>
            <button style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '1.25rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>
               View Full Audit Trail
            </button>
         </div>
      </div>
    </div>
  );
}
