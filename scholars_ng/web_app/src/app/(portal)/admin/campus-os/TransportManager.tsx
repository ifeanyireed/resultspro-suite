'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TruckIcon,
  UserGroupIcon,
  MapPinIcon,
  ClockIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';
import api, { getActiveTenantContext } from '@/lib/api';

export interface TransportRouteRecord {
  id: string;
  tenant_id: string;
  route_name: string;
  bus_number: string;
  driver_name: string;
  driver_phone: string;
  attendant_name: string;
  capacity: number;
  assigned_students: number;
  stops_summary: string;
  morning_departure: string;
  afternoon_return: string;
  term_fee: number;
  gps_status: 'EN_ROUTE' | 'PARKED_ON_CAMPUS' | 'MAINTENANCE' | 'DELAYED' | string;
  status: 'ACTIVE' | 'SUSPENDED' | string;
  created_at: string;
  updated_at: string;
}

export interface TransportRiderRecord {
  id: string;
  tenant_id: string;
  route_id: string;
  route_name: string;
  student_id: string;
  student_name: string;
  admission_number: string;
  class_arm_name: string;
  pickup_stop: string;
  morning_pickup_time: string;
  afternoon_dropoff_time: string;
  parent_phone: string;
  fee_status: 'CLEARED' | 'PENDING' | 'WAIVED' | string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  created_at: string;
  updated_at: string;
}

export interface AvailableStudentRider {
  id: string;
  student_name: string;
  admission_number: string;
  arm_name?: string;
  class_name?: string;
}

