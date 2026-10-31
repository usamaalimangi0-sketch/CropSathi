import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DosageCalculatorResponse, DealerInfo } from '../types';
import {
  Calculator,
  Droplets,
  DollarSign,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  crop: string;
  diseaseName: string;
  userDistrict?: string;
}

export const DosageCalculatorCard: React.FC<Props> = ({ crop, diseaseName, userDistrict }) => {
  const [landSize, setLandSize] = useState<number>(5.0);
  const [landUnit, setLandUnit] = useState<string>('acres');
  const [dosage, setDosage] = useState<DosageCalculatorResponse | null>(null);
  const [dealers, setDealers] = useState<DealerInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectingDealerId, setConnectingDealerId] = useState<string | null>(null);

  const fetchCalculation = async () => {
    setLoading(true);
    try {
      const res = await api.calculateDosage({
        crop,
        disease_or_problem: diseaseName,
        land_size: landSize,
        land_unit: landUnit
      });
      setDosage(res);
    } catch (err) {
      console.error('Dosage calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDealers = async () => {
    try {
      const list = await api.getDealers(userDistrict || 'Sukkur, Sindh');
      setDealers(list);
    } catch (err) {
      console.error('Failed to load dealers:', err);
    }
  };

  useEffect(() => {
    fetchCalculation();
    fetchDealers();
  }, [crop, diseaseName, landSize, landUnit]);

  const handleConnectDealer = async (dealerId: string) => {
    setConnectingDealerId(dealerId);
    try {
      const lead = await api.connectDealer({
        dealer_id: dealerId,
        crop,
        disease_name: diseaseName,
        chemical_prescribed: dosage?.product_trade_name || dosage?.chemical_active
      });

      if (lead.whatsapp_url) {
        window.open(lead.whatsapp_url, '_blank');
      }
    } catch (err) {
      console.error('Lead connect error:', err);
    } finally {
      setConnectingDealerId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Precision Chemical & Dosage Calculator</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
            Exact Spray & Fertilizer Dosage for {crop} (سپرے کیلکولیٹر)
          </h3>
          <p className="text-xs text-slate-500">
            Based on Pakistan Central Cotton Committee (PCCC) & NARC agronomic standards.
          </p>
        </div>

        {/* Land Size Inputs */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <label className="text-xs font-bold text-slate-700">Land Area:</label>
          <input
            type="number"
            min="0.5"
            max="500"
            step="0.5"
            value={landSize}
            onChange={(e) => setLandSize(parseFloat(e.target.value) || 1)}
            className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 text-center"
          />
          <select
            value={landUnit}
            onChange={(e) => setLandUnit(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50"
          >
            <option value="acres">Acres (ایکڑ)</option>
            <option value="kanals">Kanals (کنال)</option>
          </select>
        </div>
      </div>

      {/* Calculated Metric Cards */}
      {dosage && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Chemical Required</span>
            <span className="text-lg font-black text-emerald-950 mt-0.5 block">{dosage.required_quantity_liters} Liters</span>
            <span className="text-[10px] text-emerald-700 truncate block">{dosage.chemical_active}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">Water Volume</span>
            <span className="text-lg font-black text-blue-950 mt-0.5 block">{dosage.water_volume_liters} Liters</span>
            <span className="text-[10px] text-blue-700 block">Clean well/tubewell water</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Sprayer Tanks</span>
            <span className="text-lg font-black text-amber-950 mt-0.5 block">{dosage.sprayer_tanks_20l} Tanks</span>
            <span className="text-[10px] text-amber-700 block">Standard 20L knapsack</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">Estimated Cost</span>
            <span className="text-lg font-black text-purple-950 mt-0.5 block">PKR {dosage.estimated_spray_cost_pkr.toLocaleString()}</span>
            <span className="text-[10px] text-purple-700 block">Market retail rate</span>
          </div>
        </div>
      )}

      {/* Recommended Formulation Box */}
      {dosage && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Verified Formulation:</span>
            <div className="text-sm font-bold text-slate-900">{dosage.product_trade_name}</div>
            <div className="text-[11px] text-slate-500">Authorized by {dosage.recommended_partner}</div>
          </div>
          <div className="space-y-1">
            {dosage.instructions.map((inst, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{inst}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pillar B: Nearby Verified Dealers with Lead Connect */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-agri-600" />
            <span>Authorized Pesticide & Fertilizer Dealers Near {userDistrict || 'Sukkur'}</span>
          </h4>
          <span className="text-[11px] text-emerald-700 font-bold">Verified Partners</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dealers.map((dealer) => (
            <div key={dealer.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition flex flex-col justify-between gap-2.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{dealer.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    ★ {dealer.rating}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{dealer.address}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {dealer.specialties.slice(0, 3).map((sp, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleConnectDealer(dealer.id)}
                  disabled={connectingDealerId === dealer.id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{connectingDealerId === dealer.id ? 'Connecting...' : 'Order on WhatsApp'}</span>
                </button>
                <a
                  href={`tel:${dealer.phone}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Call Dealer"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
