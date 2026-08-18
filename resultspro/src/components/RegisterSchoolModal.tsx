import React, { useState } from 'react';
import { X, Target, ChevronDown, Eye, EyeOff, ArrowRight01 } from '@/lib/hugeicons-compat';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import axiosInstance from '@/lib/axiosConfig';
import { STATES, getLGAsByState } from '@/lib/nigerian-states-lgas';
import { useToast } from '@/hooks/use-toast';

interface RegisterSchoolModalProps {
  onClose: () => void;
  onSuccess: () => void;
  agentReferralCode?: string;
}

const RegisterSchoolModal: React.FC<RegisterSchoolModalProps> = ({ onClose, onSuccess, agentReferralCode }) => {
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const lgas = state ? getLGAsByState(state) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!schoolName.trim() || !email.trim() || !phone.trim() || !fullAddress.trim() || !state.trim() || !lga.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      await axiosInstance.post('/auth/register', {
        schoolName: schoolName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        fullAddress: fullAddress.trim(),
        state: state.trim(),
        lga: lga.trim(),
        referralCode: agentReferralCode,
        password,
      });

      toast({
        title: 'Success',
        description: 'School registered successfully. They will need to verify their email.',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-[30px] p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Register New School</h2>
            <p className="text-gray-400 text-sm mt-1">Onboard a school to your management network</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder=" "
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all" />
              <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none" 
                style={schoolName ? { top: '-10px', fontSize: '12px', background: 'rgb(17, 24, 39)', padding: '0 4px', color: 'rgb(96, 165, 250)' } : {}}>
                School Name
              </label>
            </div>

            <div className="relative">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" "
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all" />
              <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none"
                style={email ? { top: '-10px', fontSize: '12px', background: 'rgb(17, 24, 39)', padding: '0 4px', color: 'rgb(96, 165, 250)' } : {}}>
                Admin Email Address
              </label>
            </div>

            <div className="relative">
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder=" "
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all" />
              <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none"
                style={phone ? { top: '-10px', fontSize: '12px', background: 'rgb(17, 24, 39)', padding: '0 4px', color: 'rgb(96, 165, 250)' } : {}}>
                Phone Number
              </label>
            </div>

            <div className="relative">
              <input type="text" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} placeholder=" "
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all" />
              <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none"
                style={fullAddress ? { top: '-10px', fontSize: '12px', background: 'rgb(17, 24, 39)', padding: '0 4px', color: 'rgb(96, 165, 250)' } : {}}>
                Full Address
              </label>
            </div>

            <div className="relative">
              <select value={state} onChange={(e) => { setState(e.target.value); setLga(''); }}
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none">
                <option value="">Select State</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select value={lga} onChange={(e) => setLga(e.target.value)}
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                disabled={!state}>
                <option value="">Select LGA</option>
                {lgas.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" "
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all pr-12" />
              <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none"
                style={password ? { top: '-10px', fontSize: '12px', background: 'rgb(17, 24, 39)', padding: '0 4px', color: 'rgb(96, 165, 250)' } : {}}>
                Password
              </label>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-gray-400 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder=" "
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 transition-all pr-12" />
              <label className="absolute left-6 top-3 text-gray-400 text-sm transition-all pointer-events-none"
                style={confirmPassword ? { top: '-10px', fontSize: '12px', background: 'rgb(17, 24, 39)', padding: '0 4px', color: 'rgb(96, 165, 250)' } : {}}>
                Confirm Password
              </label>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3 text-gray-400 hover:text-white transition-colors">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-3">
            <Target className="text-blue-400 w-5 h-5 flex-shrink-0" />
            <p className="text-xs text-blue-300">This school will be automatically linked to your account via your referral code: <strong>{agentReferralCode}</strong></p>
          </div>

          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>}

          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><InlineLoadingSpinner size="sm" /><span>Registering...</span></> : <>Register School<ArrowRight01 size={20} /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterSchoolModal;
