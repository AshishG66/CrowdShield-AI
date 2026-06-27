import { Request, Response } from 'express';
import { CrowdReadingService } from '../services/crowd_reading.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export class CrowdReadingController {
  private crowdReadingService: CrowdReadingService;

  constructor() {
    this.crowdReadingService = new CrowdReadingService();
  }

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const readings = await this.crowdReadingService.getAllReadings();
    res.status(200).json(
      new ApiResponse(200, readings, 'Crowd readings retrieved successfully')
    );
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const reading = await this.crowdReadingService.getReadingById(id);
    res.status(200).json(
      new ApiResponse(200, reading, 'Crowd reading retrieved successfully')
    );
  });

  getByEvent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params;
    const readings = await this.crowdReadingService.getReadingsByEvent(eventId);
    res.status(200).json(
      new ApiResponse(200, readings, `Crowd readings for event ${eventId} retrieved successfully`)
    );
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const reading = await this.crowdReadingService.createReading(req.body);
    res.status(201).json(
      new ApiResponse(201, reading, 'Crowd reading registered successfully')
    );
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const reading = await this.crowdReadingService.updateReading(id, req.body);
    res.status(200).json(
      new ApiResponse(200, reading, 'Crowd reading updated successfully')
    );
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.crowdReadingService.deleteReading(id);
    res.status(200).json(
      new ApiResponse(200, null, 'Crowd reading deleted successfully')
    );
  });
}

export default CrowdReadingController;
