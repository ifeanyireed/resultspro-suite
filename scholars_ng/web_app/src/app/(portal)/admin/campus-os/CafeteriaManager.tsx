'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BuildingStorefrontIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  CreditCardIcon,
  XMarkIcon,
  TrashIcon,
  QrCodeIcon,
  BanknotesIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { MotionRise } from '@/components/ScrollRiseProvider';
import api from '@/lib/api';

export interface CafeteriaWallet {
  id: string;
  tenant_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  card_rfid: string;
  balance: number;
  daily_limit: number;
  status: 'ACTIVE' | 'SUSPENDED' | string;
  last_top_up_amount: number;
  last_top_up_date: string;
  updated_at: string;
}

export interface CafeteriaTransaction {
  id: string;
  tenant_id: string;
  wallet_id: string;
  student_id: string;
  student_name: string;
  transaction_type: 'PURCHASE' | 'TOP_UP' | string;
  amount: number;
  balance_after: number;
  description: string;
  cashier_name: string;
  created_at: string;
}

export interface CafeteriaMenu {
  id: string;
  tenant_id: string;
  day_of_week: string;
  meal_time: 'BREAKFAST' | 'LUNCH' | 'DINNER' | string;
  menu_items: string;
  allergens: string;
  calorie_estimate: string;
}

export interface CafeteriaSummary {
  active_wallets: number;
  total_balance: number;
  today_pos_sales: number;
  scheduled_menus: number;
}

export type CafeteriaSubtab = 'overview' | 'wallets' | 'pos_sales' | 'menus';

