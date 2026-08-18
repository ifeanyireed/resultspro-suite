import React, { useState, useEffect } from 'react';
import { IconTrendingUp as TrendingUp, IconAlertCircle as AlertCircle, IconGift as Gift, IconClock as Clock } from '@tabler/icons-react';

interface DashboardStats {
  totalAllocated: number;
  activeAvailable: number;
  dispensed: number;
  depleted: number;
  deactivated: number;
}

interface RecentUsage {
  id: string;
  studentAdmissionNumber: string;
  usedAt: string;
  card?: { pin: string };
}

interface ScratchCardDashboard {
  stats: DashboardStats;
  pendingRequests: number;
  recentUsage: RecentUsage[];
}

const ScratchCardDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<ScratchCardDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/school/scratch-cards/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setDashboard(data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center p-8">Loading...</div>;

  if (!dashboard) return <div className="text-red-400">Failed to load dashboard</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Scratch Card Dashboard</h1>
        <p className="text-gray-400">Track and manage your allocated scratch cards</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Total Allocated</span>
            <Gift className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold">{dashboard.stats.totalAllocated.toLocaleString()}</p>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Active Available</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">{dashboard.stats.activeAvailable.toLocaleString()}</p>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Dispensed</span>
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-orange-400">{dashboard.stats.dispensed.toLocaleString()}</p>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Pending Requests</span>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">{dashboard.pendingRequests}</p>
        </div>
      </div>

      {/* Recent Activity */}
      {dashboard.recentUsage.length > 0 && (
        <div className="rounded-[20px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {dashboard.recentUsage.map((usage) => (
              <div key={usage.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <p className="text-white font-medium">{usage.studentAdmissionNumber}</p>
                  <p className="text-xs text-gray-500">Used at {new Date(usage.usedAt).toLocaleString()}</p>
                </div>
                <span className="text-gray-400 text-sm font-mono">{usage.card?.pin}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchCardDashboard;
