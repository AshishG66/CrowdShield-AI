import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CrowdShield AI - API Reference Docs',
      version: '1.0.0',
      description: 'Real-time Event Crowd Control & Incident Management Command Center API Specs',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      schemas: {
        Sector: {
          type: 'object',
          required: ['name', 'capacity'],
          properties: {
            name: { type: 'string', example: 'Sector A' },
            occupancy: { type: 'number', example: 1200 },
            capacity: { type: 'number', example: 5000 },
            risk: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'low' },
            exits: { type: 'string', example: '6/6 Open' },
            staff: { type: 'number', example: 12 },
            cameras: { type: 'string', example: '10/10 Online' },
          },
        },
        Venue: {
          type: 'object',
          required: ['name', 'type', 'city', 'state', 'capacity', 'latitude', 'longitude'],
          properties: {
            _id: { type: 'string', example: '60d5ec49f3183c26883e002a' },
            name: { type: 'string', example: 'M. Chinnaswamy Stadium' },
            type: { type: 'string', example: 'Stadium' },
            city: { type: 'string', example: 'Bengaluru' },
            state: { type: 'string', example: 'Karnataka' },
            country: { type: 'string', example: 'India' },
            capacity: { type: 'number', example: 45000 },
            occupancy: { type: 'number', example: 14820 },
            riskScore: { type: 'number', example: 25 },
            latitude: { type: 'number', example: 12.9784 },
            longitude: { type: 'number', example: 77.5994 },
            entryGates: { type: 'number', example: 8 },
            exitGates: { type: 'number', example: 8 },
            emergencyExits: { type: 'number', example: 4 },
            status: { type: 'string', enum: ['Active', 'Inactive', 'secure', 'elevated', 'emergency'], example: 'Active' },
            sectors: {
              type: 'array',
              items: { $ref: '#/components/schemas/Sector' },
            },
          },
        },
        Event: {
          type: 'object',
          required: ['title', 'venueId', 'startTime', 'endTime'],
          properties: {
            _id: { type: 'string', example: '60d5ec49f3183c26883e002b' },
            title: { type: 'string', example: 'IPL Final 2026' },
            description: { type: 'string', example: 'Championship final match between RCB and CSK' },
            venueId: { type: 'string', example: '60d5ec49f3183c26883e002a' },
            startTime: { type: 'string', format: 'date-time', example: '2026-06-27T18:00:00Z' },
            endTime: { type: 'string', format: 'date-time', example: '2026-06-27T22:00:00Z' },
            status: { type: 'string', enum: ['scheduled', 'active', 'completed', 'cancelled'], example: 'scheduled' },
            capacity: { type: 'number', example: 45000 },
            expectedCrowd: { type: 'number', example: 40000 },
            securityStaff: { type: 'number', example: 250 },
            medicalTeam: { type: 'number', example: 20 },
            currentOccupancy: { type: 'number', example: 0 },
          },
        },
        CrowdReading: {
          type: 'object',
          required: ['eventId', 'crowdCount', 'entryRate', 'exitRate'],
          properties: {
            _id: { type: 'string', example: '60d5ec49f3183c26883e002c' },
            eventId: { type: 'string', example: '60d5ec49f3183c26883e002b' },
            venueId: { type: 'string', example: '60d5ec49f3183c26883e002a' },
            timestamp: { type: 'string', format: 'date-time', example: '2026-06-27T10:25:00Z' },
            crowdCount: { type: 'number', example: 38420 },
            entryRate: { type: 'number', example: 420 },
            exitRate: { type: 'number', example: 165 },
            temperature: { type: 'number', example: 35 },
            humidity: { type: 'number', example: 72 },
            weather: { type: 'string', example: 'Sunny' },
            riskScore: { type: 'number', example: 45 },
            threatLevel: { type: 'string', enum: ['Low', 'Elevated', 'Severe'], example: 'Elevated' },
          },
        },
        Prediction: {
          type: 'object',
          required: ['eventId', 'title', 'severity', 'riskLevel', 'confidence'],
          properties: {
            _id: { type: 'string', example: '60d5ec49f3183c26883e002d' },
            eventId: { type: 'string', example: '60d5ec49f3183c26883e002b' },
            venueId: { type: 'string', example: '60d5ec49f3183c26883e002a' },
            timestamp: { type: 'string', format: 'date-time', example: '2026-06-27T10:25:00Z' },
            title: { type: 'string', example: 'AI Crowd Anomaly Alert: High Risk' },
            severity: { type: 'string', enum: ['info', 'warning', 'critical'], example: 'critical' },
            riskLevel: { type: 'string', example: 'High' },
            confidence: { type: 'number', example: 94 },
            recommendations: { type: 'array', items: { type: 'string' }, example: ['Open Exit 4', 'Deploy 8 Volunteers'] },
            explanation: { type: 'string', example: 'Uplink telemetry assessment yields High Risk.' },
            chartData: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'string', example: 'Current' },
                  density: { type: 'number', example: 38420 },
                  limit: { type: 'number', example: 45000 },
                },
              },
            },
          },
        },
        Incident: {
          type: 'object',
          required: ['incidentId', 'title', 'description', 'location'],
          properties: {
            _id: { type: 'string', example: '60d5ec49f3183c26883e002e' },
            incidentId: { type: 'string', example: 'INC-101' },
            title: { type: 'string', example: 'Automated Congestion Incident: High Risk Anomaly' },
            description: { type: 'string', example: 'AI Prediction engine flagged high anomaly congestion (Risk: High, Confidence: 94%).' },
            location: { type: 'string', example: 'Sector Telemetry Gate Grid' },
            timestamp: { type: 'string', format: 'date-time', example: '2026-06-27T10:33:00Z' },
            severity: { type: 'string', enum: ['info', 'warning', 'critical'], example: 'critical' },
            status: { type: 'string', enum: ['active', 'investigating', 'resolved'], example: 'active' },
            assignedOfficer: { type: 'string', example: 'Marshal Ramesh K' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'high' },
            comments: { type: 'array', items: { type: 'string' }, example: ['Automated trigger generated by AI Prediction uplink.'] },
            resolution: { type: 'string', example: 'Exits cleared.' },
            eventId: { type: 'string', example: '60d5ec49f3183c26883e002b' },
            venueId: { type: 'string', example: '60d5ec49f3183c26883e002a' },
          },
        },
        Report: {
          type: 'object',
          required: ['reportId', 'date', 'name', 'format', 'size'],
          properties: {
            _id: { type: 'string', example: '60d5ec49f3183c26883e002f' },
            reportId: { type: 'string', example: 'REP-101' },
            date: { type: 'string', example: '2026-06-27' },
            name: { type: 'string', example: 'IPL Final Density Compliance Audit' },
            format: { type: 'string', enum: ['PDF', 'Excel', 'CSV'], example: 'PDF' },
            size: { type: 'string', example: '2.4 MB' },
            type: { type: 'string', enum: ['density', 'incidents', 'alarms', 'compliance'], example: 'density' },
            range: { type: 'string', enum: ['today', 'week', 'month'], example: 'today' },
            venueId: { type: 'string', example: '60d5ec49f3183c26883e002a' },
          },
        },
        StandardResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
            errors: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
