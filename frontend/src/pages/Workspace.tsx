import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Diagnose } from './Diagnose';
import { Assistant } from './Assistant';
import { IrrigationPage } from './Irrigation';
import { HistoryPage } from './History';
import {
  Camera,
  MessageSquare,
  CloudRain,
  History,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

type TabType = 'diagnose' | 'assistant' | 'irrigation' | 'history';

interface TabItem {
  id: TabType;
  label: string;
  urdu: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const TABS: TabItem[] = [
  {
    id: 'diagnose',
    label: 'AI Leaf Doctor',
    urdu: 'تشخیص',
    icon: Camera,
    tag: 'Vision AI'
  },
  {
    id: 'assistant',
    label: 'Farming Assistant',
    urdu: 'زرعی معاون',
    icon: MessageSquare,
    tag: 'Chat & IPM'
  },
  {
    id: 'irrigation',
    label: 'Smart Irrigation',
    urdu: 'آبپاشی',
    icon: CloudRain,
    tag: 'Live Weather'
  },
  {
    id: 'history',
    label: 'Scan History',
    urdu: 'تاریخچہ',
    icon: History,
    tag: 'Local DB'
  }
];

export const Workspace: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = (searchParams.get('tab') as TabType) || 'diagnose';

  const setTab = (tab: TabType) => {
    setSearchParams({ tab }, { replace: true });
  };

  // If URL has no tab or invalid tab, default to diagnose
  useEffect(() => {
    const validTabs: TabType[] = ['diagnose', 'assistant', 'irrigation', 'history'];
    const tabParam = searchParams.get('tab') as TabType;
    if (!tabParam || !validTabs.includes(tabParam)) {
      setSearchParams({ tab: 'diagnose' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      
      {/* ============================================================ */}
      {/* 1. TOP UTILITY BAR (Breadcrumb, Studio Badge, Quick Home) */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition shadow-xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>
          
          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-800">CropSathi Studio</span>
            <span>•</span>
            <span className="text-agri-700 font-semibold">Active Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gemini Vision Ready</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-[11px] font-semibold text-sky-800">
            <span>Open-Meteo Synced</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. PINTEREST-INSPIRED SEGMENTED CONTROL DOCK (Tab Switcher) */}
      {/* ============================================================ */}
      <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-glass sticky top-20 z-30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`relative flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-agri-800 text-white shadow-md shadow-agri-900/15 scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div className="flex items-center gap-1.5 truncate">
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-urdu hidden lg:inline font-normal ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                    ({tab.urdu})
                  </span>
                </div>
                
                {/* Micro Tag on Desktop */}
                <span className={`hidden sm:inline-block ml-auto text-[9px] uppercase px-1.5 py-0.5 rounded tracking-wide font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. ACTIVE TOOL WORKSPACE */}
      {/* ============================================================ */}
      <div className="pt-2 transition-all duration-300">
        {currentTab === 'diagnose' && <Diagnose />}
        {currentTab === 'assistant' && <Assistant />}
        {currentTab === 'irrigation' && <IrrigationPage />}
        {currentTab === 'history' && <HistoryPage />}
      </div>

    </div>
  );
};
