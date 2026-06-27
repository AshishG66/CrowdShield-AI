import { Prediction, IPrediction } from '../models/Prediction.model';

export class PredictionRepository {
  async findAll(): Promise<IPrediction[]> {
    return Prediction.find().populate('eventId').populate('venueId');
  }

  async findById(id: string): Promise<IPrediction | null> {
    return Prediction.findById(id).populate('eventId').populate('venueId');
  }

  async findByEvent(eventId: string): Promise<IPrediction[]> {
    return Prediction.find({ eventId }).sort({ timestamp: -1 }).populate('eventId').populate('venueId');
  }

  async create(data: any): Promise<IPrediction> {
    const prediction = new Prediction(data);
    return prediction.save();
  }

  async update(id: string, data: any): Promise<IPrediction | null> {
    return Prediction.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('eventId')
      .populate('venueId');
  }

  async delete(id: string): Promise<IPrediction | null> {
    return Prediction.findByIdAndDelete(id);
  }
}

export default PredictionRepository;
