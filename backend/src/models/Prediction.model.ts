import { Schema, model, Document, Types } from 'mongoose';

export interface IChartData {
  time: string;
  density: number;
  limit: number;
}

export interface IPrediction extends Document {
  venueId: Types.ObjectId;
  eventId?: Types.ObjectId;
  timestamp: Date;
  title: string;
  severity: 'info' | 'warning' | 'critical';
  riskLevel: string;
  confidence: number;
  recommendations: string[];
  explanation?: string;
  chartData: IChartData[];
  createdAt: Date;
  updatedAt: Date;
}

const ChartDataSchema = new Schema<IChartData>({
  time: { type: String, required: true },
  density: { type: Number, required: true },
  limit: { type: Number, required: true },
});

const PredictionSchema = new Schema<IPrediction>(
  {
    venueId: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Venue reference (venueId) is required'],
      index: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    riskLevel: {
      type: String,
      required: [true, 'Risk level is required'],
      trim: true,
    },
    confidence: {
      type: Number,
      required: [true, 'Confidence score is required'],
      min: 0,
      max: 100,
    },
    recommendations: {
      type: [String],
      default: [],
    },
    explanation: {
      type: String,
      trim: true,
    },
    chartData: [ChartDataSchema],
  },
  {
    timestamps: true,
  }
);

export const Prediction = model<IPrediction>('Prediction', PredictionSchema);
export default Prediction;
