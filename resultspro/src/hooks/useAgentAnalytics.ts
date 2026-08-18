import { useState, useCallback } from 'react';
import apiClient from '@/lib/api';

export interface Agent {
  id: string;
  userId: string;
  phoneNumber?: string;
  state?: string;
  lga?: string;
  locationType?: string;
  subscriptionTier: string;
  bio?: string;
  avatarUrl?: string;
  verificationStatus: string;
  pointsBalance: number;
  lifetimePoints: number;
  totalCommissionEarned: number;
  pendingCommission: number;
  uniqueReferralCode: string;
}

export interface AgentDashboard {
  agent: Agent;
  referralStats: {
    totalReferrals: number;
    pendingReferrals: number;
    approvedReferrals: number;
    totalClicks: number;
    successfulRegistrations: number;
    totalCommissionPaid: number;
  };
  rewards: {
    pointsBalance: number;
    lifetimePoints: number;
    leaderboardRank?: number;
    badges: any[];
  };
  withdrawalStats: {
    totalWithdrawals: number;
    pending: number;
    approved: number;
    paid: number;
    totalWithdrawn: number;
  };
}

export interface ManagedSchool {
  id: string;
  schoolId: string;
  name: string;
  role: string;
  commissionRate: number;
  status: string;
  assignedAt: string;
}

// Hook for fetching agent dashboard
export const useAgentDashboard = (agentId?: string) => {
  const [data, setData] = useState<AgentDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      // Use /agent/dashboard for current user, or /agent/{agentId}/dashboard for specific agent
      const endpoint = agentId ? `/agent/${agentId}/dashboard` : '/agent/dashboard';
      const response = await apiClient.get(endpoint);
      setData(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  return { data, loading, error, fetchDashboard };
};

// Hook for fetching agent profile
export const useAgentProfile = (agentId?: string) => {
  const [profile, setProfile] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = agentId ? `/agent/profile/${agentId}` : '/agent/profile/me';
      const response = await apiClient.get(endpoint);
      setProfile(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  const updateProfile = useCallback(
    async (updates: Partial<Agent>) => {
      try {
        setLoading(true);
        const endpoint = agentId ? `/agent/profile/${agentId}` : '/agent/profile/me';
        const response = await apiClient.patch(endpoint, updates);
        setProfile(response.data.data);
        setError(null);
        return response.data.data;
      } catch (err: any) {
        const message = err.response?.data?.error || 'Failed to update profile';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [agentId]
  );

  return { profile, loading, error, fetchProfile, updateProfile };
};

// Hook for referrals
export const useAgentReferrals = (agentId: string) => {
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferrals = useCallback(async (skip = 0, take = 20) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/agent/${agentId}/referrals?skip=${skip}&take=${take}`
      );
      setReferrals(response.data.data.referrals);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get(`/agent/${agentId}/referrals/stats`);
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch referral stats');
    }
  }, [agentId]);

  return { referrals, stats, loading, error, fetchReferrals, fetchStats };
};

// Hook for rewards and badges
export const useAgentRewards = (agentId: string) => {
  const [rewards, setRewards] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/agent/${agentId}/rewards`);
      setRewards(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  const fetchLeaderboard = useCallback(async (limit = 50) => {
    try {
      const response = await apiClient.get(`/agent/leaderboard?limit=${limit}`);
      setLeaderboard(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch leaderboard');
    }
  }, []);

  return { rewards, leaderboard, loading, error, fetchRewards, fetchLeaderboard };
};

// Hook for withdrawals
export const useAgentWithdrawals = (agentId: string) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(async (skip = 0, take = 20) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/agent/${agentId}/withdrawals?skip=${skip}&take=${take}`
      );
      setWithdrawals(response.data.data.withdrawals);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get(`/agent/${agentId}/withdrawals/stats`);
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch withdrawal stats');
    }
  }, [agentId]);

  const requestWithdrawal = useCallback(
    async (amount: number, paymentMethod: string, bankDetails?: any) => {
      try {
        setLoading(true);
        const payload = {
          amount,
          ...bankDetails,
        };
        const response = await apiClient.post(
          `/agent/${agentId}/withdrawals/request`,
          payload
        );
        setError(null);
        return response.data.data;
      } catch (err: any) {
        const message = err.response?.data?.error || 'Failed to request withdrawal';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [agentId]
  );

  return { withdrawals, stats, loading, error, fetchWithdrawals, fetchStats, requestWithdrawal };
};

// Hook for subscription
export const useAgentSubscription = () => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/agent/subscription-pricing');
      setPricing(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch pricing');
    } finally {
      setLoading(false);
    }
  }, []);

  const upgradePlan = useCallback(
    async (agentId: string, tier: 'Free' | 'Pro' | 'Premium') => {
      try {
        setLoading(true);
        const response = await apiClient.post(
          `/agent/subscription/${agentId}/upgrade`,
          { tier }
        );
        setError(null);
        return response.data.data;
      } catch (err: any) {
        const message = err.response?.data?.error || 'Failed to upgrade subscription';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const verifySubscription = useCallback(
    async (reference: string) => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/agent/subscription/verify?reference=${reference}`);
        setError(null);
        return response.data.data;
      } catch (err: any) {
        const message = err.response?.data?.error || 'Failed to verify subscription';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { pricing, loading, error, fetchPricing, upgradePlan, verifySubscription };
};

// Hook for schools managed by agent
export const useAgentSchools = () => {
  const [schools, setSchools] = useState<ManagedSchool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/agent/my-schools');
      setSchools(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch assigned schools');
    } finally {
      setLoading(false);
    }
  }, []);

  return { schools, loading, error, fetchSchools };
};
