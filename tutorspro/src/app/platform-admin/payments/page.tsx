"use client";

import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getPayments, updatePaymentStatus } from '@/lib/platform.api';

interface Transaction {
  id: string;
  user: string;
  type: string;
  amount: string;
  status: string;
  date: string;
}

export default function PaymentOperations() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const data = await getPayments();
      setTransactions(data);
    } catch (error) {
      toast.error("Failed to load payments.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateStatus = async (paymentId: string, status: string) => {
    const toastId = toast.loading(`Updating payment ${paymentId}...`);
    try {
      const response = await updatePaymentStatus(paymentId, status);
      toast.success(response.message || 'Payment status updated!', { id: toastId });
      fetchPayments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update payment status.', { id: toastId });
    }
  };

  return (
    <main className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Payment Operations</h1>
            <p className="text-gray-400">Monitor platform revenue, manage payouts, and handle billing adjustments.</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction ID</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">User / Entity</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-20 text-gray-500">Loading transactions...</td></tr>
              ) : (
                transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="px-8 py-6 text-sm font-mono text-gray-400 group-hover:text-green transition-colors">{tx.id}</td>
                  <td className="px-8 py-6">
                    <div className="text-white font-bold">{tx.user}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-tight">{tx.date}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-gray-400">{tx.type}</span>
                  </td>
                  <td className={`px-8 py-6 font-bold ${tx.amount.startsWith('-') ? 'text-rose' : 'text-white'}`}>
                    {tx.amount}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {tx.status === 'Completed' && <CheckCircle2 className="w-4 h-4 text-green" />}
                       {tx.status === 'Pending' && <Clock className="w-4 h-4 text-amber" />}
                       {tx.status === 'Processing' && <Clock className="w-4 h-4 text-blue" />}
                       {tx.status === 'Failed' && <XCircle className="w-4 h-4 text-rose" />}
                       <span className={`text-xs font-bold uppercase tracking-widest ${
                         tx.status === 'Completed' ? 'text-green' : tx.status === 'Failed' ? 'text-rose' : 'text-gray-500'
                       }`}>
                         {tx.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleUpdateStatus(tx.id, 'Completed')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
