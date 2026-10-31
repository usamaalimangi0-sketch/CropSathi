import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  User,
  Phone,
  MapPin,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sprout
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalReason, login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('Sukkur, Sindh');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        await login({
          phone_or_email: phoneOrEmail.trim(),
          password
        });
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        await register({
          phone_or_email: phoneOrEmail.trim(),
          full_name: fullName.trim(),
          district,
          password
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Authentication failed. Please check your credentials.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      // Try login as demo account or auto-register if first time
      const demoUser = {
        phone_or_email: '03001234567',
        password: 'KisanPassword123'
      };

      try {
        await login(demoUser);
      } catch (loginErr) {
        // If not registered yet, auto-register
        await register({
          phone_or_email: demoUser.phone_or_email,
          full_name: 'Usama Ali (Farmer)',
          district: 'Sukkur, Sindh',
          password: demoUser.password
        });
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || err.message || 'Demo sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Header Pattern */}
        <div className="bg-gradient-to-br from-agri-900 via-agri-800 to-emerald-900 text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                CropSathi Farmer ID
              </h2>
              <p className="text-xs text-emerald-200/90 font-medium">
                Unlock AI Diagnosis, Irrigation Advisory & Farm History
              </p>
            </div>
          </div>

          {/* Action Context Reason Banner */}
          <div className="mt-4 p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-emerald-100 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <span>{authModalReason}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            className={`py-2 rounded-xl transition ${
              tab === 'login'
                ? 'bg-white text-agri-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In (لاگ ان)
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            className={`py-2 rounded-xl transition ${
              tab === 'register'
                ? 'bg-white text-agri-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account (نیا اکاؤنٹ)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name (آپ کا نام)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Usama Ali"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-600 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Number or Email (موبائل نمبر یا ای میل)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. 03001234567 or farmer@cropsathi.pk"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-600 focus:bg-white"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Farming District (ضلع)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-600 focus:bg-white appearance-none"
                >
                  <option value="Sukkur, Sindh">Sukkur, Sindh</option>
                  <option value="Larkana, Sindh">Larkana, Sindh</option>
                  <option value="Hyderabad, Sindh">Hyderabad, Sindh</option>
                  <option value="Mirpur Khas, Sindh">Mirpur Khas, Sindh</option>
                  <option value="Multan, Punjab">Multan, Punjab</option>
                  <option value="Faisalabad, Punjab">Faisalabad, Punjab</option>
                  <option value="Bahawalpur, Punjab">Bahawalpur, Punjab</option>
                  <option value="Peshawar, KP">Peshawar, KP</option>
                  <option value="Quetta, Balochistan">Quetta, Balochistan</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password (پاس ورڈ)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-agri-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-agri-800 hover:bg-agri-900 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{tab === 'login' ? 'Sign In & Continue' : 'Create Free Account & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Login Option */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>1-Click Quick Demo Sign-In (فوری ٹیسٹ)</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Continue browsing UI as guest (Explore only)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
