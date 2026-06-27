import { PredictionRepository } from '../repositories/prediction.repository';
import { EventRepository } from '../repositories/event.repository';
import { IPrediction } from '../models/Prediction.model';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { broadcastEvent } from '../sockets/socket';

export class PredictionService {
  private predictionRepository: PredictionRepository;
  private eventRepository: EventRepository;

  constructor() {
    this.predictionRepository = new PredictionRepository();
    this.eventRepository = new EventRepository();
  }

  async getAllPredictions(): Promise<IPrediction[]> {
    return this.predictionRepository.findAll();
  }

  async getPredictionById(id: string): Promise<IPrediction> {
    const prediction = await this.predictionRepository.findById(id);
    if (!prediction) {
      throw new ApiError(404, `Prediction with ID ${id} not found`);
    }
    return prediction;
  }

  async getPredictionsByEvent(eventId: string): Promise<IPrediction[]> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, `Event with ID ${eventId} not found`);
    }
    return this.predictionRepository.findByEvent(eventId);
  }

  /**
   * Triggers prediction from FastAPI service or fallback rules
   */
  async triggerPrediction(crowdReading: any): Promise<IPrediction> {
    const event = await this.eventRepository.findById(crowdReading.eventId);
    if (!event) {
      throw new ApiError(404, `Event with ID ${crowdReading.eventId} not found`);
    }

    const capacity = crowdReading.capacity || event.capacity || 45000;
    const expected = event.expectedCrowd || capacity || 10000;
    const crowdReadingPayload = {
      eventId: crowdReading.eventId.toString(),
      timestamp: crowdReading.timestamp ? crowdReading.timestamp.toISOString() : new Date().toISOString(),
      crowdCount: crowdReading.crowdCount,
      capacity: capacity,
      entryRate: crowdReading.entryRate,
      exitRate: crowdReading.exitRate,
      temperature: crowdReading.temperature || 25,
      humidity: crowdReading.humidity || 50,
      weather: crowdReading.weather || 'Clear',
      securityStaff: crowdReading.securityStaff || 250,
      emergencyExits: crowdReading.emergencyExits || 8,
    };

    let risk = 'Low';
    let confidence = 80;
    let recommendation: string[] = ['Maintain standard operations monitor'];

    // 1. Attempt to fetch prediction from FastAPI
    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const response = await fetch(`${aiServiceUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crowdReadingPayload),
      });

      if (response.ok) {
        const aiData: any = await response.json();
        risk = aiData.risk || 'Low';
        confidence = aiData.confidence || 90;
        recommendation = aiData.recommendation || [];
        logger.info(`✅ Prediction resolved via FastAPI: Risk=${risk}, Conf=${confidence}%`);
      } else {
        logger.warn(`AI Service responded with status ${response.status}. Using fallback local rules.`);
        throw new Error('AI Service bad response status');
      }
    } catch (error) {
      // 2. Fallback heuristic model
      logger.warn('AI Service is offline. Applying local heuristic fallback model.');
      const occupancyRatio = crowdReading.crowdCount / capacity;
      const rateMultiplier = (crowdReading.entryRate - crowdReading.exitRate) / 60;
      const staffRatio = crowdReading.securityStaff ? (crowdReading.crowdCount / crowdReading.securityStaff) : 150;
      
      // Risk score evaluation
      let riskScore = 0;
      // Occupancy contribution
      if (occupancyRatio > 1.0) riskScore += 45;
      else if (occupancyRatio > 0.85) riskScore += 30;
      else if (occupancyRatio > 0.7) riskScore += 15;

      // Inflow vs outflow contribution
      if (rateMultiplier > 4.5) riskScore += 35;
      else if (rateMultiplier > 2.0) riskScore += 20;

      // Weather contribution
      if (crowdReading.weather === 'Stormy') riskScore += 25;
      else if (crowdReading.weather === 'Rainy') riskScore += 15;

      // Temperature contribution
      if (crowdReading.temperature > 38) riskScore += 10;

      // Security contribution
      if (staffRatio > 200) riskScore += 20;
      else if (staffRatio > 150) riskScore += 10;

      // Exits contribution
      if (crowdReading.emergencyExits < 4) riskScore += 20;
      else if (crowdReading.emergencyExits < 6) riskScore += 10;

      if (riskScore >= 60 || occupancyRatio > 0.95 || rateMultiplier > 4.5) {
        risk = 'High';
        confidence = Math.min(99, 85 + Math.floor((riskScore - 60) / 2));
        if (confidence < 85) confidence = 85;
        recommendation = [
          'Open emergency exits immediately',
          'Deploy additional volunteer security marshal units',
          'De-escalate bottleneck by reducing entry rate gates',
          'Diver incoming crowd flow to alternate venue zones',
        ];
      } else if (riskScore >= 30 || occupancyRatio > 0.75 || rateMultiplier > 2.0) {
        risk = 'Medium';
        confidence = Math.min(95, 75 + Math.floor((riskScore - 30) / 2));
        if (confidence < 75) confidence = 75;
        recommendation = [
          'Open auxiliary flow corridors',
          'Deploy 8 volunteers to exit gate quadrants',
          'Monitor entry point queues for potential overflow patterns',
        ];
      } else {
        risk = 'Low';
        confidence = Math.min(90, 60 + Math.floor(riskScore / 2));
        if (confidence < 60) confidence = 60;
        recommendation = [
          'Normal density bounds maintained',
          'Continue camera telemetry logs scans',
        ];
      }
    }

    // Map risk string to database severity enum
    let severity: 'info' | 'warning' | 'critical' = 'info';
    if (risk === 'High') {
      severity = 'critical';
    } else if (risk === 'Medium') {
      severity = 'warning';
    }

    // Form chart projection data
    const chartData = [
      { time: '-15m', density: Math.round(crowdReading.crowdCount * 0.92), limit: capacity },
      { time: 'Current', density: crowdReading.crowdCount, limit: capacity },
      { time: '+15m', density: Math.min(capacity * 1.1, Math.round(crowdReading.crowdCount + (crowdReading.entryRate - crowdReading.exitRate) * 15)), limit: capacity },
    ];

    // Build prediction entity
    const predictionDoc = {
      eventId: event._id,
      venueId: event.venueId,
      title: `AI Crowd Anomaly Alert: ${risk} Risk`,
      severity,
      riskLevel: risk,
      confidence,
      recommendations: recommendation,
      explanation: `Telemetry assessment yields a ${risk} congestion danger score of ${confidence}% confidence, based on active occupancy metrics.`,
      chartData,
    };

    const savedPrediction = await this.predictionRepository.create(predictionDoc);

    // Broadcast WebSocket event
    try {
      broadcastEvent('prediction_created', savedPrediction);
    } catch (err) {
      logger.error(`Failed to broadcast prediction_created: ${err}`);
    }

    // Auto-create incident on High or Critical Risk anomaly alert
    if (risk === 'High' || risk === 'Critical') {
      try {
        const IncidentServiceClass = (await import('./incident.service')).default;
        const incidentService = new IncidentServiceClass();
        await incidentService.createAutomaticIncident(savedPrediction);
      } catch (err) {
        logger.error(`Failed to trigger automatic incident creation: ${err}`);
      }
    }

    return savedPrediction;
  }

  async deletePrediction(id: string): Promise<IPrediction> {
    await this.getPredictionById(id);

    const deleted = await this.predictionRepository.delete(id);
    if (!deleted) {
      throw new ApiError(400, `Failed to delete Prediction with ID ${id}`);
    }
    return deleted;
  }
}

export default PredictionService;
