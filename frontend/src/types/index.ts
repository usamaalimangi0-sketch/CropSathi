export interface DiagnosisInfo {
  name: string;
  confidence: number | null;
  reasoning_summary: string;
}

export interface CropDiagnosisResponse {
  id?: string;
  crop: string;
  image_quality: 'good' | 'low' | 'blurry' | 'unclear';
  plant_status: 'healthy' | 'possibly_diseased' | 'unclear' | 'unsupported';
  diagnosis: DiagnosisInfo;
  symptoms: string[];
  possible_causes: string[];
  recommended_actions: string[];
  prevention: string[];
  urgency: 'low' | 'moderate' | 'high' | 'critical';
  language: 'en' | 'ur';
  disclaimer: string;
  image_data?: string;
  created_at?: string;
  is_mock?: boolean;
}

export interface ScanListItem {
  id: string;
  crop: string;
  plant_status: string;
  diagnosis_name: string | null;
  confidence: number | null;
  analysis_summary: string | null;
  urgency: string;
  created_at: string | null;
  image_data: string | null;
}

export interface ScanListResponse {
  total: number;
  items: ScanListItem[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  crop_context?: string;
  language?: string;
}

export interface ChatResponse {
  reply: string;
  suggested_followups: string[];
  language: string;
}

export interface IrrigationRequest {
  crop: string;
  location?: string;
  soil_type?: string;
  growth_stage?: string;
  latitude?: number;
  longitude?: number;
}

export interface IrrigationResponse {
  crop: string;
  location: string;
  soil_type: string;
  growth_stage: string;
  watering_advice: string;
  urgency: 'low' | 'normal' | 'high' | 'hold';
  soil_moisture_estimate: string;
  weather_summary?: {
    temperature_c?: number;
    relative_humidity_pct?: number;
    precipitation_mm?: number;
    wind_speed_kmh?: number;
    soil_moisture_pct?: number;
    time?: string;
  };
  guidelines: string[];
  data_source: string;
}

export interface SystemHealth {
  status: string;
  service: string;
  version: string;
  database: string;
  timestamp: string;
}

export interface AiHealth {
  ai_service: string;
  model: string;
  is_configured: boolean;
  status: 'ready' | 'configuration_required';
  instructions: string;
}

export interface UserProfile {
  id: string;
  phone_or_email: string;
  full_name: string;
  district: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface LoginPayload {
  phone_or_email: string;
  password: string;
}

export interface RegisterPayload {
  phone_or_email: string;
  full_name: string;
  password: string;
  district?: string;
}
