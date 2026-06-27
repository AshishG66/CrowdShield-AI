export interface IncidentItem {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  status: "active" | "investigating" | "resolved";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "system" | "ai" | "security" | "report";
  isRead: boolean;
}

export interface WeatherData {
  temp: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  icon: string;
}

export interface PredictionData {
  time: string;
  occupancy: number;
  predicted: number;
}

// Initial Mock Incidents
export const initialIncidents: IncidentItem[] = [
  {
    id: "INC-342",
    title: "Overcrowding Sector B",
    description: "Camera index reports gate congestion exceeding 4.2 people/m² density index limits.",
    location: "Gate 4 Entry concourse",
    timestamp: "3 mins ago",
    severity: "critical",
    status: "active",
  },
  {
    id: "INC-109",
    title: "Suspicious Object Sector A",
    description: "AI camera detects unattended backpack near Ticket Booth 2.",
    location: "Sector A Entrance",
    timestamp: "12 mins ago",
    severity: "warning",
    status: "investigating",
  },
];

// Initial Mock Notifications
export const initialNotifications: NotificationItem[] = [
  {
    id: "NOT-089",
    title: "AI Alert: Pre-Incident flow match",
    message: "Crowd turbulence detection algorithm matches flow pattern associated with gate bottlenecks. Flow adjustments suggested.",
    timestamp: "10 mins ago",
    type: "ai",
    isRead: false,
  },
  {
    id: "NOT-090",
    title: "System Update: Sync complete",
    message: "All 12 zoning cameras synced with central GPU clustering services.",
    timestamp: "25 mins ago",
    type: "system",
    isRead: true,
  }
];

// Weather Data
export const mockWeatherData: WeatherData = {
  temp: 28,
  condition: "Clear",
  windSpeed: 12,
  humidity: 45,
  icon: "sun"
};

// Prediction graph data
export const mockPredictionData: PredictionData[] = [
  { time: "08:00", occupancy: 4200, predicted: 4000 },
  { time: "10:00", occupancy: 7800, predicted: 8000 },
  { time: "12:00", occupancy: 12400, predicted: 12000 },
  { time: "14:00", occupancy: 14820, predicted: 15000 },
  { time: "16:00", occupancy: 13900, predicted: 14200 },
  { time: "18:00", occupancy: 11500, predicted: 11000 },
  { time: "20:00", occupancy: 9200, predicted: 9500 },
];
