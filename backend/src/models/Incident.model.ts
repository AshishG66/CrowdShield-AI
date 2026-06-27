import { Schema, model, Document, Types } from 'mongoose';

export interface IIncident extends Document {
  incidentId: string;
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  status: 'active' | 'investigating' | 'resolved';
  assignedOfficer?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  comments: string[];
  resolution?: string;
  venueId?: Types.ObjectId;
  eventId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>(
  {
    incidentId: {
      type: String,
      required: [true, 'Incident ID is required (e.g. INC-342)'],
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'warning',
    },
    status: {
      type: String,
      enum: ['active', 'investigating', 'resolved'],
      default: 'active',
    },
    assignedOfficer: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    comments: {
      type: [String],
      default: [],
    },
    resolution: {
      type: String,
      trim: true,
    },
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      index: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Incident = model<IIncident>('Incident', IncidentSchema);
export default Incident;
