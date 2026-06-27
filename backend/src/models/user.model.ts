import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'operator' | 'responder' | 'viewer';
  avatarUrl?: string;
  phoneNumber?: string;
  department?: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    mfaEnabled: boolean;
  };
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'operator', 'responder', 'viewer'],
      default: 'viewer',
    },
    avatarUrl: {
      type: String,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      mfaEnabled: {
        type: Boolean,
        default: false,
      },
    },
    lastActiveAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', UserSchema);
export default User;
