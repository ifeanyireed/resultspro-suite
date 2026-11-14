'use client';

import React, { useState, useEffect } from 'react';
import {
  Bus,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Phone,
  Users,
  MapPin,
  AlertTriangle,
  Wrench
} from 'lucide-react';
import { fetchTransportRoutes, TransportRoute } from '@/lib/campus-api';

export default function LogisticsTransportPage() {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newRoute, setNewRoute] = useState({
    route_name: '',
    vehicle_plate: '',
    driver_name: '',
    driver_phone: '',
    capacity: 36,
    enrolled_students: 0,
    corridor_areas: '',
    status: 'ACTIVE' as const,
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  async function loadRoutes() {
    setLoading(true);
    const data = await fetchTransportRoutes();
    setRoutes(data);
    setLoading(false);
  }

  function handleCreateRoute(e: React.FormEvent) {
    e.preventDefault();
    if (!newRoute.route_name || !newRoute.driver_name) return;

    const created: TransportRoute = {
      id: `tr-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newRoute,
    };

    setRoutes((prev) => [...prev, created]);
    setIsModalOpen(false);
    setNewRoute({
      route_name: '',
      vehicle_plate: '',
      driver_name: '',
      driver_phone: '',
      capacity: 36,
      enrolled_students: 0,
      corridor_areas: '',
      status: 'ACTIVE',
    });
  }

  const filteredRoutes = routes.filter((r) =>
    r.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.vehicle_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.corridor_areas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search route name, driver, corridor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transport Route</span>
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoutes.map((rt) => {
          const occupancy = Math.round((rt.enrolled_students / rt.capacity) * 100);

          return (
            <div
              key={rt.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 font-mono">
                    {rt.vehicle_plate}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rt.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                    rt.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {rt.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {rt.route_name}
                </h3>

                <p className="text-xs text-slate-500 mb-4 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{rt.corridor_areas}</span>
                </p>

                {/* Driver Info */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Driver</span>
                    <span className="font-semibold text-slate-800">{rt.driver_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Contact</span>
                    <span className="font-mono text-slate-700 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {rt.driver_phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Occupancy bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Passenger Allocation</span>
                  <span className="font-bold text-slate-900">{rt.enrolled_students} / {rt.capacity} ({occupancy}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      occupancy > 90 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(100, occupancy)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Register Transport Route</h3>
            <p className="text-xs text-slate-500 mb-4">Add bus fleet corridor and driver contact details</p>

            <form onSubmit={handleCreateRoute} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 5: Ikeja - Ogba - Agege Express"
                  value={newRoute.route_name}
                  onChange={(e) => setNewRoute({ ...newRoute, route_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Vehicle Plate / Type</label>
                  <input
                    type="text"
                    required
                    placeholder="EKY-904-XA (Coaster)"
                    value={newRoute.vehicle_plate}
                    onChange={(e) => setNewRoute({ ...newRoute, vehicle_plate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Total Capacity</label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    value={newRoute.capacity}
                    onChange={(e) => setNewRoute({ ...newRoute, capacity: parseInt(e.target.value) || 36 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    required
                    placeholder="Mr. Jude Okafor"
                    value={newRoute.driver_name}
                    onChange={(e) => setNewRoute({ ...newRoute, driver_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Driver Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+234 802 331 4455"
                    value={newRoute.driver_phone}
                    onChange={(e) => setNewRoute({ ...newRoute, driver_phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Corridor Areas & Key Pickups</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Admiralty Way, Kingsway Road, Falomo, Adeola Odeku..."
                  value={newRoute.corridor_areas}
                  onChange={(e) => setNewRoute({ ...newRoute, corridor_areas: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
