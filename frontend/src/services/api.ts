import axios from 'axios';
import {
  CropDiagnosisResponse,
  ScanListResponse,
  ChatRequest,
  ChatResponse,
  IrrigationRequest,
  IrrigationResponse,
  SystemHealth,
  AiHealth,
  UserProfile,
  AuthResponse,
  LoginPayload,
  RegisterPayload
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 35000, // 35 seconds for image inference
  headers: {
    'Accept': 'application/json',
  }
});

// Automatic Bearer Token Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cropsathi_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Authentication & Profile
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  async getMe(): Promise<UserProfile> {
    const res = await apiClient.get<UserProfile>('/auth/me');
    return res.data;
  },

  // System Health
  async getHealth(): Promise<SystemHealth> {
    const res = await apiClient.get<SystemHealth>('/health');
    return res.data;
  },

  async getAiHealth(): Promise<AiHealth> {
    const res = await apiClient.get<AiHealth>('/health/ai');
    return res.data;
  },

  // Crop Diagnosis
  async diagnoseCrop(
    file: File,
    crop?: string,
    symptoms?: string,
    language: string = 'en'
  ): Promise<CropDiagnosisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (crop) formData.append('crop', crop);
    if (symptoms) formData.append('symptoms', symptoms);
    formData.append('language', language);

    const res = await apiClient.post<CropDiagnosisResponse>('/diagnose', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return res.data;
  },

  // Scan History
  async getScans(params?: {
    crop?: string;
    search?: string;
    plant_status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ScanListResponse> {
    const res = await apiClient.get<ScanListResponse>('/scans', { params });
    return res.data;
  },

  async getScan(id: string): Promise<CropDiagnosisResponse> {
    const res = await apiClient.get<CropDiagnosisResponse>(`/scans/${id}`);
    return res.data;
  },

  async deleteScan(id: string): Promise<{ message: string; id: string }> {
    const res = await apiClient.delete<{ message: string; id: string }>(`/scans/${id}`);
    return res.data;
  },

  // Farming Assistant
  async sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
    const res = await apiClient.post<ChatResponse>('/chat', payload);
    return res.data;
  },

  // Smart Irrigation Advisor
  async getIrrigationAdvice(payload: IrrigationRequest): Promise<IrrigationResponse> {
    const res = await apiClient.post<IrrigationResponse>('/irrigation/advice', payload);
    return res.data;
  }
};
