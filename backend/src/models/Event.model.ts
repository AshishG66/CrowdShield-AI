import { Schema, model, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description?: string;
  venueId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  capacity?: number;
  expectedCrowd?: number;
  securityStaff?: number;
  medicalTeam?: number;
  currentOccupancy: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Venue reference (venueId) is required'],
      index: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'active', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    capacity: {
      type: Number,
    },
    expectedCrowd: {
      type: Number,
      default: 0,
    },
    securityStaff: {
      type: Number,
      default: 0,
    },
    medicalTeam: {
      type: Number,
      default: 0,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = model<IEvent>('Event', EventSchema);
export default Event;
