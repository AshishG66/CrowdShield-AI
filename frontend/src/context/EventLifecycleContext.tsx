"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/toast";
import { io } from "socket.io-client";

export type LifecycleStage = "nominal" | "telemetry_spike" | "ai_analysis" | "incident_triggered" | "resolved";

export interface SystemTelemetry {
  crowdCount: number;
  capacity: number;
  inflowRate: number;
  outflowRate: number;
  temperature: number;
  weatherCondition: string;
  riskScore: number;
  threatLevel: "Low" | "Elevated" | "Severe";
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  status: "active" | "investigating" | "resolved";
  assignedOfficer: string;
  priority: "low" | "medium" | "high" | "critical";
  comments: string[];
  resolution?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "system" | "ai" | "security" | "report";
  isRead: boolean;
}

export interface SmsLogItem {
  id: string;
  timestamp: string;
  sector: string;
  message: string;
  audienceCount: number;
  status: "delivered" | "pending" | "failed";
}

export interface VoiceCallLogItem {
  id: string;
  timestamp: string;
  responder: string;
  channel: string;
  duration: string;
  signalStrength: number;
  status: "connected" | "ended";
}

export interface DispatchLog {
  timestamp: string;
  type: "sms" | "voice" | "broadcast" | "police" | "hospital" | "incident" | "system";
  message: string;
}

interface EventLifecycleContextType {
  stage: LifecycleStage;
  telemetry: SystemTelemetry;
  incidents: Incident[];
  notifications: Notification[];
  smsLogs: SmsLogItem[];
  voiceCallLogs: VoiceCallLogItem[];
  dispatchLogs: DispatchLog[];
  isAiAnalyzing: boolean;
  aiLogs: string[];
  
  // Transition actions
  triggerNominal: () => void;
  triggerSpike: () => void;
  runAiPrediction: () => Promise<void>;
  triggerEmergencyDispatches: () => void;
  resolveIncident: (id: string, resolution?: string) => void;
  investigateIncident: (id: string) => void;
  addCommentToIncident: (id: string, comment: string) => void;
  updateIncidentOfficer: (id: string, officer: string) => void;
  updateIncidentStatus: (id: string, status: Incident["status"]) => void;
  addManualDispatchLog: (type: DispatchLog["type"], message: string) => void;
  markNotificationRead: (id: string) => void;
  syncPredictionLocal: (prediction: any) => void;
}

const EventLifecycleContext = createContext<EventLifecycleContextType | undefined>(undefined);

// Initial values for nominal state
const nominalTelemetry: SystemTelemetry = {
  crowdCount: 14820,
  capacity: 45000,
  inflowRate: 120,
  outflowRate: 90,
  temperature: 28,
  weatherCondition: "Clear, Sunny",
  riskScore: 12,
  threatLevel: "Low",
};

