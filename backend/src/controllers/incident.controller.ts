import { Request, Response } from 'express';
import { IncidentService } from '../services/incident.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export class IncidentController {
  private incidentService: IncidentService;

  constructor() {
    this.incidentService = new IncidentService();
  }

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const incidents = await this.incidentService.getAllIncidents();
    res.status(200).json(
      new ApiResponse(200, incidents, 'Incidents retrieved successfully')
    );
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const incident = await this.incidentService.getIncidentById(id);
    res.status(200).json(
      new ApiResponse(200, incident, 'Incident retrieved successfully')
    );
  });

  getByEvent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params;
    const incidents = await this.incidentService.getIncidentsByEvent(eventId);
    res.status(200).json(
      new ApiResponse(200, incidents, `Incidents for event ${eventId} retrieved successfully`)
    );
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const incident = await this.incidentService.createIncident(req.body);
    res.status(201).json(
      new ApiResponse(201, incident, 'Incident created successfully')
    );
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const incident = await this.incidentService.updateIncident(id, req.body);
    res.status(200).json(
      new ApiResponse(200, incident, 'Incident updated successfully')
    );
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.incidentService.deleteIncident(id);
    res.status(200).json(
      new ApiResponse(200, null, 'Incident deleted successfully')
    );
  });
}

export default IncidentController;
