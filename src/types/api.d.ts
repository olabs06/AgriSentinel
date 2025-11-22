export interface MLPredictionRequest {
  image: string; // base64
  cropType: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface MLPredictionResponse {
  disease: string;
  confidence: number;
  source: 'TFLite' | 'Gemma Vision' | 'TFLite + Gemma';
  advice: string;
  treatment: {
    steps: string[];
    products?: Array<{ name: string; quantity: string }>;
    estimatedCost: string;
  };
  processingTime: number;
}