import { ReportRepository } from '../repositories/report.repository';
import { VenueRepository } from '../repositories/venue.repository';
import { IReport } from '../models/Report.model';
import { ApiError } from '../utils/ApiError';

export class ReportService {
  private reportRepository: ReportRepository;
  private venueRepository: VenueRepository;

  constructor() {
    this.reportRepository = new ReportRepository();
    this.venueRepository = new VenueRepository();
  }

  async getAllReports(): Promise<IReport[]> {
    return this.reportRepository.findAll();
  }

  async getReportById(id: string): Promise<IReport> {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new ApiError(404, `Report with ID ${id} not found`);
    }
    return report;
  }

  async createReport(data: any): Promise<IReport> {
    if (data.venueId) {
      const venue = await this.venueRepository.findById(data.venueId);
      if (!venue) {
        throw new ApiError(404, `Venue with ID ${data.venueId} not found`);
      }
    }

    // Auto-generate reportId
    if (!data.reportId) {
      const count = await this.reportRepository.count();
      data.reportId = `REP-${100 + count + 1}`;
    }

    // Auto-generate current date string
    if (!data.date) {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const dy = String(now.getDate()).padStart(2, '0');
      data.date = `${yr}-${mo}-${dy}`;
    }

    // Auto-generate file size
    if (!data.size) {
      const sizes = ['1.2 MB', '1.8 MB', '2.4 MB', '3.1 MB', '4.5 MB'];
      data.size = sizes[Math.floor(Math.random() * sizes.length)];
    }

    return this.reportRepository.create(data);
  }

  async updateReport(id: string, data: any): Promise<IReport> {
    await this.getReportById(id);

    if (data.venueId) {
      const venue = await this.venueRepository.findById(data.venueId);
      if (!venue) {
        throw new ApiError(404, `Venue with ID ${data.venueId} not found`);
      }
    }

    const updated = await this.reportRepository.update(id, data);
    if (!updated) {
      throw new ApiError(400, `Failed to update Report with ID ${id}`);
    }
    return updated;
  }

  async deleteReport(id: string): Promise<IReport> {
    await this.getReportById(id);

    const deleted = await this.reportRepository.delete(id);
    if (!deleted) {
      throw new ApiError(400, `Failed to delete Report with ID ${id}`);
    }
    return deleted;
  }
}

export default ReportService;
