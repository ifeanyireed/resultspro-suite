"use client";

import { IconUsers as Users, IconTrendingUp as TrendingUp, IconSword as Sword, IconArrowUpRight as ArrowUpRight, IconArrowDownRight as ArrowDownRight, IconCurrencyDollar as DollarSign, IconChevronRight as ChevronRight, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

// --- Premium Custom Chart Components (Zero Dependency) ---

const CustomAreaChart = ({ data, color = "#00C853" }: { data: any[], color?: string }) => {
  const max = useMemo(() => Math.max(...data.map(d => d.value), 100), [data]);
  const width = 600;
  const height = 200;
  const padding = 20;

  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((d.value / max) * (height - padding * 2)) - padding;
      return { x, y };
    });
  }, [data, max]);

  const pathData = useMemo(() => {
    if (points.length === 0) return { linePath: "", areaPath: "" };
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;
    return { linePath, areaPath };
  }, [points]);

  return (
    <div className="w-full h-full flex flex-col justify-end">
      <div className="flex-1 min-h-[200px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1={padding}
              y1={padding + (height - padding * 2) * p}
              x2={width - padding}
              y2={padding + (height - padding * 2) * p}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          {/* Area fill */}
          {pathData.areaPath && <path d={pathData.areaPath} fill="url(#chartGradient)" />}
          {/* Line stroke */}
          {pathData.linePath && <path d={pathData.linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
          {/* Point dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0A0E1A" stroke={color} strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-4 px-2 overflow-hidden">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{d.day}</span>
        ))}
      </div>
    </div>
  );
};

const CustomBarChart = ({ data, colors = ['#00C853', '#2196F3', '#9C27B0'] }: { data: any[], colors?: string[] }) => {
  const max = useMemo(() => Math.max(...data.map(d => d.value), 10), [data]);

  return (
    <div className="w-full h-full flex flex-col justify-end gap-3">
      <div className="flex-1 flex items-end justify-between gap-2 px-2 min-h-[150px]">
        {data.map((d, i) => {
          const h = (d.value / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
              <div 
                className="w-full rounded-t-lg transition-all duration-300 hover:brightness-125 bg-blue-500"
                style={{ height: `${Math.max(h, 5)}%`, backgroundColor: colors[i % colors.length] }}
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 px-2 py-0.5 rounded text-[10px] font-black text-white whitespace-nowrap z-10">
                {d.value}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between overflow-hidden">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-[8px] font-bold text-gray-600 text-center uppercase tracking-tighter truncate">{d.day}</span>
        ))}
      </div>
    </div>
  );
};

interface OverviewData {
  kpis: Array<{ label: string, value: string, trend: string, up: boolean }>;
  activity: Array<{ user: string, action: string, time: string, status: string, img: string }>;
  revenueGrowth: Array<{ day: string, value: number }>;
  userGrowth: Array<{ day: string, value: number }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await api.get('/admin/overview');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin overview:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const kpiIcons: Record<string, any> = {
    "Total Students": Users,
    "New (24h)": TrendingUp,
    "Revenue (MTD)": DollarSign,
    "Active Battles": Sword,
  };

  return (
    <>
      <AdminHeader title="Overview" />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">Overview</h1>
            <p className="text-sm text-gray-500">Real-time platform performance metrics.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-white/[0.1] border-t-white/[0.15] font-bold text-sm bg-white/5 text-white hover:bg-white/10">Export Data</Button>
            <Link href="/admin/questions">
              <Button className="rounded-xl bg-green text-navy hover:bg-green/90 font-bold text-sm">Add New Question</Button>
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.kpis.map((kpi, i) => {
            const Icon = kpiIcons[kpi.label] || TrendingUp;
            return (
              <div key={i} className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-green/10 group-hover:text-green transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-0.5 text-[10px] font-black ${kpi.up ? 'text-green' : 'text-red-500'}`}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{kpi.label}</div>
                <div className="text-2xl font-display font-black text-white">{kpi.value}</div>
              </div>
            );
          })}
        </div>

        {/* Real Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-display font-bold text-white text-lg">Daily Revenue (Last 7 Days)</h3>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-1.5 bg-white/5 rounded-xl border border-white/[0.1] border-t-white/[0.15]">Real-time Data</div>
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
              {data.revenueGrowth?.length > 0 ? (
                <CustomAreaChart data={data.revenueGrowth} color="#00C853" />
              ) : (
                <p className="text-gray-500 italic text-sm">No revenue data for this period</p>
              )}
            </div>
          </div>

          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col">
            <h3 className="font-display font-bold text-white text-lg mb-8">Daily Retention</h3>
            <div className="flex-1 w-full flex items-center justify-center">
              {data.userGrowth?.length > 0 ? (
                <CustomBarChart data={data.userGrowth} />
              ) : (
                <p className="text-gray-500 italic text-sm">No growth data</p>
              )}
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Growth (7d)</span>
                <span className="text-sm font-black text-white">
                  {data.userGrowth?.reduce((acc, curr) => acc + curr.value, 0) || 0} users
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white/[0.02] rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-display font-bold text-white text-lg">Recent Platform Activity</h3>
            <Link href="/admin/users">
              <button className="text-xs font-bold text-green uppercase tracking-widest hover:underline">View All Users</button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Action</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.activity?.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img src={row.img} className="w-8 h-8 rounded-lg border border-white/10" alt="" />
                        <span className="text-sm font-bold text-white">{row.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-400 font-medium">{row.action}</td>
                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">
                      {new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${row.status === 'Success' || row.status === 'Correct' ? 'bg-green/10 text-green' : 'bg-blue/10 text-blue-400'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-gray-500 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
