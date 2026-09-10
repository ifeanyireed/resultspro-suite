import React, { useState, useEffect } from 'react';
import { WidgetCard } from '@/components/ui/Cards';
import { RefreshCw, Save, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReferralsTab() {
  const [settings, setSettings] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [coinReward, setCoinReward] = useState('50');
  const [fiatReward, setFiatReward] = useState('2000');
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, payoutsRes] = await Promise.all([
        api.get('/examspro/admin/settings'),
        api.get('/examspro/admin/payouts')
      ]);

      setSettings(settingsRes.data || []);
      setPayouts(payoutsRes.data || []);

      const coinSet = settingsRes.data?.find((s: any) => s.id === 'referral_coin_reward');
      const fiatSet = settingsRes.data?.find((s: any) => s.id === 'referral_fiat_reward');
      if (coinSet) setCoinReward(coinSet.value);
      if (fiatSet) setFiatReward(fiatSet.value);

    } catch (err: any) {
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      await api.put('/examspro/admin/settings/referral_coin_reward', { value: coinReward });
      await api.put('/examspro/admin/settings/referral_fiat_reward', { value: fiatReward });
      toast.success('Referral settings updated!');
      fetchData();
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    if (!window.confirm("Are you sure you want to mark this payout as completed? This means you have manually transferred the funds to their bank.")) return;
    try {
      await api.put(`/examspro/admin/payouts/${id}`, { status: 'completed' });
      toast.success('Payout marked as completed!');
      fetchData();
    } catch (err) {
      toast.error('Failed to update payout status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Referrals & Payouts</h2>
        <button onClick={fetchData} className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-lg border hover:bg-gray-50">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WidgetCard title="Referral Settings" subtitle="Configure rewards given when a referee buys a plan">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coin Reward</label>
              <input 
                type="number" 
                value={coinReward} 
                onChange={e => setCoinReward(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#146ef5]"
              />
              <p className="text-xs text-gray-500 mt-1">Amount of coins to give the referrer.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiat Discount / Cash (₦)</label>
              <input 
                type="number" 
                value={fiatReward} 
                onChange={e => setFiatReward(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#146ef5]"
              />
              <p className="text-xs text-gray-500 mt-1">Cash amount (in Naira) added to referrer's wallet.</p>
            </div>
            <button 
              onClick={handleSaveSettings} 
              disabled={savingSettings}
              className="w-full bg-[#146ef5] text-white py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={16} /> Save Settings
            </button>
          </div>
        </WidgetCard>
      </div>

      <WidgetCard title="Payout Requests" subtitle="Manage cash withdrawals from referral wallets">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">User</th>
                <th className="px-4 py-3">Amount (₦)</th>
                <th className="px-4 py-3">Bank Details</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payouts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.user?.name || p.user?.email || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{p.userId}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600">₦{p.amountNgn.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-600">{p.bankName}</div>
                    <div className="font-medium">{p.accountNumber}</div>
                    <div className="text-xs text-gray-500">{p.accountName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status === 'pending' && (
                      <button 
                        onClick={() => handleMarkPaid(p.id)}
                        className="inline-flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        <CheckCircle size={14} /> Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No payout requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </WidgetCard>
    </div>
  );
}
