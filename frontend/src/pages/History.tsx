import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ScanListItem, CropDiagnosisResponse } from '../types';
import { DiagnosisResultCard } from '../components/DiagnosisResultCard';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  Eye,
  Camera,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  X,
  RefreshCw,
  Lock,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [scans, setScans] = useState<ScanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedScan, setSelectedScan] = useState<CropDiagnosisResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchScans = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setScans([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getScans({
        search: searchTerm.trim() || undefined,
        plant_status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 100
      });
      setScans(data.items || []);
    } catch (err) {
      console.error('Failed to load scans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchScans();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter, isAuthenticated]);

  const handleViewDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const detail = await api.getScan(id);
      setSelectedScan(detail);
    } catch (err) {
      console.error('Failed to fetch scan detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this scan from history?')) return;

    setDeletingId(id);
    try {
      await api.deleteScan(id);
      setScans(prev => prev.filter(s => s.id !== id));
      if (selectedScan?.id === id) {
        setSelectedScan(null);
      }
    } catch (err) {
      console.error('Failed to delete scan:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personal Farm Scan History Locked
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Sign in or create a free farmer account to securely store and review your crop disease diagnoses, treatments, and recovery records over time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left pt-2">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600 mb-1.5" />
            <div className="text-xs font-bold text-slate-800">Permanent Records</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Every photo and diagnosis saved under your account.</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-agri-600 mb-1.5" />
            <div className="text-xs font-bold text-slate-800">Private & Secure</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Only you can view and manage your farm history.</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <Search className="w-4 h-4 text-sky-600 mb-1.5" />
            <div className="text-xs font-bold text-slate-800">Instant Search</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Filter past scans by crop type, disease, or date.</div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => openAuthModal('Sign in to view and save your personal crop scans.')}
            className="inline-flex items-center gap-2 bg-agri-800 hover:bg-agri-900 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Sign In / Create Free Account (لاگ ان کریں)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <HistoryIcon className="w-7 h-7 text-agri-700" />
            {user ? `${user.full_name}'s Farm Scan History` : 'Saved Scan History'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and review your real personal crop diagnosis records saved for {user?.district || 'Pakistan'}.
          </p>
        </div>
        <Link
          to="/app?tab=diagnose"
          className="inline-flex items-center gap-2 bg-agri-700 hover:bg-agri-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-xs self-start sm:self-center"
        >
          <Camera className="w-4 h-4" />
          New Diagnosis
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by crop, disease name, or symptom..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-agri-500 focus:border-transparent"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Records' },
            { id: 'possibly_diseased', label: 'Diseased' },
            { id: 'healthy', label: 'Healthy' },
            { id: 'unclear', label: 'Unclear' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`
                px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap
                ${statusFilter === tab.id
                  ? 'bg-agri-700 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Scan Records List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-agri-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading saved scans from SQLite database...</p>
        </div>
      ) : scans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {scans.map((scan) => {
            const isDiseased = scan.plant_status === 'possibly_diseased';
            const isHealthy = scan.plant_status === 'healthy';

            return (
              <div
                key={scan.id}
                onClick={() => handleViewDetail(scan.id)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-agri-300 shadow-xs hover:shadow-md transition overflow-hidden cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail / Header */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    {scan.image_data ? (
                      <img
                        src={scan.image_data}
                        alt={scan.crop}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No image preview
                      </div>
                    )}
                    
                    {/* Status Pill on top of image */}
                    <div className="absolute top-2.5 left-2.5">
                      {isHealthy ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          <CheckCircle2 className="w-3 h-3" /> Healthy
                        </span>
                      ) : isDiseased ? (
                        <span className="inline-flex items-center gap-1 bg-amber-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          <AlertCircle className="w-3 h-3" /> Diseased
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-700/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          <HelpCircle className="w-3 h-3" /> Unclear
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md">
                        {scan.crop}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-agri-700 transition line-clamp-1">
                      {scan.diagnosis_name || 'Healthy Leaf'}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {scan.analysis_summary || 'No detailed analysis summary available.'}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{scan.created_at ? new Date(scan.created_at).toLocaleDateString() : 'Recent'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(scan.id, e)}
                      disabled={deletingId === scan.id}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-agri-700 font-semibold text-xs inline-flex items-center gap-1">
                      View <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Scans Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'No saved scans matched your search criteria. Try resetting filters.'
                : 'You have not performed any crop leaf diagnoses yet. Start your first analysis now!'}
            </p>
          </div>
          <Link
            to="/diagnose"
            className="inline-flex items-center gap-2 bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <Camera className="w-4 h-4" />
            Analyze a Crop
          </Link>
        </div>
      )}

      {/* Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-3xl w-full my-8">
            <button
              onClick={() => setSelectedScan(null)}
              className="absolute -top-3 -right-3 z-50 w-8 h-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center shadow-lg"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            <DiagnosisResultCard result={selectedScan} />
          </div>
        </div>
      )}

    </div>
  );
};
