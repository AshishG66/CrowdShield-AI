import { VenueRepository } from '../repositories/venue.repository';
import { IVenue } from '../models/Venue.model';

export class VenueService {
  private venueRepository: VenueRepository;

  constructor() {
    this.venueRepository = new VenueRepository();
  }

  async getAllVenues(): Promise<IVenue[]> {
    return this.venueRepository.findAll();
  }

  async getVenueById(id: string): Promise<IVenue> {
    const venue = await this.venueRepository.findById(id);
    if (!venue) {
      const err = new Error(`Venue with ID ${id} not found`);
      (err as any).status = 404;
      throw err;
    }
    return venue;
  }

  async createVenue(data: any): Promise<IVenue> {
    const existing = await this.venueRepository.findByName(data.name);
    if (existing) {
      const err = new Error(`Venue with name "${data.name}" already exists`);
      (err as any).status = 400;
      throw err;
    }
    return this.venueRepository.create(data);
  }

  async updateVenue(id: string, data: any): Promise<IVenue> {
    // Check if exists
    await this.getVenueById(id);
    
    const updated = await this.venueRepository.update(id, data);
    if (!updated) {
      const err = new Error(`Failed to update Venue with ID ${id}`);
      (err as any).status = 400;
      throw err;
    }
    return updated;
  }

  async deleteVenue(id: string): Promise<IVenue> {
    // Check if exists
    await this.getVenueById(id);
    
    const deleted = await this.venueRepository.delete(id);
    if (!deleted) {
      const err = new Error(`Failed to delete Venue with ID ${id}`);
      (err as any).status = 400;
      throw err;
    }
    return deleted;
  }
}
export default VenueService;
