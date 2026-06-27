import { Venue, IVenue } from '../models/Venue.model';

export class VenueRepository {
  async findAll(): Promise<IVenue[]> {
    return Venue.find();
  }

  async findById(id: string): Promise<IVenue | null> {
    return Venue.findById(id);
  }

  async findByName(name: string): Promise<IVenue | null> {
    return Venue.findOne({ name });
  }

  async create(data: any): Promise<IVenue> {
    const venue = new Venue(data);
    return venue.save();
  }

  async update(id: string, data: any): Promise<IVenue | null> {
    return Venue.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<IVenue | null> {
    return Venue.findByIdAndDelete(id);
  }
}
