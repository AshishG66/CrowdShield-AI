"use client";

import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/widgets/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import {
  BrainCircuit,
  CheckCircle2,
  ShieldAlert,
  Users,
  PhoneCall,
  MessageSquare,
  Activity,
  RefreshCw,
  Plus,
  AlertTriangle
} from "lucide-react";

// Import mock API services
import {
  initialIncidents,
  initialNotifications,
  mockWeatherData,
  mockPredictionData,
  IncidentItem,
  NotificationItem
} from "@/services/mockApi";

// Import modular widgets
import { RiskGauge, RiskLevel } from "@/components/widgets/dashboard/RiskGauge";
import { IncidentTimeline } from "@/components/widgets/IncidentTimeline";
import { WeatherWidget } from "@/components/widgets/dashboard/WeatherWidget";
import { PredictionCard } from "@/components/widgets/PredictionCard";
import { NotificationCard } from "@/components/cards/NotificationCard";

import { useEventLifecycle } from "@/context/EventLifecycleContext";

export default function DashboardOverview() {
  const [activeFilter, setActiveFilter] = useState("Live feed");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    stage,
    telemetry,
    incidents,
    notifications,
    smsLogs,
    voiceCallLogs,
    investigateIncident,
    resolveIncident,
    markNotificationRead,
  } = useEventLifecycle();

  // Derived state calculations
  const activeIncidents = incidents.filter(i => i.status !== "resolved");
  const hasCritical = activeIncidents.some(i => i.severity === "critical");
  const hasWarning = activeIncidents.some(i => i.severity === "warning");
  const activeCount = activeIncidents.length;

  const currentRiskScore = telemetry.riskScore;

  const threatLevelText = telemetry.threatLevel === "Severe"
    ? "Level 3: Severe"
    : telemetry.threatLevel === "Elevated"
      ? "Level 2: Elevated"
      : "Level 1: Low";

  const voiceCallsValue = voiceCallLogs.filter(c => c.status === "connected").length > 0
    ? `${voiceCallLogs.filter(c => c.status === "connected").length} Active Radio Bridges`
    : "0 Standby";

  // Compute dynamic zone parameters
  const zoneAIncident = incidents.find(i => i.id === "INC-109");
  const zoneARiskScore = zoneAIncident
    ? zoneAIncident.status === "active"
      ? 68
      : zoneAIncident.status === "investigating"
        ? 42
        : 12
    : 12;
  const zoneARiskLevel: RiskLevel = zoneARiskScore > 60 ? "high" : zoneARiskScore > 30 ? "medium" : "low";
  const zoneATrend = zoneAIncident
    ? zoneAIncident.status === "active"
      ? "up"
      : zoneAIncident.status === "investigating"
        ? "stable"
        : "down"
    : "down";

  const zoneBIncident = incidents.find(i => i.id === "INC-241" || i.id === "INC-342");
  const zoneBRiskScore = zoneBIncident
    ? zoneBIncident.status === "active"
      ? 96
      : zoneBIncident.status === "investigating"
        ? 55
        : 14
    : 14;
  const zoneBRiskLevel: RiskLevel = zoneBRiskScore > 80 ? "critical" : zoneBRiskScore > 50 ? "high" : zoneBRiskScore > 20 ? "medium" : "low";
  const zoneBTrend = zoneBIncident
    ? zoneBIncident.status === "active"
      ? "up"
      : zoneBIncident.status === "investigating"
        ? "stable"
        : "down"
    : "down";

  // Action handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Telemetry Refreshed",
        description: "All sensors, AI inference layers, and dispatch modules synced successfully.",
        variant: "success",
      });
    }, 800);
  };

  const handleRespond = (id: string) => {
    investigateIncident(id);
    toast({
      title: "Response Initiated",
      description: `First responders dispatched to ${id}. Status marked as Investigating.`,
      variant: "default",
    });
  };

  const handleResolve = (id: string) => {
    resolveIncident(id);
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    toast({
      title: "Notification Cleared",
      description: `Alert detail ${id} marked read.`,
      variant: "success",
    });
  };

  const dynamicPredictionData = React.useMemo(() => {
    if (stage !== "nominal") {
      return [
        { time: "16:00", occupancy: 12000, predicted: 11000 },
        { time: "17:00", occupancy: 24000, predicted: 22000 },
        { time: "18:00", occupancy: 35000, predicted: 36000 },
        { time: "19:00", occupancy: 42150, predicted: 41000 },
        { time: "20:00", occupancy: 43000, predicted: 44000 },
        { time: "21:00", occupancy: 42500, predicted: 43000 },
      ];
    }
    return mockPredictionData;
  }, [stage]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Hub Overview"
        description="Real-time intelligent safety monitoring and emergency dispatch telemetry."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Sync Telemetry</span>
            </Button>
            <Button size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95">
              <Plus className="h-3.5 w-3.5" />
              <span>New Action Plan</span>
            </Button>
          </>
        }
      />

      {/* "Is everything okay?" 5-Second Status Panel */}
      <div className={cn(
        "relative overflow-hidden rounded-xl border p-6 transition-all duration-300 shadow-sm",
        hasCritical
          ? "border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10 text-foreground"
          : hasWarning
            ? "border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 text-foreground"
            : "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 text-foreground"
      )}>
        {/* Glow backdrop styling effect */}
        <div className={cn(
          "absolute -top-24 -right-24 h-48 w-48 rounded-full blur-[80px] opacity-15 transition-all duration-500",
          hasCritical ? "bg-rose-500" : hasWarning ? "bg-amber-500" : "bg-emerald-500"
        )} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            {/* Dynamic Pulsing Orb */}
            <div className={cn(
              "relative mt-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
              hasCritical
                ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                : hasWarning
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
            )}>
              <span className={cn(
                "absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75 animate-pulse",
                hasCritical ? "bg-rose-500" : hasWarning ? "bg-amber-500" : "bg-emerald-500"
              )} />
              <span className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                hasCritical ? "bg-rose-500" : hasWarning ? "bg-amber-500" : "bg-emerald-500"
              )} />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                  Status Evaluation
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                    hasCritical
                      ? "border-rose-500/30 text-rose-600 bg-rose-500/10 dark:text-rose-400"
                      : hasWarning
                        ? "border-amber-500/30 text-amber-600 bg-amber-500/10 dark:text-amber-400"
                        : "border-emerald-500/30 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
                  )}
                >
                  {hasCritical ? "Action Required" : hasWarning ? "Alert Advisory" : "Secure"}
                </Badge>
              </div>

              {/* Core 5-Second Question & Answer */}
              <h2 className="text-xl font-bold tracking-tight">
                Is everything okay? &mdash;{" "}
                <span className={cn(
                  "font-extrabold",
                  hasCritical ? "text-rose-500" : hasWarning ? "text-amber-500" : "text-emerald-500"
                )}>
                  {hasCritical
                    ? "Critical Incident Active"
                    : hasWarning
                      ? "Elevated Warning Flagged"
                      : "Yes, Systems Operational"}
                </span>
              </h2>

              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed pt-0.5">
                {hasCritical
                  ? `Attention required. AI sensors detect active critical overcrowding at Gate 4 Entry. Response protocols have been initiated.`
                  : hasWarning
                    ? `General venue safety is intact. There is 1 warning alert undergoing active investigation. Monitoring telemetry is in elevated stand-by.`
                    : `All zones report nominal status. Crowds are flowing smoothly, weather conditions are optimal, and no security threats have been detected.`}
              </p>
            </div>
          </div>

          {/* Diagnostics Live Telemetry Mini Grid */}
          <div className="flex flex-wrap lg:flex-nowrap gap-3 shrink-0">
            <div className="flex flex-col gap-1 rounded-lg bg-card/60 backdrop-blur-xs border border-muted-foreground/10 p-3 min-w-[110px] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">AI Scanning</span>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Locked & On
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg bg-card/60 backdrop-blur-xs border border-muted-foreground/10 p-3 min-w-[110px] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Crowd Flow</span>
              <span className={cn(
                "text-xs font-bold flex items-center gap-1.5",
                hasCritical ? "text-rose-500" : hasWarning ? "text-amber-500" : "text-emerald-500"
              )}>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  hasCritical ? "bg-rose-500 animate-pulse" : hasWarning ? "bg-amber-500" : "bg-emerald-500"
                )} />
                {hasCritical ? "Congestion" : hasWarning ? "Heavy Inflow" : "Optimal"}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg bg-card/60 backdrop-blur-xs border border-muted-foreground/10 p-3 min-w-[110px] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Active Triage</span>
              <span className={cn(
                "text-xs font-bold flex items-center gap-1.5",
                activeCount > 0 ? "text-amber-500" : "text-emerald-500"
              )}>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  activeCount > 0 ? "bg-amber-500 animate-ping" : "bg-emerald-500"
                )} />
                {activeCount > 0 ? `${activeCount} Checked` : "Standby"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (utilizing single-responsibility components and WeatherWidget) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* 1. Crowd Occupancy */}
        <KpiCard
          title="Crowd Occupancy"
          value={`${telemetry.crowdCount.toLocaleString()} / ${telemetry.capacity.toLocaleString()}`}
          icon={Users}
          trend={{ value: `${Math.round((telemetry.crowdCount / telemetry.capacity) * 100)}% Target Cap`, isPositive: telemetry.crowdCount < telemetry.capacity * 0.95 }}
          description="Within stadium premises"
          variant={telemetry.crowdCount > telemetry.capacity * 0.9 ? "warning" : "default"}
          apiEndpoint="GET /api/venues/occupancy"
          collection="CrowdReading, Venue"
        />

        {/* 2. Current AI Risk */}
        <KpiCard
          title="Current AI Risk"
          value={`${currentRiskScore}%`}
          icon={Activity}
          trend={activeCount === 0
            ? { value: "-5.8% drop", isPositive: true }
            : { value: `+${currentRiskScore - 12}% rise`, isPositive: false }}
          description="Avg anomaly score"
          variant={activeCount === 0 ? "safe" : hasCritical ? "critical" : "warning"}
          apiEndpoint="GET /api/dashboard/risk"
          collection="Prediction"
        />

        {/* 3. Threat Level */}
        <KpiCard
          title="Threat Level"
          value={threatLevelText}
          icon={ShieldAlert}
          description="Command defense posture"
          variant={activeCount === 0 ? "safe" : hasCritical ? "critical" : "warning"}
          apiEndpoint="GET /api/dashboard/risk"
          collection="Prediction"
        />

        {/* 4. Incidents Today */}
        <KpiCard
          title="Incidents Today"
          value={`${activeCount} Active / ${incidents.length} Total`}
          icon={AlertTriangle}
          description={`${incidents.filter(i => i.status === "resolved").length} resolved reports`}
          variant={activeCount === 0 ? "safe" : hasCritical ? "critical" : "warning"}
          apiEndpoint="GET /api/incidents/today"
          collection="Incident"
        />

        {/* 5. SMS Delivered */}
        <KpiCard
          title="SMS Delivered"
          value={`${(smsLogs.length * 14820 + 1240).toLocaleString()} Messages`}
          icon={MessageSquare}
          trend={{ value: "100% gateway", isPositive: true }}
          description="Bulk warning relay online"
          apiEndpoint="GET /api/notifications/sms/count"
          collection="SMSLog"
        />

        {/* 6. Voice Calls */}
        <KpiCard
          title="Voice Calls"
          value={voiceCallsValue}
          icon={PhoneCall}
          description="Dispatch radio relays"
          apiEndpoint="GET /api/notifications/voice/count"
          collection="CallLog"
        />

        {/* 7. System Health */}
        <KpiCard
          title="System Health"
          value="99.98%"
          icon={CheckCircle2}
          description="12/12 zoning grids online"
          variant="safe"
          apiEndpoint="GET /api/system/health"
          collection="User"
        />

        {/* 8. WeatherWidget */}
        <WeatherWidget
          weather={{
            temp: telemetry.temperature,
            condition: telemetry.temperature > 30 ? "Humid, Hot" : "Clear",
            windSpeed: 12,
            humidity: telemetry.temperature > 30 ? 75 : 45,
            icon: telemetry.temperature > 30 ? "cloud-lightning" : "sun"
          }}
        />
      </div>

      {/* Dynamic Zone Risk Cards (utilizing modular RiskGauge widgets) */}
      <div className="grid gap-6 md:grid-cols-3">
        <RiskGauge
          zoneName="North Stadium concourse (Sector A)"
          riskScore={zoneARiskScore}
          riskLevel={zoneARiskLevel}
          trend={zoneATrend}
          factors={zoneAIncident && zoneAIncident.status !== "resolved" ? ["Density Accumulation", "Unattended Item"] : ["Normal Queuing"]}
          className="md:col-span-1"
        />
        <RiskGauge
          zoneName="East Gate Terminal (Sector B)"
          riskScore={zoneBRiskScore}
          riskLevel={zoneBRiskLevel}
          trend={zoneBTrend}
          factors={zoneBIncident && zoneBIncident.status !== "resolved" ? ["Overcrowding bottleneck", "Inflow > Outflow Limit"] : ["Stable Ingress"]}
          className="md:col-span-1"
        />
        <RiskGauge
          zoneName="VIP Lounge Entrance"
          riskScore={8}
          riskLevel="low"
          trend="stable"
          factors={[]}
          className="md:col-span-1"
        />
      </div>

      {/* Main Charts & Incident Feed Split Section (utilizing modular PredictionCard & IncidentTimeline widgets) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* PredictionCard area graph widget */}
        <div className="lg:col-span-2">
          <PredictionCard
            data={dynamicPredictionData}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* IncidentTimeline & Notification Feed list widget */}
        <div className="space-y-6 lg:col-span-1">
          <IncidentTimeline
            incidents={incidents}
            onRespond={handleRespond}
            onResolve={handleResolve}
          />

          <div className="border-t border-muted-foreground/10 pt-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">AI Engine Notification Feed</h4>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  id={notif.id}
                  title={notif.title}
                  message={notif.message}
                  timestamp={notif.timestamp}
                  type={notif.type}
                  isRead={notif.isRead}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
