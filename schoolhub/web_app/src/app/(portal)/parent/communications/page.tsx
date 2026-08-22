'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Message01Icon, Mail01Icon, Notification03Icon, Search01Icon, FilterIcon, MoreHorizontalIcon } from 'hugeicons-react';
import api from '@/lib/api';

export default function CommunicationsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/parent/communications');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch communications data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Messages...</div>;
  if (!data) return <div style={{ padding: '2rem' }}>Failed to load messages data.</div>;

  return (
    <div style={{ maxWidth: '1200px', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Communications
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
            Stay connected with the school through newsletters, teacher updates, and official broadcasts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
             <input 
               type="text" 
               placeholder="Search messages..." 
               style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '250px', outline: 'none' }}
             />
             <Search01Icon size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.8rem', borderRadius: '1rem', cursor: 'pointer', color: '#64748b' }}>
             <FilterIcon size={20} />
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
        {/* Sidebar Folders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           {data.folders?.map((folder: any, i: number) => (
             <button
               key={i}
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'space-between',
                 padding: '1rem 1.25rem',
                 borderRadius: '1.25rem',
                 border: 'none',
                 background: folder.active ? '#eff6ff' : 'transparent',
                 color: folder.active ? '#146ef5' : '#64748b',
                 fontWeight: '700',
                 cursor: 'pointer',
                 textAlign: 'left',
                 transition: 'all 0.2s ease'
               }}
             >
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 {folder.icon === 'message' && <Message01Icon size={20} />}
                 {folder.icon === 'notification' && <Notification03Icon size={20} />}
                 {folder.icon === 'mail' && <Mail01Icon size={20} />}
                 {folder.icon === 'filter' && <FilterIcon size={20} />}
                 <span>{folder.name}</span>
               </div>
               <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{folder.count}</span>
             </button>
           ))}
        </div>

        {/* Message List */}
        <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          {data.messages?.map((msg: any, i: number) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ background: '#f8fafc' }}
              style={{
                padding: '1.5rem 2rem',
                borderBottom: i === data.messages.length - 1 ? 'none' : '1px solid #f1f5f9',
                cursor: 'pointer',
                display: 'flex',
                gap: '1.5rem',
                position: 'relative'
              }}
            >
              {msg.unread && (
                <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: '#146ef5' }} />
              )}
              
              <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: `${msg.color}15`, color: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                {msg.sender.charAt(0)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: msg.unread ? '800' : '700', color: '#1e293b', margin: 0 }}>{msg.sender}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{msg.time}</span>
                </div>
                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{msg.subject}</div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {msg.excerpt}
                </p>
                <div style={{ marginTop: '0.75rem' }}>
                   <span style={{ fontSize: '0.65rem', fontWeight: '800', color: msg.color, background: `${msg.color}10`, padding: '0.2rem 0.6rem', borderRadius: '0.5rem', border: `1px solid ${msg.color}20` }}>
                     {msg.category.toUpperCase()}
                   </span>
                </div>
              </div>

              <button style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', alignSelf: 'flex-start' }}>
                 <MoreHorizontalIcon size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
