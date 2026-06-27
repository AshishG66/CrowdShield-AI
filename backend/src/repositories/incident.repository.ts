import { Incident, IIncident } from '../models/Incident.model';

export class IncidentRepository {
  async findAll(): Promise<IIncident[]> {
    return Incident.find().populate('eventId').populate('venueId');
  }

  async findById(id: string): Promise<IIncident | null> {
    return Incident.findById(id).populate('eventId').populate('venueId');
  }

  async findByEvent(eventId: string): Promise<IIncident[]> {
    return Incident.find({ eventId }).sort({ timestamp: -1 }).populate('eventId').populate('venueId');
  }

  async count(): Promise<number> {
    return Incident.countDocuments();
  }

  async create(data: any): Promise<IIncident> {
    const incident = new Incident(data);
    return incident.save();
  }

  async update(id: string, data: any): Promise<IIncident | null> {
    return Incident.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('eventId')
      .populate('venueId');
  }

  async delete(id: string): Promise<IIncident | null> {
    return Incident.findByIdAndDelete(id);
  }
}

export default IncidentRepository;
