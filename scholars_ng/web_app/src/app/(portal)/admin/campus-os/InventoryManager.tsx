'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArchiveBoxIcon,
  ArchiveBoxArrowDownIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ReceiptPercentIcon,
  ShoppingCartIcon,
  TagIcon,
  TruckIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  ArrowPathIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PrinterIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ClockIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

// ============================================================================
// TYPES & DATA CONTRACTS
// ============================================================================

export interface InventoryItem {
  id: string;
  tenant_id: string;
  sku: string;
  item_name: string;
  category: string;
  unit: string;
  quantity_in_stock: number;
  reorder_level: number;
  unit_cost: number;
  total_value: number;
  location: string;
  supplier_name: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | string;
  last_restocked_at?: string;
  last_dispatched_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StockMovement {
  id: string;
  tenant_id: string;
  item_id: string;
  item_name: string;
  sku: string;
  movement_type: 'STOCK_IN' | 'DISPATCH' | 'RETURN' | 'AUDIT_ADJUSTMENT' | string;
  quantity: number;
  balance_after: number;
  department: string;
  recipient_name: string;
  authorized_by: string;
  reference_po?: string;
  movement_date: string;
  notes?: string;
  created_at?: string;
}

export interface ProcurementRequest {
  id: string;
  tenant_id: string;
  po_number: string;
  title: string;
  department: string;
  requested_by: string;
  vendor_name: string;
  items_summary: string;
  total_amount: number;
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW' | string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'REJECTED' | string;
  approved_by?: string;
  approval_notes?: string;
  needed_by_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryVendor {
  id: string;
  tenant_id: string;
  vendor_name: string;
  category: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  payment_terms: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  rating: number;
  created_at?: string;
}

export interface InventorySummary {
  total_skus: number;
  total_valuation: number;
  low_stock_count: number;
  out_of_stock_count: number;
  pending_pos_count: number;
  approved_pos_count: number;
  total_pos_value: number;
  vendors_count: number;
}

type SubTabKey = 'overview' | 'catalog' | 'movements' | 'procurement' | 'vendors';

export default function InventoryManager() {
  const [subtab, setSubtab] = useState<SubTabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Core Database Data
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [procurements, setProcurements] = useState<ProcurementRequest[]>([]);
  const [vendors, setVendors] = useState<InventoryVendor[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [summary, setSummary] = useState<InventorySummary>({
    total_skus: 0,
    total_valuation: 0,
    low_stock_count: 0,
    out_of_stock_count: 0,
    pending_pos_count: 0,
    approved_pos_count: 0,
    total_pos_value: 0,
    vendors_count: 0,
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [movementTypeFilter, setMovementTypeFilter] = useState('ALL');
  const [poStatusFilter, setPoStatusFilter] = useState('ALL');

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [printVoucher, setPrintVoucher] = useState<{
    type: 'PO' | 'DISPATCH';
    data: any;
  } | null>(null);

  // Item Form State
  const [itemForm, setItemForm] = useState({
    id: '',
    sku: '',
    item_name: '',
    category: 'Science Laboratory',
    unit: 'Units',
    quantity_in_stock: 10,
    reorder_level: 5,
    unit_cost: 25000,
    location: 'Main Science Block Store',
    supplier_name: '',
  });

  // Stock Movement Form State
  const [movementForm, setMovementForm] = useState({
    item_id: '',
    movement_type: 'DISPATCH',
    quantity: 1,
    department: 'Science & Robotics Lab',
    recipient_name: '',
    authorized_by: 'Store Manager',
    reference_po: '',
    movement_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // PO Form State
  const [poForm, setPoForm] = useState({
    title: '',
    department: 'Science & Robotics Lab',
    requested_by: '',
    vendor_name: '',
    items_summary: '',
    total_amount: 150000,
    priority: 'NORMAL',
    needed_by_date: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
  });

  // Vendor Form State
  const [vendorForm, setVendorForm] = useState({
    vendor_name: '',
    category: 'Science & Lab Apparatus',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    payment_terms: 'Net 30',
  });

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const loadInventoryData = useCallback(async () => {
    setLoading(true);
    setErrorBanner(null);
    try {
      const res = await api.get('/v1/campus/inventory');
      const data = res.data;
      if (data) {
        if (data.summary) setSummary(data.summary);
        if (data.inventory) setInventory(data.inventory);
        if (data.movements) setMovements(data.movements);
        if (data.procurement_requests) setProcurements(data.procurement_requests);
        if (data.vendors) setVendors(data.vendors);
        if (data.departments) setDepartments(data.departments);
      }
    } catch (err: any) {
      console.error('Failed to load campus inventory:', err);
      setErrorBanner(err?.response?.data?.error || 'Failed to connect to tenant inventory store.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventoryData();
  }, [loadInventoryData]);

  // ============================================================================
  // ITEM SKU HANDLERS
  // ============================================================================
  const openNewItemModal = () => {
    setItemForm({
      id: '',
      sku: '',
      item_name: '',
      category: 'Science Laboratory',
      unit: 'Units',
      quantity_in_stock: 10,
      reorder_level: 5,
      unit_cost: 25000,
      location: 'Central Campus Store',
      supplier_name: vendors[0]?.vendor_name || 'Finlab Nigeria Ltd',
    });
    setShowItemModal(true);
  };

  const openEditItemModal = (item: InventoryItem) => {
    setItemForm({
      id: item.id,
      sku: item.sku,
      item_name: item.item_name,
      category: item.category,
      unit: item.unit,
      quantity_in_stock: item.quantity_in_stock,
      reorder_level: item.reorder_level,
      unit_cost: item.unit_cost,
      location: item.location,
      supplier_name: item.supplier_name,
    });
    setShowItemModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.item_name.trim()) {
      setErrorBanner('Item name is required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/v1/campus/inventory', {
        ...itemForm,
        quantity_in_stock: Number(itemForm.quantity_in_stock),
        reorder_level: Number(itemForm.reorder_level),
        unit_cost: Number(itemForm.unit_cost),
      });
      setShowItemModal(false);
      setSuccessBanner(`Store SKU "${itemForm.item_name}" saved successfully in database.`);
      await loadInventoryData();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to save store item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete SKU "${name}" and its stock history?`)) return;
    try {
      await api.delete(`/v1/campus/inventory?id=${id}&type=item`);
      setSuccessBanner(`Store item "${name}" removed from database.`);
      await loadInventoryData();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to delete item.');
    }
  };

  // ============================================================================
  // STOCK MOVEMENT HANDLERS
  // ============================================================================
  const openMovementModalWithItem = (item: InventoryItem, movementType: 'DISPATCH' | 'STOCK_IN') => {
    setMovementForm({
      item_id: item.id,
      movement_type: movementType,
      quantity: 1,
      department: departments[0] || 'Science & Robotics Lab',
      recipient_name: '',
      authorized_by: 'Store Manager',
      reference_po: '',
      movement_date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowMovementModal(true);
  };

  const handleSaveMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementForm.item_id) {
      setErrorBanner('Please select an inventory item.');
      return;
    }
    const targetItem = inventory.find((i) => i.id === movementForm.item_id);
    if (movementForm.movement_type === 'DISPATCH') {
      if (!targetItem) {
        setErrorBanner('Selected item not found.');
        return;
      }
      if (Number(movementForm.quantity) > targetItem.quantity_in_stock) {
        setErrorBanner(
          `Cannot dispatch ${movementForm.quantity} units. Only ${targetItem.quantity_in_stock} available in store.`
        );
        return;
      }
    }
    setSaving(true);
    try {
      const res = await api.post('/v1/campus/inventory', {
        action: 'stock_movement',
        ...movementForm,
        quantity: Number(movementForm.quantity),
      });
      setShowMovementModal(false);
      setSuccessBanner(res.data?.message || 'Stock ledger entry updated successfully.');
      await loadInventoryData();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to log stock movement.');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // PURCHASE REQUISITION (PO) HANDLERS
  // ============================================================================
  const handleSavePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poForm.title.trim() || !poForm.requested_by.trim()) {
      setErrorBanner('Requisition title and requesting officer name are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/v1/campus/inventory', {
        action: 'create_procurement',
        ...poForm,
        total_amount: Number(poForm.total_amount),
      });
      setShowPOModal(false);
      setSuccessBanner(res.data?.message || 'Purchase requisition submitted.');
      await loadInventoryData();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to submit procurement requisition.');
    } finally {
      setSaving(false);
    }
  };

  const handlePOStatusUpdate = async (poId: string, newStatus: string) => {
    try {
      const res = await api.put('/v1/campus/inventory', {
        id: poId,
        status: newStatus,
        approved_by: 'Super Admin',
      });
      setSuccessBanner(res.data?.message || `Purchase order status changed to ${newStatus}.`);
      await loadInventoryData();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to update PO status.');
    }
  };

  const handleDeletePO = async (id: string, poNumber: string) => {
    if (!window.confirm(`Delete purchase requisition ${poNumber}?`)) return;
    try {
      await api.delete(`/v1/campus/inventory?id=${id}&type=procurement`);
      setSuccessBanner(`Procurement request ${poNumber} deleted.`);
      await loadInventoryData();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to delete procurement request.');
    }
  };

  // ============================================================================
  // VENDOR HANDLERS
  // ============================================================================
  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.vendor_name.trim()) {
      setErrorBanner('Vendor business name is required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/v1/campus/inventory', {
        action: 'add_vendor',
        ...vendorForm,
      });
      setShowVendorModal(false);
      setSuccessBanner(`Vendor "${vendorForm.vendor_name}" added to approved directory.`);
      await loadInventoryData();
    } catch (err: any) {
      setErrorBanner(err?.response?.data?.error || 'Failed to register vendor.');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // FILTERED DATASETS
  // ============================================================================
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [inventory, searchQuery, categoryFilter, statusFilter]);

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      return movementTypeFilter === 'ALL' || m.movement_type === movementTypeFilter;
    });
  }, [movements, movementTypeFilter]);

  const filteredProcurements = useMemo(() => {
    return procurements.filter((po) => {
      return poStatusFilter === 'ALL' || po.status === poStatusFilter;
    });
  }, [procurements, poStatusFilter]);

  // Unique Categories from Inventory
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [inventory]);

  // Subtab Config
  const subtabs: { id: SubTabKey; label: string; icon: any; count?: number | string }[] = [
    { id: 'overview', label: 'Overview & Stock Pulse', icon: ArchiveBoxIcon },
    { id: 'catalog', label: 'Store Catalog & SKUs', icon: CubeIcon, count: summary.total_skus },
    {
      id: 'movements',
      label: 'Stock Issuances & Dispatches',
      icon: ArrowsRightLeftIcon,
      count: movements.length,
    },
    {
      id: 'procurement',
      label: 'Purchase Orders & Requisitions',
      icon: ShoppingCartIcon,
      count: summary.pending_pos_count > 0 ? `${summary.pending_pos_count} Pending` : undefined,
    },
    { id: 'vendors', label: 'Suppliers & Vendors', icon: BuildingStorefrontIcon, count: summary.vendors_count },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Dynamic Alerts */}
      {errorBanner && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button onClick={() => setErrorBanner(null)} className="text-rose-500 hover:text-rose-700">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-500 hover:text-emerald-700">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Store Inventory & Procurement</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5] border border-blue-200">
              Tenant-Aware Postgres
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage institutional store items, departmental stock dispatches, supplier purchase orders, and audit trail.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={openNewItemModal}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add Store Item (SKU)
          </button>
          <button
            onClick={() => {
              if (inventory.length > 0) {
                openMovementModalWithItem(inventory[0], 'DISPATCH');
              } else {
                setErrorBanner('Register at least one store SKU before logging stock movements.');
              }
            }}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowsRightLeftIcon className="w-4 h-4 text-[#146ef5]" />
            Log Stock Dispatch
          </button>
          <button
            onClick={() => setShowPOModal(true)}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCartIcon className="w-4 h-4 text-white" />
            New Purchase Order
          </button>
          <button
            onClick={loadInventoryData}
            disabled={loading}
            className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm transition-all cursor-pointer"
            title="Refresh database records"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-[#146ef5]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Subtab Navigation Pill Bar */}
      <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex items-center gap-1.5 bg-gray-100/90 rounded-full p-1 border border-gray-200/70">
          {subtabs.map((tab) => {
            const Icon = tab.icon;
            const active = subtab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubtab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-[#146ef5] shadow-sm border border-gray-200/60'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      active ? 'bg-blue-50 text-[#146ef5] font-bold' : 'bg-white/70 text-gray-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUBTAB 1: OVERVIEW & STOCK VALUATION PULSE */}
      {/* ==================================================================== */}
      {subtab === 'overview' && (
        <div className="space-y-6">
          {/* Executive 4-Quadrant Metric Cards */}
          <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MotionRise className="bg-gradient-to-br from-[#146ef5] to-[#0D1060] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start z-10">
                <h3 className="text-xl font-normal text-white">Stock Valuation</h3>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <ArrowUpRightIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="z-10">
                <h2 className="text-3xl font-medium tracking-tight text-white mb-1">
                  ₦{summary.total_valuation.toLocaleString()}
                </h2>
                <p className="text-xs text-white/80">
                  {summary.total_skus} distinct catalog SKUs in store
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
            </MotionRise>

            <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Reorder Alerts</h3>
                <div className="w-8 h-8 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center text-amber-600">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-4xl font-medium tracking-tight text-amber-600">
                    {summary.low_stock_count + summary.out_of_stock_count}
                  </h2>
                  <span className="text-xs font-semibold text-gray-500">SKUs</span>
                </div>
                <p className="text-xs text-gray-500">
                  {summary.out_of_stock_count} completely depleted · {summary.low_stock_count} below threshold
                </p>
              </div>
            </MotionRise>

            <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Purchase Orders</h3>
                <div className="w-8 h-8 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-[#146ef5]">
                  <ShoppingCartIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-medium tracking-tight text-gray-900 mb-1">
                  {summary.pending_pos_count}
                </h2>
                <p className="text-xs text-gray-500">
                  ₦{summary.total_pos_value.toLocaleString()} total requisitioned
                </p>
              </div>
            </MotionRise>

            <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal text-gray-900">Suppliers</h3>
                <div className="w-8 h-8 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <BuildingStorefrontIcon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-medium tracking-tight text-gray-900 mb-1">
                  {summary.vendors_count}
                </h2>
                <p className="text-xs text-gray-500">Approved institutional vendors</p>
              </div>
            </MotionRise>
          </MotionStagger>

          {/* Critical Low Stock Alert Table & Quick Reorder Trigger */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Items Requiring Immediate Restock</h3>
                  <p className="text-xs text-gray-500">SKUs at or below minimum buffer reorder quantity</p>
                </div>
                <button
                  onClick={() => {
                    setSubtab('catalog');
                    setStatusFilter('LOW_STOCK');
                  }}
                  className="text-xs font-semibold text-[#146ef5] hover:underline"
                >
                  View All in Catalog →
                </button>
              </div>

              {inventory.filter((i) => i.status !== 'IN_STOCK').length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-xs">
                  <CheckCircleIcon className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All tracked inventory items currently have sufficient store stock.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 font-medium">
                        <th className="pb-3">SKU</th>
                        <th className="pb-3">Item Description</th>
                        <th className="pb-3">In Store</th>
                        <th className="pb-3">Reorder Point</th>
                        <th className="pb-3">Supplier</th>
                        <th className="pb-3 text-right">Quick Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {inventory
                        .filter((i) => i.status !== 'IN_STOCK')
                        .slice(0, 5)
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-3 font-mono font-bold text-[#146ef5]">{item.sku}</td>
                            <td className="py-3">
                              <span className="font-semibold text-gray-900">{item.item_name}</span>
                              <div className="text-[11px] text-gray-400">{item.location}</div>
                            </td>
                            <td className="py-3 font-bold text-rose-600">
                              {item.quantity_in_stock} {item.unit}
                            </td>
                            <td className="py-3 text-gray-600">{item.reorder_level} {item.unit}</td>
                            <td className="py-3 text-gray-500">{item.supplier_name || 'N/A'}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => openMovementModalWithItem(item, 'STOCK_IN')}
                                className="px-3 py-1 bg-blue-50 text-[#146ef5] hover:bg-blue-100 rounded-full font-semibold text-[11px] transition-all cursor-pointer"
                              >
                                + Restock
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Department Dispatches Snippet */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Recent Dispatches</h3>
                <button
                  onClick={() => setSubtab('movements')}
                  className="text-xs font-semibold text-[#146ef5] hover:underline"
                >
                  Full Ledger →
                </button>
              </div>

              {movements.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  No movement records registered yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {movements.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{m.item_name}</div>
                        <div className="text-[11px] text-gray-500">
                          {m.department} · {m.recipient_name || 'Store Recipient'}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{m.movement_date}</div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.movement_type === 'STOCK_IN'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}
                        >
                          {m.movement_type === 'STOCK_IN' ? `+${m.quantity}` : `-${m.quantity}`}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-1">Bal: {m.balance_after}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 2: STORE CATALOG & SKUs */}
      {/* ==================================================================== */}
      {subtab === 'catalog' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search SKU code, item name, location, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
              >
                <option value="ALL">All Categories</option>
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20"
              >
                <option value="ALL">All Stock Statuses</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock (Alert)</option>
                <option value="OUT_OF_STOCK">Out of Stock (Zero)</option>
              </select>

              {(searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                  className="px-3 py-2 text-xs rounded-xl text-gray-500 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Inventory Items Table */}
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-700">
                Displaying {filteredInventory.length} of {inventory.length} store items
              </span>
              <button
                onClick={openNewItemModal}
                className="text-xs font-semibold text-[#146ef5] hover:underline flex items-center gap-1"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add New Store SKU
              </button>
            </div>

            {filteredInventory.length === 0 ? (
              <div className="py-16 text-center">
                <CubeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-gray-900">No Store Items Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                  {inventory.length === 0
                    ? 'No store catalog items have been added to this tenant database yet.'
                    : 'No items match the active search criteria and filters.'}
                </p>
                <button
                  onClick={openNewItemModal}
                  className="px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full shadow-sm hover:bg-[#105bd1] transition-all"
                >
                  Register First Store Item
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100 text-[10px]">
                      <th className="px-5 py-3.5">SKU Code</th>
                      <th className="px-5 py-3.5">Item Name & Location</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">In Stock</th>
                      <th className="px-5 py-3.5">Reorder Point</th>
                      <th className="px-5 py-3.5">Unit Cost</th>
                      <th className="px-5 py-3.5">Asset Value</th>
                      <th className="px-5 py-3.5">Stock Health</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-[#146ef5]">{item.sku}</td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-sm text-gray-900">{item.item_name}</div>
                          <div className="text-[11px] text-gray-500">
                            {item.location} · {item.supplier_name || 'Vendor not specified'}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[11px] font-medium text-gray-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-sm text-gray-900">{item.quantity_in_stock}</span>{' '}
                          <span className="text-gray-500 text-[11px]">{item.unit}</span>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {item.reorder_level} {item.unit}
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-800">
                          ₦{item.unit_cost.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 font-bold text-gray-900">
                          ₦{item.total_value.toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.status === 'OUT_OF_STOCK'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : item.status === 'LOW_STOCK'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'OUT_OF_STOCK'
                                  ? 'bg-rose-600'
                                  : item.status === 'LOW_STOCK'
                                  ? 'bg-amber-600'
                                  : 'bg-emerald-600'
                              }`}
                            />
                            {item.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openMovementModalWithItem(item, 'DISPATCH')}
                              className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold text-[11px] transition-all cursor-pointer"
                              title="Dispatch supplies to teacher/lab"
                            >
                              Dispatch
                            </button>
                            <button
                              onClick={() => openMovementModalWithItem(item, 'STOCK_IN')}
                              className="px-2.5 py-1 bg-blue-50 text-[#146ef5] hover:bg-blue-100 rounded-lg font-semibold text-[11px] transition-all cursor-pointer"
                              title="Restock store inventory"
                            >
                              Restock
                            </button>
                            <button
                              onClick={() => openEditItemModal(item)}
                              className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                              title="Edit item specifications"
                            >
                              <TagIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.item_name)}
                              className="p-1 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                              title="Delete store item"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 3: STOCK ISSUANCES & DEPARTMENT DISPATCHES (AUDIT LEDGER) */}
      {/* ==================================================================== */}
      {subtab === 'movements' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Movement Type:</span>
              <div className="flex flex-wrap items-center gap-1">
                {['ALL', 'DISPATCH', 'STOCK_IN', 'RETURN', 'AUDIT_ADJUSTMENT'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setMovementTypeFilter(type)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      movementTypeFilter === type
                        ? 'bg-[#146ef5] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (inventory.length > 0) {
                  openMovementModalWithItem(inventory[0], 'DISPATCH');
                } else {
                  setErrorBanner('No inventory items available to dispatch.');
                }
              }}
              className="px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full shadow-sm hover:bg-[#105bd1] transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusIcon className="w-4 h-4" />
              Log Store Movement
            </button>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-700">
                Immutable Stock Ledger ({filteredMovements.length} logged events)
              </span>
            </div>

            {filteredMovements.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-xs">
                <ArrowsRightLeftIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                No physical stock movements recorded matching the current filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100 text-[10px]">
                      <th className="px-5 py-3.5">Date & Event</th>
                      <th className="px-5 py-3.5">Store Item</th>
                      <th className="px-5 py-3.5">Type</th>
                      <th className="px-5 py-3.5">Quantity</th>
                      <th className="px-5 py-3.5">Balance After</th>
                      <th className="px-5 py-3.5">Recipient & Department</th>
                      <th className="px-5 py-3.5">Authorized By</th>
                      <th className="px-5 py-3.5 text-right">Voucher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMovements.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">{m.movement_date}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            {m.created_at ? new Date(m.created_at).toLocaleTimeString() : ''}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">{m.item_name}</div>
                          <div className="text-[11px] font-mono text-gray-500">{m.sku}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              m.movement_type === 'STOCK_IN'
                                ? 'bg-emerald-50 text-emerald-700'
                                : m.movement_type === 'DISPATCH'
                                ? 'bg-purple-50 text-purple-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {m.movement_type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-sm text-gray-900">
                          {m.movement_type === 'STOCK_IN' ? `+${m.quantity}` : `-${m.quantity}`}
                        </td>
                        <td className="px-5 py-4 font-mono font-semibold text-gray-700">
                          {m.balance_after}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {m.recipient_name || 'Store Internal'}
                          </div>
                          <div className="text-[11px] text-gray-500">{m.department}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{m.authorized_by}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setPrintVoucher({ type: 'DISPATCH', data: m })}
                            className="p-1.5 text-gray-500 hover:text-[#146ef5] hover:bg-blue-50 rounded-lg transition-all"
                            title="Print Store Issue Voucher"
                          >
                            <PrinterIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 4: PURCHASE ORDERS & REQUISITIONS */}
      {/* ==================================================================== */}
      {subtab === 'procurement' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Status:</span>
              <div className="flex flex-wrap items-center gap-1">
                {['ALL', 'PENDING_APPROVAL', 'APPROVED', 'ORDERED', 'RECEIVED', 'REJECTED'].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setPoStatusFilter(status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        poStatusFilter === status
                          ? 'bg-[#146ef5] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status.replace(/_/g, ' ')}
                    </button>
                  )
                )}
              </div>
            </div>

            <button
              onClick={() => setShowPOModal(true)}
              className="px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full shadow-sm hover:bg-[#105bd1] transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
              New Purchase Requisition
            </button>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-700">
                Purchase Order Requisitions ({filteredProcurements.length} requests)
              </span>
            </div>

            {filteredProcurements.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-xs">
                <ShoppingCartIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                No procurement requisitions found in this state.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/70 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100 text-[10px]">
                      <th className="px-5 py-3.5">PO Number</th>
                      <th className="px-5 py-3.5">Title & Items</th>
                      <th className="px-5 py-3.5">Department</th>
                      <th className="px-5 py-3.5">Vendor</th>
                      <th className="px-5 py-3.5">Total Amount</th>
                      <th className="px-5 py-3.5">Priority</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Workflow Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProcurements.map((po) => (
                      <tr key={po.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-[#146ef5]">
                          {po.po_number}
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-semibold text-gray-900">{po.title}</div>
                          <div className="text-[11px] text-gray-500 line-clamp-1">
                            {po.items_summary}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          <div>{po.department}</div>
                          <div className="text-[11px] text-gray-400">By: {po.requested_by}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-800 font-medium">{po.vendor_name || 'TBD'}</td>
                        <td className="px-5 py-4 font-bold text-gray-900">
                          ₦{po.total_amount.toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              po.priority === 'URGENT'
                                ? 'bg-rose-100 text-rose-800'
                                : po.priority === 'HIGH'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {po.priority}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              po.status === 'APPROVED'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : po.status === 'ORDERED'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : po.status === 'RECEIVED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : po.status === 'REJECTED'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {po.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {po.status === 'PENDING_APPROVAL' && (
                              <>
                                <button
                                  onClick={() => handlePOStatusUpdate(po.id, 'APPROVED')}
                                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold text-[11px] transition-all cursor-pointer"
                                  title="Approve Requisition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handlePOStatusUpdate(po.id, 'REJECTED')}
                                  className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold text-[11px] transition-all cursor-pointer"
                                  title="Reject Requisition"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {po.status === 'APPROVED' && (
                              <button
                                onClick={() => handlePOStatusUpdate(po.id, 'ORDERED')}
                                className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-semibold text-[11px] transition-all cursor-pointer"
                                title="Mark as ordered from supplier"
                              >
                                Place Order
                              </button>
                            )}
                            {po.status === 'ORDERED' && (
                              <button
                                onClick={() => handlePOStatusUpdate(po.id, 'RECEIVED')}
                                className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold text-[11px] transition-all cursor-pointer"
                                title="Fulfill and receive delivery into store"
                              >
                                Mark Received
                              </button>
                            )}
                            <button
                              onClick={() => setPrintVoucher({ type: 'PO', data: po })}
                              className="p-1.5 text-gray-500 hover:text-[#146ef5] hover:bg-blue-50 rounded-lg transition-all"
                              title="Print Purchase Order Requisition"
                            >
                              <PrinterIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePO(po.id, po.po_number)}
                              className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete Requisition"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 5: SUPPLIERS & VENDORS DIRECTORY */}
      {/* ==================================================================== */}
      {subtab === 'vendors' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">
              Institutional Supplier Directory ({vendors.length} vendors)
            </span>
            <button
              onClick={() => setShowVendorModal(true)}
              className="px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full shadow-sm hover:bg-[#105bd1] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
              Add Approved Vendor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:-translate-y-0.5 transition-transform"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5] border border-blue-200">
                      {vendor.category}
                    </span>
                    <span className="text-xs font-bold text-amber-500">★ {vendor.rating}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">{vendor.vendor_name}</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Contact: <span className="font-semibold text-gray-800">{vendor.contact_person || 'N/A'}</span>
                  </p>

                  <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-50 pt-3">
                    <div>📞 {vendor.phone || 'No phone provided'}</div>
                    <div>✉️ {vendor.email || 'No email provided'}</div>
                    <div>📍 {vendor.address || 'Address on file'}</div>
                    <div className="text-[11px] text-gray-400 mt-1">Payment Terms: {vendor.payment_terms}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    APPROVED SUPPLIER
                  </span>
                  <button
                    onClick={() => {
                      setPoForm((prev) => ({ ...prev, vendor_name: vendor.vendor_name }));
                      setShowPOModal(true);
                    }}
                    className="text-xs font-semibold text-[#146ef5] hover:underline"
                  >
                    Create PO →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: ADD / EDIT STORE ITEM (SKU) */}
      {/* ==================================================================== */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {itemForm.id ? 'Edit Store Item SKU' : 'Register New Campus Store Item'}
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Olympus CX23 Compound Microscopes"
                  value={itemForm.item_name}
                  onChange={(e) => setItemForm({ ...itemForm, item_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate"
                    value={itemForm.sku}
                    onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="Science Laboratory">Science Laboratory</option>
                    <option value="ICT & Computer Hardware">ICT & Computer Hardware</option>
                    <option value="Examinations & Booklets">Examinations & Booklets</option>
                    <option value="General Stationery">General Stationery</option>
                    <option value="Hostel & Boarding">Hostel & Boarding</option>
                    <option value="Medical & Clinic Supplies">Medical & Clinic Supplies</option>
                    <option value="Sports Equipment">Sports Equipment</option>
                    <option value="Facility & Maintenance">Facility & Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    placeholder="Units, Cartons, Reams"
                    value={itemForm.unit}
                    onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity in Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={itemForm.quantity_in_stock}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, quantity_in_stock: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={itemForm.reorder_level}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, reorder_level: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-amber-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Unit Cost (NGN)</label>
                  <input
                    type="number"
                    min="0"
                    value={itemForm.unit_cost}
                    onChange={(e) => setItemForm({ ...itemForm, unit_cost: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Warehouse Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Store Shelf B4"
                    value={itemForm.location}
                    onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Supplier</label>
                <input
                  type="text"
                  placeholder="e.g. Finlab Nigeria Ltd"
                  value={itemForm.supplier_name}
                  onChange={(e) => setItemForm({ ...itemForm, supplier_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  {saving ? 'Saving...' : 'Save Store SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: LOG STOCK MOVEMENT (RESTOCK OR DISPATCH) */}
      {/* ==================================================================== */}
      {showMovementModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Log Store Stock Movement</h3>
              <button
                onClick={() => setShowMovementModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovement} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Movement Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementForm({ ...movementForm, movement_type: 'DISPATCH' })}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      movementForm.movement_type === 'DISPATCH'
                        ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    📦 Dispatch to Department
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementForm({ ...movementForm, movement_type: 'STOCK_IN' })}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      movementForm.movement_type === 'STOCK_IN'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    📥 Inflow / Restock Store
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Store Item *</label>
                <select
                  required
                  value={movementForm.item_id}
                  onChange={(e) => setMovementForm({ ...movementForm, item_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white font-medium"
                >
                  <option value="">-- Choose Store Item --</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.item_name} ({item.quantity_in_stock} {item.unit} in store) - {item.sku}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={movementForm.quantity}
                    onChange={(e) =>
                      setMovementForm({ ...movementForm, quantity: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Movement Date</label>
                  <input
                    type="date"
                    required
                    value={movementForm.movement_date}
                    onChange={(e) =>
                      setMovementForm({ ...movementForm, movement_date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Department</label>
                  <select
                    value={movementForm.department}
                    onChange={(e) => setMovementForm({ ...movementForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Ngozi Okafor"
                    value={movementForm.recipient_name}
                    onChange={(e) =>
                      setMovementForm({ ...movementForm, recipient_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Authorizing Official</label>
                <input
                  type="text"
                  value={movementForm.authorized_by}
                  onChange={(e) =>
                    setMovementForm({ ...movementForm, authorized_by: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notes / Reason for Movement</label>
                <textarea
                  rows={2}
                  placeholder="e.g. WAEC Practicals preparations or Routine science lab restock"
                  value={movementForm.notes}
                  onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  {saving ? 'Updating Ledger...' : 'Post Movement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: NEW PURCHASE REQUISITION */}
      {/* ==================================================================== */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">New Purchase Order Requisition</h3>
              <button
                onClick={() => setShowPOModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePO} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Requisition Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Titration Burettes & Lab Reagents"
                  value={poForm.title}
                  onChange={(e) => setPoForm({ ...poForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Requesting Dept</label>
                  <select
                    value={poForm.department}
                    onChange={(e) => setPoForm({ ...poForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Requested By *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Ibrahim Musa"
                    value={poForm.requested_by}
                    onChange={(e) => setPoForm({ ...poForm, requested_by: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Designated Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Finlab Nigeria Ltd"
                    value={poForm.vendor_name}
                    onChange={(e) => setPoForm({ ...poForm, vendor_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Estimated Cost (NGN)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={poForm.total_amount}
                    onChange={(e) => setPoForm({ ...poForm, total_amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Requisition Priority</label>
                  <select
                    value={poForm.priority}
                    onChange={(e) => setPoForm({ ...poForm, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white font-semibold"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent (Exam Critical)</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Needed By Date</label>
                  <input
                    type="date"
                    value={poForm.needed_by_date}
                    onChange={(e) => setPoForm({ ...poForm, needed_by_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Items Summary</label>
                <textarea
                  rows={2}
                  placeholder="Provide specifications: quantities, grade, catalog reference..."
                  value={poForm.items_summary}
                  onChange={(e) => setPoForm({ ...poForm, items_summary: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  {saving ? 'Submitting...' : 'Submit Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: ADD VENDOR */}
      {/* ==================================================================== */}
      {showVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Register Approved Supplier</h3>
              <button
                onClick={() => setShowVendorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Vendor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Slot Enterprise B2B"
                  value={vendorForm.vendor_name}
                  onChange={(e) => setVendorForm({ ...vendorForm, vendor_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Supply Category</label>
                  <input
                    type="text"
                    placeholder="e.g. ICT Hardware & Laptops"
                    value={vendorForm.category}
                    onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Chinedu Okafor"
                    value={vendorForm.contact_person}
                    onChange={(e) => setVendorForm({ ...vendorForm, contact_person: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+234 803 123 4567"
                    value={vendorForm.phone}
                    onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="sales@vendor.ng"
                    value={vendorForm.email}
                    onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Village, Ikeja, Lagos"
                  value={vendorForm.address}
                  onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowVendorModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  {saving ? 'Registering...' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: PRINTABLE STORE ISSUE VOUCHER & PO REQUISITION */}
      {/* ==================================================================== */}
      {printVoucher && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <PrinterIcon className="w-5 h-5 text-[#146ef5]" />
                <h3 className="text-base font-bold text-gray-900">
                  {printVoucher.type === 'PO'
                    ? 'Purchase Order Document'
                    : 'Store Issue & Dispatch Voucher'}
                </h3>
              </div>
              <button
                onClick={() => setPrintVoucher(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Document Sheet */}
            <div className="my-6 p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 space-y-4">
              <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">SCHOLARS ACADEMY</h2>
                  <p className="text-xs text-gray-500">Central Stores &amp; Procurement Logistics</p>
                  <p className="text-[11px] text-gray-400">Campus OS Official Document</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-100 text-[#146ef5]">
                    {printVoucher.type === 'PO'
                      ? printVoucher.data.po_number
                      : `SIV-${printVoucher.data.id?.slice(0, 8).toUpperCase()}`}
                  </span>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Date: {printVoucher.data.movement_date || new Date().toISOString().split('T')[0]}
                  </div>
                </div>
              </div>

              {printVoucher.type === 'PO' ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-gray-700">Requisition Title:</span>
                      <p className="text-gray-900 font-semibold">{printVoucher.data.title}</p>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Department:</span>
                      <p className="text-gray-900">{printVoucher.data.department}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-gray-700">Designated Vendor:</span>
                      <p className="text-gray-900">{printVoucher.data.vendor_name || 'TBD'}</p>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Total Approved Value:</span>
                      <p className="text-gray-900 font-bold text-sm">
                        ₦{Number(printVoucher.data.total_amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-gray-700">Item Specifications:</span>
                    <p className="text-gray-600 bg-white p-3 rounded-xl border border-gray-200 mt-1">
                      {printVoucher.data.items_summary}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-gray-700">Item Dispatched:</span>
                      <p className="text-gray-900 font-semibold text-sm">{printVoucher.data.item_name}</p>
                      <p className="font-mono text-gray-500 text-[11px]">SKU: {printVoucher.data.sku}</p>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Quantity Issued:</span>
                      <p className="text-gray-900 font-bold text-sm">{printVoucher.data.quantity} units</p>
                      <p className="text-gray-500 text-[11px]">Store Balance After: {printVoucher.data.balance_after}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-gray-700">Recipient Officer:</span>
                      <p className="text-gray-900 font-semibold">{printVoucher.data.recipient_name || 'Store Recipient'}</p>
                      <p className="text-gray-500 text-[11px]">{printVoucher.data.department}</p>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Authorized By:</span>
                      <p className="text-gray-900">{printVoucher.data.authorized_by}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Signatures Row */}
              <div className="pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center text-[10px] text-gray-500">
                <div className="border-t border-gray-400 pt-1">Storekeeper Signature</div>
                <div className="border-t border-gray-400 pt-1">Receiving Officer</div>
                <div className="border-t border-gray-400 pt-1">Bursar / Internal Audit</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setPrintVoucher(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-[#105bd1] transition-all flex items-center gap-1.5"
              >
                <PrinterIcon className="w-4 h-4" />
                Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
