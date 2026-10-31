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
  subscription_tier?: 'free' | 'pro_monthly' | 'kisan_season_pass';
  is_pro?: boolean;
  scans_used?: number;
  monthly_limit?: number;
  scans_remaining?: number | string;
  subscription_expires_at?: string;
  created_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  urdu_name: string;
  price_pkr: number;
  duration: string;
  scans_limit: string;
  features: string[];
  badge?: string;
}

export interface SubscribePaymentRequest {
  plan_id: string;
  payment_gateway: string;
  account_number?: string;
}

export interface SubscribePaymentResponse {
  success: boolean;
  message: string;
  transaction_id: string;
  plan_id: string;
  amount_pkr: number;
  subscription_expires_at?: string;
  user_summary: UserProfile;
}

export interface DosageCalculatorRequest {
  crop: string;
  disease_or_problem: string;
  land_size: number;
  land_unit?: string;
}

export interface DosageCalculatorResponse {
  crop: string;
  problem: string;
  land_size_acres: number;
  chemical_active: string;
  product_trade_name: string;
  recommended_partner: string;
  required_quantity_liters: number;
  water_volume_liters: number;
  sprayer_tanks_20l: number;
  estimated_spray_cost_pkr: number;
  instructions: string[];
}

export interface DealerInfo {
  id: string;
  name: string;
  partner_brand: string;
  district: string;
  address: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  specialties: string[];
  rating: number;
}

export interface LeadConnectRequest {
  dealer_id: string;
  crop: string;
  disease_name: string;
  chemical_prescribed?: string;
}

export interface LeadConnectResponse {
  success: boolean;
  lead_id: string;
  dealer_name: string;
  whatsapp_url: string;
  phone: string;
  message: string;
}

export interface EnterpriseAssessmentRequest {
  farmer_name: string;
  farmer_phone: string;
  district: string;
  crop: string;
  field_size_acres: number;
  observed_disease?: string;
  severity?: string;
  loan_requested_pkr?: number;
}

export interface EnterpriseAssessmentResponse {
  certificate_id: string;
  farmer_name: string;
  district: string;
  crop: string;
  field_risk_index_pct: number;
  crop_health_grade: string;
  loan_eligibility_recommendation: string;
  loss_probability_pct: number;
  verification_hash: string;
  timestamp: string;
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
