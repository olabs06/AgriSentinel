import { z } from 'zod';

export const schemas = {
  detection: z.object({
    cropType: z.enum(['cassava', 'tomato', 'maize', 'rice', 'beans']),
    farmId: z.string(),
    location: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
  }),

  user: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().regex(/^\+234\d{10}$/),
    email: z.string().email(),
    preferredLanguage: z.enum(['en', 'yo', 'ha', 'ig']),
    location: z.object({
      state: z.string(),
      lga: z.string(),
      coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    }),
  }),

  farm: z.object({
    name: z.string().min(2).max(100),
    size: z.number().positive().max(1000),
    crops: z.array(z.string()).min(1),
    soilType: z.string(),
  }),
};