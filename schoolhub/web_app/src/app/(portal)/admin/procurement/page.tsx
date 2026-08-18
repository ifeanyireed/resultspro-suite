'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PackageIcon, Plus01Icon, AnalyticsUpIcon, ShoppingCart01Icon, FilterIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function AdminProcurementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/procurement');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin procurement data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Procurement...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load procurement data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Procurement & Inventory
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Manage school supplies, track inventory levels, and handle vendor purchase orders.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
             Vendors
           </button>
           <button style={{ background: '#146ef5', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '1.25rem', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(20, 110, 245, 0.25)' }}>
             <Plus01Icon size={20} />
             Create Purchase Order
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
              {stat.icon === 'analytics' && <AnalyticsUpIcon size={32} />}
              {stat.icon === 'package' && <PackageIcon size={32} />}
              {stat.icon === 'cart' && <ShoppingCart01Icon size={32} />}
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginTop: '0.25rem' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
         {/* Inventory List */}
         <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Stock Inventory</h2>
               <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input type="text" placeholder="Search items..." style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }} />
                  <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '0.75rem', cursor: 'pointer' }}><FilterIcon size={18} /></button>
               </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               {data.categories?.map((cat: any, i: number) => (
                 <div key={i} style={{ padding: '1.25rem', borderRadius: '1.5rem', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#146ef5', border: '1px solid #e2e8f0' }}>
                          <PackageIcon size={20} />
                       </div>
                       <div>
                          <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>{cat.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Last restocked: 12 June 2024</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontWeight: '800', color: '#1e293b' }}>{cat.count} Items</div>
                       <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700' }}>In Stock</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Alerts */}
         <div style={{ background: '#fef2f2', borderRadius: '2rem', border: '1px solid #fee2e2', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#991b1b', marginBottom: '1.5rem' }}>Stock Alerts</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {data.alerts?.map((alert: any) => (
                 <div key={alert.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #fee2e2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                       <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9rem' }}>{alert.item}</span>
                       <span style={{ fontSize: '0.65rem', fontWeight: '800', color: alert.color, background: `${alert.color}10`, padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>{alert.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Stock: {alert.stock}</div>
                       <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Min: {alert.min}</div>
                    </div>
                    <button style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', borderRadius: '0.75rem', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                       Reorder Now
                    </button>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
