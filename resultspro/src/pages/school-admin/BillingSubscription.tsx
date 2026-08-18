import React, { useState, useEffect } from 'react';
import { IconCheckCircle as CheckCircle, IconCreditCard as CreditCard, IconAlertCircle as AlertCircle, IconCheck as Check, IconRefreshCw as RefreshCw, IconArrowUpCircle as ArrowUpCircle, IconFileText as FileText, IconUsers as Users, IconX as X } from '@tabler/icons-react';
import { LoadingSpinner, InlineLoadingSpinner } from '@/components/LoadingSpinner';
import axiosInstance from '@/lib/axiosConfig';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface Plan {
  id: string;
  name: string;
  priceNGN: number;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
  isPopular: boolean;
}

interface Subscription {
  id: string;
  planName: string;
  planId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  isAutoRenew: boolean;
  daysRemaining: number;
  isExpiring: boolean;
  maxStudents: number;
  maxTeachers: number;
}

interface UsageMetric {
  used: number;
  limit: number;
  percentage: number;
  isAtLimit: boolean;
  remaining: number;
  termName?: string;
}

interface UsageData {
  students: UsageMetric;
  teachers: UsageMetric;
  results: UsageMetric;
  plan: any;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  planName: string;
  billingPeriod: string;
  totalAmount: number;
  status: string;
  paidAt: string;
  dueDate: string;
}