export function EventLifecycleProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<LifecycleStage>("nominal");
  const [telemetry, setTelemetry] = useState<SystemTelemetry>(nominalTelemetry);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  
  // Incidents registry
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "INC-109",
      title: "Suspicious Object Sector A",
      description: "AI camera detects unattended backpack near Ticket Booth 2.",
      location: "Sector A Entrance",
      timestamp: "12 mins ago",
      severity: "warning",
      status: "investigating",
      assignedOfficer: "Officer M. Jenkins",
      priority: "high",
      comments: ["Area cordoned off.", "Patrol units inspecting backpack."],
    }
  ]);

  // Notifications feed
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "NOT-090",
      title: "System Update: Sync complete",
      message: "All 12 zoning cameras synced with central GPU clustering services.",
      timestamp: "25 mins ago",
      type: "system",
      isRead: true,
    }
  ]);

  // SMS Registry
  const [smsLogs, setSmsLogs] = useState<SmsLogItem[]>([]);
  
  // Voice Bridge Registry
  const [voiceCallLogs, setVoiceCallLogs] = useState<VoiceCallLogItem[]>([]);

  // Emergency page central terminal dispatches log
  const [dispatchLogs, setDispatchLogs] = useState<DispatchLog[]>([
    { timestamp: "19:02:14", type: "system", message: "Emergency command networks online. Frequency 462.56 MHz secured." },
    { timestamp: "19:05:40", type: "system", message: "Visual AI crowd telemetry stream feeds stabilized." },
  ]);

  const getTimeString = () => new Date().toTimeString().split(" ")[0];

  const addLogMessage = (type: DispatchLog["type"], message: string) => {
    setDispatchLogs(prev => [...prev, { timestamp: getTimeString(), type, message }]);
  };

  // --- WEBSOCKET REAL-TIME SYNC ---
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
    );

    socket.on("connect", () => {
      console.log("🔌 Connected to backend WebSocket!");
    });

    socket.on("prediction_created", (prediction: any) => {
      console.log("📢 Received prediction_created WebSocket event:", prediction);
      
      setTelemetry({
        crowdCount: prediction.chartData?.[1]?.density || prediction.crowdCount || 38420,
        capacity: prediction.chartData?.[1]?.limit || prediction.capacity || 45000,
        inflowRate: prediction.entryRate || 420,
        outflowRate: prediction.exitRate || 165,
        temperature: prediction.temperature || 35,
        weatherCondition: prediction.weather || "Sunny",
        riskScore: prediction.confidence,
        threatLevel: prediction.riskLevel === "High" ? "Severe" : prediction.riskLevel === "Medium" ? "Elevated" : "Low",
      });

      if (prediction.riskLevel === "High") {
        setStage("incident_triggered");
      } else if (prediction.riskLevel === "Medium") {
        setStage("telemetry_spike");
      } else {
        setStage("nominal");
      }
    });

    socket.on("incident_created", (incident: any) => {
      console.log("📢 Received incident_created WebSocket event:", incident);
      const formattedIncident: Incident = {
        id: incident.incidentId || incident._id,
        title: incident.title,
        description: incident.description,
        location: incident.location,
        timestamp: "Just now",
        severity: incident.severity,
        status: incident.status,
        assignedOfficer: incident.assignedOfficer || "Officer R. Davis",
        priority: incident.priority,
        comments: incident.comments || [],
        resolution: incident.resolution,
      };

      setIncidents(prev => {
        if (prev.some(i => i.id === formattedIncident.id)) return prev;
        return [formattedIncident, ...prev];
      });
      setStage("incident_triggered");
    });

    socket.on("sms_dispatched", (smsLog: any) => {
      console.log("📢 Received sms_dispatched WebSocket event:", smsLog);
      const formattedSms: SmsLogItem = {
        id: smsLog.smsLogId || smsLog._id,
        timestamp: new Date(smsLog.createdAt || Date.now()).toTimeString().split(" ")[0],
        sector: smsLog.sector || "All Gates & Sectors",
        message: smsLog.message,
        audienceCount: smsLog.audienceCount || 15000,
        status: smsLog.status || "delivered",
      };

      setSmsLogs(prev => {
        if (prev.some(s => s.id === formattedSms.id)) return prev;
        return [formattedSms, ...prev];
      });
      addLogMessage("sms", `SMS Alerts Dispatched: ${formattedSms.message}`);
    });

    socket.on("voice_call_dispatched", (callLog: any) => {
      console.log("📢 Received voice_call_dispatched WebSocket event:", callLog);
      const formattedCall: VoiceCallLogItem = {
        id: callLog.voiceCallLogId || callLog._id,
        timestamp: new Date(callLog.createdAt || Date.now()).toTimeString().split(" ")[0],
        responder: callLog.responder || "Officer R. Davis",
        channel: callLog.channel || "Channel Red-01",
        duration: callLog.duration || "0:45",
        signalStrength: callLog.signalStrength || 98,
        status: "connected",
      };

      setVoiceCallLogs(prev => {
        if (prev.some(c => c.id === formattedCall.id)) return prev;
        return [formattedCall, ...prev];
      });
      addLogMessage("voice", `Emergency voice bridge call connected with ${formattedCall.responder} on ${formattedCall.channel}`);
    });

    socket.on("notification_received", (notif: any) => {
      console.log("📢 Received notification_received WebSocket event:", notif);
      const formattedNotif: Notification = {
        id: notif.notificationId || notif._id,
        title: notif.title,
        message: notif.message,
        timestamp: "Just now",
        type: notif.type || "system",
        isRead: notif.isRead || false,
      };

      setNotifications(prev => {
        if (prev.some(n => n.id === formattedNotif.id)) return prev;
        return [formattedNotif, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // --- LOCAL OFFLINE SIMULATION FALLBACK ---
  const syncPredictionLocal = (prediction: any) => {
    setTelemetry({
      crowdCount: prediction.crowdCount,
      capacity: prediction.capacity,
      inflowRate: prediction.entryRate,
      outflowRate: prediction.exitRate,
      temperature: prediction.temperature,
      weatherCondition: prediction.weather,
      riskScore: prediction.confidence,
      threatLevel: prediction.riskLevel === "High" ? "Severe" : prediction.riskLevel === "Medium" ? "Elevated" : "Low",
    });

    if (prediction.riskLevel === "High") {
      setStage("incident_triggered");
      
      const newIncident: Incident = {
        id: `INC-SIM-${Date.now()}`,
        title: "AI Dynamic Congestion Warning",
        description: `Simulation flagged critical congestion risk (${prediction.confidence}% confidence). Exits: ${prediction.emergencyExits}, Staff: ${prediction.securityStaff}. Recommendations: ${prediction.recommendations.join(', ')}`,
        location: "Sector B (Gate 4)",
        timestamp: "Just now",
        severity: "critical",
        status: "active",
        assignedOfficer: "Officer R. Davis",
        priority: "critical",
        comments: [
          "AI prediction triggered in offline simulation mode.",
          `Local evaluation score: ${prediction.confidence}%`,
        ]
      };
      
      setIncidents(prev => {
        if (prev.some(i => i.id.startsWith("INC-SIM-"))) return prev;
        return [newIncident, ...prev];
      });

      const newSms: SmsLogItem = {
        id: `SMS-SIM-${Date.now()}`,
        timestamp: getTimeString(),
        sector: "Sector B (Gate 4)",
        message: "CRITICAL: Gate 4 entry bottleneck. Divert to Gates 1 & 2 immediately. Dispersal active.",
        audienceCount: Math.round(prediction.crowdCount * 0.4),
        status: "delivered",
      };
      setSmsLogs(prev => [newSms, ...prev]);

      const newCall: VoiceCallLogItem = {
        id: `CALL-SIM-${Date.now()}`,
        timestamp: getTimeString(),
        responder: "Officer R. Davis (Sector B Lead)",
        channel: "Channel Red-01",
        duration: "0:45",
        signalStrength: 98,
        status: "connected",
      };
      setVoiceCallLogs(prev => [newCall, ...prev]);

      const newNotif: Notification = {
        id: `NOT-SIM-${Date.now()}`,
        title: "AI Alert: Critical Overcrowding (Simulated)",
        message: `High risk bottleneck detected at Gate 4. Simulated incident created.`,
        timestamp: "Just now",
        type: "ai",
        isRead: false,
      };
      setNotifications(prev => [newNotif, ...prev]);

      addLogMessage("incident", `SIMULATED INCIDENT LOGGED: [CRITICAL] AI dynamic threshold breach.`);
      addLogMessage("sms", "Mass SMS warning alert broadcasted (Simulated).");
      addLogMessage("voice", "Radio voice bridge connected (Simulated).");
    } else if (prediction.riskLevel === "Medium") {
      setStage("telemetry_spike");
      addLogMessage("system", `Telemetry anomaly detected. Risk: Medium (${prediction.confidence}% confidence).`);
    } else {
      setStage("nominal");
      addLogMessage("system", "Telemetry bounds verified. Risk: Low.");
    }
  };

  // --- TRANSITIONS ---
  
  // 1. Reset to nominal
  const triggerNominal = () => {
    setStage("nominal");
    setTelemetry(nominalTelemetry);
    setIncidents([
      {
        id: "INC-109",
        title: "Suspicious Object Sector A",
        description: "AI camera detects unattended backpack near Ticket Booth 2.",
        location: "Sector A Entrance",
        timestamp: "12 mins ago",
        severity: "warning",
        status: "investigating",
        assignedOfficer: "Officer M. Jenkins",
        priority: "high",
        comments: ["Area cordoned off.", "Patrol units inspecting backpack."],
      }
    ]);
    setNotifications([
      {
        id: "NOT-090",
        title: "System Update: Sync complete",
        message: "All 12 zoning cameras synced with central GPU clustering services.",
        timestamp: "25 mins ago",
        type: "system",
        isRead: true,
      }
    ]);
    setSmsLogs([]);
    setVoiceCallLogs([]);
    setDispatchLogs([
      { timestamp: "19:02:14", type: "system", message: "Emergency command networks online. Frequency 462.56 MHz secured." },
      { timestamp: "19:05:40", type: "system", message: "Visual AI crowd telemetry stream feeds stabilized." },
    ]);
    setAiLogs([]);
    setIsAiAnalyzing(false);
    toast({ title: "System Reset", description: "Simulation reset back to Nominal/Secure state.", variant: "default" });
  };

  // 2. Trigger Telemetry Spike (IPL crowd entry begins)
  const triggerSpike = () => {
    setStage("telemetry_spike");
    setTelemetry({
      crowdCount: 42150,
      capacity: 45000,
      inflowRate: 520,
      outflowRate: 80,
      temperature: 36,
      weatherCondition: "Heavy Humidity, 36°C",
      riskScore: 48,
      threatLevel: "Elevated",
    });
    addLogMessage("system", "IPL Match crowd telemetry ingress detected. Occupancy vector spiking at East Gate (Gate 4).");
    toast({ title: "IPL Telemetry Loaded", description: "Sensor spikes logged: 42,150 crowd headcount active.", variant: "default" });
  };

  // 3. Run AI Prediction
  const runAiPrediction = async () => {
    if (stage !== "telemetry_spike" && stage !== "nominal") return;
    setIsAiAnalyzing(true);
    setStage("ai_analysis");
    setAiLogs([]);
    
    const logs = [
      "Initializing AI predictive flow neural layers...",
      "Normalizing crowd inflow (520/min) against turnstile exit rates (80/min)...",
      "Correlating heat factor (36°C) with ticketing validation queue delays...",
      "Safety margin breakdown forecasted at Gate 4 entry concourse...",
      "LSTM inference complete. Danger: Inflow bottleneck risk = 96% confidence.",
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAiLogs(prev => [...prev, logs[i]]);
      addLogMessage("system", `AI model analysis pipeline step ${i+1}: ${logs[i]}`);
    }

    setIsAiAnalyzing(false);
    setTelemetry(prev => ({
      ...prev,
      riskScore: 96,
      threatLevel: "Severe",
    }));

    // Auto-advance to Emergency trigger
    triggerEmergencyDispatches();
  };

  // 4. Trigger Emergency (Backend automatically dispatches & creates INC-241)
  const triggerEmergencyDispatches = () => {
    setStage("incident_triggered");
    
    // Add Incident #241
    const newIncident: Incident = {
      id: "INC-241",
      title: "IPL Gate 4 Congestion Crisis",
      description: "Critical crowd bottleneck at Sector B East Gate. Densities exceed 4.8 p/m².",
      location: "Sector B (Gate 4)",
      timestamp: "Just now",
      severity: "critical",
      status: "active",
      assignedOfficer: "Officer R. Davis (Sector B Lead)",
      priority: "critical",
      comments: [
        "AI engine automatically generated this incident ticket based on a 96% risk forecast.",
        "Automatic SMS broadcast sent to Sector B handsets.",
        "Automatic voice radio bridge connected with Officer R. Davis."
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Send SMS
    const newSms: SmsLogItem = {
      id: "SMS-241",
      timestamp: getTimeString(),
      sector: "Sector B (Gate 4)",
      message: "CRITICAL: Gate 4 entry bottleneck detected. Please divert to Gates 1 and 2 to access the concourse area.",
      audienceCount: 14820,
      status: "delivered",
    };
    setSmsLogs(prev => [newSms, ...prev]);

    // Start Voice Call
    const newCall: VoiceCallLogItem = {
      id: "CALL-241",
      timestamp: getTimeString(),
      responder: "Officer R. Davis (Sector B Lead)",
      channel: "Channel Red-01",
      duration: "0:45",
      signalStrength: 98,
      status: "connected",
    };
    setVoiceCallLogs(prev => [newCall, ...prev]);

    // Add notification
    const newNotif: Notification = {
      id: "NOT-241",
      title: "AI Alert: Critical Overcrowding Sector B",
      message: "Danger bottleneck detected. Incident #241 logged. Automatic SMS broadcast sent.",
      timestamp: "Just now",
      type: "ai",
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Log dispatches to terminal screen
    addLogMessage("incident", "MANUAL INCIDENT LOGGED: [CRITICAL] INC-241 - IPL Gate 4 Congestion Crisis at Sector B (Gate 4).");
    addLogMessage("sms", "Mass SMS warning alert broadcasted: 'CRITICAL: Gate 4 entry bottleneck detected. Divert to Gates 1/2.'");
    addLogMessage("voice", "Encrypted radio voice bridge call auto-connected with Officer R. Davis on Channel Red-01.");

    toast({
      title: "Incident #241 Activated",
      description: "AI high-risk warning. Automated SMS, Voice bridges, and police tickets dispatched.",
      variant: "destructive",
    });
  };

  // 5. Investigate incident
  const investigateIncident = (id: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, status: "investigating" } : inc))
    );
    addLogMessage("system", `Incident ${id} status shifted to INVESTIGATING.`);
  };

  // 6. Resolve Incident
  const resolveIncident = (id: string, resolution?: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, status: "resolved", resolution: resolution || "Cleared and verified by command center." } : inc))
    );
    addLogMessage("system", `Incident ${id} marked RESOLVED. All gates cleared.`);
    
    // If the main simulated incident is resolved, we reset telemetry indicators
    if (id === "INC-241") {
      setStage("resolved");
      setTelemetry({
        ...nominalTelemetry,
        crowdCount: 42150, // Keep occupancy high but resolve risk
        riskScore: 14,
        threatLevel: "Low",
      });
      // Close active call log
      setVoiceCallLogs(prev =>
        prev.map(c => (c.id === "CALL-241" ? { ...c, status: "ended", duration: "3m 15s" } : c))
      );
      toast({ title: "Incident Resolved", description: "Incident #241 marked clear. Risk score reverted to nominal.", variant: "success" });
    }
  };

  const addCommentToIncident = (id: string, comment: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, comments: [...inc.comments, comment] } : inc))
    );
  };

  const updateIncidentOfficer = (id: string, officer: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, assignedOfficer: officer } : inc))
    );
  };

  const updateIncidentStatus = (id: string, status: Incident["status"]) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, status: status } : inc))
    );
    addLogMessage("system", `Incident ${id} status updated to ${status.toUpperCase()}.`);
    
    if (id === "INC-241" && status === "resolved") {
      resolveIncident("INC-241");
    }
  };

  const addManualDispatchLog = (type: DispatchLog["type"], message: string) => {
    addLogMessage(type, message);
  };  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  return (
    <EventLifecycleContext.Provider
      value={{
        stage,
        telemetry,
        incidents,
        notifications,
        smsLogs,
        voiceCallLogs,
        dispatchLogs,
        isAiAnalyzing,
        aiLogs,
        triggerNominal,
        triggerSpike,
        runAiPrediction,
        triggerEmergencyDispatches,
        resolveIncident,
        investigateIncident,
        addCommentToIncident,
        updateIncidentOfficer,
        updateIncidentStatus,
        addManualDispatchLog,
        markNotificationRead,
        syncPredictionLocal,
      }}
    >
      {children}
    </EventLifecycleContext.Provider>
  );
}

export function useEventLifecycle() {
  const context = useContext(EventLifecycleContext);
  if (context === undefined) {
    throw new Error("useEventLifecycle must be used within an EventLifecycleProvider");
  }
  return context;
}
