// Parent Analytics hooks
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface ChildInfo {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  classId: string;
  schoolId: string;
  schoolName: string;
}

interface ChildSummary {
  studentName: string;
  overallAverage: number;
  classAverage: number;
  position: number;
  classSize: number;
  attendance: {
    daysPresent: number;
    daysSchoolOpen: number;
    percentage: string;
  };
  riskLevel: string;
  riskScore: number;
  subjectBreakdown: Array<any>;
  affectiveDomainScores: Array<any>;
  psychomotorDomainScores: Array<any>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface DashboardOverview {
  parentName: string;
  totalChildren: number;
  children: Array<{
    studentId: string;
    studentName: string;
    className: string;
    average: number;
    position: number;
    riskLevel?: string;
    status: string;
  }>;
  alerts: {
    critical: number;
    high: number;
    medium: number;
  };
}

// Get parent dashboard overview
export const useParentDashboard = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/parent-analytics/dashboard');
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

// Get list of parent's children
export const useParentChildren = () => {
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const response = await api.get('/parent-analytics/children');
        setChildren(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch children');
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  return { children, loading, error };
};

// Get child current term summary
export const useChildSummary = (studentId: string) => {
  const [summary, setSummary] = useState<ChildSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/parent-analytics/child/${studentId}/summary`);
        setSummary(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [studentId]);

  return { summary, loading, error };
};

// Get child progress trend
export const useChildProgress = (studentId: string, limit: number = 3) => {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/parent-analytics/child/${studentId}/progress`, {
          params: { limit },
        });
        setProgress(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [studentId, limit]);

  return { progress, loading, error };
};

// Get child subject analysis
export const useChildSubject = (studentId: string, subjectName: string) => {
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId || !subjectName) {
      setLoading(false);
      return;
    }

    const fetchSubject = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/parent-analytics/child/${studentId}/subject/${encodeURIComponent(subjectName)}`);
        setSubject(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subject');
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [studentId, subjectName]);

  return { subject, loading, error };
};

// Get child attendance analysis
export const useChildAttendance = (studentId: string) => {
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/parent-analytics/child/${studentId}/attendance`);
        setAttendance(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId]);

  return { attendance, loading, error };
};

// Get comprehensive child analytics
export const useChildAnalytics = (studentId: string) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/parent-analytics/child/${studentId}/analytics`);
        setAnalytics(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [studentId]);

  return { analytics, loading, error };
};
