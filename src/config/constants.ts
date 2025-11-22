export const CROPS = {
  CASSAVA: 'cassava',
  TOMATO: 'tomato',
  MAIZE: 'maize',
  RICE: 'rice',
  BEANS: 'beans',
} as const;

export const LANGUAGES = {
  ENGLISH: 'en',
  YORUBA: 'yo',
  HAUSA: 'ha',
  IGBO: 'ig',
} as const;

export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const USER_ROLES = {
  FARMER: 'farmer',
  EXTENSION_OFFICER: 'extension_officer',
  ADMIN: 'admin',
} as const;

export const DETECTION_SOURCE = {
  TFLITE: 'TFLite',
  GEMMA: 'Gemma Vision',
  HYBRID: 'TFLite + Gemma',
} as const;