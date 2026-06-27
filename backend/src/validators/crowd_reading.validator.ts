import { z } from 'zod';

export const createCrowdReadingValidator = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID format'),
    timestamp: z.coerce.date().optional(),
    crowdCount: z.number().int().nonnegative('Crowd count must be non-negative'),
    entryRate: z.number().int().nonnegative('Entry rate must be non-negative'),
    exitRate: z.number().int().nonnegative('Exit rate must be non-negative'),
    temperature: z.number().optional(),
    humidity: z.number().optional(),
    weather: z.string().optional(),
    riskScore: z.number().int().min(0).max(100).optional(),
    threatLevel: z.enum(['Low', 'Elevated', 'Severe']).optional(),
  }),
});

export const updateCrowdReadingValidator = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID format').optional(),
    timestamp: z.coerce.date().optional(),
    crowdCount: z.number().int().nonnegative().optional(),
    entryRate: z.number().int().nonnegative().optional(),
    exitRate: z.number().int().nonnegative().optional(),
    temperature: z.number().optional(),
    humidity: z.number().optional(),
    weather: z.string().optional(),
    riskScore: z.number().int().min(0).max(100).optional(),
    threatLevel: z.enum(['Low', 'Elevated', 'Severe']).optional(),
  }),
});
