import { Schema, model, Document, Types } from 'mongoose';

export interface ISmsLog extends Document {
  smsLogId: string;
  timestamp: Date;
  sector: string;
  message: string;
  audienceCount: number;
  status: 'delivered' | 'pending' | 'failed';
  venueId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SmsLogSchema = new Schema<ISmsLog>(
  {
    smsLogId: {
      type: String,
      required: [true, 'SMS Log ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    sector: {
      type: String,
      required: [true, 'Sector is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message body is required'],
      trim: true,
    },
    audienceCount: {
      type: Number,
      required: [true, 'Audience count is required'],
    },
    status: {
      type: String,
      enum: ['delivered', 'pending', 'failed'],
      default: 'pending',
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

export const SmsLog = model<ISmsLog>('SmsLog', SmsLogSchema);
export default SmsLog;
