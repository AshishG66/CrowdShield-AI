import { Schema, model, Document, Types } from 'mongoose';

export interface ICrowdReading extends Document {
  eventId: Types.ObjectId;
  venueId?: Types.ObjectId;
  timestamp: Date;
  crowdCount: number;
  entryRate: number;
  exitRate: number;
  temperature?: number;
  humidity?: number;
  weather?: string;
  riskScore: number;
  threatLevel: 'Low' | 'Elevated' | 'Severe';
  createdAt: Date;
  updatedAt: Date;
}

const CrowdReadingSchema = new Schema<ICrowdReading>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference (eventId) is required'],
      index: true,
    },
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    crowdCount: {
      type: Number,
      required: [true, 'Crowd count is required'],
    },
    entryRate: {
      type: Number,
      required: [true, 'Entry rate is required'],
    },
    exitRate: {
      type: Number,
      required: [true, 'Exit rate is required'],
    },
    temperature: {
      type: Number,
    },
    humidity: {
      type: Number,
    },
    weather: {
      type: String,
      trim: true,
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    threatLevel: {
      type: String,
      enum: ['Low', 'Elevated', 'Severe'],
      default: 'Low',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-populate venueId from Event on save
CrowdReadingSchema.pre('save', async function (next) {
  if (this.isModified('eventId') || !this.venueId) {
    try {
      const Event = model('Event');
      const eventDoc = await Event.findById(this.eventId);
      if (eventDoc) {
        this.venueId = (eventDoc as any).venueId;
      }
    } catch (err) {
      // Ignore lookup errors
    }
  }
  next();
});

export const CrowdReading = model<ICrowdReading>('CrowdReading', CrowdReadingSchema);
export default CrowdReading;
