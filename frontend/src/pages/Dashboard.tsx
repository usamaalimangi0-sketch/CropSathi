import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ScanListItem, SystemHealth, AiHealth } from '../types';
import {
  Camera,
  MessageSquare,
  CloudRain,
  History,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Leaf,
  Droplets,
  Sun,
  Activity
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [recentScans, setRecentScans] = useState<ScanListItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [aiHealth, setAiHealth] = useState<AiHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.getScans({ limit: 4 }).catch(() => ({ total: 0, items: [] })),
      api.getHealth().catch(() => null),
      api.getAiHealth().catch(() => null),
    ]).then(([scansData, healthData, aiData]) => {
      if (mounted) {
        setRecentScans(scansData.items || []);
        setSystemHealth(healthData);
        setAiHealth(aiData);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agri-900 via-agri-800 to-agri-950 text-white shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-agri-700/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 sm:px-10 sm:py-16 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-800/80 border border-agri-600/50 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>DITE Hackathon 2026–27 • Hyderabad, Pakistan</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              CropSathi AI
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100 font-medium">
              Smart Farming. Healthier Crops. Better Decisions.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              An intelligent agriculture assistant designed for Pakistani farmers. Upload a crop leaf photo to identify potential diseases, understand causes, and receive practical care guidance in English or Urdu.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link
                to="/diagnose"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <Camera className="w-5 h-5 text-slate-950" />
                Diagnose My Crop
              </Link>
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3.5 rounded-xl backdrop-blur-xs border border-white/15 transition text-sm sm:text-base"
              >
                <MessageSquare className="w-5 h-5" />
                Ask Farming Assistant
              </Link>
            </div>
          </div>

          {/* Quick Upload Teaser Card */}
          <div className="w-full sm:w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span className="font-semibold uppercase tracking-wider">Quick Scan</span>
              <span className="bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-md text-[10px]">Real AI</span>
            </div>

            <div
              onClick={() => navigate('/diagnose')}
              className="border-2 border-dashed border-white/30 hover:border-emerald-400 rounded-xl p-6 text-center cursor-pointer transition group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-white">Click to Upload Leaf Photo</p>
              <p className="text-[11px] text-slate-300 mt-1">JPEG, PNG, WebP up to 8MB</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
              <span>🌾 Cotton, Wheat, Rice, Veggies</span>
              <span className="font-semibold text-amber-300">Free & Fast</span>
            </div>
          </div>
        </div>
      </section>

      {/* System Status & Key Indicators */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Backend Connectivity */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Service Health</div>
            <div className="text-sm font-bold text-slate-800">
              {systemHealth?.status === 'online' ? 'FastAPI Backend Online' : 'Connecting...'}
            </div>
          </div>
        </div>

        {/* AI Model Ready */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${aiHealth?.is_configured ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            {aiHealth?.is_configured ? <Sparkles className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Vision Model</div>
            <div className="text-sm font-bold text-slate-800">
              {aiHealth?.is_configured ? `Gemini Active (${aiHealth.model})` : 'Awaiting API Key'}
            </div>
          </div>
        </div>

        {/* Database Persistence */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Local Storage</div>
            <div className="text-sm font-bold text-slate-800">
              SQLite Database Connected
            </div>
          </div>
        </div>

      </section>

      {/* Feature Pillar Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-agri-50 text-agri-700 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Leaf Diagnosis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload close-up photos of suspected crop leaves. Multimodal vision models detect fungal spots, viruses, pests, and nutrient deficiencies with objective reasoning.
            </p>
          </div>
          <Link
            to="/diagnose"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-agri-700 hover:text-agri-800"
          >
            Start Diagnosis <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multilingual Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask agronomical questions in Urdu (اردو) or English. Get contextual guidance for fertilizer schedules, organic pest control, and seasonal crop care.
            </p>
          </div>
          <Link
            to="/assistant"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Chat with Assistant <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Smart Irrigation Advisor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Combines live Open-Meteo agro-meteorology data (heat stress, rainfall, soil moisture) with crop stage to calculate water intervals for Pakistani agricultural districts.
            </p>
          </div>
          <Link
            to="/irrigation"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800"
          >
            Check Irrigation <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>

      {/* Recent Scans Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Crop Analyses</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real scan history stored locally on the server</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-agri-700 hover:text-agri-800 inline-flex items-center gap-1"
          >
            View All Scans <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading recent records...</div>
        ) : recentScans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => navigate('/history')}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-agri-300 hover:shadow-sm cursor-pointer transition space-y-3"
              >
                {scan.image_data ? (
                  <img
                    src={scan.image_data}
                    alt={scan.crop}
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                    No preview
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
                    <span className="font-bold text-agri-800 uppercase tracking-wider">{scan.crop}</span>
                    <span className="text-slate-400">
                      {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {scan.diagnosis_name || 'Healthy'}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {scan.analysis_summary || 'No summary'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center space-y-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">No previous scans found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No crops have been diagnosed yet on this local instance. Perform your first scan to save results here!
              </p>
            </div>
            <Link
              to="/diagnose"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-agri-700 hover:bg-agri-800 text-white px-4 py-2 rounded-lg transition"
            >
              <Camera className="w-3.5 h-3.5" /> Start First Scan
            </Link>
          </div>
        )}
      </section>

      {/* Practical Agricultural Tips for Pakistan */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              Pakistani Crop Health & Agronomy Best Practices
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Verified regional guidance from agricultural extension research</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Cotton Tip */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-agri-800 font-bold text-xs uppercase tracking-wider">
              <span>🌾</span> Cotton (کپاس)
            </div>
            <h4 className="text-xs font-bold text-slate-900">Whitefly & CLCuV Vector Control</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Cotton Leaf Curl Virus (CLCuV) is vectored primarily by Bemisia tabaci (whitefly). Install yellow sticky traps (15-20/acre) to scout early populations before heavy nymph infestation occurs.
            </p>
          </div>

          {/* Wheat Tip */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <span>🌾</span> Wheat (گندم)
            </div>
            <h4 className="text-xs font-bold text-slate-900">Rust Monitoring & Crown Irrigation</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Crown root initiation (CRI) at 20-25 days after sowing is the most critical irrigation stage. Check under lower leaves for powdery yellow/brown pustules indicating early rust infection.
            </p>
          </div>

          {/* Rice Tip */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <span>🌾</span> Rice (چاول / ڌانءِ)
            </div>
            <h4 className="text-xs font-bold text-slate-900">Stem Borer & Blast Prevention</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Avoid excessive urea application in late vegetative stage as tender tissues become vulnerable to Rice Blast (Pyricularia oryzae). Balance with balanced Potash (SOP) applications.
            </p>
          </div>

          {/* Tomato/Chilli Tip */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
              <span>🌶️</span> Chilli & Tomato (مرچ / ٽماٽر)
            </div>
            <h4 className="text-xs font-bold text-slate-900">Drip Over Overhead Sprinkling</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Overhead foliage watering promotes Late Blight and Anthracnose fungal spores. Irrigate along furrows or via drip tubes to keep foliage dry and resilient.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
