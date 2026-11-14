
'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRightIcon,
  UserGroupIcon,
  BoltIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export default function TransportDashboard() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    route_name: '',
    bus_number: 'BUS-03 (Toyota Coaster)',
    driver_name: '',
    driver_phone: '',
    capacity: 30,
    assigned_students: 22,
    stops_summary: '',
    term_fee: 65000
  });

  const loadTransport = async () => {
    try {
      const res = await api.get('/v1/campus/transport');
      setRoutes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load tenant transport routes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransport();
  }, []);

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/v1/campus/transport', {
        ...newRoute,
        capacity: Number(newRoute.capacity),
        assigned_students: Number(newRoute.assigned_students),
        term_fee: Number(newRoute.term_fee)
      });
      setShowAddModal(false);
      setNewRoute({
        route_name: '',
        bus_number: 'BUS-03 (Toyota Coaster)',
        driver_name: '',
        driver_phone: '',
        capacity: 30,
        assigned_students: 22,
        stops_summary: '',
        term_fee: 65000
      });
      await loadTransport();
    } catch (err) {
      console.error('Failed to add transport route:', err);
    }
  };

  const totalStudents = routes.reduce((acc, r) => acc + Number(r.assigned_students || 0), 0);
  const totalCapacity = routes.reduce((acc, r) => acc + Number(r.capacity || 0), 0);

  return (
    <>
      <MotionRise className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Transport & Fleet</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tenant-scoped school bus corridors, drivers, and student riders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add Bus Route
          </button>
        </div>
      </MotionRise>

      {showAddModal && (
        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-blue-200 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Bus Route</h3>
          <form onSubmit={handleAddRoute} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              required
              placeholder="Route Name (e.g. Route C · Surulere)"
              value={newRoute.route_name}
              onChange={(e) => setNewRoute({ ...newRoute, route_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Bus Plate / Fleet No."
              value={newRoute.bus_number}
              onChange={(e) => setNewRoute({ ...newRoute, bus_number: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Assigned Driver Name"
              value={newRoute.driver_name}
              onChange={(e) => setNewRoute({ ...newRoute, driver_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              placeholder="Driver Phone"
              value={newRoute.driver_phone}
              onChange={(e) => setNewRoute({ ...newRoute, driver_phone: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              placeholder="Stops Corridor Summary"
              value={newRoute.stops_summary}
              onChange={(e) => setNewRoute({ ...newRoute, stops_summary: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <div className="flex items-center gap-2">
              <button type="submit" className="bg-[#146ef5] text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer">
                Save Route
              </button>
              <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </MotionRise>
      )}

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MotionRise className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square text-white">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal">Active Routes</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight mb-2">{routes.length}</h2>
            <p className="text-xs text-white/80">GPS-monitored school buses</p>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Enrolled Riders</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{totalStudents}</h2>
            <p className="text-xs text-gray-500">Out of {totalCapacity} fleet seats</p>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Seat Utilization</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">
              {totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 90}%
            </h2>
            <p className="text-xs text-gray-500">Morning & afternoon runs</p>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Safety Record</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-emerald-600 mb-2">100%</h2>
            <p className="text-xs text-gray-500">Zero incidents this term</p>
          </div>
        </MotionRise>
      </MotionStagger>

      <MotionRise delay={0.08} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Active School Bus Corridors</h3>
          <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
            {loading ? 'Loading...' : `${routes.length} Routes`}
          </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Route & Stops</th>
              <th className="px-6 py-4">Bus Fleet</th>
              <th className="px-6 py-4">Driver</th>
              <th className="px-6 py-4">Riders / Capacity</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {routes.map((r: any) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-sm text-gray-900">{r.route_name}</div>
                  <div className="text-xs text-gray-500">{r.stops_summary}</div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-[#146ef5]">{r.bus_number}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{r.driver_name}</div>
                  <div className="text-xs text-gray-500">{r.driver_phone}</div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-800">
                  {r.assigned_students} / {r.capacity} Students
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    {r.gps_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MotionRise>
    </>
  );
}
