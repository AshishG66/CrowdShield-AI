import { z } from 'zod';

const chartDataSchema = z.object({
  time: z.string(),
  density: z.number(),
  limit: z.number(),
});

export const createPredictionValidator = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID format'),
    title: z.string().min(1, 'Title is required'),
    severity: z.enum(['info', 'warning', 'critical']).default('info'),
    riskLevel: z.string().min(1, 'Risk level is required'),
    confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100'),
    recommendations: z.array(z.string()).default([]),
    explanation: z.string().optional(),
    chartData: z.array(chartDataSchema).default([]),
  }),
});

export const updatePredictionValidator = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID format').optional(),
    title: z.string().min(1, 'Title is required').optional(),
    severity: z.enum(['info', 'warning', 'critical']).optional(),
    riskLevel: z.string().min(1, 'Risk level is required').optional(),
    confidence: z.number().min(0).max(100).optional(),
    recommendations: z.array(z.string()).optional(),
    explanation: z.string().optional(),
    chartData: z.array(chartDataSchema).optional(),
  }),
});
