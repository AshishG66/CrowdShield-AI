import { CrowdReading, ICrowdReading } from '../models/CrowdReading.model';

export class CrowdReadingRepository {
  async findAll(): Promise<ICrowdReading[]> {
    return CrowdReading.find().populate('eventId').populate('venueId');
  }

  async findById(id: string): Promise<ICrowdReading | null> {
    return CrowdReading.findById(id).populate('eventId').populate('venueId');
  }

  async findByEvent(eventId: string): Promise<ICrowdReading[]> {
    return CrowdReading.find({ eventId }).sort({ timestamp: -1 }).populate('eventId').populate('venueId');
  }

  async create(data: any): Promise<ICrowdReading> {
    const reading = new CrowdReading(data);
    return reading.save();
  }

  async update(id: string, data: any): Promise<ICrowdReading | null> {
    return CrowdReading.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('eventId')
      .populate('venueId');
  }

  async delete(id: string): Promise<ICrowdReading | null> {
    return CrowdReading.findByIdAndDelete(id);
  }
}

export default CrowdReadingRepository;
