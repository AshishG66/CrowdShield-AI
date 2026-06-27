import { Request, Response } from 'express';
import { VenueService } from '../services/venue.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export class VenueController {
  private venueService: VenueService;

  constructor() {
    this.venueService = new VenueService();
  }

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const venues = await this.venueService.getAllVenues();
    res.status(200).json(
      new ApiResponse(200, venues, 'Venues retrieved successfully')
    );
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const venue = await this.venueService.getVenueById(id);
    res.status(200).json(
      new ApiResponse(200, venue, 'Venue retrieved successfully')
    );
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const venue = await this.venueService.createVenue(req.body);
    res.status(201).json(
      new ApiResponse(201, venue, 'Venue created successfully')
    );
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const venue = await this.venueService.updateVenue(id, req.body);
    res.status(200).json(
      new ApiResponse(200, venue, 'Venue updated successfully')
    );
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.venueService.deleteVenue(id);
    res.status(200).json(
      new ApiResponse(200, null, 'Venue deleted successfully')
    );
  });
}

export default VenueController;
