'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CompactGradebook } from './components/gradebook/CompactGradebook';
import axiosInstance from './lib/axiosConfig';

export * from './components/gradebook';

export interface ResultCheckerViewProps {
  schoolSlug?: string;
  tenantId?: string;
  initialAdmissionNumber?: string;
  standalone?: boolean;
}

export const ResultCheckerView: React.FC<ResultCheckerViewProps> = ({
  schoolSlug,
  tenantId,
  initialAdmissionNumber = '',
  standalone = false,
}) => {
  const [admissionNumber, setAdmissionNumber] = useState(initialAdmissionNumber);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/scratch-cards/validate', {
        pin: pin.trim(),
        studentAdmissionNumber: admissionNumber.trim(),
      });

      if (response.data.success) {
        setResultData(response.data.data);
      } else {
        setError(response.data.error || 'Invalid credentials or PIN');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to retrieve terminal result. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      {!resultData ? (
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#146ef5', background: '#eff6ff', padding: '0.35rem 0.85rem', borderRadius: '2rem' }}>ResultsPRO Checker</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Terminal Result Verification</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Enter student admission number and scratch card PIN to access official term records.</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Student Admission Number</label>
              <input
                type="text"
                placeholder="e.g. SCH/2026/0491"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                required
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Scratch Card PIN</label>
              <input
                type="text"
                placeholder="e.g. 8492-9102-3849"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '1rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: '#146ef5', color: 'white', padding: '1rem', borderRadius: '0.75rem', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}
            >
              {loading ? 'Validating PIN...' : 'Access Report Card'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setResultData(null)}
            style={{ marginBottom: '1.5rem', background: '#f1f5f9', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
          >
            ← Check Another Result
          </button>
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CompactGradebook
              school={resultData.school || { name: 'School Academy' }}
              result={resultData.result || resultData}
              template={resultData.template || { gradingSystem: { A: { min: 70, max: 100 } } }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