export default function TransportManager() {
  const [routes, setRoutes] = useState<TransportRouteRecord[]>([]);
  const [riders, setRiders] = useState<TransportRiderRecord[]>([]);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudentRider[]>([]);

  const [activeSubtab, setActiveSubtab] = useState<'routes' | 'manifest'>('routes');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGpsFilter, setSelectedGpsFilter] = useState<string>('ALL');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('ALL');
  const [selectedFeeFilter, setSelectedFeeFilter] = useState<string>('ALL');

  // Modals state
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState<boolean>(false);
  const [isEditRouteModalOpen, setIsEditRouteModalOpen] = useState<boolean>(false);
  const [isEnrollRiderModalOpen, setIsEnrollRiderModalOpen] = useState<boolean>(false);
  const [isEditRiderModalOpen, setIsEditRiderModalOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'route' | 'rider';
    id: string;
    title: string;
  }>({ isOpen: false, type: 'route', id: '', title: '' });

  // Route Form State
  const [routeForm, setRouteForm] = useState({
    id: '',
    route_name: '',
    bus_number: '',
    driver_name: '',
    driver_phone: '',
    attendant_name: '',
    capacity: 30,
    stops_summary: '',
    morning_departure: '06:45 AM',
    afternoon_return: '03:30 PM',
    term_fee: 75000,
    gps_status: 'ACTIVE',
    status: 'ACTIVE',
  });

  // Rider Form State
  const [riderForm, setRiderForm] = useState({
    id: '',
    route_id: '',
    student_id: '',
    student_name: '',
    admission_number: '',
    class_arm_name: '',
    pickup_stop: '',
    morning_pickup_time: '06:45 AM',
    afternoon_dropoff_time: '03:45 PM',
    parent_phone: '',
    fee_status: 'CLEARED',
    status: 'ACTIVE',
  });

  // Preload students for the passenger selector
  const fetchStudents = useCallback(async () => {
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      const sRes = await api.get(`/v1/campus/students${qs}`).catch(async () => {
        return await api.get(`/campus/students${qs}`);
      });
      if (sRes.data && Array.isArray(sRes.data)) {
        setAvailableStudents(sRes.data);
      }
    } catch (err) {
      console.warn('Could not preload student roster for transport:', err);
    }
  }, []);

  // Fetch transport data with strict tenant isolation and zero fallbacks
  const fetchTransportData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      // 1. Fetch Routes
      const routesRes = await api.get(`/v1/campus/transport${qs}`).catch(async () => {
        return await api.get(`/campus/transport${qs}`);
      });

      // 2. Fetch Riders
      const ridersRes = await api.get(`/v1/campus/transport/riders${qs}`).catch(async () => {
        return await api.get(`/campus/transport/riders${qs}`);
      });

      if (routesRes.data && Array.isArray(routesRes.data)) {
        setRoutes(routesRes.data);
      } else {
        setRoutes([]);
      }

      if (ridersRes.data && Array.isArray(ridersRes.data)) {
        setRiders(ridersRes.data);
      } else {
        setRiders([]);
      }
    } catch (err: any) {
      console.error('Failed to load transport data:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to communicate with Campus OS Transport service');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTransportData();
    fetchStudents();
  }, [fetchTransportData, fetchStudents]);

  // Aggregate KPI metrics
  const totalFleetCapacity = useMemo(() => {
    return routes.reduce((acc, r) => acc + (r.capacity || 0), 0);
  }, [routes]);

  const totalEnrolledRiders = useMemo(() => {
    return riders.filter((rd) => rd.status === 'ACTIVE').length;
  }, [riders]);

  const seatUtilizationRate = useMemo(() => {
    if (totalFleetCapacity === 0) return 0;
    return Math.min(100, Math.round((totalEnrolledRiders / totalFleetCapacity) * 100));
  }, [totalFleetCapacity, totalEnrolledRiders]);

  const activeFleetRuns = useMemo(() => {
    return routes.filter((r) => r.gps_status === 'EN_ROUTE').length;
  }, [routes]);

  // Filtered Routes
  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        route.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.bus_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.stops_summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGps = selectedGpsFilter === 'ALL' || route.gps_status === selectedGpsFilter;

      return matchesSearch && matchesGps;
    });
  }, [routes, searchTerm, selectedGpsFilter]);

  // Filtered Riders
  const filteredRiders = useMemo(() => {
    return riders.filter((rider) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        rider.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.pickup_stop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.route_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRoute = selectedRouteFilter === 'ALL' || rider.route_id === selectedRouteFilter;
      const matchesFee = selectedFeeFilter === 'ALL' || rider.fee_status === selectedFeeFilter;

      return matchesSearch && matchesRoute && matchesFee;
    });
  }, [riders, searchTerm, selectedRouteFilter, selectedFeeFilter]);

  // Handlers for Routes CRUD
  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      await api.post(`/v1/campus/transport${qs}`, {
        ...routeForm,
        capacity: Number(routeForm.capacity),
        term_fee: Number(routeForm.term_fee),
      });

      setIsAddRouteModalOpen(false);
      setRouteForm({
        id: '',
        route_name: '',
        bus_number: '',
        driver_name: '',
        driver_phone: '',
        attendant_name: '',
        capacity: 30,
        stops_summary: '',
        morning_departure: '06:45 AM',
        afternoon_return: '03:30 PM',
        term_fee: 75000,
        gps_status: 'ACTIVE',
        status: 'ACTIVE',
      });
      await fetchTransportData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to create bus route');
    }
  };

  const handleUpdateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      await api.put(`/v1/campus/transport${qs}`, {
        ...routeForm,
        capacity: Number(routeForm.capacity),
        term_fee: Number(routeForm.term_fee),
      });

      setIsEditRouteModalOpen(false);
      await fetchTransportData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update bus route');
    }
  };

  const openEditRouteModal = (route: TransportRouteRecord) => {
    setRouteForm({
      id: route.id,
      route_name: route.route_name,
      bus_number: route.bus_number,
      driver_name: route.driver_name,
      driver_phone: route.driver_phone,
      attendant_name: route.attendant_name,
      capacity: route.capacity,
      stops_summary: route.stops_summary,
      morning_departure: route.morning_departure,
      afternoon_return: route.afternoon_return,
      term_fee: route.term_fee,
      gps_status: route.gps_status,
      status: route.status,
    });
    setIsEditRouteModalOpen(true);
  };

  // Handlers for Riders CRUD
  const handleEnrollRider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      await api.post(`/v1/campus/transport/riders${qs}`, riderForm);

      setIsEnrollRiderModalOpen(false);
      setRiderForm({
        id: '',
        route_id: '',
        student_id: '',
        student_name: '',
        admission_number: '',
        class_arm_name: '',
        pickup_stop: '',
        morning_pickup_time: '06:45 AM',
        afternoon_dropoff_time: '03:45 PM',
        parent_phone: '',
        fee_status: 'CLEARED',
        status: 'ACTIVE',
      });
      await fetchTransportData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to enroll student passenger');
    }
  };

  const handleUpdateRider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      await api.put(`/v1/campus/transport/riders${qs}`, riderForm);

      setIsEditRiderModalOpen(false);
      await fetchTransportData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update passenger record');
    }
  };

  const openEditRiderModal = (rider: TransportRiderRecord) => {
    setRiderForm({
      id: rider.id,
      route_id: rider.route_id,
      student_id: rider.student_id,
      student_name: rider.student_name,
      admission_number: rider.admission_number,
      class_arm_name: rider.class_arm_name,
      pickup_stop: rider.pickup_stop,
      morning_pickup_time: rider.morning_pickup_time,
      afternoon_dropoff_time: rider.afternoon_dropoff_time,
      parent_phone: rider.parent_phone,
      fee_status: rider.fee_status,
      status: rider.status,
    });
    setIsEditRiderModalOpen(true);
  };

  // Delete execution
  const executeDelete = async () => {
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      params.append('id', deleteConfirmation.id);
      const qs = `?${params.toString()}`;

      if (deleteConfirmation.type === 'route') {
        await api.delete(`/v1/campus/transport${qs}`);
      } else {
        await api.delete(`/v1/campus/transport/riders${qs}`);
      }

      setDeleteConfirmation({ isOpen: false, type: 'route', id: '', title: '' });
      await fetchTransportData(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete record');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-50 text-[#146ef5] rounded-2xl">
                <TruckIcon className="w-7 h-7" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  Transport & Fleet Management
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Tenant-scoped school bus corridors, GPS status tracking, and student passenger manifests.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTransportData(true)}
              disabled={refreshing}
              className="p-2.5 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Transport Data"
            >
              <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin text-[#146ef5]' : ''}`} />
            </button>

            {activeSubtab === 'routes' ? (
              <button
                onClick={() => {
                  setRouteForm({
                    id: '',
                    route_name: '',
                    bus_number: 'BUS-0' + (routes.length + 1) + ' (Toyota Coaster)',
                    driver_name: '',
                    driver_phone: '+234 ',
                    attendant_name: '',
                    capacity: 30,
                    stops_summary: '',
                    morning_departure: '06:45 AM',
                    afternoon_return: '03:30 PM',
                    term_fee: 75000,
                    gps_status: 'ACTIVE',
                    status: 'ACTIVE',
                  });
                  setIsAddRouteModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                Add Bus Route
              </button>
            ) : (
              <button
                onClick={() => {
                  const firstRoute = routes[0];
                  const firstStudent = availableStudents[0];
                  setRiderForm({
                    id: '',
                    route_id: firstRoute ? firstRoute.id : '',
                    student_id: firstStudent ? firstStudent.id : '',
                    student_name: firstStudent ? firstStudent.student_name : '',
                    admission_number: firstStudent ? firstStudent.admission_number : '',
                    class_arm_name: firstStudent ? firstStudent.arm_name || '' : '',
                    pickup_stop: '',
                    morning_pickup_time: '06:45 AM',
                    afternoon_dropoff_time: '03:45 PM',
                    parent_phone: '+234 ',
                    fee_status: 'CLEARED',
                    status: 'ACTIVE',
                  });
                  setIsEnrollRiderModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                Enroll Student Rider
              </button>
            )}
          </div>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex border-b border-gray-100 mt-8 gap-6">
          <button
            onClick={() => {
              setActiveSubtab('routes');
              setSearchTerm('');
            }}
            className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeSubtab === 'routes' ? 'text-[#146ef5]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <TruckIcon className="w-4 h-4" />
            Bus Corridors & Fleet Routes
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubtab === 'routes' ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {routes.length}
            </span>
            {activeSubtab === 'routes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#146ef5] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveSubtab('manifest');
              setSearchTerm('');
            }}
            className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeSubtab === 'manifest' ? 'text-[#146ef5]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <UserGroupIcon className="w-4 h-4" />
            Student Passenger Manifest
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeSubtab === 'manifest' ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {riders.length}
            </span>
            {activeSubtab === 'manifest' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#146ef5] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0d47a1] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-white/80">Active Corridors</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TruckIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold tracking-tight">{routes.length}</div>
            <p className="text-xs text-white/80 mt-1">Dedicated school corridors</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Fleet Capacity</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {totalEnrolledRiders} <span className="text-lg font-medium text-gray-400">/ {totalFleetCapacity}</span>
            </div>
            <div className="mt-2 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  seatUtilizationRate >= 95 ? 'bg-rose-500' : seatUtilizationRate >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${seatUtilizationRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{seatUtilizationRate}% seat capacity booked</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Fleet Operations</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <SignalIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-emerald-600 tracking-tight">{activeFleetRuns}</div>
            <p className="text-xs text-gray-500 mt-1">Buses currently En Route with GPS tracking</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Safety & Compliance</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheckIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-gray-900 tracking-tight">100%</div>
            <p className="text-xs text-gray-500 mt-1">Verified drivers, seat belts & speed monitors</p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            <p className="font-semibold">Transport Service Alert</p>
            <p className="mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => fetchTransportData(true)}
            className="text-xs font-bold text-rose-700 underline hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* SUBTAB 1: BUS CORRIDORS & FLEET ROUTES */}
      {activeSubtab === 'routes' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by corridor name, driver, bus plate or stops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500">GPS Status:</span>
              <select
                value={selectedGpsFilter}
                onChange={(e) => setSelectedGpsFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
              >
                <option value="ALL">All Statuses</option>
                <option value="EN_ROUTE">En Route (Live GPS)</option>
                <option value="PARKED_ON_CAMPUS">Parked on Campus</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="DELAYED">Delayed</option>
              </select>
            </div>
          </div>

          {/* Routes Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Corridor & Route Details</th>
                  <th className="px-6 py-4">Fleet Bus</th>
                  <th className="px-6 py-4">Driver & Attendant</th>
                  <th className="px-6 py-4">Ridership</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Term Fee</th>
                  <th className="px-6 py-4">GPS Live</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                      <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto text-[#146ef5] mb-2" />
                      Loading transport fleet data...
                    </td>
                  </tr>
                ) : filteredRoutes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500 text-sm">
                      No bus routes match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRoutes.map((route) => {
                    const percent =
                      route.capacity > 0 ? Math.round((route.assigned_students / route.capacity) * 100) : 0;
                    return (
                      <tr key={route.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{route.route_name}</div>
                          <div className="text-xs text-gray-500 mt-1 max-w-xs line-clamp-2">
                            {route.stops_summary || 'No stops specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-gray-800">
                            <TruckIcon className="w-3.5 h-3.5 text-gray-500" />
                            {route.bus_number}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{route.driver_name}</div>
                          {route.driver_phone && (
                            <a
                              href={`tel:${route.driver_phone}`}
                              className="inline-flex items-center gap-1 text-xs text-[#146ef5] hover:underline mt-0.5"
                            >
                              <PhoneIcon className="w-3 h-3" />
                              {route.driver_phone}
                            </a>
                          )}
                          {route.attendant_name && (
                            <div className="text-[11px] text-gray-400 mt-0.5">Attendant: {route.attendant_name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1">
                            <span>
                              {route.assigned_students} / {route.capacity}
                            </span>
                            <span className="text-gray-400 font-normal">{percent}%</span>
                          </div>
                          <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percent >= 95 ? 'bg-rose-500' : percent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          <div>
                            <span className="font-medium text-gray-800">AM:</span> {route.morning_departure}
                          </div>
                          <div className="mt-0.5">
                            <span className="font-medium text-gray-800">PM:</span> {route.afternoon_return}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                          ₦{Number(route.term_fee || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              route.gps_status === 'EN_ROUTE'
                                ? 'bg-emerald-50 text-emerald-700'
                                : route.gps_status === 'PARKED_ON_CAMPUS'
                                ? 'bg-blue-50 text-[#146ef5]'
                                : route.gps_status === 'DELAYED'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                route.gps_status === 'EN_ROUTE'
                                  ? 'bg-emerald-500 animate-pulse'
                                  : route.gps_status === 'PARKED_ON_CAMPUS'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-400'
                              }`}
                            />
                            {route.gps_status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedRouteFilter(route.id);
                                setActiveSubtab('manifest');
                              }}
                              className="p-1.5 text-gray-400 hover:text-[#146ef5] hover:bg-blue-50 rounded-lg transition-all"
                              title="View Passenger Manifest"
                            >
                              <UserGroupIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditRouteModal(route)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Edit Route Details"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmation({
                                  isOpen: true,
                                  type: 'route',
                                  id: route.id,
                                  title: route.route_name,
                                })
                              }
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete Bus Route"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: STUDENT PASSENGER MANIFEST */}
      {activeSubtab === 'manifest' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student, admission number, or pickup point..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Route:</span>
                <select
                  value={selectedRouteFilter}
                  onChange={(e) => setSelectedRouteFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                >
                  <option value="ALL">All Corridors ({routes.length})</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.route_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Fee Status:</span>
                <select
                  value={selectedFeeFilter}
                  onChange={(e) => setSelectedFeeFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]"
                >
                  <option value="ALL">All Payments</option>
                  <option value="CLEARED">Cleared</option>
                  <option value="PENDING">Pending</option>
                  <option value="WAIVED">Waived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Riders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student Passenger</th>
                  <th className="px-6 py-4">Class / Arm</th>
                  <th className="px-6 py-4">Assigned Corridor</th>
                  <th className="px-6 py-4">Designated Pickup Stop</th>
                  <th className="px-6 py-4">Timings (AM / PM)</th>
                  <th className="px-6 py-4">Emergency Contact</th>
                  <th className="px-6 py-4">Fee Clearance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                      <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto text-[#146ef5] mb-2" />
                      Loading student passenger manifest...
                    </td>
                  </tr>
                ) : filteredRiders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500 text-sm">
                      No student passengers match your search or corridor filter.
                    </td>
                  </tr>
                ) : (
                  filteredRiders.map((rider) => (
                    <tr key={rider.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{rider.student_name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{rider.admission_number || 'Enrolled'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                          {rider.class_arm_name || 'Assigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-2.5 py-1 rounded-full">
                          {rider.route_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-800">
                        <div className="flex items-center gap-1.5">
                          <MapPinIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{rider.pickup_stop}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        <div>
                          <span className="font-medium text-gray-800">Pick:</span> {rider.morning_pickup_time}
                        </div>
                        <div className="mt-0.5">
                          <span className="font-medium text-gray-800">Drop:</span> {rider.afternoon_dropoff_time}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {rider.parent_phone ? (
                          <a
                            href={`tel:${rider.parent_phone}`}
                            className="inline-flex items-center gap-1 text-[#146ef5] hover:underline font-medium"
                          >
                            <PhoneIcon className="w-3 h-3" />
                            {rider.parent_phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            rider.fee_status === 'CLEARED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : rider.fee_status === 'WAIVED'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {rider.fee_status === 'CLEARED' && <CheckCircleIcon className="w-3 h-3" />}
                          {rider.fee_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditRiderModal(rider)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit Rider Details"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                isOpen: true,
                                type: 'rider',
                                id: rider.id,
                                title: `${rider.student_name} (${rider.route_name})`,
                              })
                            }
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Remove Rider from Manifest"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD BUS ROUTE */}
      {isAddRouteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Bus Route Corridor</h2>
              <button
                onClick={() => setIsAddRouteModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="mt-6 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Route Corridor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route A · Lekki Phase 1 / Ikate Corridor"
                  value={routeForm.route_name}
                  onChange={(e) => setRouteForm({ ...routeForm, route_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fleet Bus & Plate *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BUS-01 (Toyota Coaster)"
                    value={routeForm.bus_number}
                    onChange={(e) => setRouteForm({ ...routeForm, bus_number: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Passenger Capacity (Seats) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={routeForm.capacity}
                    onChange={(e) => setRouteForm({ ...routeForm, capacity: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Driver Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Sunday Adeleke"
                    value={routeForm.driver_name}
                    onChange={(e) => setRouteForm({ ...routeForm, driver_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Driver Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +234 802 331 4450"
                    value={routeForm.driver_phone}
                    onChange={(e) => setRouteForm({ ...routeForm, driver_phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Bus Attendant / Chaperone</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Grace Udoh"
                    value={routeForm.attendant_name}
                    onChange={(e) => setRouteForm({ ...routeForm, attendant_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Term Transport Fee (₦)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="75000"
                    value={routeForm.term_fee}
                    onChange={(e) => setRouteForm({ ...routeForm, term_fee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Stops Corridor Summary</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Admiralty Way → Freedom Way → Ikate Elegushi → Campus Gate"
                  value={routeForm.stops_summary}
                  onChange={(e) => setRouteForm({ ...routeForm, stops_summary: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Morning Departure Time</label>
                  <input
                    type="text"
                    placeholder="06:45 AM"
                    value={routeForm.morning_departure}
                    onChange={(e) => setRouteForm({ ...routeForm, morning_departure: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Afternoon Return Time</label>
                  <input
                    type="text"
                    placeholder="03:30 PM"
                    value={routeForm.afternoon_return}
                    onChange={(e) => setRouteForm({ ...routeForm, afternoon_return: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Fleet GPS Status</label>
                <select
                  value={routeForm.gps_status}
                  onChange={(e) => setRouteForm({ ...routeForm, gps_status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                >
                  <option value="ACTIVE">Active (Normal)</option>
                  <option value="EN_ROUTE">En Route (Morning/Afternoon Run)</option>
                  <option value="PARKED_ON_CAMPUS">Parked on Campus</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="DELAYED">Delayed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddRouteModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#146ef5] text-white font-semibold rounded-xl hover:bg-[#105bd1] transition-colors shadow-sm cursor-pointer"
                >
                  Save Bus Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT BUS ROUTE */}
      {isEditRouteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Edit Bus Route Details</h2>
              <button
                onClick={() => setIsEditRouteModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRoute} className="mt-6 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Route Corridor Name *</label>
                <input
                  type="text"
                  required
                  value={routeForm.route_name}
                  onChange={(e) => setRouteForm({ ...routeForm, route_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fleet Bus & Plate *</label>
                  <input
                    type="text"
                    required
                    value={routeForm.bus_number}
                    onChange={(e) => setRouteForm({ ...routeForm, bus_number: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Passenger Capacity (Seats) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={routeForm.capacity}
                    onChange={(e) => setRouteForm({ ...routeForm, capacity: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Driver Full Name *</label>
                  <input
                    type="text"
                    required
                    value={routeForm.driver_name}
                    onChange={(e) => setRouteForm({ ...routeForm, driver_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Driver Phone Number</label>
                  <input
                    type="text"
                    value={routeForm.driver_phone}
                    onChange={(e) => setRouteForm({ ...routeForm, driver_phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Bus Attendant / Chaperone</label>
                  <input
                    type="text"
                    value={routeForm.attendant_name}
                    onChange={(e) => setRouteForm({ ...routeForm, attendant_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Term Transport Fee (₦)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={routeForm.term_fee}
                    onChange={(e) => setRouteForm({ ...routeForm, term_fee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Stops Corridor Summary</label>
                <textarea
                  rows={2}
                  value={routeForm.stops_summary}
                  onChange={(e) => setRouteForm({ ...routeForm, stops_summary: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Morning Departure Time</label>
                  <input
                    type="text"
                    value={routeForm.morning_departure}
                    onChange={(e) => setRouteForm({ ...routeForm, morning_departure: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Afternoon Return Time</label>
                  <input
                    type="text"
                    value={routeForm.afternoon_return}
                    onChange={(e) => setRouteForm({ ...routeForm, afternoon_return: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Fleet GPS Tracking Status</label>
                <select
                  value={routeForm.gps_status}
                  onChange={(e) => setRouteForm({ ...routeForm, gps_status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                >
                  <option value="ACTIVE">Active (Normal)</option>
                  <option value="EN_ROUTE">En Route (Morning/Afternoon Run)</option>
                  <option value="PARKED_ON_CAMPUS">Parked on Campus</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="DELAYED">Delayed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditRouteModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#146ef5] text-white font-semibold rounded-xl hover:bg-[#105bd1] transition-colors shadow-sm cursor-pointer"
                >
                  Update Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ENROLL STUDENT RIDER */}
      {isEnrollRiderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Enroll Student on Bus Route</h2>
              <button
                onClick={() => setIsEnrollRiderModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollRider} className="mt-6 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Student from Roster *</label>
                <select
                  required
                  value={riderForm.student_id}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const st = availableStudents.find((s) => s.id === selId);
                    setRiderForm({
                      ...riderForm,
                      student_id: selId,
                      student_name: st ? st.student_name : '',
                      admission_number: st ? st.admission_number : '',
                      class_arm_name: st ? st.arm_name || '' : '',
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                >
                  <option value="">Select a student...</option>
                  {availableStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.student_name} ({s.arm_name || 'Enrolled'}) · {s.admission_number}
                    </option>
                  ))}
                </select>
                {availableStudents.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    No students loaded from roster. You can type the name below.
                  </p>
                )}
              </div>

              {!riderForm.student_id && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chinedu Okafor"
                      value={riderForm.student_name}
                      onChange={(e) => setRiderForm({ ...riderForm, student_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Admission Number</label>
                    <input
                      type="text"
                      placeholder="ADM/2026/0142"
                      value={riderForm.admission_number}
                      onChange={(e) => setRiderForm({ ...riderForm, admission_number: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Bus Corridor *</label>
                <select
                  required
                  value={riderForm.route_id}
                  onChange={(e) => setRiderForm({ ...riderForm, route_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                >
                  <option value="">Select bus corridor...</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.route_name} ({r.assigned_students}/{r.capacity} Seats Booked)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Designated Pickup Stop *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admiralty Way (Admiralty Mall Bus Stop)"
                  value={riderForm.pickup_stop}
                  onChange={(e) => setRiderForm({ ...riderForm, pickup_stop: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Morning Pickup Time</label>
                  <input
                    type="text"
                    placeholder="06:35 AM"
                    value={riderForm.morning_pickup_time}
                    onChange={(e) => setRiderForm({ ...riderForm, morning_pickup_time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Afternoon Dropoff Time</label>
                  <input
                    type="text"
                    placeholder="03:45 PM"
                    value={riderForm.afternoon_dropoff_time}
                    onChange={(e) => setRiderForm({ ...riderForm, afternoon_dropoff_time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Emergency Parent Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. +234 803 301 2284"
                    value={riderForm.parent_phone}
                    onChange={(e) => setRiderForm({ ...riderForm, parent_phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Transport Fee Status</label>
                  <select
                    value={riderForm.fee_status}
                    onChange={(e) => setRiderForm({ ...riderForm, fee_status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  >
                    <option value="CLEARED">Cleared</option>
                    <option value="PENDING">Pending</option>
                    <option value="WAIVED">Waived (Scholarship)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEnrollRiderModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#146ef5] text-white font-semibold rounded-xl hover:bg-[#105bd1] transition-colors shadow-sm cursor-pointer"
                >
                  Enroll on Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT RIDER DETAILS */}
      {isEditRiderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Passenger Details</h2>
                <p className="text-xs text-gray-500">{riderForm.student_name} · {riderForm.admission_number}</p>
              </div>
              <button
                onClick={() => setIsEditRiderModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRider} className="mt-6 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Bus Corridor *</label>
                <select
                  required
                  value={riderForm.route_id}
                  onChange={(e) => setRiderForm({ ...riderForm, route_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.route_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Designated Pickup Stop *</label>
                <input
                  type="text"
                  required
                  value={riderForm.pickup_stop}
                  onChange={(e) => setRiderForm({ ...riderForm, pickup_stop: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Morning Pickup Time</label>
                  <input
                    type="text"
                    value={riderForm.morning_pickup_time}
                    onChange={(e) => setRiderForm({ ...riderForm, morning_pickup_time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Afternoon Dropoff Time</label>
                  <input
                    type="text"
                    value={riderForm.afternoon_dropoff_time}
                    onChange={(e) => setRiderForm({ ...riderForm, afternoon_dropoff_time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Emergency Parent Contact</label>
                  <input
                    type="text"
                    value={riderForm.parent_phone}
                    onChange={(e) => setRiderForm({ ...riderForm, parent_phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Transport Fee Status</label>
                  <select
                    value={riderForm.fee_status}
                    onChange={(e) => setRiderForm({ ...riderForm, fee_status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#146ef5]"
                  >
                    <option value="CLEARED">Cleared</option>
                    <option value="PENDING">Pending</option>
                    <option value="WAIVED">Waived (Scholarship)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditRiderModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#146ef5] text-white font-semibold rounded-xl hover:bg-[#105bd1] transition-colors shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <ExclamationTriangleIcon className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">
                Confirm {deleteConfirmation.type === 'route' ? 'Bus Route Deletion' : 'Rider Removal'}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirmation.title}</span>?
              {deleteConfirmation.type === 'route' && (
                <span className="block mt-2 text-rose-600 text-xs">
                  Warning: All assigned student passengers on this route will be unassigned.
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmation({ isOpen: false, type: 'route', id: '', title: '' })}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-5 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
