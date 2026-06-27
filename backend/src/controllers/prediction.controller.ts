import { Request, Response } from 'express';
import { PredictionService } from '../services/prediction.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export class PredictionController {
  private predictionService: PredictionService;

  constructor() {
    this.predictionService = new PredictionService();
  }

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const predictions = await this.predictionService.getAllPredictions();
    res.status(200).json(
      new ApiResponse(200, predictions, 'Predictions retrieved successfully')
    );
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const prediction = await this.predictionService.getPredictionById(id);
    res.status(200).json(
      new ApiResponse(200, prediction, 'Prediction retrieved successfully')
    );
  });

  getByEvent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params;
    const predictions = await this.predictionService.getPredictionsByEvent(eventId);
    res.status(200).json(
      new ApiResponse(200, predictions, `Predictions for event ${eventId} retrieved successfully`)
    );
  });

  trigger = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const prediction = await this.predictionService.triggerPrediction(req.body);
    res.status(201).json(
      new ApiResponse(201, prediction, 'Prediction triggered and saved successfully')
    );
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.predictionService.deletePrediction(id);
    res.status(200).json(
      new ApiResponse(200, null, 'Prediction deleted successfully')
    );
  });
}

export default PredictionController;
