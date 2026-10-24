import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { CropDiagnosisResponse } from '../types';
import { DiagnosisResultCard } from '../components/DiagnosisResultCard';
import {
  UploadCloud,
  Camera,
  AlertCircle,
  FileImage,
  X,
  RefreshCw,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Languages,
  ChevronDown,
  Layers,
  Zap
} from 'lucide-react';

const COMMON_CROPS = [
  { id: 'Cotton', name: 'Cotton (کپاس)', icon: '🌱' },
  { id: 'Wheat', name: 'Wheat (گندم)', icon: '🌾' },
  { id: 'Rice', name: 'Rice (چاول)', icon: '🌾' },
  { id: 'Sugarcane', name: 'Sugarcane (کماد)', icon: '🎋' },
  { id: 'Tomato', name: 'Tomato (ٹماٹر)', icon: '🍅' },
  { id: 'Chilli', name: 'Chilli (مرچ)', icon: '🌶️' },
  { id: 'Maize', name: 'Maize (مکئی)', icon: '🌽' },
  { id: 'Mango', name: 'Mango (آم)', icon: '🥭' },
  { id: 'Citrus', name: 'Citrus (کنو)', icon: '🍊' },
  { id: 'Potato', name: 'Potato (آلو)', icon: '🥔' },
  { id: 'Onion', name: 'Onion (پیاز)', icon: '🧅' },
  { id: 'Other', name: 'Other Crop', icon: '🌿' },
];

const LANGUAGES = [
  { id: 'en', label: 'English', desc: 'Standard Agronomic English' },
  { id: 'ur', label: 'اردو (Urdu)', desc: 'قومی زبان - آسان اردو' },
];

const QUICK_SAMPLES = [
  {
    name: 'Cotton Leaf Curl',
    crop: 'Cotton',
    file: '/sample_images/cotton_leaf_curl_sample.jpg',
    tag: 'Diseased',
    color: 'border-amber-400 bg-amber-50/50 text-amber-900'
  },
  {
    name: 'Wheat Yellow Rust',
    crop: 'Wheat',
    file: '/sample_images/wheat_rust_sample.jpg',
    tag: 'Diseased',
    color: 'border-rose-400 bg-rose-50/50 text-rose-900'
  },
  {
    name: 'Healthy Rice Leaf',
    crop: 'Rice',
    file: '/sample_images/healthy_rice_leaf_sample.jpg',
    tag: 'Healthy',
    color: 'border-emerald-400 bg-emerald-50/50 text-emerald-900'
  }
];

