'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TrophyIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  UserGroupIcon,
  CalendarIcon,
  XMarkIcon,
  TrashIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export interface CampusHouse {
  id: string;
  tenant_id: string;
  house_name: string;
  color_code: string;
  house_master: string;
  total_points: number;
  student_count: number;
  motto: string;
}

export interface CampusClub {
  id: string;
  tenant_id: string;
  club_name: string;
  category: string;
  patron_teacher: string;
  meeting_day: string;
  meeting_time: string;
  venue: string;
  member_count: number;
  description: string;
  status: string;
}

export interface SportsFixture {
  id: string;
  tenant_id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  venue: string;
  winning_house?: string;
  score_summary?: string;
  status: 'UPCOMING' | 'COMPLETED' | string;
}

export interface CoCurricularSummary {
  total_houses: number;
  total_clubs: number;
  total_club_members: number;
  upcoming_fixtures: number;
}

export type CoCurricularSubtab = 'overview' | 'houses' | 'clubs' | 'fixtures';

export default function CoCurricularManager({
  initialSubtab = 'overview',
}: {
  initialSubtab?: CoCurricularSubtab;
}) {
  const [subtab, setSubtab] = useState<CoCurricularSubtab>(initialSubtab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [summary, setSummary] = useState<CoCurricularSummary>({
    total_houses: 0,
    total_clubs: 0,
    total_club_members: 0,
    upcoming_fixtures: 0,
  });
  const [houses, setHouses] = useState<CampusHouse[]>([]);
  const [clubs, setClubs] = useState<CampusClub[]>([]);
  const [fixtures, setFixtures] = useState<SportsFixture[]>([]);

  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showFixtureModal, setShowFixtureModal] = useState(false);
  const [selectedHouseForPoints, setSelectedHouseForPoints] = useState<CampusHouse | null>(null);
  const [deltaPoints, setDeltaPoints] = useState(25);

  // Form states
  const [newHouse, setNewHouse] = useState({
    house_name: '',
    color_code: '#146ef5',
    house_master: '',
    motto: '',
    total_points: 0,
  });

  const [newClub, setNewClub] = useState({
    club_name: '',
    category: 'STEM & Robotics',
    patron_teacher: 'Engr. Ibrahim Musa',
    meeting_day: 'Wednesday',
    meeting_time: '03:45 PM',
    venue: 'ICT Innovation Lab',
    member_count: 24,
    description: 'Practical drone coding, Arduino sensors, and national robotics Olympiad preparation.',
  });

  const [newFixture, setNewFixture] = useState({
    event_name: 'Inter-House 100m Senior Sprint Finals',
    event_type: 'Athletics & Track',
    event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    venue: 'Main Campus Stadium & Track',
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api
        .get('/v1/campus/co-curricular')
        .catch(async () => await api.get('/campus/co-curricular'));

      if (res.data) {
        if (res.data.summary) setSummary(res.data.summary);
        setHouses(res.data.houses || []);
        setClubs(res.data.clubs || []);
        setFixtures(res.data.fixtures || []);
      }
    } catch (err: any) {
      console.error('Failed to load co-curricular data:', err);
      setErrorMsg(err?.response?.data?.error || 'Failed to load co-curricular records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouse.house_name.trim()) {
      alert('House name is required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/co-curricular', {
        action: 'create_house',
        ...newHouse,
      });
      setShowHouseModal(false);
      setSuccessMsg('School house registered!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewHouse({
        house_name: '',
        color_code: '#146ef5',
        house_master: '',
        motto: '',
        total_points: 0,
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to register house');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHouseForPoints) return;
    try {
      setSaving(true);
      await api.post('/v1/campus/co-curricular', {
        action: 'update_house_points',
        house_id: selectedHouseForPoints.id,
        delta_points: deltaPoints,
      });
      setSelectedHouseForPoints(null);
      setSuccessMsg(`Added ${deltaPoints} points to ${selectedHouseForPoints.house_name}!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update points');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.club_name.trim()) {
      alert('Club name is required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/co-curricular', {
        action: 'create_club',
        ...newClub,
      });
      setShowClubModal(false);
      setSuccessMsg('Co-curricular society/club registered!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewClub({
        club_name: '',
        category: 'STEM & Robotics',
        patron_teacher: 'Engr. Ibrahim Musa',
        meeting_day: 'Wednesday',
        meeting_time: '03:45 PM',
        venue: 'ICT Innovation Lab',
        member_count: 24,
        description: '',
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to create club');
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleFixture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFixture.event_name.trim()) {
      alert('Event name is required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/co-curricular', {
        action: 'schedule_fixture',
        ...newFixture,
      });
      setShowFixtureModal(false);
      setSuccessMsg('Athletic fixture scheduled!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to schedule fixture');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string, type: string) => {
    if (!confirm('Permanently remove this record?')) return;
    try {
      await api.delete(`/v1/campus/co-curricular?id=${id}&type=${type}`);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XMarkIcon className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <MotionRise className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <TrophyIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Co-Curricular, Clubs & House System</h2>
              <p className="text-xs text-gray-500">
                School Houses leaderboard, clubs & societies rosters, athletic fixtures, and Inter-House Sports trophies.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHouseModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition shadow-sm cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Add House
          </button>
          <button
            onClick={() => setShowClubModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition shadow-sm cursor-pointer"
          >
            <UserGroupIcon className="w-4 h-4" /> Register Club
          </button>
          <button
            onClick={() => setShowFixtureModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-full hover:bg-purple-700 transition shadow-sm cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4" /> Add Fixture
          </button>
          <button
            onClick={loadData}
            title="Refresh"
            className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 cursor-pointer"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </MotionRise>

      {/* Internal Subtabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setSubtab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'overview'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Co-Curricular Hub
        </button>
        <button
          onClick={() => setSubtab('houses')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'houses'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          School Houses ({houses.length})
        </button>
        <button
          onClick={() => setSubtab('clubs')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'clubs'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Clubs & Societies ({clubs.length})
        </button>
        <button
          onClick={() => setSubtab('fixtures')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'fixtures'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Sports Fixtures ({fixtures.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">School Houses</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total_houses}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Clubs & Societies</p>
          <p className="text-2xl font-bold text-[#146ef5] mt-1">{summary.total_clubs}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Club Members Enrolled</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.total_club_members}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Upcoming Sports Meets</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{summary.upcoming_fixtures}</p>
        </div>
      </div>

      {/* Tab 1: Overview Leaderboard */}
      {subtab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inter-House Standings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <TrophyIcon className="w-4 h-4 text-amber-500" /> Annual Inter-House Championship Leaderboard
            </h3>
            {houses.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                No school houses registered yet.
              </p>
            ) : (
              <div className="space-y-3">
                {houses.map((h, idx) => (
                  <div key={h.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center bg-gray-200 text-gray-700">
                        #{idx + 1}
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: h.color_code }} />
                      <div>
                        <h4 className="font-bold text-xs text-gray-900">{h.house_name}</h4>
                        <p className="text-[10px] text-gray-500">Master: {h.house_master || 'Unassigned'} · &quot;{h.motto || 'Excellence'}&quot;</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-bold text-sm text-gray-900">{h.total_points} pts</div>
                        <div className="text-[10px] text-gray-400">{h.student_count} athletes</div>
                      </div>
                      <button
                        onClick={() => setSelectedHouseForPoints(h)}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold hover:bg-amber-100 cursor-pointer"
                      >
                        + Points
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Sports Fixtures */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-purple-600" /> Upcoming Sports Meets & Tournaments
            </h3>
            {fixtures.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                No upcoming athletic fixtures scheduled.
              </p>
            ) : (
              <div className="space-y-3">
                {fixtures.map((f) => (
                  <div key={f.id} className="p-3 bg-purple-50/30 border border-purple-100 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{f.event_name}</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                          {f.event_type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Venue: {f.venue}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{f.event_date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Houses */}
      {subtab === 'houses' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">School Houses Register</h3>
            <button
              onClick={() => setShowHouseModal(true)}
              className="px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition cursor-pointer"
            >
              + Create New House
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {houses.map((h) => (
              <div key={h.id} className="p-4 border border-gray-200 rounded-2xl bg-gray-50/40 relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: h.color_code }} />
                  <h4 className="font-bold text-gray-900 text-sm">{h.house_name}</h4>
                </div>
                <p className="text-xs text-gray-500 italic">&quot;{h.motto || 'Courage & Honor'}&quot;</p>
                <div className="mt-3 text-xs space-y-1">
                  <p><strong>Housemaster:</strong> {h.house_master || 'Staff'}</p>
                  <p><strong>Total Points:</strong> <span className="font-bold text-emerald-600">{h.total_points}</span></p>
                </div>
                <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between items-center text-[10px]">
                  <button
                    onClick={() => setSelectedHouseForPoints(h)}
                    className="text-[#146ef5] font-bold cursor-pointer"
                  >
                    Adjust Points
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(h.id, 'house')}
                    className="text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Clubs */}
      {subtab === 'clubs' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Clubs, Societies & Enrichment Activities</h3>
            <button
              onClick={() => setShowClubModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition cursor-pointer"
            >
              + Register Club
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((c) => (
              <div key={c.id} className="p-4 border border-gray-200 rounded-2xl bg-gray-50/40 relative">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-sm">{c.club_name}</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {c.member_count} Members
                  </span>
                </div>
                <p className="text-[11px] text-[#146ef5] font-semibold mt-0.5">{c.category}</p>
                <p className="text-xs text-gray-600 mt-2">{c.description}</p>
                <div className="mt-3 text-[11px] text-gray-500 space-y-0.5 border-t border-gray-200 pt-2">
                  <p><strong>Patron:</strong> {c.patron_teacher}</p>
                  <p><strong>Meetings:</strong> {c.meeting_day} @ {c.meeting_time} ({c.venue})</p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => handleDeleteRecord(c.id, 'club')}
                    className="text-rose-500 hover:text-rose-700 text-[10px] font-medium cursor-pointer"
                  >
                    Delete Club
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Fixtures */}
      {subtab === 'fixtures' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Athletics & Sports Fixtures Schedule</h3>
            <button
              onClick={() => setShowFixtureModal(true)}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-full hover:bg-purple-700 transition cursor-pointer"
            >
              + Schedule Sports Fixture
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Event Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date & Venue</th>
                  <th className="py-3 px-4">Winning House</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fixtures.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4 font-bold text-gray-900">{f.event_name}</td>
                    <td className="py-3 px-4 text-gray-600">{f.event_type}</td>
                    <td className="py-3 px-4 text-gray-500">
                      <div>{f.event_date}</div>
                      <div className="text-[10px] text-gray-400">{f.venue}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-600">{f.winning_house || 'TBD'}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#146ef5]">
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRecord(f.id, 'fixture')}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <TrashIcon className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Create House */}
      {showHouseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Add School House</h3>
              <button onClick={() => setShowHouseModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateHouse} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">House Name *</label>
                <input
                  type="text"
                  required
                  value={newHouse.house_name}
                  onChange={(e) => setNewHouse({ ...newHouse, house_name: e.target.value })}
                  placeholder="e.g. Red House (Falcon)"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">House Color Code</label>
                  <input
                    type="color"
                    value={newHouse.color_code}
                    onChange={(e) => setNewHouse({ ...newHouse, color_code: e.target.value })}
                    className="w-full h-10 border border-gray-200 rounded-lg p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">House Master</label>
                  <input
                    type="text"
                    value={newHouse.house_master}
                    onChange={(e) => setNewHouse({ ...newHouse, house_master: e.target.value })}
                    placeholder="e.g. Mr. Peter Obi"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Motto / Slogan</label>
                <input
                  type="text"
                  value={newHouse.motto}
                  onChange={(e) => setNewHouse({ ...newHouse, motto: e.target.value })}
                  placeholder="e.g. Soaring with Valor"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHouseModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer"
                >
                  {saving ? 'Creating...' : 'Register House'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Adjust House Points */}
      {selectedHouseForPoints && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Award House Points</h3>
              <button onClick={() => setSelectedHouseForPoints(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPoints} className="space-y-4 text-xs">
              <p className="text-gray-600 font-medium">House: <strong>{selectedHouseForPoints.house_name}</strong></p>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Points to Add (+)</label>
                <input
                  type="number"
                  value={deltaPoints}
                  onChange={(e) => setDeltaPoints(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-base font-bold text-emerald-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedHouseForPoints(null)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Add Points'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Register Club */}
      {showClubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Register Club or Society</h3>
              <button onClick={() => setShowClubModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateClub} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Club Name *</label>
                <input
                  type="text"
                  required
                  value={newClub.club_name}
                  onChange={(e) => setNewClub({ ...newClub, club_name: e.target.value })}
                  placeholder="e.g. Literary & Debating Society"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Category</label>
                  <select
                    value={newClub.category}
                    onChange={(e) => setNewClub({ ...newClub, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="STEM & Robotics">STEM & Robotics</option>
                    <option value="Arts, Drama & Music">Arts, Drama & Music</option>
                    <option value="Debating & Press">Debating & Press</option>
                    <option value="Martial Arts & Sports">Martial Arts & Sports</option>
                    <option value="Entrepreneurship / Junior Achievers">Entrepreneurship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Patron Teacher</label>
                  <input
                    type="text"
                    value={newClub.patron_teacher}
                    onChange={(e) => setNewClub({ ...newClub, patron_teacher: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Meeting Day</label>
                  <input
                    type="text"
                    value={newClub.meeting_day}
                    onChange={(e) => setNewClub({ ...newClub, meeting_day: e.target.value })}
                    placeholder="e.g. Wednesday"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Meeting Time & Venue</label>
                  <input
                    type="text"
                    value={newClub.venue}
                    onChange={(e) => setNewClub({ ...newClub, venue: e.target.value })}
                    placeholder="e.g. ICT Lab 1"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newClub.description}
                  onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                  placeholder="Goals and activities of this society..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClubModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  {saving ? 'Creating...' : 'Register Society'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Add Fixture */}
      {showFixtureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Schedule Sports Fixture</h3>
              <button onClick={() => setShowFixtureModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleScheduleFixture} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  value={newFixture.event_name}
                  onChange={(e) => setNewFixture({ ...newFixture, event_name: e.target.value })}
                  placeholder="e.g. Inter-House Football Championship"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Event Type</label>
                  <input
                    type="text"
                    value={newFixture.event_type}
                    onChange={(e) => setNewFixture({ ...newFixture, event_type: e.target.value })}
                    placeholder="e.g. Football / Track"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newFixture.event_date}
                    onChange={(e) => setNewFixture({ ...newFixture, event_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Venue</label>
                <input
                  type="text"
                  value={newFixture.venue}
                  onChange={(e) => setNewFixture({ ...newFixture, venue: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFixtureModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition cursor-pointer"
                >
                  {saving ? 'Scheduling...' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
