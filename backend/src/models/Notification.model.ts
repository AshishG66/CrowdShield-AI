import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  notificationId: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'system' | 'ai' | 'security' | 'report';
  isRead: boolean;
  userId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    notificationId: {
      type: String,
      required: [true, 'Notification ID is required (e.g. NOT-089)'],
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['system', 'ai', 'security', 'report'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = model<INotification>('Notification', NotificationSchema);
export default Notification;