export const Diagnose: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('Cotton');
  const [symptoms, setSymptoms] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CropDiagnosisResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    setError(null);
    if (!selectedFile) return;

    // Client-side quick size validation (8MB)
    if (selectedFile.size > 8 * 1024 * 1024) {
      setError('File size exceeds 8MB. Please choose a smaller photo.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type.toLowerCase())) {
      setError('Please upload a valid JPEG, PNG, or WebP image.');
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const handleLoadSample = async (sample: typeof QUICK_SAMPLES[0]) => {
    setError(null);
    try {
      const res = await fetch(sample.file);
      const blob = await res.blob();
      const sampleFile = new File([blob], `${sample.crop.toLowerCase()}_sample.jpg`, { type: 'image/jpeg' });
      setSelectedCrop(sample.crop);
      setFile(sampleFile);
      const objectUrl = URL.createObjectURL(sampleFile);
      setPreviewUrl(objectUrl);
    } catch (err) {
      setError('Could not load sample file.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or capture a crop leaf photograph first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    // Multi-phase progress feedback while awaiting multimodal inference
    const timer1 = setTimeout(() => setLoadingStep(1), 1200);
    const timer2 = setTimeout(() => setLoadingStep(2), 3500);
    const timer3 = setTimeout(() => setLoadingStep(3), 6000);

    try {
      const response = await api.diagnoseCrop(
        file,
        selectedCrop === 'Other' ? undefined : selectedCrop,
        symptoms.trim() || undefined,
        language
      );
      setResult(response);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError(err.message || 'Failed to analyze crop image. Check connection and try again.');
      }
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5 text-agri-700" />
          <span>Multimodal Vision Pathology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Leaf Disease Diagnosis
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Photograph or upload the affected leaf. The AI inspects visual symptoms, evaluates probable pathogens, and returns practical IPM recovery steps.
        </p>
      </div>

      {/* Result Display or Upload Form */}
      {result ? (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <DiagnosisResultCard
            result={result}
            onReset={() => {
              setResult(null);
              handleRemoveImage();
            }}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-glass space-y-6">
          
          {/* Image Upload Zone */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Leaf Photograph <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md normal-case ml-1">Required</span>
              </label>

              {/* Quick sample chips */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Quick Test:</span>
                {QUICK_SAMPLES.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleLoadSample(s)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold transition ${s.color} hover:brightness-95`}
                  >
                    + {s.crop}
                  </button>
                ))}
              </div>
            </div>

            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-agri-500 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition bg-slate-50/60 hover:bg-agri-50/40 group relative overflow-hidden"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                />

                <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-slate-200 text-agri-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  Click to capture or drag & drop leaf photo
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Accepted formats: JPEG, PNG, or WebP. Max size: 8 MB.
                </p>

                {/* Mobile Sample Chips */}
                <div className="mt-4 flex sm:hidden flex-wrap items-center justify-center gap-2">
                  <span className="text-[10px] text-slate-400 w-full">Or load a sample leaf:</span>
                  {QUICK_SAMPLES.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadSample(s);
                      }}
                      className="text-[10px] px-2 py-1 rounded-md bg-white border border-slate-200 font-semibold text-slate-700"
                    >
                      {s.crop} Sample
                    </button>
                  ))}
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-[11px] text-agri-800 bg-agri-100/70 px-3.5 py-1 rounded-full font-medium">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Tip: Capture clear, focused photos of lesions in natural daylight.
                </div>
              </div>
            ) : (
              /* AR Viewfinder Mode Preview */
              <div className="relative rounded-3xl overflow-hidden border border-slate-300 bg-slate-950 group">
                <img
                  src={previewUrl}
                  alt="Leaf Preview"
                  className="w-full max-h-96 object-contain mx-auto"
                />

                {/* AR Holographic Corner Brackets */}
                <div className="absolute inset-4 border border-emerald-400/30 rounded-2xl pointer-events-none">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>

                {/* Animated Laser Scanline during Loading */}
                {loading && <div className="animate-scan-laser pointer-events-none" />}

                {/* Floating controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-medium transition flex items-center gap-1.5"
                    title="Replace image"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 rounded-xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md text-xs font-medium transition"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{file?.name} ({(file?.size ? file.size / (1024 * 1024) : 0).toFixed(2)} MB)</span>
                </div>
              </div>
            )}
          </div>

          {/* Crop Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Select Crop Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {COMMON_CROPS.map((crop) => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`
                    p-2.5 rounded-2xl border text-left flex items-center gap-2 transition text-xs font-medium
                    ${selectedCrop === crop.id
                      ? 'bg-agri-50 border-agri-500 text-agri-950 font-bold shadow-xs ring-1 ring-agri-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }
                  `}
                >
                  <span className="text-base">{crop.icon}</span>
                  <span className="truncate">{crop.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Response Language (زبان)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id)}
                  className={`
                    p-3 rounded-2xl border text-left transition
                    ${language === lang.id
                      ? 'bg-agri-50 border-agri-500 text-agri-950 ring-1 ring-agri-500 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="text-xs font-bold">{lang.label}</div>
                  <div className="text-[11px] text-slate-500 font-normal">{lang.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Symptoms Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              4. Additional Field Observations <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Yellowing started 3 days ago, lower canopy affected, white insects visible under leaves..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 focus:outline-hidden focus:border-agri-500 focus:ring-1 focus:ring-agri-500"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Notice:</span> {error}
              </div>
            </div>
          )}

          {/* Submit Button & Progress State */}
          <div className="pt-2">
            {loading ? (
              <div className="bg-agri-50/80 border border-agri-200 rounded-2xl p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-agri-700 text-white animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {loadingStep === 0 && 'Validating leaf photo and lighting resolution...'}
                    {loadingStep === 1 && 'Consulting Google Gemini Multimodal Vision AI...'}
                    {loadingStep === 2 && 'Diagnosing pathogen patterns, chlorosis & pustules...'}
                    {loadingStep === 3 && 'Formulating safe IPM care and cultural recovery plan...'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Running live agricultural analysis with safety guardrails.
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!file}
                className={`
                  w-full py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-md
                  ${file
                    ? 'bg-agri-800 hover:bg-agri-900 text-white cursor-pointer shadow-agri-900/20 transform hover:-translate-y-0.5 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }
                `}
              >
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>Start Pathological AI Analysis</span>
              </button>
            )}
          </div>

        </form>
      )}

    </div>
  );
};
