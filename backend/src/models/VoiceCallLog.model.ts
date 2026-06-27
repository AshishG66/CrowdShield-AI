import { Schema, model, Document, Types } from 'mongoose';

export interface IVoiceCallLog extends Document {
  voiceCallLogId: string;
  timestamp: Date;
  responder: string;
  channel: string;
  duration: string;
  signalStrength: number;
  status: 'connected' | 'ended';
  venueId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VoiceCallLogSchema = new Schema<IVoiceCallLog>(
  {
    voiceCallLogId: {
      type: String,
      required: [true, 'Voice Call Log ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    responder: {
      type: String,
      required: [true, 'Responder name is required'],
      trim: true,
    },
    channel: {
      type: String,
      required: [true, 'Channel identifier is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    signalStrength: {
      type: Number,
      required: [true, 'Signal strength is required'],
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['connected', 'ended'],
      default: 'connected',
    },
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const VoiceCallLog = model<IVoiceCallLog>('VoiceCallLog', VoiceCallLogSchema);
export default VoiceCallLog;
