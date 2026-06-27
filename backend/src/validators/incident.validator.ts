import { z } from 'zod';

export const createIncidentValidator = z.object({
  body: z.object({
    incidentId: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    location: z.string().min(1, 'Location is required'),
    timestamp: z.coerce.date().optional(),
    severity: z.enum(['info', 'warning', 'critical']).default('warning'),
    status: z.enum(['active', 'investigating', 'resolved']).default('active'),
    assignedOfficer: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    comments: z.array(z.string()).default([]),
    resolution: z.string().optional(),
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID format').optional(),
    venueId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Venue ID format').optional(),
  }),
});

export const updateIncidentValidator = z.object({
  body: z.object({
    incidentId: z.string().optional(),
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    location: z.string().min(1, 'Location is required').optional(),
    timestamp: z.coerce.date().optional(),
    severity: z.enum(['info', 'warning', 'critical']).optional(),
    status: z.enum(['active', 'investigating', 'resolved']).optional(),
    assignedOfficer: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    comments: z.array(z.string()).optional(),
    resolution: z.string().optional(),
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID format').optional(),
    venueId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Venue ID format').optional(),
  }),
});
