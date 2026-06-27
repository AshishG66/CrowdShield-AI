import { Schema, model, Document } from 'mongoose';

export interface ISector {
  name: string;
  occupancy: number;
  capacity: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  exits: string;
  staff: number;
  cameras: string;
}

export interface IVenue extends Document {
  name: string;
  type: string;
  city: string;
  state: string;
  country: string;
  capacity: number;
  occupancy: number;
  riskScore: number;
  latitude: number;
  longitude: number;
  entryGates: number;
  exitGates: number;
  emergencyExits: number;
  status: 'Active' | 'Inactive' | 'secure' | 'elevated' | 'emergency';
  cameraStatus?: {
    online: number;
    total: number;
    degraded: number;
  };
  securityStaff?: {
    active: number;
    standby: number;
  };
  sectors?: ISector[];
  createdAt: Date;
  updatedAt: Date;
}

const SectorSchema = new Schema<ISector>({
  name: { type: String, required: true },
  occupancy: { type: Number, default: 0 },
  capacity: { type: Number, required: true },
  risk: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },
  exits: { type: String, default: '6/6 Open' },
  staff: { type: Number, default: 0 },
  cameras: { type: String, default: '24/24 Online' },
});

const VenueSchema = new Schema<IVenue>(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Venue type is required'],
      default: 'Stadium',
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'India',
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
    },
    occupancy: {
      type: Number,
      default: 0,
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    entryGates: {
      type: Number,
      required: [true, 'Number of entry gates is required'],
      default: 0,
    },
    exitGates: {
      type: Number,
      required: [true, 'Number of exit gates is required'],
      default: 0,
    },
    emergencyExits: {
      type: Number,
      required: [true, 'Number of emergency exits is required'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'secure', 'elevated', 'emergency'],
      default: 'Active',
    },
    cameraStatus: {
      online: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      degraded: { type: Number, default: 0 },
    },
    securityStaff: {
      active: { type: Number, default: 0 },
      standby: { type: Number, default: 0 },
    },
    sectors: [SectorSchema],
  },
  {
    timestamps: true,
  }
);

export const Venue = model<IVenue>('Venue', VenueSchema);
export default Venue;
