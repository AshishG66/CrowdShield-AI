import { z } from 'zod';

export const createReportValidator = z.object({
  body: z.object({
    reportId: z.string().optional(),
    date: z.string().optional(),
    name: z.string().min(1, 'Report name is required'),
    format: z.enum(['PDF', 'Excel', 'CSV']).default('PDF'),
    size: z.string().optional(),
    type: z.enum(['density', 'incidents', 'alarms', 'compliance']).default('density'),
    range: z.enum(['today', 'week', 'month']).default('today'),
    venueId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Venue ID format').optional(),
  }),
});

export const updateReportValidator = z.object({
  body: z.object({
    reportId: z.string().optional(),
    date: z.string().optional(),
    name: z.string().min(1, 'Report name is required').optional(),
    format: z.enum(['PDF', 'Excel', 'CSV']).optional(),
    size: z.string().optional(),
    type: z.enum(['density', 'incidents', 'alarms', 'compliance']).optional(),
    range: z.enum(['today', 'week', 'month']).optional(),
    venueId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Venue ID format').optional(),
  }),
});
