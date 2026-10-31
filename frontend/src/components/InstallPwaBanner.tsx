import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Share } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Check if user already dismissed recently
    const dismissedTime = localStorage.getItem('cropsathi_pwa_dismissed');
    if (dismissedTime && Date.now() - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      return;
    }

    // Check iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If on iOS and not dismissed, show after 3 seconds
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIosInstructions(false);
    localStorage.setItem('cropsathi_pwa_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Install CropSathi App" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/30 flex items-center justify-between gap-3.5">
        
        {/* App Icon */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-agri-800 flex items-center justify-center shrink-0 shadow-md">
          <Smartphone className="w-6 h-6 text-emerald-200" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">Install CropSathi App</h4>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded font-mono">
              Free
            </span>
          </div>
          <p className="text-[11px] text-emerald-200/90 truncate">
            {isIos ? 'Install on iPhone Home Screen' : 'Works offline • Instant field camera access'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* iOS Instructions Drawer Popup */}
      {showIosInstructions && (
        <div className="mt-2 bg-white text-slate-800 rounded-xl p-3 shadow-xl border border-slate-200 text-xs space-y-1.5 animate-in fade-in">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <Share className="w-4 h-4 text-emerald-600" />
            <span>How to install on iPhone / iPad:</span>
          </div>
          <p className="text-slate-600 text-[11px]">
            1. Tap the <strong>Share</strong> button (box with upward arrow) at the bottom of Safari.<br />
            2. Scroll down and tap <strong>"Add to Home Screen"</strong>.<br />
            3. Tap <strong>Add</strong> in the top right.
          </p>
        </div>
      )}
    </aside>
  );
};
