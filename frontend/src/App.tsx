import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';
import { InstallPwaBanner } from './components/InstallPwaBanner';
import { Navbar } from './layouts/Navbar';
import { Footer } from './layouts/Footer';
import { AiStatusBanner } from './components/AiStatusBanner';

// Core 2-Page Architecture
import { Landing } from './pages/Landing';
import { Workspace } from './pages/Workspace';
import { AboutPage } from './pages/About';

// Redirect helpers that preserve location.state (e.g. initialQuery passed from diagnosis to assistant)
const RedirectToWorkspaceTab: React.FC<{ tab: string }> = ({ tab }) => {
  const location = useLocation();
  return <Navigate to={`/app?tab=${tab}`} state={location.state} replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-[#f8faf8] text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-950">
          <Navbar />
          <AiStatusBanner />
          <AuthModal />
          <PricingModal />
          <InstallPwaBanner />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
            <Routes>
              {/* Page 1: Professional Landing Page */}
              <Route path="/" element={<Landing />} />

              {/* Page 2: Main Working Studio Workspace */}
              <Route path="/app" element={<Workspace />} />

              {/* Backward-Compatible Route Aliases directly mapping to Workspace Tabs */}
              <Route path="/diagnose" element={<RedirectToWorkspaceTab tab="diagnose" />} />
              <Route path="/assistant" element={<RedirectToWorkspaceTab tab="assistant" />} />
              <Route path="/irrigation" element={<RedirectToWorkspaceTab tab="irrigation" />} />
              <Route path="/history" element={<RedirectToWorkspaceTab tab="history" />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />

              {/* Additional info */}
              <Route path="/about" element={<AboutPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