const BillingSubscription: React.FC = () => {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'term' | 'year'>('term');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [subRes, historyRes, usageRes, plansRes] = await Promise.all([
        axiosInstance.get('/payment/subscription/active'),
        axiosInstance.get('/payment/subscription/billing-history'),
        axiosInstance.get('/payment/subscription/usage'),
        axiosInstance.get('/payment/plans'),
      ]).catch(error => {
        console.log('Some subscription data not available:', error.message);
        return [null, null, null, null];
      });

      if (subRes?.data?.data) {
        setCurrentSubscription(subRes.data.data);
      }

      if (historyRes?.data?.data) {
        setInvoices(historyRes.data.data);
      }

      if (usageRes?.data?.data) {
        setUsage(usageRes.data.data);
      }

      if (plansRes?.data?.data) {
        const parsedPlans = plansRes.data.data.map((p: any) => ({
          ...p,
          features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
        }));
        setPlans(parsedPlans);
      }
    } catch (error: any) {
      console.error('Error fetching subscription data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load billing information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);
      await axiosInstance.post('/payment/subscription/cancel', { reason: cancelReason });

      toast({
        title: 'Success',
        description: 'Subscription cancelled successfully',
      });

      setShowCancelModal(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to cancel subscription',
        variant: 'destructive',
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleUpgrade = async (plan: Plan) => {
    try {
      setUpgrading(true);
      const amount = billingPeriod === 'year' ? plan.priceNGN * 3 : plan.priceNGN; 
      const response = await axiosInstance.post('/payment/initialize', {
        planId: plan.id,
        planName: plan.name,
        amount: amount,
        billingPeriod: billingPeriod === 'year' ? 'year' : 'term'
      });

      if (response.data.success && response.data.data.authorizationUrl) {
        window.location.href = response.data.data.authorizationUrl;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate upgrade',
        variant: 'destructive',
      });
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Billing & Subscription</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your academic plan and billing information</p>
        </div>
        <Button 
          onClick={() => setShowUpgradeModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-12 rounded-xl"
        >
          <ArrowUpCircle className="w-4 h-4 mr-2" />
          Manage Plan
        </Button>
      </div>

      {/* Current Plan Card */}
      {currentSubscription ? (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-[30px] border border-blue-400/20 p-8 shadow-2xl text-white">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-3xl font-black text-white">{currentSubscription.planName}</h3>
                <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 font-bold text-[10px] uppercase tracking-widest border border-blue-500/30">
                  Current
                </span>
              </div>
              <p className="text-gray-400 font-medium">Your school is running on the {currentSubscription.planName} infrastructure.</p>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <span className="px-4 py-2 bg-green-400/20 rounded-xl text-green-400 font-bold text-sm border border-green-400/30">
                {currentSubscription.status}
              </span>
              {currentSubscription.isExpiring && (
                <span className="px-4 py-2 bg-orange-400/20 rounded-xl text-orange-400 font-bold text-xs border border-orange-400/30 animate-pulse">
                  Expires soon
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1 text-left">Started</p>
              <p className="text-lg font-bold text-white text-left">
                {new Date(currentSubscription.startDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1 text-left">Expires</p>
              <p className="text-lg font-bold text-white text-left">
                {currentSubscription.endDate ? new Date(currentSubscription.endDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1 text-left">Time Left</p>
              <p className={`text-lg font-bold text-left ${currentSubscription.daysRemaining !== null && currentSubscription.daysRemaining <= 7 ? 'text-orange-400' : 'text-blue-400'}`}>
                {currentSubscription.daysRemaining !== null ? `${currentSubscription.daysRemaining} days` : 'Unlimited'}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1 text-left">Auto-renew</p>
              <p className="text-lg font-bold text-white text-left">{currentSubscription.isAutoRenew ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {currentSubscription.planName !== 'Free' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-bold text-sm transition-all"
              >
                Cancel Subscription
              </button>
            )}
            <button 
              onClick={fetchData}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-bold text-sm transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Check for Updates
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-500/5 rounded-[30px] border border-yellow-400/20 p-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-500">No Active Subscription</h3>
            <p className="text-yellow-300/60 font-medium mt-1">You're currently on the Free plan. Upgrade to access premium features like Scratch Cards and SMS.</p>
          </div>
        </div>
      )}

      {/* Usage Summary */}
      {usage && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-xl font-bold text-white">Academic Usage & Limits</h3>
              <p className="text-sm text-gray-500 mt-1 text-left">Real-time capacity tracking for the {usage.plan.planName} plan</p>
            </div>
            {usage.results.termName && (
              <div className="px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">{usage.results.termName}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-white font-bold">Students</p>
                </div>
                <p className="text-sm font-black text-white">
                  {usage.students.used} <span className="text-gray-500">/ {usage.students.limit}</span>
                </p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${usage.students.isAtLimit ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : usage.students.percentage >= 90 ? 'bg-orange-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(usage.students.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-left">
                <p className={usage.students.isAtLimit ? 'text-red-400' : 'text-gray-500'}>
                  {usage.students.percentage}% CAPACITY USED
                </p>
                <p className="text-gray-400 text-right">{usage.students.remaining} AVAILABLE</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-white font-bold">Staff Members</p>
                </div>
                <p className="text-sm font-black text-white">
                  {usage.teachers.used} <span className="text-gray-500">/ {usage.teachers.limit}</span>
                </p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${usage.teachers.isAtLimit ? 'bg-red-500' : usage.teachers.percentage >= 90 ? 'bg-orange-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(usage.teachers.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-left">
                <p className={usage.teachers.isAtLimit ? 'text-red-400' : 'text-gray-500'}>
                  {usage.teachers.percentage}% CAPACITY USED
                </p>
                <p className="text-gray-400 text-right">{usage.teachers.remaining} AVAILABLE</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-white font-bold">Results Per Term</p>
                </div>
                <p className="text-sm font-black text-white">
                  {usage.results.used} <span className="text-gray-500">/ {usage.results.limit}</span>
                </p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${usage.results.isAtLimit ? 'bg-red-500' : usage.results.percentage >= 90 ? 'bg-orange-500' : 'bg-purple-500'}`}
                  style={{ width: `${Math.min(usage.results.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-left">
                <p className={usage.results.isAtLimit ? 'text-red-400' : 'text-gray-500'}>
                  {usage.results.percentage}% TERM LIMIT USED
                </p>
                <p className="text-gray-400 text-right">{usage.results.remaining} STUDENT SPOTS</p>
              </div>
            </div>
          </div>
          
          {(usage.students.isAtLimit || usage.teachers.isAtLimit || usage.results.isAtLimit) && (
            <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-4 items-center">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold">Plan Limit Exceeded</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  You have reached your {usage.plan.planName} plan capacity. Please upgrade to a higher tier to continue adding data or processing results.
                </p>
              </div>
              <Button 
                onClick={() => setShowUpgradeModal(true)}
                className="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl"
              >
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Payment Method */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Payment Method</h3>
          <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">Edit Details</button>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white/2.5 rounded-2xl border border-white/5">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
            <CreditCard className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-lg">Paystack Payment Gateway</p>
            <p className="text-gray-500 text-sm">Automated and secure payment processing for Nigerian schools.</p>
          </div>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden shadow-xl text-white">
        <div className="p-8 border-b border-white/5 bg-white/2.5">
          <h3 className="text-lg font-bold text-white text-left">Billing History</h3>
        </div>
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5 bg-white/2.5">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium uppercase text-[10px] tracking-widest">Invoice</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium uppercase text-[10px] tracking-widest">Plan</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium uppercase text-[10px] tracking-widest">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium uppercase text-[10px] tracking-widest">Period</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium uppercase text-[10px] tracking-widest">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium uppercase text-[10px] tracking-widest text-right">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-mono text-xs text-left">{invoice.invoiceNumber}</td>
                    <td className="py-4 px-6 text-white font-bold text-left">{invoice.planName}</td>
                    <td className="py-4 px-6 text-white font-black text-left">₦{invoice.totalAmount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-left">
                      <span className="text-gray-400 text-xs px-2 py-1 bg-white/5 rounded-md">
                        {invoice.billingPeriod.charAt(0).toUpperCase() + invoice.billingPeriod.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          invoice.status === 'PAID'
                            ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                            : 'bg-orange-400/10 text-orange-400 border border-orange-400/20'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-right">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 bg-white/2.5 italic">
            No transaction history available yet.
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-xl">
          <div className="bg-[#0a0a0a] rounded-[40px] border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-y-auto p-10 shadow-[0_0_100px_rgba(59,130,246,0.15)] relative text-white">
            <div className="flex justify-between items-start mb-12">
              <div className="text-left">
                <h3 className="text-4xl font-black text-white">Upgrade Academic Capacity</h3>
                <p className="text-gray-400 mt-2 text-lg">Scale your school's data processing power with our premium plans.</p>
              </div>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 transition-all border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const isCurrent = currentSubscription?.planId === plan.id || 
                                 (currentSubscription?.planName?.toLowerCase() === plan.name?.toLowerCase());
                const isExpired = currentSubscription && new Date(currentSubscription.endDate) < new Date() && currentSubscription.planName !== 'Free';
                
                return (
                  <div 
                    key={plan.id}
                    className={`relative p-8 rounded-[35px] border-2 transition-all flex flex-col group text-left ${
                      isCurrent 
                        ? 'border-blue-500/50 bg-blue-500/5 ring-4 ring-blue-500/10' 
                        : plan.isPopular 
                          ? 'border-purple-500 bg-purple-500/5 shadow-[0_0_40px_rgba(168,85,247,0.1)]' 
                          : 'border-white/10 bg-white/2.5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-purple-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg">
                        Recommended
                      </span>
                    )}
                    <div className="mb-8">
                      <h4 className="text-2xl font-black text-white mb-4">{plan.name}</h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white">₦{plan.priceNGN.toLocaleString()}</span>
                        <span className="text-gray-500 font-bold text-sm">/term</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10 flex-1">
                      <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                          <Check className="w-3 h-3 text-blue-400" />
                        </div>
                        <span>Up to <span className="text-white font-black">{plan.maxStudents.toLocaleString()}</span> Students</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                          <Check className="w-3 h-3 text-blue-400" />
                        </div>
                        <span>Up to <span className="text-white font-black">{plan.maxTeachers}</span> Staff Members</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                          <Check className="w-3 h-3 text-purple-400" />
                        </div>
                        <span className="text-white font-black">{plan.maxStudents.toLocaleString()}</span> processed per term
                      </div>
                      
                      <div className="h-px bg-white/5 my-4" />
                      
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-[13px] text-gray-400">
                          <CheckCircle className="w-4 h-4 text-gray-600 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      disabled={(isCurrent && !isExpired) || upgrading}
                      onClick={() => handleUpgrade(plan)}
                      className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                        isCurrent && !isExpired
                          ? 'bg-blue-500/20 text-blue-400 cursor-default border border-blue-500/30' 
                          : 'bg-white text-black hover:bg-gray-200'
                      }`}
                    >
                      {isCurrent 
                        ? (isExpired ? 'Renew Now' : 'Active Plan') 
                        : upgrading ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-gray-900 rounded-[30px] border border-red-500/20 p-10 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 text-left">Cancel Plan?</h3>
            <p className="text-gray-400 mb-8 leading-relaxed font-medium text-left">
              Your school will be downgraded to the <span className="text-white font-bold">Free Plan</span> immediately. All premium data processing limits will be applied.
            </p>

            <textarea
              placeholder="Tell us why you're cancelling (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 text-sm mb-6 resize-none outline-none focus:border-red-500/50 transition-all"
              rows={3}
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all border border-white/10 disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <InlineLoadingSpinner size="sm" />
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSubscription;
