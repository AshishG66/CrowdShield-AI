import { Event, IEvent } from '../models/Event.model';

export class EventRepository {
  async findAll(): Promise<IEvent[]> {
    return Event.find().populate('venueId');
  }

  async findById(id: string): Promise<IEvent | null> {
    return Event.findById(id).populate('venueId');
  }

  async findActiveByVenue(venueId: string): Promise<IEvent[]> {
    return Event.find({ venueId, status: 'active' });
  }

  async create(data: any): Promise<IEvent> {
    const event = new Event(data);
    return event.save();
  }

  async update(id: string, data: any): Promise<IEvent | null> {
    return Event.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('venueId');
  }

  async delete(id: string): Promise<IEvent | null> {
    return Event.findByIdAndDelete(id);
  }
}
export default EventRepository;
