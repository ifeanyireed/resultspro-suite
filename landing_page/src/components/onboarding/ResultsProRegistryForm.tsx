import React, { useState } from 'react';
import { Check, AlertCircle, Eye, EyeOff, Mail, Phone, User, MapPin, Map, Lock } from 'lucide-react';
import { NIGERIA_STATES_LGAS } from '../../utils/nigeriaStatesLgas';

export interface RegistryFormData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  state?: string;
  lga?: string;
}

interface Props {
  data: RegistryFormData;
  onChange: (data: Partial<RegistryFormData>) => void;
  onVerifiedChange?: (isVerified: boolean) => void;
  isVerified?: boolean;
  
  // Feature Flags
  requireOtp?: boolean;
  requirePassword?: boolean;
  showAddress?: boolean;
  showStateLga?: boolean;
  readOnlyFields?: ('name'|'email'|'phone'|'address'|'state'|'lga')[];
  showName?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  namePlaceholder?: string;
  nameLabel?: string;
  customTopElement?: React.ReactNode;
}

export function ResultsProRegistryForm({ 
  data, 
  onChange, 
  onVerifiedChange,
  isVerified = true,
  requireOtp = true,
  requirePassword = true,
  showAddress = false,
  showStateLga = false,
  readOnlyFields = [],
  showName = true,
  showEmail = true,
  showPhone = true,
  namePlaceholder = 'Full Name',
  nameLabel = 'Full Name',
  customTopElement
}: Props) {
  // OTP Local State
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // If OTP is NOT required, we treat the form as already verified for the sake of input states
  const effectiveIsVerified = requireOtp ? isVerified : false;
  
  const passLength = (data.password || '').length >= 8;
  const passHasUpper = /[A-Z]/.test(data.password || '');
  const passHasNumber = /[0-9]/.test(data.password || '');
  const passHasSpecial = /[^A-Za-z0-9]/.test(data.password || '');

  const getPasswordStrength = () => {
    if (!data.password) return { score: 0, text: 'No Password', color: 'bg-slate-200' };
    let score = 0;
    if (passLength) score++;
    if (passHasUpper) score++;
    if (passHasNumber) score++;
    if (passHasSpecial) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };
  
  const passwordStrength = getPasswordStrength();

  const handleSendOtp = () => {
    if (!data.phone || !data.email) {
      setOtpError('Please fill out Email and Phone Number first.');
      return;
    }
    setOtpSending(true);
    setOtpError('');
    setTimeout(() => {
      setOtpSending(false);
      setOtpSent(true);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    setOtpVerifying(true);
    setOtpError('');
    setTimeout(() => {
      setOtpVerifying(false);
      if (otpCode === '4892') {
        if (onVerifiedChange) onVerifiedChange(true);
      } else {
        setOtpError('Invalid OTP code. Use 4892 to simulate success.');
      }
    }, 900);
  };

  const inputClass = "focus:border-[#146ef5] focus:ring-1 focus:ring-[#146ef5] transition-all";
  const inputStyle = { padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '0.875rem', width: '100%', background: 'white' };

  return (
    <div style={{ 
      padding: '2.5rem', 
      border: '1px solid #e2e8f0', 
      background: '#ffffff',
      boxShadow: '0 30px 60px rgba(0,0,0,0.02)',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%',
      borderRadius: '4px'
    }}>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {customTopElement}
        
        {(showName || showEmail) && (
          <div style={{ display: 'grid', gridTemplateColumns: (showName && showEmail) ? '1fr 1fr' : '1fr', gap: '1rem' }}>
            {showName && (
              <div className="relative">
                {nameLabel && <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>{nameLabel}</label>}
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={namePlaceholder} 
                    disabled={(effectiveIsVerified && requireOtp) || readOnlyFields.includes('name')}
                    value={data.name}
                    onChange={(e) => onChange({ name: e.target.value })}
                    className={inputClass}
                    style={{ ...inputStyle, paddingLeft: '2.5rem' }} 
                  />
                </div>
              </div>
            )}
            {showEmail && (
              <div className="relative">
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    disabled={(effectiveIsVerified && requireOtp) || readOnlyFields.includes('email')}
                    value={data.email}
                    onChange={(e) => onChange({ email: e.target.value })}
                    className={inputClass}
                    style={{ ...inputStyle, paddingLeft: '2.5rem' }} 
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {showPhone && (
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <input 
              type="tel" 
              placeholder="Phone Number (+234...)" 
              disabled={(effectiveIsVerified && requireOtp) || readOnlyFields.includes('phone')}
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={inputClass}
              style={{ ...inputStyle, paddingLeft: '2.5rem', paddingRight: requireOtp ? '8.5rem' : '1rem' }} 
            />
            {requireOtp && !effectiveIsVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending || !data.phone}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-[2.5rem] rounded-full font-bold text-sm flex items-center justify-center transition-all ${!(otpSending || !data.phone) ? 'bg-[#146ef5] hover:bg-[#146ef5]/90 text-white shadow-md hover:-translate-y-[calc(50%+2px)]' : 'bg-[#708bf4]/50 text-white/80 pointer-events-none'}`}
                style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
              >
                {otpSending ? 'Sending...' : otpSent ? 'Resend' : 'Send OTP'}
              </button>
            )}
            {requireOtp && effectiveIsVerified && (
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={16} strokeWidth={3} /> Verified
              </div>
            )}
            </div>
          </div>
        )}

        {showAddress && (
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Office/Home Address</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Office/Home Address" 
                disabled={readOnlyFields.includes('address')}
                value={data.address || ''}
                onChange={(e) => onChange({ address: e.target.value })}
                className={inputClass}
                style={{ ...inputStyle, paddingLeft: '2.5rem' }} 
              />
            </div>
          </div>
        )}

        {showStateLga && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>State</label>
              <div className="relative">
                <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  value={data.state || ''}
                  disabled={readOnlyFields.includes('state')}
                  onChange={(e) => {
                    onChange({ state: e.target.value, lga: '' }); // reset LGA on state change
                  }}
                  className={inputClass}
                  style={{ ...inputStyle, appearance: 'none', paddingLeft: '2.5rem', fontSize: '13px' }}
                >
                  <option value="" style={{ fontSize: '13px' }}>Select State</option>
                  {Object.keys(NIGERIA_STATES_LGAS).sort().map((s) => (
                    <option key={s} value={s} style={{ fontSize: '13px' }}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>LGA</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  value={data.lga || ''}
                  disabled={readOnlyFields.includes('lga') || !data.state}
                  onChange={(e) => onChange({ lga: e.target.value })}
                  className={`${inputClass} disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed`}
                  style={{ ...inputStyle, appearance: 'none', paddingLeft: '2.5rem', fontSize: '13px' }}
                >
                  <option value="" style={{ fontSize: '13px' }}>Select LGA</option>
                  {data.state && NIGERIA_STATES_LGAS[data.state]?.sort().map((l) => (
                    <option key={l} value={l} style={{ fontSize: '13px' }}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {requirePassword && (
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 pl-1" style={{ marginTop: '0.75rem' }}>Account Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                placeholder="Password (Min. 6 characters)" 
                disabled={effectiveIsVerified && requireOtp}
                value={data.password || ''}
                onChange={(e) => onChange({ password: e.target.value })}
                className={inputClass}
                style={{ ...inputStyle, paddingLeft: '2.5rem' }} 
              />
            </div>

            {/* Password strength meter */}
            {data.password && (
              <div style={{ marginTop: '0.5rem', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <span>Strength: {passwordStrength.text}</span>
                </div>
                <div style={{ height: '4px', width: '100%', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                  <div 
                    style={{ height: '100%', transition: 'all 0.5s', width: `${(passwordStrength.score / 3) * 100}%`, background: passwordStrength.score === 0 ? '#ef4444' : passwordStrength.score === 1 ? '#f59e0b' : passwordStrength.score === 2 ? '#3b82f6' : '#10b981' }} 
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* OTP Verification Modal Box */}
        {requireOtp && otpSent && !effectiveIsVerified && (
          <div style={{ padding: '1.5rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '4px', marginTop: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', textShadow: 'none' }}>Verify Your Number</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', textShadow: 'none' }}>
              We sent a 4-digit code to <strong style={{ textShadow: 'none' }}>{data.phone}</strong>. (SIMULATOR: Type 4892)
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                placeholder="0000"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className={inputClass}
                style={{ flex: 1, padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', fontSize: '1.25rem', textAlign: 'center', letterSpacing: '0.5em', fontWeight: '900', background: 'white' }}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpCode.length < 4 || otpVerifying}
                className={`h-[2.5rem] rounded-full font-bold text-sm flex items-center justify-center transition-all ${!(otpCode.length < 4 || otpVerifying) ? 'bg-[#146ef5] hover:bg-[#146ef5]/90 text-white shadow-md hover:-translate-y-0.5' : 'bg-[#708bf4]/50 text-white/80 pointer-events-none'}`}
                style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
              >
                {otpVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            {otpError && (
              <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                <AlertCircle size={12} /> {otpError}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
