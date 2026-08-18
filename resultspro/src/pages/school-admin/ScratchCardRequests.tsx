import React, { useState, useEffect } from 'react';
import { IconPlus as Plus, IconSend as Send, IconX as X, IconAlertCircle as AlertCircle, IconCheckCircle as CheckCircle, IconCreditCard as CreditCard, IconLoader2 as Loader2, IconInfo as Info, IconTrendingDown as TrendingDown } from '@tabler/icons-react';
import { toast } from 'sonner';

interface BatchRequest {
  id: string;
  quantity: number;
  reason?: string;
  status: string;
  requestedAt: string;
  approvedAt?: string;
  batch?: { batchCode: string };
  payment?: {
    amount: number;
    status: string;
  };
}

interface RequestStats {
  total: number;
  pending: number;
  paid: number;
  approved: number;
  rejected: number;
  delivered: number;
}

interface CostBreakdown {
  quantity: number;
  unitPrice: number;
  total: number;
  tax: number;
  fees: number;
}

const ScratchCardRequests: React.FC = () => {
  const [requests, setRequests] = useState<BatchRequest[]>([]);
  const [stats, setStats] = useState<RequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [quantity, setQuantity] = useState('100');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [payingRequestId, setPayingRequestId] = useState<string | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);
  const [loadingCost, setLoadingCost] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  // Calculate cost when quantity changes
  useEffect(() => {
    const qty = parseInt(quantity);
    if (qty > 0) {
      calculateCost(qty);
    } else {
      setCostBreakdown(null);
    }
  }, [quantity]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/school/scratch-cards/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data.requests);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = async (qty: number) => {
    try {
      setLoadingCost(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/school/scratch-cards/calculate-cost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: qty })
      });
      const data = await res.json();
      if (data.success) {
        setCostBreakdown(data.data);
      }
    } catch (error) {
      console.error('Error calculating cost:', error);
    } finally {
      setLoadingCost(false);
    }
  };

  const handleCreateAndPay = async () => {
    if (!quantity || parseInt(quantity) < 1) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/school/scratch-cards/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: parseInt(quantity),
          reason: reason || undefined,
          payNow: true
        })
      });

      const data = await res.json();
      if (data.success && data.data.paymentUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = data.data.paymentUrl;
      } else if (data.success) {
        toast.success('Request submitted');
        setShowRequestModal(false);
        fetchRequests();
      } else {
        toast.error(data.error || 'Failed to process request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to process request');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async (requestId: string) => {
    try {
      setPayingRequestId(requestId);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/school/scratch-cards/requests/${requestId}/pay`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        toast.error(data.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error('Failed to initialize payment');
    } finally {
      setPayingRequestId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-300';
      case 'PAID': return 'bg-purple-500/20 text-purple-300';
      case 'APPROVED': return 'bg-blue-500/20 text-blue-300';
      case 'DELIVERED': return 'bg-green-500/20 text-green-300';
      case 'REJECTED': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (loading && requests.length === 0) return <div className="flex justify-center items-center p-8 text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Scratch Card Requests</h1>
          <p className="text-gray-400">Submit and track your card requests</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Paid</p>
            <p className="text-2xl font-bold text-purple-400">{stats.paid}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Approved</p>
            <p className="text-2xl font-bold text-blue-400">{stats.approved}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </div>
        </div>
      )}

      {/* Requests Table */}
      <div className="rounded-[20px] border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Request Date</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Quantity</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Amount</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Action / Batch</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 text-white">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-white font-medium">{request.quantity}</td>
                  <td className="py-4 px-6 text-white font-medium">
                    {request.payment ? `₦${request.payment.amount.toLocaleString()}` : 'Calculating...'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {request.status === 'PENDING' ? (
                      <button
                        onClick={() => handlePay(request.id)}
                        disabled={payingRequestId === request.id}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {payingRequestId === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-white font-mono">
                        {request.batch?.batchCode || '-'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">No requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-[20px] border border-white/10 p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Request Scratch Cards</h3>
              <button onClick={() => setShowRequestModal(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantity Needed</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    max="5000"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reason (Optional)</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    rows={2}
                    placeholder="Why do you need these cards?"
                  />
                </div>

                {/* Tiered Pricing Info */}
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-3 text-blue-400">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">Tiered Pricing</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-gray-400">1 - 99 cards</span>
                    <span className="text-white text-right font-medium">₦500 / card</span>
                    <span className="text-gray-400">100 - 249 cards</span>
                    <span className="text-white text-right font-medium text-green-400">₦450 / card</span>
                    <span className="text-gray-400">250 - 499 cards</span>
                    <span className="text-white text-right font-medium text-green-400">₦400 / card</span>
                    <span className="text-gray-400">500 - 999 cards</span>
                    <span className="text-white text-right font-medium text-green-400">₦350 / card</span>
                    <span className="text-gray-400">1,000+ cards</span>
                    <span className="text-white text-right font-medium text-green-400">₦300 / card</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Payment Breakdown</label>
                
                {costBreakdown ? (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cards ({costBreakdown.quantity} × ₦{costBreakdown.unitPrice})</span>
                      <span className="text-white font-medium">₦{(costBreakdown.quantity * costBreakdown.unitPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1">VAT (7.5%) <Info className="w-3 h-3 cursor-help" /></span>
                      <span className="text-white">₦{costBreakdown.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1">Transaction Charges <Info className="w-3 h-3 cursor-help" /></span>
                      <span className="text-white">₦{costBreakdown.fees.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Grand Total</p>
                          <p className="text-3xl font-black text-blue-500">₦{costBreakdown.total.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">
                            SAVE ₦{((500 - costBreakdown.unitPrice) * costBreakdown.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : loadingCost ? (
                  <div className="h-48 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-gray-500 italic text-sm">
                    Enter quantity to see breakdown
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAndPay}
                    disabled={submitting || loadingCost || !costBreakdown}
                    className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                    Pay Now ₦{costBreakdown?.total.toLocaleString() || ''}
                  </button>
                </div>
                
                <p className="text-[10px] text-center text-gray-500">
                  Secure payment powered by <b>Paystack</b>. Cards are generated instantly after admin approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchCardRequests;
