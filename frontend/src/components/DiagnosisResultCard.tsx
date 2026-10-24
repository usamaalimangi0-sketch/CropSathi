import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CropDiagnosisResponse } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  Activity,
  ListChecks,
  Stethoscope,
  Printer,
  MessageSquare,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface Props {
  result: CropDiagnosisResponse;
  onReset?: () => void;
}

export const DiagnosisResultCard: React.FC<Props> = ({ result, onReset }) => {
  const navigate = useNavigate();
  const isRtl = result.language === 'ur';

  // Helper to remove any rogue markdown asterisks from AI responses
  const cleanText = (text?: string): string => {
    if (!text) return '';
    return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  };

  const getStatusBadge = () => {
    switch (result.plant_status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Healthy Plant
          </span>
        );
      case 'possibly_diseased':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Possibly Diseased
          </span>
        );
      case 'unclear':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Unclear / Low Confidence
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
            Unsupported / Non-Plant
          </span>
        );
    }
  };

  const getUrgencyBadge = () => {
    const urg = (result.urgency || 'moderate').toLowerCase();
    const colors: Record<string, string> = {
      low: 'bg-blue-50 text-blue-700 border-blue-200',
      moderate: 'bg-amber-50 text-amber-700 border-amber-200',
      high: 'bg-orange-50 text-orange-700 border-orange-200',
      critical: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${colors[urg] || colors.moderate}`}>
        <Activity className="w-3 h-3" />
        {urg} Priority
      </span>
    );
  };

  const handleAskAssistant = () => {
    const contextPrompt = `I received a diagnosis for my ${result.crop} crop: suspected "${result.diagnosis.name}". Can you explain practical next steps and precautions for a farmer in Pakistan?`;
    navigate('/app?tab=assistant', {
      state: {
        initialQuery: contextPrompt,
        cropContext: `${result.crop} - ${result.diagnosis.name}`
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-agri-800 via-agri-700 to-agri-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {getStatusBadge()}
              {getUrgencyBadge()}
              {result.crop && (
                <span className="bg-white/15 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-0.5 rounded-full border border-white/20">
                  {result.crop}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {cleanText(result.diagnosis.name) || 'Diagnosis Complete'}
            </h2>
            <p className="text-agri-100 text-xs sm:text-sm mt-1">
              Analyzed on {result.created_at ? new Date(result.created_at).toLocaleString() : 'Just now'} • Quality: {result.image_quality}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center print:hidden">
            <button
              onClick={handlePrint}
              title="Print or export PDF report"
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-xs border border-white/15"
            >
              <Printer className="w-4 h-4" />
            </button>
            {onReset && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition backdrop-blur-xs border border-white/15"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Analyze Another
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`p-6 sm:p-8 space-y-8 ${isRtl ? 'font-urdu' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Image preview & reasoning summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {result.image_data && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
              <img
                src={result.image_data}
                alt={result.crop}
                className="w-full h-56 object-cover object-center"
              />
              <div className="p-2 text-center text-[11px] text-slate-500 bg-white border-t border-slate-100">
                {isRtl ? 'اپلوڈ کردہ پتے کی تصویر' : 'Uploaded Leaf Photograph'}
              </div>
            </div>
          )}

          <div className={result.image_data ? 'md:col-span-2 space-y-4' : 'md:col-span-3 space-y-4'}>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-agri-600" />
                {isRtl ? 'طبی شواہد اور زرعی تجزیہ' : 'Visible Evidence & Pathologist Reasoning'}
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-normal">
                {cleanText(result.diagnosis.reasoning_summary) || 'No diagnostic notes provided.'}
              </p>
              {result.diagnosis.confidence !== null && result.diagnosis.confidence !== undefined && (
                <div className="mt-3 text-xs text-slate-500 font-medium">
                  {isRtl ? 'ماڈل کا اعتماد:' : 'Calibrated Model Confidence:'} {(result.diagnosis.confidence * 100).toFixed(1)}%
                </div>
              )}
            </div>

            {/* Quick action button to AI Assistant */}
            <div className="bg-agri-50 border border-agri-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-agri-600 flex items-center justify-center text-white shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-agri-900">
                    {isRtl ? 'اس بیماری کے متعلق کوئی سوال ہے؟' : 'Have questions about this condition?'}
                  </h4>
                  <p className="text-xs text-agri-700">
                    {isRtl ? 'زرعی معاون سے ادویات اور کھاد کے متعلق رہنمائی حاصل کریں۔' : 'Discuss pest management and organic options with the AI assistant.'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleAskAssistant}
                className="inline-flex items-center gap-1.5 bg-agri-700 hover:bg-agri-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap shadow-xs"
              >
                {isRtl ? 'معاون سے پوچھیں' : 'Ask Assistant'} <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Structured Grid: Symptoms, Causes, Recommendations, Prevention */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Observable Symptoms */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              {isRtl ? 'مشاہدہ کردہ علامات' : 'Observable Symptoms'}
            </h4>
            {result.symptoms && result.symptoms.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {result.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span className="leading-relaxed">{cleanText(symptom)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">No specific lesion symptoms recorded.</p>
            )}
          </div>

          {/* Contributing Causes */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              {isRtl ? 'ممکنہ وجوہات' : 'Possible Contributing Causes'}
            </h4>
            {result.possible_causes && result.possible_causes.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {result.possible_causes.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span className="leading-relaxed">{cleanText(cause)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">No pathogens or environmental causes identified.</p>
            )}
          </div>

          {/* Recommended Practical Actions */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-emerald-600" />
              {isRtl ? 'تجویز کردہ عملی اقدامات' : 'Recommended Next Steps'}
            </h4>
            {result.recommended_actions && result.recommended_actions.length > 0 ? (
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {result.recommended_actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{cleanText(action)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">Standard maintenance practices recommended.</p>
            )}
          </div>

          {/* Long-term Preventive Measures */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              {isRtl ? 'حفاظتی اور پیشگی تدابیر' : 'Preventive & Cultural Practices'}
            </h4>
            {result.prevention && result.prevention.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {result.prevention.map((prev, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{cleanText(prev)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">Follow standard field sanitation practices.</p>
            )}
          </div>

        </div>

        {/* Agricultural Disclaimer */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Official Agricultural Advisory Notice:</span> {cleanText(result.disclaimer)}
          </div>
        </div>

      </div>
    </div>
  );
};
