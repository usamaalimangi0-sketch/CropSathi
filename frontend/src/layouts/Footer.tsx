import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-auto text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          
          {/* Brand & Vision */}
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-agri-600 to-agri-800 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">CropSathi AI</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Smart agricultural companion empowering Pakistani smallholders with AI-driven crop pathology and localized agritech advisory.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Hyderabad • Sindh • Pakistan</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Crop Studio</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span>Home Landing Page</span>
                </Link>
              </li>
              <li>
                <Link to="/app?tab=diagnose" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span>AI Leaf Doctor</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link to="/app?tab=assistant" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span>Farming Assistant</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link to="/app?tab=irrigation" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span>Smart Irrigation</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link to="/app?tab=history" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span>Scan History Log</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026–27 CropSathi AI. Built for Pakistani Farmers with Sustainable AI.</p>
          <p className="font-urdu text-xs text-slate-400">
            کسانوں کی خوشحالی • پاکستان کی ترقی
          </p>
        </div>
      </div>
    </footer>
  );
};
