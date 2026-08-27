import React, { useState, useEffect } from 'react';
import { IconBuilding as Building2, IconUsers as Users, IconTrendingUp as TrendingUp, IconAlertTriangle as AlertTriangle, IconDownload as Download, IconFilter as Filter, IconSearch as Search, IconChevronRight as ChevronRight, IconCircleCheck as CheckCircle, IconClock as Clock, IconCircleX as XCircle, IconCurrencyDollar as DollarSign } from '@tabler/icons-react';
import axios from '@/lib/axiosConfig';
import { useToast } from '@/hooks/use-toast';

interface NetworkOverview {
  totalSchools: number;
  activeSchools: number;
  inactiveSchools: number;
  totalStudents: number;
  totalTeachers: number;
  activeSubscriptions: number;
  enterpriseSubscriptions: number;
  totalRevenue: number;
  averageStudentsPerSchool: number;
  averageTeachersPerSchool: number;
}

interface School {
  id: string;
  name: string;
  status: string;
  studentCount: number;
  staffCount: number;
  subscription: {
    planName: string;
    status: string;
    startDate: Date;
    endDate: Date;
  } | null;
  createdAt: Date;
}

interface Alert {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  schoolName: string;
  message: string;
  dueDate?: Date;
}

interface OverviewSectionProps {
  overview: NetworkOverview | null;
  loading: boolean;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ overview, loading }) => {
  if (loading || !overview) return <div className="p-4">Loading overview...</div>;

  const stats = [
    {
      label: 'Total Schools',
      value: overview.totalSchools,
      icon: Building2,
      color: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    {
      label: 'Active Schools',
      value: overview.activeSchools,
      icon: CheckCircle,
      color: 'bg-green-100',
      textColor: 'text-green-700',
    },
    {
      label: 'Total Students',
      value: overview.totalStudents.toLocaleString(),
      icon: Users,
      color: 'bg-purple-100',
      textColor: 'text-purple-700',
    },
    {
      label: 'Total Staff',
      value: overview.totalTeachers,
      icon: Users,
      color: 'bg-orange-100',
      textColor: 'text-orange-700',
    },
    {
      label: 'Active Subscriptions',
      value: overview.activeSubscriptions,
      icon: CheckCircle,
      color: 'bg-indigo-100',
      textColor: 'text-indigo-700',
    },
    {
      label: 'Enterprise Plans',
      value: overview.enterpriseSubscriptions,
      icon: TrendingUp,
      color: 'bg-pink-100',
      textColor: 'text-pink-700',
    },
    {
      label: 'Total Revenue',
      value: `₦${overview.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-amber-100',
      textColor: 'text-amber-700',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Average Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Students/School</span>
              <span className="font-semibold text-gray-900">
                {overview.averageStudentsPerSchool}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Staff/School</span>
              <span className="font-semibold text-gray-900">
                {overview.averageTeachersPerSchool}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subscription Rate</span>
              <span className="font-semibold text-gray-900">
                {Math.round((overview.activeSubscriptions / overview.activeSchools) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Network Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Active Schools</span>
                <span className="text-sm font-semibold">
                  {Math.round((overview.activeSchools / overview.totalSchools) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(overview.activeSchools / overview.totalSchools) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Enterprise Adoption</span>
                <span className="text-sm font-semibold">
                  {Math.round(
                    (overview.enterpriseSubscriptions / overview.activeSubscriptions) * 100
                  )}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{
                    width: `${(overview.enterpriseSubscriptions / overview.activeSubscriptions) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SchoolsListProps {
  schools: School[];
  loading: boolean;
  onLoadMore: () => void;
}

const SchoolsListSection: React.FC<SchoolsListProps> = ({ schools, loading, onLoadMore }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Schools Network
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">School Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Students</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Staff</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Plan</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Expires</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr
                key={school.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">{school.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      school.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {school.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{school.studentCount}</td>
                <td className="px-4 py-3 text-gray-600">{school.staffCount}</td>
                <td className="px-4 py-3">
                  {school.subscription ? (
                    <span className="text-blue-600 font-medium">{school.subscription.planName}</span>
                  ) : (
                    <span className="text-gray-500">No subscription</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {school.subscription ? (
                    <span className="text-gray-600">
                      {new Date(school.subscription.endDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {schools.length === 0 && !loading && (
        <div className="px-4 py-8 text-center text-gray-500">
          No schools found
        </div>
      )}
    </div>
  );
};

interface AlertsPanelProps {
  alerts: Alert[];
  loading: boolean;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, loading }) => {
  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL');
  const warningAlerts = alerts.filter((a) => a.severity === 'WARNING');

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          System Alerts ({criticalAlerts.length + warningAlerts.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No active alerts</div>
        ) : (
          alerts.slice(0, 10).map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border-l-4 ${
                alert.severity === 'CRITICAL'
                  ? 'border-red-500 bg-red-50'
                  : 'border-yellow-500 bg-yellow-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{alert.schoolName}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
                {alert.severity === 'CRITICAL' ? (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const MultiSchoolDashboard: React.FC = () => {
  const [overview, setOverview] = useState<NetworkOverview | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'schools' | 'analytics' | 'financial' | 'staff'
  >('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAgent = user.role === 'AGENT';
  const apiEndpoint = isAgent ? '/agent/analytics' : '/admin/schools';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [overviewRes, schoolsRes, alertsRes] = await Promise.all([
          axios.get(`${apiEndpoint}/overview`),
          axios.get(isAgent ? `${apiEndpoint}/schools?limit=20&offset=0` : `${apiEndpoint}/list?limit=20&offset=0`),
          axios.get(`${apiEndpoint}/alerts`),
        ]);

        setOverview(overviewRes.data.data);
        setSchools(schoolsRes.data.data || []);
        setAlerts(alertsRes.data.data.alerts || []);
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: 'Error',
          description:
            error.response?.data?.error || 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, isAgent, toast]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'schools', label: 'Schools', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'staff', label: 'Staff', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                {isAgent ? 'Assigned Schools Network' : 'Multi-School Network Management'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isAgent ? 'Manage and monitor your assigned schools' : 'Manage and monitor all enterprise schools'}
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-4 font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <OverviewSection overview={overview} loading={loading} />
            <AlertsPanel alerts={alerts} loading={loading} />
          </div>
        )}

        {activeTab === 'schools' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
            <SchoolsListSection
              schools={schools}
              loading={loading}
              onLoadMore={() => {}}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Network Analytics</h2>
            <div className="text-center py-12 text-gray-500">
              Coming soon - Consolidated analytics across all schools
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Dashboard</h2>
            <div className="text-center py-12 text-gray-500">
              Coming soon - Revenue tracking, invoices, and payment analytics
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Staff Management</h2>
            <div className="text-center py-12 text-gray-500">
              Coming soon - Manage teachers and staff across network
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSchoolDashboard;
