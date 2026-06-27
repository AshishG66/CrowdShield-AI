import { EventRepository } from '../repositories/event.repository';
import { VenueRepository } from '../repositories/venue.repository';
import { IEvent } from '../models/Event.model';
import { ApiError } from '../utils/ApiError';

export class EventService {
  private eventRepository: EventRepository;
  private venueRepository: VenueRepository;

  constructor() {
    this.eventRepository = new EventRepository();
    this.venueRepository = new VenueRepository();
  }

  async getAllEvents(): Promise<IEvent[]> {
    return this.eventRepository.findAll();
  }

  async getEventById(id: string): Promise<IEvent> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new ApiError(404, `Event with ID ${id} not found`);
    }
    return event;
  }

  async createEvent(data: any): Promise<IEvent> {
    // Verify venue exists
    const venue = await this.venueRepository.findById(data.venueId);
    if (!venue) {
      throw new ApiError(404, `Venue with ID ${data.venueId} not found`);
    }
    return this.eventRepository.create(data);
  }

  async updateEvent(id: string, data: any): Promise<IEvent> {
    // Verify event exists
    await this.getEventById(id);

    // Verify venue exists if it is being updated
    if (data.venueId) {
      const venue = await this.venueRepository.findById(data.venueId);
      if (!venue) {
        throw new ApiError(404, `Venue with ID ${data.venueId} not found`);
      }
    }

    const updated = await this.eventRepository.update(id, data);
    if (!updated) {
      throw new ApiError(400, `Failed to update Event with ID ${id}`);
    }
    return updated;
  }

  async deleteEvent(id: string): Promise<IEvent> {
    // Verify event exists
    await this.getEventById(id);

    const deleted = await this.eventRepository.delete(id);
    if (!deleted) {
      throw new ApiError(400, `Failed to delete Event with ID ${id}`);
    }
    return deleted;
  }
}
export default EventService;
