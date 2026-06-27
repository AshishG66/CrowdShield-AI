import { z } from 'zod';

const sectorSchema = z.object({
  name: z.string().min(1, 'Sector name is required'),
  occupancy: z.number().int().nonnegative().default(0),
  capacity: z.number().int().positive('Capacity must be positive'),
  risk: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
  exits: z.string().default('6/6 Open'),
  staff: z.number().int().nonnegative().default(0),
  cameras: z.string().default('24/24 Online'),
});

export const createVenueValidator = z.object({
  body: z.object({
    name: z.string().min(1, 'Venue name is required'),
    type: z.string().min(1, 'Venue type is required').default('Stadium'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required').default('India'),
    capacity: z.number().int().positive('Capacity must be positive'),
    occupancy: z.number().int().nonnegative().default(0),
    riskScore: z.number().int().min(0).max(100).default(0),
    latitude: z.number({ message: 'Latitude must be a number' }),
    longitude: z.number({ message: 'Longitude must be a number' }),
    entryGates: z.number().int().nonnegative().default(0),
    exitGates: z.number().int().nonnegative().default(0),
    emergencyExits: z.number().int().nonnegative().default(0),
    status: z.enum(['Active', 'Inactive', 'secure', 'elevated', 'emergency']).default('Active'),
    cameraStatus: z.object({
      online: z.number().int().nonnegative().default(0),
      total: z.number().int().nonnegative().default(0),
      degraded: z.number().int().nonnegative().default(0),
    }).default({ online: 0, total: 0, degraded: 0 }),
    securityStaff: z.object({
      active: z.number().int().nonnegative().default(0),
      standby: z.number().int().nonnegative().default(0),
    }).default({ active: 0, standby: 0 }),
    sectors: z.array(sectorSchema).default([]),
  }),
});

export const updateVenueValidator = z.object({
  body: z.object({
    name: z.string().min(1, 'Venue name is required').optional(),
    type: z.string().min(1, 'Venue type is required').optional(),
    city: z.string().min(1, 'City is required').optional(),
    state: z.string().min(1, 'State is required').optional(),
    country: z.string().min(1, 'Country is required').optional(),
    capacity: z.number().int().positive('Capacity must be positive').optional(),
    occupancy: z.number().int().nonnegative().optional(),
    riskScore: z.number().int().min(0).max(100).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    entryGates: z.number().int().nonnegative().optional(),
    exitGates: z.number().int().nonnegative().optional(),
    emergencyExits: z.number().int().nonnegative().optional(),
    status: z.enum(['Active', 'Inactive', 'secure', 'elevated', 'emergency']).optional(),
    cameraStatus: z.object({
      online: z.number().int().nonnegative().optional(),
      total: z.number().int().nonnegative().optional(),
      degraded: z.number().int().nonnegative().optional(),
    }).optional(),
    securityStaff: z.object({
      active: z.number().int().nonnegative().optional(),
      standby: z.number().int().nonnegative().optional(),
    }).optional(),
    sectors: z.array(sectorSchema).optional(),
  }),
});
