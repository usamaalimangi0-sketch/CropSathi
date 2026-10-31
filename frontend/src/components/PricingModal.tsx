import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  Smartphone,
  Crown
} from 'lucide-react';

export const PricingModal: React.FC = () => {
  const { user, isPricingModalOpen, closePricingModal, updateUserProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'pro_monthly' | 'kisan_season_pass'>('pro_monthly');
  const [gateway, setGateway] = useState<'easypaisa' | 'jazzcash' | 'sadapay' | 'card'>('easypaisa');
  const [accountNumber, setAccountNumber] = useState(user?.phone_or_email || '03001234567');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isPricingModalOpen) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.subscribePlan({
        plan_id: selectedPlan,
        payment_gateway: gateway,
        account_number: accountNumber
      });

      if (res.success) {
        setSuccessMsg(res.message);
        if (res.user_summary) {
          updateUserProfile(res.user_summary);
        }
        setTimeout(() => {
          closePricingModal();
          setSuccessMsg(null);
        }, 2200);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Subscription processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-agri-950 via-agri-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={closePricingModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wide border border-emerald-400/30">
              <Crown className="w-3.5 h-3.5 text-emerald-300" />
              <span>Pakistani Farmer Subscription</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Upgrade to CropSathi Pro (کسان پرو پیکج)
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-lg">
            Unlimited AI Leaf Diagnoses, chemical spray dosage calculations per acre, and direct priority agronomist advice for your fields.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {successMsg ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">Mubarak! Subscription Activated</h3>
              <p className="text-xs text-emerald-800">{successMsg}</p>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Plan Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Pro Monthly */}
                <div
                  onClick={() => setSelectedPlan('pro_monthly')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
                    selectedPlan === 'pro_monthly'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                    Most Popular
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Kisan Pro Monthly</h4>
                  <div className="text-[11px] text-slate-500 font-urdu mb-2">ماہانہ پرو پلان</div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-2xl font-black text-slate-900">PKR 499</span>
                    <span className="text-xs text-slate-500 font-medium">/ month</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 mt-3 pt-3 border-t border-slate-100">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Unlimited</strong> AI Disease Scans</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Chemical Dosage Calculator</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Priority Urdu Chatbot Support</span>
                    </li>
                  </ul>
                </div>

                {/* Season Pass */}
                <div
                  onClick={() => setSelectedPlan('kisan_season_pass')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
                    selectedPlan === 'kisan_season_pass'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider">
                    Save 33%
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Season Harvest Pass</h4>
                  <div className="text-[11px] text-slate-500 font-urdu mb-2">سیزن ہارویسٹ پاس (6 ماہ)</div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-2xl font-black text-slate-900">PKR 1,999</span>
                    <span className="text-xs text-slate-500 font-medium">/ 6 months</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 mt-3 pt-3 border-t border-slate-100">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Full 6-Month Harvest Coverage</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Bank & Insurance Health Certificates</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Direct WhatsApp Priority Line</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Pakistani Payment Gateway Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Pakistani Payment Method (ادائیگی کا طریقہ)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'easypaisa', name: 'EasyPaisa', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                    { id: 'jazzcash', name: 'JazzCash', color: 'border-rose-500 bg-rose-50 text-rose-900' },
                    { id: 'sadapay', name: 'SadaPay', color: 'border-cyan-500 bg-cyan-50 text-cyan-900' },
                    { id: 'card', name: 'Debit / ATM', color: 'border-slate-500 bg-slate-50 text-slate-900' }
                  ].map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setGateway(gw.id as any)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                        gateway === gw.id
                          ? `${gw.color} shadow-xs`
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{gw.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Account Form */}
              <form onSubmit={handleSubscribe} className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {gateway === 'card' ? 'Card / Account Details' : `${gateway.toUpperCase()} Mobile Number`}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 03001234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Instant verification via mobile OTP / digital debit.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-agri-800 hover:bg-agri-900 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Pay PKR {selectedPlan === 'pro_monthly' ? '499' : '1,999'} & Unlock Pro Instantly</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
