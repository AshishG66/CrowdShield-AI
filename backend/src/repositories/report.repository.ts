import { Report, IReport } from '../models/Report.model';

export class ReportRepository {
  async findAll(): Promise<IReport[]> {
    return Report.find().populate('venueId');
  }

  async findById(id: string): Promise<IReport | null> {
    return Report.findById(id).populate('venueId');
  }

  async count(): Promise<number> {
    return Report.countDocuments();
  }

  async create(data: any): Promise<IReport> {
    const report = new Report(data);
    return report.save();
  }

  async update(id: string, data: any): Promise<IReport | null> {
    return Report.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('venueId');
  }

  async delete(id: string): Promise<IReport | null> {
    return Report.findByIdAndDelete(id);
  }
}

export default ReportRepository;
