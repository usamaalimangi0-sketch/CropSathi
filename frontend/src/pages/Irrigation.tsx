import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { IrrigationResponse } from '../types';
import {
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
  MapPin,
  Leaf
} from 'lucide-react';

const PAKISTAN_LOCATIONS = [
  { name: 'Hyderabad, Sindh', lat: 25.3960, lon: 68.3578 },
  { name: 'Sukkur, Sindh', lat: 27.7052, lon: 68.8574 },
  { name: 'Larkana, Sindh', lat: 27.5589, lon: 68.2120 },
  { name: 'Mirpur Khas, Sindh', lat: 25.5269, lon: 69.0111 },
  { name: 'Nawabshah, Sindh', lat: 26.2483, lon: 68.4096 },
  { name: 'Multan, Punjab', lat: 30.1575, lon: 71.5249 },
  { name: 'Bahawalpur, Punjab', lat: 29.3544, lon: 71.6911 },
  { name: 'Faisalabad, Punjab', lat: 31.4504, lon: 73.1350 },
  { name: 'Sahiwal, Punjab', lat: 30.6682, lon: 73.1114 },
  { name: 'Peshawar, KPK', lat: 34.0151, lon: 71.5249 },
  { name: 'Quetta, Balochistan', lat: 30.1798, lon: 66.9750 },
];

const CROPS = [
  'Cotton',
  'Wheat',
  'Rice',
  'Sugarcane',
  'Tomato',
  'Chilli',
  'Maize'
];

const GROWTH_STAGES = [
  'Seedling / Emergence',
  'Vegetative Growth',
  'Tillering / Flowering',
  'Fruiting / Boll Formation',
  'Maturity / Pre-harvest'
];

const SOIL_TYPES = [
  'Loam / Alluvial Loam',
  'Clay-Loam (Heavy)',
  'Sandy Loam (Fast Draining)',
  'Saline / Sodic Soil'
];

export const IrrigationPage: React.FC = () => {
  const [location, setLocation] = useState(PAKISTAN_LOCATIONS[0].name);
  const [crop, setCrop] = useState(CROPS[0]);
  const [growthStage, setGrowthStage] = useState(GROWTH_STAGES[1]);
  const [soilType, setSoilType] = useState(SOIL_TYPES[0]);
  
  const [advice, setAdvice] = useState<IrrigationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const selectedLoc = PAKISTAN_LOCATIONS.find(l => l.name === location);
      const res = await api.getIrrigationAdvice({
        crop,
        location,
        soil_type: soilType,
        growth_stage: growthStage,
        latitude: selectedLoc?.lat,
        longitude: selectedLoc?.lon
      });
      setAdvice(res);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch agro-meteorology data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [location, crop, growthStage, soilType]);

  const getUrgencyBadge = (urg: string) => {
    switch (urg) {
      case 'hold':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <CloudRain className="w-4 h-4 text-blue-600" />
            Hold Irrigation (Rain Recorded)
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            High Irrigation Urgency (Heat Stress)
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <CheckCircle2 className="w-4 h-4 text-slate-600" />
            Low Demand (Cooler Weather)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <Droplets className="w-4 h-4 text-emerald-600" />
            Normal Recommended Interval
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <CloudRain className="w-3.5 h-3.5" />
          <span>Real-time Agro-Meteorology</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Smart Irrigation Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Tailored watering schedules computed by combining live Open-Meteo weather observations with crop growth stages in Pakistan.
        </p>
      </div>

      {/* Input Parameter Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-agri-600" /> District / Region
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-agri-500"
            >
              {PAKISTAN_LOCATIONS.map(loc => (
                <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Crop */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Crop
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-agri-500"
            >
              {CROPS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Growth Stage */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" /> Stage
            </label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-agri-500"
            >
              {GROWTH_STAGES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Soil Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-600" /> Soil Type
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-agri-500"
            >
              {SOIL_TYPES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Live Results Card */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Querying Open-Meteo weather station for {location}...</p>
        </div>
      ) : advice ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-6">
          
          {/* Weather Status Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Live Agrometeorology • {advice.location}
                </span>
                <h3 className="text-xl font-bold mt-0.5">
                  Irrigation Guidance for {advice.crop}
                </h3>
              </div>
              <div>{getUrgencyBadge(advice.urgency)}</div>
            </div>

            {/* Live Weather Metrics */}
            {advice.weather_summary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-700 text-xs">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature
                  </span>
                  <div className="text-lg font-bold text-white mt-1">
                    {advice.weather_summary.temperature_c}°C
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
                  </span>
                  <div className="text-lg font-bold text-white mt-1">
                    {advice.weather_summary.relative_humidity_pct}%
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Precipitation
                  </span>
                  <div className="text-lg font-bold text-white mt-1">
                    {advice.weather_summary.precipitation_mm} mm
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-slate-300" /> Wind Speed
                  </span>
                  <div className="text-lg font-bold text-white mt-1">
                    {advice.weather_summary.wind_speed_kmh} km/h
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advice Body */}
          <div className="p-6 space-y-6">
            
            {/* Primary Advice Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                Watering Recommendation
              </h4>
              <p className="text-sm font-semibold text-blue-950 leading-relaxed">
                {advice.watering_advice}
              </p>
              <div className="mt-2 text-xs text-blue-700">
                Topsoil Moisture: <strong>{advice.soil_moisture_estimate}</strong>
              </div>
            </div>

            {/* Stage-Specific Field Guidelines */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Agronomic Field Precautions for {advice.crop} ({advice.growth_stage})
              </h4>
              <div className="space-y-2">
                {advice.guidelines.map((guide, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{guide}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Source Transparency */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Source: {advice.data_source}</span>
              <span>Updated: {advice.weather_summary?.time || 'Live'}</span>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
