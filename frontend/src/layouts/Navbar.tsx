import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Camera,
  MessageSquare,
  History,
  CloudRain,
  Info,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  User,
  LogOut,
  LogIn
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const isAppWorkspace = location.pathname.startsWith('/app');

  const navLinks = [
    { to: '/', label: 'Home', icon: Sprout, end: true },
    { to: '/app?tab=diagnose', label: 'AI Leaf Doctor', icon: Camera, matchPrefix: '/app?tab=diagnose' },
    { to: '/app?tab=assistant', label: 'Farming Assistant', icon: MessageSquare, matchPrefix: '/app?tab=assistant' },
    { to: '/app?tab=irrigation', label: 'Smart Irrigation', icon: CloudRain, matchPrefix: '/app?tab=irrigation' },
    { to: '/app?tab=history', label: 'Scan History', icon: History, matchPrefix: '/app?tab=history' },
    { to: '/about', label: 'About & Help', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-700 to-agri-900 flex items-center justify-center text-white shadow-md shadow-agri-800/25 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">CropSathi</span>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase border border-emerald-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Smart Farming Companion • Pakistan
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition
                ${isActive && !isAppWorkspace
                  ? 'bg-agri-50 text-agri-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }
              `}
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/app"
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition
                ${isAppWorkspace
                  ? 'bg-agri-100/80 text-agri-950 font-bold border border-agri-300/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }
              `}
            >
              <LayoutGrid className="w-4 h-4 text-agri-700" />
              <span>Crop Studio</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition
                ${isActive
                  ? 'bg-agri-50 text-agri-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }
              `}
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>About</span>
            </NavLink>
          </nav>

          {/* Right Action CTA Button & Auth Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-agri-700 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.full_name}</span>
                  <span className="text-[10px] text-slate-400">({user.district.split(',')[0]})</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('Sign in to save your personal crop scans and history.')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-agri-950 font-bold text-xs border border-slate-300 shadow-2xs transition"
              >
                <LogIn className="w-3.5 h-3.5 text-agri-700" />
                <span>Farmer Sign In</span>
              </button>
            )}

            {isAppWorkspace ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Studio Active</span>
              </div>
            ) : (
              <Link
                to="/app?tab=diagnose"
                className="inline-flex items-center gap-2 bg-agri-800 hover:bg-agri-900 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-agri-900/20 hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Launch Crop Doctor</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4">
          
          {/* Mobile Auth User Card */}
          {isAuthenticated && user ? (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-agri-700 text-white font-bold flex items-center justify-center text-xs">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{user.full_name}</div>
                  <div className="text-[10px] text-slate-500">{user.district}</div>
                </div>
              </div>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="px-2.5 py-1 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { openAuthModal('Sign in to save your personal crop scans.'); setMobileMenuOpen(false); }}
              className="w-full mb-2 py-2.5 px-3 rounded-xl bg-agri-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4 text-emerald-300" />
              <span>Farmer Sign In / Register</span>
            </button>
          )}

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>Home Landing Page</span>
          </Link>

          <div className="pt-2 pb-1 border-t border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
            Crop Studio Workspace
          </div>

          <Link
            to="/app?tab=diagnose"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-agri-900 bg-agri-50"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>AI Leaf Doctor (Diagnose)</span>
          </Link>

          <Link
            to="/app?tab=assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <MessageSquare className="w-4 h-4 text-agri-600" />
            <span>Farming Assistant</span>
          </Link>

          <Link
            to="/app?tab=irrigation"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <CloudRain className="w-4 h-4 text-sky-600" />
            <span>Smart Irrigation</span>
          </Link>

          <Link
            to="/app?tab=history"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span>Scan History Log</span>
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Info className="w-4 h-4 text-slate-500" />
            <span>About & Help</span>
          </Link>

          <div className="pt-3">
            <Link
              to="/app?tab=diagnose"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-agri-800 text-white font-bold py-3 rounded-xl text-sm shadow-md"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Launch Studio Now</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
