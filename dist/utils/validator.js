"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const zod_1 = require("zod");
exports.schemas = {
    detection: zod_1.z.object({
        cropType: zod_1.z.enum(['cassava', 'tomato', 'maize', 'rice', 'beans']),
        farmId: zod_1.z.string(),
        location: zod_1.z.object({
            latitude: zod_1.z.number().min(-90).max(90),
            longitude: zod_1.z.number().min(-180).max(180),
        }),
    }),
    user: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        phone: zod_1.z.string().regex(/^\+234\d{10}$/),
        email: zod_1.z.string().email(),
        preferredLanguage: zod_1.z.enum(['en', 'yo', 'ha', 'ig']),
        location: zod_1.z.object({
            state: zod_1.z.string(),
            lga: zod_1.z.string(),
            coordinates: zod_1.z.object({
                latitude: zod_1.z.number(),
                longitude: zod_1.z.number(),
            }),
        }),
    }),
    farm: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        size: zod_1.z.number().positive().max(1000),
        crops: zod_1.z.array(zod_1.z.string()).min(1),
        soilType: zod_1.z.string(),
    }),
};
//# sourceMappingURL=validator.js.map