export default function CafeteriaManager({
  initialSubtab = 'overview',
}: {
  initialSubtab?: CafeteriaSubtab;
}) {
  const [subtab, setSubtab] = useState<CafeteriaSubtab>(initialSubtab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [summary, setSummary] = useState<CafeteriaSummary>({
    active_wallets: 0,
    total_balance: 0,
    today_pos_sales: 0,
    scheduled_menus: 0,
  });
  const [wallets, setWallets] = useState<CafeteriaWallet[]>([]);
  const [transactions, setTransactions] = useState<CafeteriaTransaction[]>([]);
  const [menus, setMenus] = useState<CafeteriaMenu[]>([]);

  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showPosModal, setShowPosModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedWalletForAction, setSelectedWalletForAction] = useState<CafeteriaWallet | null>(null);

  // Form states
  const [newWallet, setNewWallet] = useState({
    student_name: '',
    class_name: 'JSS 2 Gold',
    card_rfid: '',
    daily_limit: 2500,
  });

  const [topupAmount, setTopupAmount] = useState(5000);
  const [posData, setPosData] = useState({
    amount: 750,
    description: 'Meat Pie (1) + Ribena Drink (1)',
    cashier_name: 'Tuck Shop Point-of-Sale',
  });

  const [newMenu, setNewMenu] = useState({
    day_of_week: 'Monday',
    meal_time: 'LUNCH',
    menu_items: 'Jollof Rice with Fried Plantain & Grilled Chicken breast',
    allergens: 'None',
    calorie_estimate: '680 kcal',
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api
        .get('/v1/campus/cafeteria')
        .catch(async () => await api.get('/campus/cafeteria'));

      if (res.data) {
        if (res.data.summary) setSummary(res.data.summary);
        setWallets(res.data.wallets || []);
        setTransactions(res.data.transactions || []);
        setMenus(res.data.menus || []);
      }
    } catch (err: any) {
      console.error('Failed to load cafeteria data:', err);
      setErrorMsg(err?.response?.data?.error || 'Failed to load cafeteria records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallet.student_name.trim()) {
      alert('Student name is required');
      return;
    }
    try {
      setSaving(true);
      await api.post('/v1/campus/cafeteria', {
        action: 'create_wallet',
        ...newWallet,
      });
      setShowWalletModal(false);
      setSuccessMsg('Student campus cashless wallet provisioned!');
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewWallet({
        student_name: '',
        class_name: 'JSS 2 Gold',
        card_rfid: '',
        daily_limit: 2500,
      });
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to create wallet');
    } finally {
      setSaving(false);
    }
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWalletForAction) return;
    try {
      setSaving(true);
      await api.post('/v1/campus/cafeteria', {
        action: 'topup_wallet',
        wallet_id: selectedWalletForAction.id,
        amount: topupAmount,
        description: `Bursary Top-Up for ${selectedWalletForAction.student_name}`,
      });
      setShowTopupModal(false);
      setSuccessMsg(`₦${topupAmount.toLocaleString()} credited to ${selectedWalletForAction.student_name}'s wallet!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Top-up failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePosPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWalletForAction) return;
    try {
      setSaving(true);
      await api.post('/v1/campus/cafeteria', {
        action: 'record_pos_transaction',
        wallet_id: selectedWalletForAction.id,
        ...posData,
      });
      setShowPosModal(false);
      setSuccessMsg(`Tuck shop purchase recorded! ₦${posData.amount.toLocaleString()} deducted.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Purchase failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/v1/campus/cafeteria', {
        action: 'save_menu',
        ...newMenu,
      });
      setShowMenuModal(false);
      setSuccessMsg('Meal menu item added to weekly roster!');
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to save menu');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm('Remove this menu item?')) return;
    try {
      await api.delete(`/v1/campus/cafeteria?id=${id}`);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete');
    }
  };

  const filteredWallets = wallets.filter((w) =>
    w.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.card_rfid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.class_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Alerts */}
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
              <BuildingStorefrontIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cafeteria, Dining Hall & Cashless Tuck Shop</h2>
              <p className="text-xs text-gray-500">
                Cashless student wallets, RFID card point-of-sale, weekly meal planning, and nutrition rosters.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWalletModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition shadow-sm cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Enroll Wallet
          </button>
          <button
            onClick={() => setShowMenuModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition shadow-sm cursor-pointer"
          >
            <CalendarDaysIcon className="w-4 h-4" /> Schedule Menu
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
          Cafeteria Overview
        </button>
        <button
          onClick={() => setSubtab('wallets')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'wallets'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Student Wallets ({wallets.length})
        </button>
        <button
          onClick={() => setSubtab('pos_sales')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'pos_sales'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Tuck Shop POS Transactions ({transactions.length})
        </button>
        <button
          onClick={() => setSubtab('menus')}
          className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition ${
            subtab === 'menus'
              ? 'bg-[#0D1060] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Meal Menus & Nutrition ({menus.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Active Student Wallets</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{summary.active_wallets}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Balance Floating</p>
          <p className="text-2xl font-bold text-[#146ef5] mt-1">₦{summary.total_balance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Today&apos;s Tuck Shop Sales</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">₦{summary.today_pos_sales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Scheduled Menus</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{summary.scheduled_menus}</p>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {subtab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Cashless POS Feed */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <BanknotesIcon className="w-4 h-4 text-[#146ef5]" /> Recent Tuck Shop Tap Purchases
            </h3>
            {transactions.filter((t) => t.transaction_type === 'PURCHASE').length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                No tuck shop purchases logged today.
              </p>
            ) : (
              <div className="space-y-3">
                {transactions
                  .filter((t) => t.transaction_type === 'PURCHASE')
                  .slice(0, 5)
                  .map((t) => (
                    <div key={t.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{t.student_name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{t.cashier_name}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{t.description}</p>
                        <p className="text-[10px] text-gray-400">Balance after: ₦{t.balance_after.toLocaleString()} · {t.created_at}</p>
                      </div>
                      <span className="font-bold text-sm text-rose-600">-₦{t.amount.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Today's Dining Menu */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4 text-emerald-600" /> Dining Hall Meal Schedule
            </h3>
            {menus.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center italic">
                No meal menus published. Click &quot;Schedule Menu&quot; to post daily meals.
              </p>
            ) : (
              <div className="space-y-3">
                {menus.map((m) => (
                  <div key={m.id} className="p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{m.day_of_week}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          {m.meal_time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1">{m.menu_items}</p>
                      <p className="text-[10px] text-gray-400">Allergens: {m.allergens} · {m.calorie_estimate}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteRecord(m.id)}
                      className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Wallets */}
      {subtab === 'wallets' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or RFID tag..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#146ef5]"
              />
            </div>
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition cursor-pointer"
            >
              + Enroll New Student Wallet
            </button>
          </div>

          {filteredWallets.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              No student cashless wallets found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Student & Class</th>
                    <th className="py-3 px-4">RFID Tag / Card</th>
                    <th className="py-3 px-4">Current Balance</th>
                    <th className="py-3 px-4">Daily Spend Limit</th>
                    <th className="py-3 px-4">Last Top-Up</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredWallets.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <div>{w.student_name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{w.class_name}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">{w.card_rfid || 'Unassigned RFID'}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600 text-sm">
                        ₦{w.balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">₦{w.daily_limit.toLocaleString()} / day</td>
                      <td className="py-3 px-4 text-gray-500">
                        {w.last_top_up_amount > 0 ? (
                          <div>
                            <div>+₦{w.last_top_up_amount.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-400">{w.last_top_up_date}</div>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => {
                            setSelectedWalletForAction(w);
                            setShowTopupModal(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold hover:bg-emerald-100 cursor-pointer"
                        >
                          Top-Up
                        </button>
                        <button
                          onClick={() => {
                            setSelectedWalletForAction(w);
                            setShowPosModal(true);
                          }}
                          className="px-2.5 py-1 bg-blue-50 text-[#146ef5] border border-blue-200 rounded-full text-[10px] font-bold hover:bg-blue-100 cursor-pointer"
                        >
                          POS Tap
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Transactions */}
      {subtab === 'pos_sales' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Tuck Shop POS Audit Trail</h3>
          </div>

          {transactions.length === 0 ? (
            <p className="text-xs text-gray-400 py-12 text-center italic">
              No transactions recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">New Balance</th>
                    <th className="py-3 px-4">Cashier</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">{t.student_name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.transaction_type === 'TOP_UP'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {t.transaction_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{t.description}</td>
                      <td className={`py-3 px-4 font-bold ${t.transaction_type === 'TOP_UP' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.transaction_type === 'TOP_UP' ? '+' : '-'}₦{t.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">₦{t.balance_after.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-500">{t.cashier_name}</td>
                      <td className="py-3 px-4 text-gray-400 text-[10px]">{t.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Menus */}
      {subtab === 'menus' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Weekly Boarding & Day Student Meal Schedule</h3>
            <button
              onClick={() => setShowMenuModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition cursor-pointer"
            >
              + Add Menu Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menus.map((m) => (
              <div key={m.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/40 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs">{m.day_of_week}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {m.meal_time}
                  </span>
                </div>
                <p className="text-xs text-gray-800 font-medium mt-2">{m.menu_items}</p>
                <div className="mt-3 text-[10px] text-gray-500 space-y-0.5 border-t border-gray-200 pt-2 flex justify-between items-center">
                  <span>Allergens: {m.allergens} · {m.calorie_estimate}</span>
                  <button
                    onClick={() => handleDeleteRecord(m.id)}
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

      {/* Modal 1: Enroll Wallet */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Enroll Student Cashless Wallet</h3>
              <button onClick={() => setShowWalletModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateWallet} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newWallet.student_name}
                  onChange={(e) => setNewWallet({ ...newWallet, student_name: e.target.value })}
                  placeholder="e.g. Uchechukwu Eze"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Class</label>
                  <input
                    type="text"
                    value={newWallet.class_name}
                    onChange={(e) => setNewWallet({ ...newWallet, class_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Daily Spend Limit (₦)</label>
                  <input
                    type="number"
                    value={newWallet.daily_limit}
                    onChange={(e) => setNewWallet({ ...newWallet, daily_limit: parseInt(e.target.value) || 2500 })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">RFID Smart Card ID / Barcode</label>
                <input
                  type="text"
                  value={newWallet.card_rfid}
                  onChange={(e) => setNewWallet({ ...newWallet, card_rfid: e.target.value })}
                  placeholder="e.g. RFID-8829401"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWalletModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer"
                >
                  {saving ? 'Creating...' : 'Enroll Wallet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Wallet Top-Up */}
      {showTopupModal && selectedWalletForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Top-Up Student Wallet</h3>
              <button onClick={() => setShowTopupModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleTopup} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                <p className="font-bold text-gray-900">{selectedWalletForAction.student_name}</p>
                <p className="text-gray-500">{selectedWalletForAction.class_name} · Balance: ₦{selectedWalletForAction.balance.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Top-Up Credit Amount (₦) *</label>
                <input
                  type="number"
                  required
                  min={100}
                  step={500}
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5] text-base font-bold text-emerald-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopupModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  {saving ? 'Crediting...' : 'Confirm Credit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: POS Purchase */}
      {showPosModal && selectedWalletForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Tuck Shop POS Tap Checkout</h3>
              <button onClick={() => setShowPosModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePosPurchase} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                <p className="font-bold text-gray-900">{selectedWalletForAction.student_name}</p>
                <p className="text-gray-500">Available Balance: ₦{selectedWalletForAction.balance.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Purchased Item(s) Description *</label>
                <input
                  type="text"
                  required
                  value={posData.description}
                  onChange={(e) => setPosData({ ...posData, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Total Amount (₦) *</label>
                <input
                  type="number"
                  required
                  min={50}
                  value={posData.amount}
                  onChange={(e) => setPosData({ ...posData, amount: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5] text-base font-bold text-rose-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPosModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || selectedWalletForAction.balance < posData.amount}
                  className="px-5 py-2 bg-[#146ef5] text-white rounded-full font-semibold hover:bg-blue-600 transition cursor-pointer disabled:bg-gray-300"
                >
                  {saving ? 'Processing...' : 'Complete Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Schedule Menu */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-base">Schedule Dining Hall Meal</h3>
              <button onClick={() => setShowMenuModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Day of Week</label>
                  <select
                    value={newMenu.day_of_week}
                    onChange={(e) => setNewMenu({ ...newMenu, day_of_week: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Meal Time</label>
                  <select
                    value={newMenu.meal_time}
                    onChange={(e) => setNewMenu({ ...newMenu, meal_time: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Menu Items & Sides *</label>
                <textarea
                  required
                  rows={2}
                  value={newMenu.menu_items}
                  onChange={(e) => setNewMenu({ ...newMenu, menu_items: e.target.value })}
                  placeholder="e.g. Fried Rice with Chicken & Coleslaw"
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Allergens</label>
                  <input
                    type="text"
                    value={newMenu.allergens}
                    onChange={(e) => setNewMenu({ ...newMenu, allergens: e.target.value })}
                    placeholder="e.g. None / Fish / Nuts"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Est. Calories</label>
                  <input
                    type="text"
                    value={newMenu.calorie_estimate}
                    onChange={(e) => setNewMenu({ ...newMenu, calorie_estimate: e.target.value })}
                    placeholder="e.g. 650 kcal"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#146ef5]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMenuModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Add to Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
