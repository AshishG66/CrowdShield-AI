import { CrowdReadingRepository } from '../repositories/crowd_reading.repository';
import { EventRepository } from '../repositories/event.repository';
import { PredictionService } from './prediction.service';
import { ICrowdReading } from '../models/CrowdReading.model';
import { ApiError } from '../utils/ApiError';

export class CrowdReadingService {
  private crowdReadingRepository: CrowdReadingRepository;
  private eventRepository: EventRepository;

  constructor() {
    this.crowdReadingRepository = new CrowdReadingRepository();
    this.eventRepository = new EventRepository();
  }

  async getAllReadings(): Promise<ICrowdReading[]> {
    return this.crowdReadingRepository.findAll();
  }

  async getReadingById(id: string): Promise<ICrowdReading> {
    const reading = await this.crowdReadingRepository.findById(id);
    if (!reading) {
      throw new ApiError(404, `Crowd reading with ID ${id} not found`);
    }
    return reading;
  }

  async getReadingsByEvent(eventId: string): Promise<ICrowdReading[]> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, `Event with ID ${eventId} not found`);
    }
    return this.crowdReadingRepository.findByEvent(eventId);
  }

  async createReading(data: any): Promise<ICrowdReading> {
    // Verify event exists
    const event = await this.eventRepository.findById(data.eventId);
    if (!event) {
      throw new ApiError(404, `Event with ID ${data.eventId} not found`);
    }

    // Auto-calculate risk score if not provided
    if (data.riskScore === undefined) {
      const expected = event.expectedCrowd || event.capacity || 10000;
      const ratio = data.crowdCount / expected;
      const rateFactor = Math.min(40, Math.round((data.entryRate - data.exitRate) / 5));
      const baseRisk = Math.round(ratio * 50);
      data.riskScore = Math.max(0, Math.min(100, baseRisk + rateFactor));
    }

    // Auto-calculate threat level based on risk score
    if (!data.threatLevel) {
      if (data.riskScore > 75) {
        data.threatLevel = 'Severe';
      } else if (data.riskScore > 35) {
        data.threatLevel = 'Elevated';
      } else {
        data.threatLevel = 'Low';
      }
    }

    // Save reading
    const reading = await this.crowdReadingRepository.create(data);

    // Update the current occupancy of the event
    event.currentOccupancy = data.crowdCount;
    await event.save();

    // Trigger AI prediction evaluation cycle automatically
    try {
      const predictionService = new PredictionService();
      await predictionService.triggerPrediction(reading);
    } catch (err) {
      // Catch trigger failures so the reading request itself succeeds
    }

    return reading;
  }

  async updateReading(id: string, data: any): Promise<ICrowdReading> {
    await this.getReadingById(id);

    if (data.eventId) {
      const event = await this.eventRepository.findById(data.eventId);
      if (!event) {
        throw new ApiError(404, `Event with ID ${data.eventId} not found`);
      }
    }

    const updated = await this.crowdReadingRepository.update(id, data);
    if (!updated) {
      throw new ApiError(400, `Failed to update Crowd reading with ID ${id}`);
    }
    return updated;
  }

  async deleteReading(id: string): Promise<ICrowdReading> {
    await this.getReadingById(id);

    const deleted = await this.crowdReadingRepository.delete(id);
    if (!deleted) {
      throw new ApiError(400, `Failed to delete Crowd reading with ID ${id}`);
    }
    return deleted;
  }
}

export default CrowdReadingService;
