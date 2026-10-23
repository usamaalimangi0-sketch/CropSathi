import React from 'react';
import {
  Sprout,
  Camera,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  Cpu,
  Lock
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>DITE Hackathon 2026–27 • Hyderabad, Pakistan</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About CropSathi AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          An accessible digital assistant built to support Pakistani farmers in early crop disease detection, smart irrigation management, and reliable agricultural advisory.
        </p>
      </div>

      {/* Photography Guide for Farmers */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-agri-600" />
          How to Take an Effective Crop-Leaf Photo
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The accuracy of multimodal AI diagnosis depends heavily on image clarity. Follow these field guidelines when photographing suspected leaves:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Natural, Indirect Sunlight
            </div>
            <p className="text-[11px] text-slate-600">
              Photograph leaves during morning or late afternoon light. Avoid harsh lens glare or dark shadows.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Focus on Lesions & Margins
            </div>
            <p className="text-[11px] text-slate-600">
              Hold the camera 10–20 cm from the affected leaf area. Ensure spots, chlorosis, or vein curling are in sharp focus.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Single Leaf in Frame
            </div>
            <p className="text-[11px] text-slate-600">
              Avoid capturing entire wide field vistas. A close-up of a representative diseased leaf yields the highest diagnosis fidelity.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Both Upper & Lower Surface
            </div>
            <p className="text-[11px] text-slate-600">
              For suspected downy mildew, leaf curl, or sucking pests (whiteflies/aphids), inspecting the lower leaf surface is vital.
            </p>
          </div>

        </div>
      </div>

      {/* AI Transparency & Architecture */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-agri-600" />
          How the AI Diagnosis System Works
        </h2>
        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            CropSathi AI combines a high-performance <strong>FastAPI</strong> backend with Google’s multimodal <strong>Gemini Vision</strong> architecture.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Diagnostic Workflow:</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px]">
              <li><strong>Integrity Check:</strong> Image bytes are decoded via Pillow to verify file structure, filter out non-image files, and prevent malicious payloads.</li>
              <li><strong>Multimodal Inspection:</strong> The processed leaf image is streamed to the vision model alongside regional Pakistani agronomic context.</li>
              <li><strong>Evidence-Grounded Extraction:</strong> The model evaluates visual evidence (lesions, necrotic patches, chlorotic halos, vein enations) and outputs structured JSON.</li>
              <li><strong>Zero-Hallucination Policy:</strong> If an image is blurry or not a plant leaf, the system classifies it as <em>unclear</em> or <em>unsupported</em> rather than fabricating disease diagnoses.</li>
              <li><strong>Persistence:</strong> Validated diagnoses are stored locally in SQLite database for historical tracking.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Supported Crops */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          Supported Pakistani Crops & Pathogens
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900">Cotton (کپاس):</span> CLCuV (Leaf Curl Virus), Bacterial Blight, Whitefly/Jassid damage, Alternaria spot.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900">Wheat (گندم):</span> Yellow Rust, Brown Rust, Powdery Mildew, Karnal Bunt, Aphid injury.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900">Rice (چاول / ڌانءِ):</span> Rice Blast, Bacterial Leaf Blight, Brown Spot, Stem Borer symptoms.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900">Sugarcane (کماد):</span> Red Rot, Smut, Whip Smut, Sugarcane Pyrilla foliage damage.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900">Chilli & Tomato:</span> Early Blight, Late Blight, Blossom End Rot, Tomato Yellow Leaf Curl.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900">Mango & Citrus:</span> Anthracnose, Citrus Canker, Mango Malformation, Powdery Mildew.
          </div>
        </div>
      </div>

      {/* Data Privacy & Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-3 text-amber-950">
        <h2 className="text-base font-bold flex items-center gap-2 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          Agricultural & Advisory Disclaimer
        </h2>
        <p className="text-xs leading-relaxed">
          CropSathi AI is intended as a digital decision support tool for farmers and extension workers. While our multimodal AI is calibrated against agricultural literature, optical diagnoses alone cannot guarantee laboratory-level certainty.
        </p>
        <p className="text-xs leading-relaxed font-semibold">
          Before applying chemical treatments, systemic fungicides, or insecticides, always verify critical crop symptoms with your certified local agricultural extension officer or district agronomist.
        </p>
      </div>

    </div>
  );
};
