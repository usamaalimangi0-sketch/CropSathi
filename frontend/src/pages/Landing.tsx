import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  MessageSquare,
  CloudRain,
  History,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  Languages,
  Activity,
  Layers,
  Zap,
  Globe2,
  Smartphone,
  ChevronRight,
  Sun,
  Wind
} from 'lucide-react';

interface SampleLeaf {
  id: string;
  cropName: string;
  cropUrdu: string;
  disease: string;
  confidence: number;
  urgency: 'Low' | 'Moderate' | 'High';
  status: 'healthy' | 'possibly_diseased';
  sampleImage: string;
  badgeColor: string;
  previewSummary: string;
}

const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'cotton',
    cropName: 'Cotton',
    cropUrdu: 'کپاس / ڦٽيون',
    disease: 'Cotton Leaf Curl Virus (CLCuV)',
    confidence: 96,
    urgency: 'Moderate',
    status: 'possibly_diseased',
    sampleImage: 'https://images.unsplash.com/photo-1594488582792-2761ae337c68?w=800&auto=format&fit=crop&q=80',
    badgeColor: 'amber',
    previewSummary: 'Upward leaf curling and vein thickening observed. Transmitted primarily by Bemisia tabaci (Whitefly).'
  },
  {
    id: 'wheat',
    cropName: 'Wheat',
    cropUrdu: 'گندم / ڪڻڪ',
    disease: 'Wheat Stripe / Yellow Rust',
    confidence: 93,
    urgency: 'High',
    status: 'possibly_diseased',
    sampleImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    badgeColor: 'rose',
    previewSummary: 'Linear yellow pustules arranged in parallel stripes across the leaf blade. Requires prompt isolation.'
  },
  {
    id: 'rice',
    cropName: 'Rice',
    cropUrdu: 'چاول / ڌانءِ',
    disease: 'Healthy Specimen (No Active Pathogen)',
    confidence: 98,
    urgency: 'Low',
    status: 'healthy',
    sampleImage: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=800&auto=format&fit=crop&q=80',
    badgeColor: 'emerald',
    previewSummary: 'Uniform chlorophyll distribution with zero necrosis or viral lesions. Excellent vegetative health.'
  }
];

