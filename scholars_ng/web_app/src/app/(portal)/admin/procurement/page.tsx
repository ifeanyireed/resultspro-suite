
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

export default function ProcurementDashboard() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: '',
    category: 'Laboratory',
    unit: 'Units',
    quantity_in_stock: 25,
    reorder_level: 5,
    unit_cost: 45000,
    location: 'Central Campus Store',
    supplier_name: 'Finlab Nigeria Ltd'
  });

  const loadProcurement = async () => {
    try {
      const res = await api.get('/v1/campus/procurement');
      setInventory(res.data?.inventory || []);
      setRequests(res.data?.procurement_requests || []);
    } catch (err) {
      console.error('Failed to load tenant procurement data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProcurement();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/v1/campus/procurement', {
        ...newItem,
        quantity_in_stock: Number(newItem.quantity_in_stock),
        reorder_level: Number(newItem.reorder_level),
        unit_cost: Number(newItem.unit_cost)
      });
      setShowAddModal(false);
      setNewItem({
        item_name: '',
        category: 'Laboratory',
        unit: 'Units',
        quantity_in_stock: 25,
        reorder_level: 5,
        unit_cost: 45000,
        location: 'Central Campus Store',
        supplier_name: 'Finlab Nigeria Ltd'
      });
      await loadProcurement();
    } catch (err) {
      console.error('Failed to add inventory item:', err);
    }
  };

  const inventoryValue = inventory.reduce(
    (acc, item) => acc + Number(item.quantity_in_stock || 0) * Number(item.unit_cost || 0),
    0
  );
  const lowStockCount = inventory.filter((i) => i.status === 'LOW_STOCK').length;

  return (
    <>
      <MotionRise className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory & Procurement</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tenant-scoped store inventory, reorder thresholds, and purchase orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add Store Item
          </button>
        </div>
      </MotionRise>

      {showAddModal && (
        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-blue-200 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Campus Store Item</h3>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              required
              placeholder="Item Name"
              value={newItem.item_name}
              onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              placeholder="Category (e.g. Laboratory, ICT)"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="number"
              required
              placeholder="Quantity in Stock"
              value={newItem.quantity_in_stock}
              onChange={(e) => setNewItem({ ...newItem, quantity_in_stock: Number(e.target.value) })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="number"
              required
              placeholder="Unit Cost (NGN)"
              value={newItem.unit_cost}
              onChange={(e) => setNewItem({ ...newItem, unit_cost: Number(e.target.value) })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              placeholder="Supplier Name"
              value={newItem.supplier_name}
              onChange={(e) => setNewItem({ ...newItem, supplier_name: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <div className="flex items-center gap-2">
              <button type="submit" className="bg-[#146ef5] text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer">
                Save Item
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
            <h3 className="text-xl font-normal">Pending POs</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight mb-2">{requests.length}</h2>
            <p className="text-xs text-white/80">Active purchase orders</p>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Inventory Value</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-2">₦{inventoryValue.toLocaleString()}</h2>
            <p className="text-xs text-gray-500">Total asset valuation</p>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Low Stock Alerts</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{lowStockCount}</h2>
            <p className="text-xs text-amber-600 font-semibold">Below reorder threshold</p>
          </div>
        </MotionRise>

        <MotionRise className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">SKUs Tracked</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{inventory.length}</h2>
            <p className="text-xs text-gray-500">Store items persisted</p>
          </div>
        </MotionRise>
      </MotionStagger>

      <MotionRise delay={0.08} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Campus Store Inventory</h3>
          <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
            {loading ? 'Loading...' : `${inventory.length} SKUs`}
          </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Item & Location</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">In Stock</th>
              <th className="px-6 py-4">Unit Cost</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono font-bold text-[#146ef5]">{item.sku}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-sm text-gray-900">{item.item_name}</div>
                  <div className="text-xs text-gray-500">{item.location} · {item.supplier_name}</div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">{item.category}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.quantity_in_stock} {item.unit}</td>
                <td className="px-6 py-4 text-sm text-gray-700">₦{Number(item.unit_cost || 0).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.status === 'LOW_STOCK' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {item.status}
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
