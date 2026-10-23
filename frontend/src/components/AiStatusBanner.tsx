import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AiHealth } from '../types';
import { Sparkles, AlertTriangle, CheckCircle2, KeyRound, ExternalLink, X } from 'lucide-react';

export const AiStatusBanner: React.FC = () => {
  const [aiStatus, setAiStatus] = useState<AiHealth | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getAiHealth()
      .then(data => {
        if (mounted) {
          setAiStatus(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading || !aiStatus) return null;

  if (aiStatus.is_configured) {
    return (
      <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-800 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong className="font-semibold">AI Vision Model Active:</strong> {aiStatus.model} connected for real multimodal leaf diagnosis.
            </span>
          </div>
          <span className="hidden sm:inline-block bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded-full text-[11px]">
            Google Gemini Connected
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-amber-50 border-b border-amber-300 px-4 py-2.5 text-xs text-amber-900 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong className="font-semibold">Gemini API Key Required:</strong> To enable real-time multimodal diagnosis with Google Gemini, add your key to <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-800">backend/.env</code>.
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium px-3 py-1 rounded-md transition shadow-xs"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Setup Instructions
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-agri-100 flex items-center justify-center text-agri-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Configure Gemini API Key</h3>
                  <p className="text-xs text-slate-500">Enable real AI crop disease diagnosis</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-medium text-slate-800 mb-1">Step 1: Get a free API key</p>
                <p className="text-xs text-slate-600 mb-2">Google provides free API quotas for Gemini Developer API.</p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-agri-700 hover:text-agri-800 font-semibold underline"
                >
                  Open Google AI Studio <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-medium text-slate-800 mb-1">Step 2: Add key to backend</p>
                <p className="text-xs text-slate-600 mb-2">Open the <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">backend/.env</code> file in your project folder:</p>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded text-xs font-mono overflow-x-auto">
GEMINI_API_KEY=AIzaSyYourActualKeyHere
GEMINI_MODEL=gemini-2.5-flash
                </pre>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-medium text-slate-800 mb-1">Step 3: Ready!</p>
                <p className="text-xs text-slate-600">
                  The backend automatically loads the key. Refresh the page and your crop leaf diagnoses will run through real Google Gemini inference!
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-agri-700 hover:bg-agri-800 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
