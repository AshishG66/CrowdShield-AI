import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const events = await this.eventService.getAllEvents();
    res.status(200).json(
      new ApiResponse(200, events, 'Events retrieved successfully')
    );
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const event = await this.eventService.getEventById(id);
    res.status(200).json(
      new ApiResponse(200, event, 'Event retrieved successfully')
    );
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const event = await this.eventService.createEvent(req.body);
    res.status(201).json(
      new ApiResponse(201, event, 'Event created successfully')
    );
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const event = await this.eventService.updateEvent(id, req.body);
    res.status(200).json(
      new ApiResponse(200, event, 'Event updated successfully')
    );
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.eventService.deleteEvent(id);
    res.status(200).json(
      new ApiResponse(200, null, 'Event deleted successfully')
    );
  });
}

export default EventController;
