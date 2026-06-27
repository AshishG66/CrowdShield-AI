import { z } from 'zod';

export const createEventValidator = z.object({
  body: z.object({
    title: z.string().min(1, 'Event title is required'),
    description: z.string().optional(),
    venueId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Venue ID format'),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    status: z.enum(['scheduled', 'active', 'completed', 'cancelled']).default('scheduled'),
    capacity: z.number().int().positive().optional(),
    expectedCrowd: z.number().int().nonnegative().default(0),
    securityStaff: z.number().int().nonnegative().default(0),
    medicalTeam: z.number().int().nonnegative().default(0),
    currentOccupancy: z.number().int().nonnegative().default(0),
  }).refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  }),
});

export const updateEventValidator = z.object({
  body: z.object({
    title: z.string().min(1, 'Event title is required').optional(),
    description: z.string().optional(),
    venueId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Venue ID format').optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    status: z.enum(['scheduled', 'active', 'completed', 'cancelled']).optional(),
    capacity: z.number().int().positive().optional(),
    expectedCrowd: z.number().int().nonnegative().optional(),
    securityStaff: z.number().int().nonnegative().optional(),
    medicalTeam: z.number().int().nonnegative().optional(),
    currentOccupancy: z.number().int().nonnegative().optional(),
  }).refine((data) => {
    if (data.startTime && data.endTime) {
      return data.endTime > data.startTime;
    }
    return true;
  }, {
    message: 'End time must be after start time',
    path: ['endTime'],
  }),
});