const PAKISTANI_CROPS = [
  { name: 'Cotton', urdu: 'کپاس', icon: '🌱', season: 'Kharif', region: 'Sindh & Punjab' },
  { name: 'Wheat', urdu: 'گندم', icon: '🌾', season: 'Rabi', region: 'Nationwide' },
  { name: 'Rice', urdu: 'چاول', icon: '🌾', season: 'Kharif', region: 'Sindh & Punjab' },
  { name: 'Sugarcane', urdu: 'کماد', icon: '🎋', season: 'Year-round', region: 'Indus Basin' },
  { name: 'Tomato', urdu: 'ٹماٹر', icon: '🍅', season: 'Rabi / Spring', region: 'Sindh & Balochistan' },
  { name: 'Chilli', urdu: 'مرچ', icon: '🌶️', season: 'Kharif', region: 'Kunri & Mirpur Khas' },
  { name: 'Mango', urdu: 'آم', icon: '🥭', season: 'Summer', region: 'Multan & Mirpur Khas' },
  { name: 'Maize', urdu: 'مکئی', icon: '🌽', season: 'Spring / Kharif', region: 'KPK & Punjab' },
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeSample, setActiveSample] = useState<SampleLeaf>(SAMPLE_LEAVES[0]);
  const [isScanningSim, setIsScanningSim] = useState(false);

  const triggerSampleSwitch = (sample: SampleLeaf) => {
    setIsScanningSim(true);
    setActiveSample(sample);
    setTimeout(() => {
      setIsScanningSim(false);
    }, 600);
  };

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">

      {/* ============================================================ */}
      {/* 1. HERO SECTION (Biophilic Minimalist) */}
      {/* ============================================================ */}
      <section className="relative pt-6 sm:pt-12">
        {/* Soft atmospheric gradient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-200/40 via-agri-100/30 to-amber-100/30 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Value Proposition & CTA Cluster */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Platform Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-100/80 border border-agri-300/60 text-xs font-semibold text-agri-900 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-agri-700 animate-spin-slow" />
              <span>AI-Powered Agritech Platform • Pakistan</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Smart Farming. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-700 via-emerald-600 to-agri-900">
                Healthier Crops.
              </span> <br />
              Better Decisions.
            </h1>

            {/* Bilingual Subtitle / Value Prop */}
            <div className="space-y-2 max-w-xl mx-auto lg:mx-0">
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                CropSathi AI combines <span className="font-semibold text-slate-800">Google Gemini Multimodal Vision</span> with localized agronomic knowledge and live district agro-meteorology. Instant leaf diagnosis and IPM care guides in <span className="font-semibold text-slate-800">English and Urdu (اردو)</span>.
              </p>
              <p className="font-urdu text-sm sm:text-base text-agri-800 font-medium">
                کسان کا اپنا ڈیجیٹل ساتھی — فصلوں کی بیماریوں کی فوری تشخیص اور آسان رہنمائی۔
              </p>
            </div>

            {/* ---------------------------------------------------- */}
            {/* ACTION-PACKED CTA BUTTON CLUSTER (Redirects to App) */}
            {/* ---------------------------------------------------- */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              
              {/* Primary CTA: Launch Diagnose */}
              <Link
                to="/app?tab=diagnose"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-agri-800 hover:bg-agri-900 text-white font-bold px-7 py-4 rounded-2xl shadow-xl shadow-agri-900/20 hover:shadow-agri-900/30 transition transform hover:-translate-y-0.5 active:scale-95 text-base group"
              >
                <Camera className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Diagnose Leaf Now</span>
                <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary CTA: Farming Assistant */}
              <Link
                to="/app?tab=assistant"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-4 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow transition transform hover:-translate-y-0.5 active:scale-95 text-base"
              >
                <MessageSquare className="w-5 h-5 text-agri-600" />
                <span>Ask AI Assistant</span>
              </Link>

              {/* Ghost CTA: Smart Irrigation */}
              <Link
                to="/app?tab=irrigation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-slate-600 hover:text-agri-800 hover:bg-agri-50 transition text-sm font-semibold"
              >
                <CloudRain className="w-4 h-4 text-sky-500" />
                <span>Live Irrigation</span>
              </Link>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Zero Chemical Sponsorship
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-emerald-600" /> 11 Agro Districts Synced
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Instant Gemini Flash Vision
              </span>
            </div>

          </div>

          {/* Right Column: Interactive AR Viewfinder Teaser */}
          <div className="lg:col-span-5 relative">
            
            {/* Viewfinder Outer Card */}
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200/80 backdrop-blur-xl">
              
              {/* Header inside simulated camera */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-slate-700 tracking-wide uppercase text-[10px]">
                    Live AI Lens Active
                  </span>
                </div>
                <div className="bg-agri-50 text-agri-800 px-2 py-0.5 rounded text-[10px] font-bold">
                  Gemini Vision 2.5
                </div>
              </div>

              {/* Viewfinder Screen Area */}
              <div className="relative mt-3 rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 group">
                
                {/* Background Leaf Image */}
                <img
                  src={activeSample.sampleImage}
                  alt={activeSample.cropName}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isScanningSim ? 'scale-105 filter blur-xs' : 'scale-100'
                  }`}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                {/* Holographic AR Reticle Brackets */}
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400/50 rounded-xl pointer-events-none">
                  {/* Top-left corner */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  {/* Top-right corner */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  {/* Bottom-left corner */}
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  {/* Bottom-right corner */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>

                {/* Animated Laser Scan Line */}
                <div className="animate-scan-laser pointer-events-none" />

                {/* Floating Top HUD Tag */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-[11px] pointer-events-none">
                  <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 font-medium">
                    Target: {activeSample.cropName} ({activeSample.cropUrdu})
                  </span>
                  <span className="bg-emerald-500/80 backdrop-blur-md px-2 py-0.5 rounded-full font-bold text-[10px]">
                    {activeSample.confidence}% Match
                  </span>
                </div>

                {/* Floating Bottom Detection Result Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md border border-white/20 p-2.5 rounded-xl text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-300">
                      {activeSample.disease}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      activeSample.urgency === 'High' ? 'bg-red-500/80 text-white' :
                      activeSample.urgency === 'Moderate' ? 'bg-amber-500/80 text-white' :
                      'bg-emerald-500/80 text-white'
                    }`}>
                      {activeSample.urgency} Urgency
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                    {activeSample.previewSummary}
                  </p>
                </div>
              </div>

              {/* Sample Selector Tabs */}
              <div className="mt-3.5">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>Switch Interactive Field Sample:</span>
                  <span className="text-emerald-700 font-semibold text-[11px]">Click to inspect</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_LEAVES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => triggerSampleSwitch(sample)}
                      className={`px-2.5 py-2 rounded-xl text-left transition border text-xs ${
                        activeSample.id === sample.id
                          ? 'bg-agri-50 border-agri-500 text-agri-900 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">{sample.cropName}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">
                        {sample.status === 'healthy' ? 'Healthy' : 'Diseased'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Workspace Launcher from Teaser */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => navigate('/app?tab=diagnose')}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-agri-800 text-white py-2.5 rounded-xl text-xs font-bold transition"
                >
                  <span>Open Full AI Scanner with Your Leaf Photo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. LIVE TELEMETRY STATS STRIP */}
      {/* ============================================================ */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-glass">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-agri-800">11+ Districts</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">
              Live Open-Meteo Weather Sync (Hyderabad, Sukkur, Multan...)
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-agri-800">Bilingual AI</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">
              English & اردو (Urdu)
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-agri-800">12+ Crops</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">
              Cotton, Wheat, Rice, Sugarcane, Chilli & more
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">Zero Guesswork</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">
              IPM Safety Standards & Cultural Remedies First
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. BENTO GRID CAPABILITIES SHOWCASE */}
      {/* ============================================================ */}
      <section id="features" className="space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-semibold uppercase tracking-wider">
            Comprehensive Agro-Tech
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Field Clarity & Real Results
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A minimalist bento architecture built to work reliably on budget mobile phones in direct sunlight.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {/* Bento Card 1: Vision Diagnostic (Large 2x2) */}
          <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-agri-900 via-agri-800 to-agri-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 backdrop-blur-md border border-white/15">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Multimodal AI Leaf Pathology</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Powered by Google Gemini 2.5 Flash Vision. Analyzes curl patterns, chlorosis, lesions, and fungal pustules from everyday field photos. Rejects corrupted or non-plant images automatically.
              </p>
            </div>

            <div className="pt-8 relative z-10 flex items-center justify-between">
              <Link
                to="/app?tab=diagnose"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-emerald-200"
              >
                <span>Launch Diagnostic Engine</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                PIL + Gemini Vision
              </span>
            </div>
          </div>

          {/* Bento Card 2: Smart Irrigation (2x1) */}
          <div className="md:col-span-1 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-glass flex flex-col justify-between hover:border-sky-300 transition group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <CloudRain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Agro-Meteorology & Soil Advisory</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Live Open-Meteo telemetry computes precipitation probability and soil moisture stress across 11 Pakistani agricultural districts to prevent wasteful watering.
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <Link
                to="/app?tab=irrigation"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800"
              >
                <span>Explore Irrigation Telemetry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Live Sensors</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Multilingual Support (1x1) */}
          <div className="md:col-span-1 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-glass flex flex-col justify-between hover:border-agri-300 transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Native Urdu Intelligence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Break language barriers in rural fields. Every diagnosis, remedy, and preventative checklist is translated into native colloquial Urdu.
              </p>
              <div className="p-3 bg-agri-50/70 rounded-xl border border-agri-100 text-xs font-urdu text-agri-900">
                اردو اور انگلش میں مکمل اور مستند زرعی رہنمائی دستياب ہے۔
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <Link
                to="/app?tab=assistant"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-agri-700 hover:text-agri-800"
              >
                <span>Try Multilingual Chat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bento Card 4: IPM & Safety (1x1) */}
          <div className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-glass flex flex-col justify-between hover:border-amber-300 transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Zero-Hallucination IPM Guardrails</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Prioritizes Integrated Pest Management (IPM), crop rotation, and bio-controls before prescribing chemical pesticides. Recommends consulting local extension officers for severe blight.
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <Link
                to="/app?tab=assistant"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900"
              >
                <span>Ask IPM Advisor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[11px] text-slate-400 font-medium">Safe Farming Standard</span>
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 4. 3-STEP INTERACTIVE WORKFLOW */}
      {/* ============================================================ */}
      <section id="how-it-works" className="space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            From Field Photo to Recovery Plan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 relative">
            <div className="text-4xl font-extrabold text-agri-100">01</div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Snap or Upload</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Photograph the affected leaf directly on your phone camera or upload an existing image (JPEG, PNG, WebP up to 8MB).
              </p>
            </div>
            <div className="text-xs text-agri-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High-res leaf structure checked
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 relative">
            <div className="text-4xl font-extrabold text-agri-100">02</div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">AI Pathological Scan</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gemini Vision inspects cellular patterns, discoloration, pustules, and margins to determine health status with confidence scores.
              </p>
            </div>
            <div className="text-xs text-agri-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero hallucinations guardrail
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 relative">
            <div className="text-4xl font-extrabold text-agri-100">03</div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Action & Protect</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Get an instant prioritized recovery checklist, cultural prevention habits, and one-click follow-up consultation with the AI Assistant.
              </p>
            </div>
            <div className="text-xs text-agri-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Multilingual action checklist
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 5. SUPPORTED PAKISTANI CROPS */}
      {/* ============================================================ */}
      <section id="crops" className="space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-semibold uppercase tracking-wider mb-2">
              Optimized Coverage
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Calibrated for Pakistan's Agricultural Heartlands
            </h2>
          </div>
          <Link
            to="/app?tab=diagnose"
            className="text-xs font-bold text-agri-700 hover:text-agri-800 flex items-center gap-1"
          >
            <span>Scan any crop leaf</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {PAKISTANI_CROPS.map((crop) => (
            <div
              key={crop.name}
              onClick={() => navigate('/app?tab=diagnose')}
              className="bg-white hover:bg-agri-50/50 p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-agri-300 transition cursor-pointer group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{crop.icon}</div>
              <div className="font-bold text-sm text-slate-900">{crop.name}</div>
              <div className="font-urdu text-xs text-agri-800">{crop.urdu}</div>
              <div className="mt-2 text-[10px] text-slate-400 font-medium">
                {crop.season} • {crop.region}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ============================================================ */}
      {/* 6. BOTTOM CONVERSION BANNER (The Big Launch CTA) */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agri-950 via-agri-900 to-slate-950 text-white p-8 sm:p-14 shadow-2xl text-center space-y-6">
        
        {/* Decorative blur glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ready for the Field</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Protect Your Harvest Today.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            No expensive lab tests required. Capture a leaf photograph from your phone and receive instant, science-backed guidance in seconds.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app?tab=diagnose"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5 active:scale-95 text-base"
            >
              <Camera className="w-5 h-5 text-slate-950" />
              <span>Open Crop Studio Workspace</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              to="/app?tab=assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-2xl backdrop-blur-xs border border-white/15 transition text-base"
            >
              <MessageSquare className="w-5 h-5 text-emerald-300" />
              <span>Ask Farming Assistant</span>
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
};
