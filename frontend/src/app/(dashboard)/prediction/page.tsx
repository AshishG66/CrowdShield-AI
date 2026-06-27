"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/widgets/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import { useEventLifecycle } from "@/context/EventLifecycleContext";
import {
  Brain,
  Sliders,
  Play,
  TrendingUp,
  AlertOctagon,
  ShieldAlert,
  CheckCircle,
  Settings,
  Radio,
  FileCheck,
  RefreshCw,
  MessageSquare,
  PhoneCall,
  Activity,
  Layers,
  Database,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function PredictionPage() {
  const { syncPredictionLocal } = useEventLifecycle();
  const [isPredicting, setIsPredicting] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  // Simulation Sliders States
  const [crowdCount, setCrowdCount] = useState(38420);
  const [capacity, setCapacity] = useState(45000);
  const [temperature, setTemperature] = useState(35);
  const [weather, setWeather] = useState("Sunny");
  const [entryRate, setEntryRate] = useState(420);
  const [exitRate, setExitRate] = useState(165);
  const [securityStaff, setSecurityStaff] = useState(250);
  const [emergencyExits, setEmergencyExits] = useState(8);

  // AI Prediction Result State
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [cascadeSteps, setCascadeSteps] = useState<any[]>([]);
  const [showCascade, setShowCascade] = useState(false);

  // Fetch or Seed active event for simulation context
  useEffect(() => {
    const fetchSimulationContext = async () => {
      try {
        setLoadingEvent(true);
        // 1. Fetch Events
        const res = await fetch("http://localhost:5000/api/events");
        const json = await res.json();
        
        if (json.success && json.data && json.data.length > 0) {
          setActiveEvent(json.data[0]);
          setCapacity(json.data[0].capacity || 45000);
          setCrowdCount(json.data[0].currentOccupancy || 38000);
        } else {
          // 2. Seeding required - create a mock Venue and Event
          const venueRes = await fetch("http://localhost:5000/api/venues", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "M. Chinnaswamy Stadium",
              type: "Stadium",
              city: "Bengaluru",
              state: "Karnataka",
              capacity: 45000,
              latitude: 12.9784,
              longitude: 77.5994,
              entryGates: 8,
              exitGates: 8,
              emergencyExits: 4,
            }),
          });
          const venueJson = await venueRes.json();
          const venueId = venueJson.data?._id;

          if (venueId) {
            const eventRes = await fetch("http://localhost:5000/api/events", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: "IPL Final Match 2026",
                description: "Bengaluru vs Mumbai T20 Finals",
                venueId,
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + 14400000).toISOString(),
                capacity: 45000,
                expectedCrowd: 40000,
                securityStaff: 250,
                medicalTeam: 20,
              }),
            });
            const eventJson = await eventRes.json();
            if (eventJson.success) {
              setActiveEvent(eventJson.data);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch simulation database context", err);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchSimulationContext();
  }, []);

  const runSimulationInference = async () => {
    if (!activeEvent) {
      toast({
        title: "Database Context Required",
        description: "Connecting to database. Please refresh or check server status.",
        variant: "destructive",
      });
      return;
    }

    const computeLocalHeuristic = () => {
      const occupancyRatio = crowdCount / capacity;
      const rateMultiplier = (entryRate - exitRate) / 60;
      const staffRatio = securityStaff ? (crowdCount / securityStaff) : 150;

      // Risk score evaluation
      let riskScore = 0;
      if (occupancyRatio > 1.0) riskScore += 45;
      else if (occupancyRatio > 0.85) riskScore += 30;
      else if (occupancyRatio > 0.7) riskScore += 15;

      if (rateMultiplier > 4.5) riskScore += 35;
      else if (rateMultiplier > 2.0) riskScore += 20;

      if (weather === 'Stormy') riskScore += 25;
      else if (weather === 'Rainy') riskScore += 15;

      if (temperature > 38) riskScore += 10;

      if (staffRatio > 200) riskScore += 20;
      else if (staffRatio > 150) riskScore += 10;

      if (emergencyExits < 4) riskScore += 20;
      else if (emergencyExits < 6) riskScore += 10;

      let risk = 'Low';
      let confidence = 80;
      let recommendations = ['Normal density bounds maintained', 'Continue camera telemetry logs scans'];

      if (riskScore >= 60 || occupancyRatio > 0.95 || rateMultiplier > 4.5) {
        risk = 'High';
        confidence = Math.min(99, 85 + Math.floor((riskScore - 60) / 2));
        if (confidence < 85) confidence = 85;
        recommendations = [
          'Open emergency exits immediately',
          'Deploy additional volunteer security marshal units',
          'De-escalate bottleneck by reducing entry rate gates',
          'Divert incoming crowd flow to alternate venue zones',
        ];
      } else if (riskScore >= 30 || occupancyRatio > 0.75 || rateMultiplier > 2.0) {
        risk = 'Medium';
        confidence = Math.min(95, 75 + Math.floor((riskScore - 30) / 2));
        if (confidence < 75) confidence = 75;
        recommendations = [
          'Open auxiliary flow corridors',
          'Deploy 8 volunteers to exit gate quadrants',
          'Monitor entry point queues for potential overflow patterns',
        ];
      }

      const chartData = [
        { time: '-15m', density: Math.round(crowdCount * 0.92), limit: capacity },
        { time: 'Current', density: crowdCount, limit: capacity },
        { time: '+15m', density: Math.min(capacity * 1.1, Math.round(crowdCount + (entryRate - exitRate) * 15)), limit: capacity },
      ];

      return {
        title: `AI Crowd Anomaly Alert: ${risk} Risk`,
        riskLevel: risk,
        confidence,
        recommendations,
        chartData,
        crowdCount,
        capacity,
        entryRate,
        exitRate,
        temperature,
        weather,
        securityStaff,
        emergencyExits,
      };
    };

    try {
      setIsPredicting(true);
      setShowCascade(false);
      setCascadeSteps([]);

      // Trigger the prediction POST request
      const response = await fetch("http://localhost:5000/api/predictions/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: activeEvent._id,
          crowdCount,
          capacity,
          entryRate,
          exitRate,
          temperature,
          humidity: 72,
          weather,
          securityStaff,
          emergencyExits,
        }),
      });

      const json = await response.json();

      if (json.success) {
        setPredictionResult(json.data);
        syncPredictionLocal(json.data);

        toast({
          title: "Prediction Core Active",
          description: `Telemetry evaluated with confidence ${json.data.confidence}%`,
          variant: "success",
        });

        // Trigger simulation steps timeline presentation
        setShowCascade(true);
        const steps = [
          { id: 1, title: "Crowd Telemetry Ingested", desc: `${crowdCount.toLocaleString()} count / ${entryRate}/m Entry`, time: "0ms" },
          { id: 2, title: `AI Prediction Processed`, desc: `Risk: ${json.data.riskLevel} (${json.data.confidence}% confidence)`, time: "42ms" }
        ];

        // Add additional automated cascades if risk is High
        if (json.data.riskLevel === "High") {
          steps.push(
            { id: 3, title: "Critical Anomaly Incident Logged", desc: "Automated database ticket generated successfully (active state)", time: "65ms" },
            { id: 4, title: "SMS Alerts Dispatched", desc: "Gate marshallers broadcasted: Dispersal procedures active", time: "110ms" },
            { id: 5, title: "Responder Channel Connected", desc: "Emergency voice call linked to Control Room", time: "185ms" },
            { id: 6, title: "WebSocket Event Broadcasted", desc: "Emitted incident_created to active dashboards", time: "220ms" }
          );
        } else {
          steps.push(
            { id: 3, title: "Bounds Normal", desc: "No active threshold triggers, monitoring continues", time: "50ms" }
          );
        }

        // Animate stepping sequentially
        steps.forEach((step, idx) => {
          setTimeout(() => {
            setCascadeSteps(prev => [...prev, step]);
          }, (idx + 1) * 350);
        });

      } else {
        throw new Error(json.message || "Endpoint error");
      }
    } catch (err) {
      console.warn("Backend server is offline, running offline simulation fallback:", err);
      
      // RUN FALLBACK OFFLINE SIMULATION
      const localResult = computeLocalHeuristic();
      setPredictionResult(localResult);
      syncPredictionLocal(localResult);

      toast({
        title: "Simulation Active (Offline)",
        description: `Local telemetry evaluated with confidence ${localResult.confidence}%`,
        variant: "default",
      });

      setShowCascade(true);
      const steps = [
        { id: 1, title: "Crowd Telemetry Ingested (Local)", desc: `${crowdCount.toLocaleString()} count / ${entryRate}/m Entry`, time: "0ms" },
        { id: 2, title: `AI Fallback Heuristics Evaluated`, desc: `Risk: ${localResult.riskLevel} (${localResult.confidence}% confidence)`, time: "30ms" }
      ];

      if (localResult.riskLevel === "High") {
        steps.push(
          { id: 3, title: "Simulated Incident Created", desc: `Mock incident INC-SIM logged in React context`, time: "50ms" },
          { id: 4, title: "Simulated SMS Alerts Dispatched", desc: `SMS broadcasts sent to ${Math.round(crowdCount * 0.4).toLocaleString()} users`, time: "85ms" },
          { id: 5, title: "Simulated Voice Call Connected", desc: "Officer R. Davis responder bridge initialized", time: "120ms" },
          { id: 6, title: "Local Context State Dispatched", desc: "Synchronized safety status with in-memory dashboard", time: "150ms" }
        );
      } else {
        steps.push(
          { id: 3, title: "Bounds Normal", desc: "No active threshold triggers, monitoring continues", time: "40ms" }
        );
      }

      // Animate stepping sequentially
      steps.forEach((step, idx) => {
        setTimeout(() => {
          setCascadeSteps(prev => [...prev, step]);
        }, (idx + 1) * 350);
      });
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Predictive Control Room"
        description="Simulate real-time gate processing constraints, weather fluctuations, and count thresholds to model risk indexes dynamically."
      />

      {/* Model Overview KPI block */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Flagship LSTM Version"
          value="CrowdFlow v4.2"
          icon={Brain}
          description="LSTM Neural Network active"
          variant="safe"
        />
        <KpiCard
          title="Active Telemetry Context"
          value={loadingEvent ? "Locating..." : activeEvent ? activeEvent.title : "Unlinked"}
          icon={Database}
          description={activeEvent ? `Event ID: ${activeEvent._id.slice(-6).toUpperCase()}` : "Launch backend server"}
          variant={activeEvent ? "safe" : "warning"}
        />
        <KpiCard
          title="Emergency Dispatch Integration"
          value="Socket.io Uplink"
          icon={Radio}
          description="Live dashboard broadcasts enabled"
          variant="safe"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Parameter Sliders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-muted-foreground/10 pb-3">
              <Sliders className="h-4 w-4 text-primary" /> Adjustment Panel
            </h3>

            {/* Slider 1: Crowd Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Crowd Count</span>
                <span className="text-foreground font-mono">{crowdCount.toLocaleString()} / {capacity.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max={capacity * 1.2}
                step="500"
                value={crowdCount}
                onChange={(e) => setCrowdCount(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <Progress value={(crowdCount / capacity) * 100} className="h-1" />
            </div>

            {/* Slider 2: Capacity limit */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Venue Capacity Limit</span>
                <span className="text-foreground font-mono">{capacity.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Slider 3: Entry Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Entry Inflow Rate</span>
                <span className="text-foreground font-mono">{entryRate}/min</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={entryRate}
                onChange={(e) => setEntryRate(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>10/min</span>
                <span>1,000/min (Congestion)</span>
              </div>
            </div>

            {/* Slider 4: Exit Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Exit Outflow Rate</span>
                <span className="text-foreground font-mono">{exitRate}/min</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={exitRate}
                onChange={(e) => setExitRate(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Slider 5: Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Environmental Temperature</span>
                <span className="text-foreground font-mono">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Slider 6: Security Staff */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Security Personnel Deployed</span>
                <span className="text-foreground font-mono">{securityStaff} Marshals</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={securityStaff}
                onChange={(e) => setSecurityStaff(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Slider 7: Weather Environment */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Weather Condition</span>
                <span className="text-foreground font-mono">
                  {weather === "Sunny" ? "Optimal (Sunny)" : weather === "Rainy" ? "Degraded (Rainy)" : "Severe (Stormy)"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={weather === "Sunny" ? 0 : weather === "Rainy" ? 1 : 2}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val === 0) setWeather("Sunny");
                  else if (val === 1) setWeather("Rainy");
                  else setWeather("Stormy");
                }}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                <span>Sunny</span>
                <span>Rainy</span>
                <span>Stormy</span>
              </div>
            </div>

            {/* Slider 8: Emergency Exits */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Emergency Exits Open</span>
                <span className="text-foreground font-mono">{emergencyExits} Exits</span>
              </div>
              <input
                type="range"
                min="2"
                max="16"
                step="1"
                value={emergencyExits}
                onChange={(e) => setEmergencyExits(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                <span>2 Exits</span>
                <span>16 Exits (Max)</span>
              </div>
            </div>

            <Button
              onClick={runSimulationInference}
              disabled={isPredicting || loadingEvent}
              className="w-full h-10 mt-3 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer font-semibold text-xs"
            >
              {isPredicting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Computing LSTM Anomaly Matrix...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Execute Instant AI Prediction</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Dynamic Feedback & Alert Panels */}
        <div className="lg:col-span-7 space-y-6">
          {!predictionResult && !isPredicting ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center border rounded-xl bg-card border-dashed border-muted-foreground/20 p-8">
              <Brain className="h-14 w-14 text-muted-foreground/30 mb-4 animate-pulse" />
              <h3 className="font-bold text-base text-foreground">Waiting for Inference Parameters</h3>
              <p className="text-xs text-muted-foreground max-w-[340px] mt-1.5 leading-relaxed">
                Adjust sliders in the configuration panel and hit "Execute Instant AI Prediction" to dispatch mock payloads and run real-time predictions.
              </p>
            </div>
          ) : isPredicting ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center border rounded-xl bg-card border-dashed border-muted-foreground/20 p-8">
              <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
              <h3 className="font-bold text-sm text-foreground">Evaluating Telemetry Flux</h3>
              <p className="text-xs text-muted-foreground max-w-[280px] mt-1.5">
                Calling endpoint POST /api/predictions/trigger and mapping safety risk models.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Output Prediction Summary Card */}
              <div className={cn(
                "rounded-xl border p-6 space-y-5 shadow-xs transition-colors duration-300",
                predictionResult.riskLevel === "High"
                  ? "border-rose-500/25 bg-rose-500/5"
                  : predictionResult.riskLevel === "Medium"
                    ? "border-amber-500/25 bg-amber-500/5"
                    : "border-emerald-500/25 bg-emerald-500/5"
              )}>
                <div className="flex items-center justify-between border-b border-muted-foreground/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Inference Result</span>
                    <h3 className="text-base font-bold text-foreground">{predictionResult.title}</h3>
                  </div>
                  <Badge className={cn(
                    "text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white tracking-wider",
                    predictionResult.riskLevel === "High" ? "bg-rose-500" : predictionResult.riskLevel === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                  )}>
                    {predictionResult.riskLevel} RISK
                  </Badge>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  {/* Gauge Speedometer Indicator */}
                  <div className="space-y-2 flex flex-col items-center justify-center bg-muted/20 rounded-lg p-3 border">
                    <span className="text-[9px] font-bold uppercase text-muted-foreground">Confidence</span>
                    <div className="relative flex items-center justify-center">
                      {/* SVG Gauge */}
                      <svg className="w-20 h-20">
                        <circle className="text-muted/30" strokeWidth="6" stroke="currentColor" fill="transparent" r="30" cx="40" cy="40"/>
                        <circle
                          className={cn(
                            predictionResult.riskLevel === "High" ? "text-rose-500" : predictionResult.riskLevel === "Medium" ? "text-amber-500" : "text-emerald-500"
                          )}
                          strokeWidth="6"
                          strokeDasharray={188.4}
                          strokeDashoffset={188.4 - (188.4 * predictionResult.confidence) / 100}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="30"
                          cx="40"
                          cy="40"
                          transform="rotate(-90 40 40)"
                        />
                      </svg>
                      <span className="absolute text-sm font-extrabold">{predictionResult.confidence}%</span>
                    </div>
                  </div>

                  {/* Actions Recommendation snippets */}
                  <div className="sm:col-span-2 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <CheckCircle className={cn(
                        "h-3.5 w-3.5",
                        predictionResult.riskLevel === "High" ? "text-rose-500" : predictionResult.riskLevel === "Medium" ? "text-amber-500" : "text-emerald-500"
                      )} /> Recommended Mitigations
                    </span>
                    <ul className="text-xs space-y-1 text-foreground leading-relaxed list-disc list-inside">
                      {predictionResult.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="font-semibold text-muted-foreground">
                          <span className="text-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Dynamic Emergency Panel Dispatch (Lights Up if High Risk) */}
              {predictionResult.riskLevel === "High" && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-6 space-y-4 shadow-lg shadow-rose-500/5 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-500 animate-bounce">
                      <AlertOctagon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">EMERGENCY DISPATCH ACTIVE</h4>
                      <p className="text-xs text-muted-foreground">AI crowd thresholds breached. Real-time emergency mitigation pipelines initialized.</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    {/* SMS Status Box */}
                    <div className="flex items-center gap-2.5 rounded-lg bg-background/50 backdrop-blur-xs p-3 border border-rose-500/20">
                      <MessageSquare className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                      <div>
                        <p className="font-bold text-[9px] uppercase text-muted-foreground tracking-wider">SMS Dispatch</p>
                        <p className="font-extrabold text-emerald-500 flex items-center gap-1">
                          Delivered <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        </p>
                      </div>
                    </div>

                    {/* Radio Voice Status Box */}
                    <div className="flex items-center gap-2.5 rounded-lg bg-background/50 backdrop-blur-xs p-3 border border-rose-500/20">
                      <PhoneCall className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                      <div>
                        <p className="font-bold text-[9px] uppercase text-muted-foreground tracking-wider">Voice Call</p>
                        <p className="font-extrabold text-emerald-500 flex items-center gap-1">
                          Connected <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        </p>
                      </div>
                    </div>

                    {/* Incident Ticket Box */}
                    <div className="flex items-center gap-2.5 rounded-lg bg-background/50 backdrop-blur-xs p-3 border border-rose-500/20">
                      <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                      <div>
                        <p className="font-bold text-[9px] uppercase text-muted-foreground tracking-wider">Incident State</p>
                        <p className="font-extrabold text-rose-500 flex items-center gap-1">
                          Ticket Created
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cascade Timeline Steps (SMS, Voice, Incident created details) */}
              {showCascade && (
                <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-primary" /> Automated Dispatch Cascade Sequence
                  </h4>

                  <div className="relative border-l border-muted-foreground/10 pl-6 ml-2 space-y-5">
                    {cascadeSteps.map((step) => (
                      <div key={step.id} className="relative animate-slide-in">
                        {/* Dot Indicator */}
                        <div className="absolute -left-[31px] mt-0.5 rounded-full h-2.5 w-2.5 bg-primary border-4 border-card ring-2 ring-primary/25" />
                        
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-foreground">{step.title}</span>
                            <span className="font-mono text-[9px] text-muted-foreground/60">{step.time}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projection graph card */}
              <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-foreground">Forecast Accumulation Trend</h4>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={predictionResult.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                      <XAxis dataKey="time" fontSize={9} />
                      <YAxis fontSize={9} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="density"
                        stroke={predictionResult.riskLevel === "High" ? "#ef4444" : predictionResult.riskLevel === "Medium" ? "#f59e0b" : "#10b981"}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="limit"
                        stroke="#64748b"
                        strokeDasharray="4 4"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
