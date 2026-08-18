// Analytics hooks
import { useState, useEffect } from 'react';
import api from '@/lib/axiosConfig';
import {
  DashboardData,
  AtRiskStudentsList,
  SubjectAnalytics,
  StudentAnalytics,
} from '@/types/analytics';

export const useAnalyticsDashboard = (classId: string, sessionId: string, termId: string, instanceId?: string) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/dashboard', {
          params: { classId, sessionId, termId, instanceId },
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (instanceId || (classId && sessionId && termId)) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [classId, sessionId, termId, instanceId]);

  return { data, loading, error };
};

export const useAtRiskStudents = (classId: string, sessionId: string, termId: string, instanceId?: string) => {
  const [data, setData] = useState<AtRiskStudentsList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/at-risk-students', {
          params: { classId, sessionId, termId, instanceId },
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch at-risk students');
      } finally {
        setLoading(false);
      }
    };

    if (instanceId || (classId && sessionId && termId)) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [classId, sessionId, termId, instanceId]);

  return { data, loading, error };
};

export const useSubjectAnalytics = (subjectId: string, classId: string, sessionId: string, termId: string) => {
  const [data, setData] = useState<SubjectAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/analytics/subject/${subjectId}`, {
          params: { classId, sessionId, termId },
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subject analytics');
      } finally {
        setLoading(false);
      }
    };

    if (subjectId && classId && sessionId && termId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [subjectId, classId, sessionId, termId]);

  return { data, loading, error };
};

export const useStudentAnalytics = (studentId: string) => {
  const [data, setData] = useState<StudentAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/analytics/student/${studentId}`);
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch student analytics');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [studentId]);

  return { data, loading, error };
};

export const useAttendanceImpact = (classId: string, sessionId: string, termId: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/attendance-impact', {
          params: { classId, sessionId, termId },
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch attendance impact data');
      } finally {
        setLoading(false);
      }
    };

    if (classId && sessionId && termId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [classId, sessionId, termId]);

  return { data, loading, error };
};

export const useCompareClasses = (classIds: string[], sessionId: string, termId: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/compare-classes', {
          params: {
            classIds: classIds.join(','),
            sessionId,
            termId,
          },
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch comparison data');
      } finally {
        setLoading(false);
      }
    };

    if (classIds.length > 0 && sessionId && termId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [classIds.join(','), sessionId, termId]);

  return { data, loading, error };
};

export const useAttendanceAnalytics = (classId: string, sessionId: string, termId: string, instanceId?: string) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/attendance', {
          params: { classId, sessionId, termId, instanceId },
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };

    if (instanceId || (classId && sessionId && termId)) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [classId, sessionId, termId, instanceId]);

  return { data, loading, error };
};

export const useDomainAnalytics = (classId: string, sessionId: string, termId: string, instanceId?: string) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/domains', {
          params: { classId, sessionId, termId, instanceId },
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch domain analytics');
      } finally {
        setLoading(false);
      }
    };

    if (instanceId || (classId && sessionId && termId)) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [classId, sessionId, termId, instanceId]);

  return { data, loading, error };
};

export const useStudentLeaderboard = (params: { classId?: string; sessionId?: string; termId?: string; instanceId?: string; limit?: number }) => {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/leaderboard', {
          params,
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    if (params.instanceId || (params.classId && params.sessionId && params.termId)) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [params.classId, params.sessionId, params.termId, params.instanceId, params.limit]);

  return { data, loading, error };
};
