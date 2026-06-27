import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const reports = await this.reportService.getAllReports();
    res.status(200).json(
      new ApiResponse(200, reports, 'Reports retrieved successfully')
    );
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const report = await this.reportService.getReportById(id);
    res.status(200).json(
      new ApiResponse(200, report, 'Report retrieved successfully')
    );
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const report = await this.reportService.createReport(req.body);
    res.status(201).json(
      new ApiResponse(201, report, 'Report generated successfully')
    );
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const report = await this.reportService.updateReport(id, req.body);
    res.status(200).json(
      new ApiResponse(200, report, 'Report updated successfully')
    );
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.reportService.deleteReport(id);
    res.status(200).json(
      new ApiResponse(200, null, 'Report deleted successfully')
    );
  });
}

export default ReportController;
