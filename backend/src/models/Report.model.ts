import { Schema, model, Document, Types } from 'mongoose';

export interface IReport extends Document {
  reportId: string;
  date: string;
  name: string;
  format: 'PDF' | 'Excel' | 'CSV';
  size: string;
  type: 'density' | 'incidents' | 'alarms' | 'compliance';
  range: 'today' | 'week' | 'month';
  venueId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reportId: {
      type: String,
      required: [true, 'Report ID is required (e.g. REP-431)'],
      unique: true,
      trim: true,
      index: true,
    },
    date: {
      type: String,
      required: [true, 'Date string is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Report name is required'],
      trim: true,
    },
    format: {
      type: String,
      enum: ['PDF', 'Excel', 'CSV'],
      default: 'PDF',
    },
    size: {
      type: String,
      required: [true, 'Report file size is required (e.g. 2.4 MB)'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['density', 'incidents', 'alarms', 'compliance'],
      default: 'density',
    },
    range: {
      type: String,
      enum: ['today', 'week', 'month'],
      default: 'today',
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

export const Report = model<IReport>('Report', ReportSchema);
export default Report;
