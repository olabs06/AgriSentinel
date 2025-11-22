import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  uid: string;
  name: string;
  phone: string;
  email: string;
  location: {
    state: string;
    lga: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  farms: Farm[];
  preferredLanguage: 'en' | 'yo' | 'ha' | 'ig';
  smsEnabled: boolean;
  fcmTokens: string[];
  role: 'farmer' | 'extension_officer' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Farm {
  id: string;
  name: string;
  size: number; // hectares
  crops: string[];
  soilType: string;
  registeredDate: string;
}

export interface Detection {
  id: string;
  userId: string;
  farmId: string;
  cropType: string;
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  imageUrl: string;
  location: {
    state: string;
    lga: string;
    latitude: number;
    longitude: number;
  };
  analysisSource: 'TFLite' | 'Gemma Vision' | 'TFLite + Gemma';
  advice: string;
  treatment: {
    steps: string[];
    products?: Array<{ name: string; quantity: string }>;
    estimatedCost: string;
    timing?: string;
  };
  weather: WeatherData;
  riskScore?: number;
  timestamp: Timestamp;
  synced: boolean;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  precipitation: number;
  forecast?: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
    condition: string;
  }>;
}

export interface Alert {
  id: string;
  userId: string;
  detectionId?: string;
  type: 'disease_detection' | 'disease_outbreak' | 'weather_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: Record<string, string>;
  sentVia: ('push' | 'sms')[];
  sentAt: Timestamp;
  read: boolean;
}
