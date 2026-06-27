"use client";

import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/widgets/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import {
  MapPin,
  Sliders,
  LayoutGrid,
  Users,
  Video,
  Shield,
  DoorOpen,
  AlertTriangle,
  Play,
  Eye,
  CheckCircle,
  Activity,
  Plus,
  RefreshCw,
  FileCheck2,
  VideoOff
} from "lucide-react";

interface Sector {
  name: string;
  occupancy: number;
  capacity: number;
  risk: "low" | "medium" | "high" | "critical";
  exits: string;
  staff: number;
  cameras: string;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupancy: number;
  riskScore: number;
  cameraStatus: { online: number; total: number; degraded: number };
  emergencyExits: { open: number; total: number; blocked: number };
  securityStaff: { active: number; standby: number };
  status: "secure" | "elevated" | "emergency";
  sectors: Sector[];
}

import { useEventLifecycle } from "@/context/EventLifecycleContext";

export default function VenuesPage() {
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { stage, telemetry } = useEventLifecycle();

  // Dynamic Venue list bound to global event lifecycle
  const computedVenues = React.useMemo(() => {
    return [
      {
        id: "venue-olympus",
        name: "Olympus National Stadium",
        location: "East Plaza, Sector 4",
        capacity: telemetry.capacity,
        occupancy: telemetry.crowdCount,
        riskScore: telemetry.riskScore,
        cameraStatus: { online: 96, total: 96, degraded: 0 },
        emergencyExits: { open: 24, total: 24, blocked: 0 },
        securityStaff: { active: 120, standby: 30 },
        status: telemetry.riskScore > 80 ? "emergency" as const : telemetry.riskScore > 30 ? "elevated" as const : "secure" as const,
        sectors: [
          { name: "Sector A (North Entrance)", occupancy: Math.round(telemetry.crowdCount * 0.3), capacity: 16000, risk: telemetry.riskScore > 80 ? "high" as const : "medium" as const, exits: "6/6 Open", staff: 35, cameras: "24/24 Online" },
          { name: "Sector B (East Gate concourse)", occupancy: Math.round(telemetry.crowdCount * 0.5), capacity: 18000, risk: telemetry.riskScore > 80 ? "critical" as const : telemetry.riskScore > 40 ? "high" as const : "medium" as const, exits: "6/6 Open", staff: 45, cameras: "24/24 Online" },
          { name: "Sector C (VIP Lounge Entrance)", occupancy: Math.round(telemetry.crowdCount * 0.1), capacity: 8000, risk: "low" as const, exits: "4/4 Open", staff: 15, cameras: "16/16 Online" },
          { name: "Sector D (South concourse Plaza)", occupancy: Math.round(telemetry.crowdCount * 0.1), capacity: 23000, risk: telemetry.riskScore > 80 ? "medium" as const : "low" as const, exits: "8/8 Open", staff: 25, cameras: "32/32 Online" },
        ]
      },
      {
        id: "venue-centennial",
        name: "Centennial Indoor Arena",
        location: "Central Concourse, Tower B",
        capacity: 18500,
        occupancy: 17200,
        riskScore: 78,
        cameraStatus: { online: 44, total: 48, degraded: 4 },
        emergencyExits: { open: 11, total: 12, blocked: 1 },
        securityStaff: { active: 48, standby: 12 },
        status: "emergency" as const,
        sectors: [
          { name: "Lower Tier North Gates", occupancy: 4200, capacity: 4500, risk: "medium" as const, exits: "3/3 Open", staff: 12, cameras: "12/12 Online" },
          { name: "East Concourse Turnstiles", occupancy: 5800, capacity: 5000, risk: "critical" as const, exits: "2/3 Open (Gate 4 Blocked)", staff: 20, cameras: "8/12 Online (4 Degraded)" },
          { name: "West Exit Terminals", occupancy: 3900, capacity: 4500, risk: "medium" as const, exits: "3/3 Open", staff: 10, cameras: "12/12 Online" },
          { name: "South VIP Plaza Area", occupancy: 3300, capacity: 4500, risk: "low" as const, exits: "3/3 Open", staff: 6, cameras: "12/12 Online" },
        ]
      },
      {
        id: "venue-metropolis",
        name: "Metropolis Amphitheatre",
        location: "North Lakeside, Sector F",
        capacity: 8500,
        occupancy: 6100,
        riskScore: 18,
        cameraStatus: { online: 24, total: 24, degraded: 0 },
        emergencyExits: { open: 8, total: 8, blocked: 0 },
        securityStaff: { active: 18, standby: 6 },
        status: "secure" as const,
        sectors: [
          { name: "Main Stage Pit Area", occupancy: 3200, capacity: 4000, risk: "medium" as const, exits: "4/4 Open", staff: 8, cameras: "12/12 Online" },
          { name: "Lawn Seating Terraces", occupancy: 2100, capacity: 3500, risk: "low" as const, exits: "2/2 Open", staff: 6, cameras: "8/8 Online" },
          { name: "Lakeside Entry Concourse", occupancy: 800, capacity: 1000, risk: "low" as const, exits: "2/2 Open", staff: 4, cameras: "4/4 Online" },
        ]
      }
    ];
  }, [telemetry]);

  const [venuesList, setVenuesList] = useState<Venue[]>([]);

  React.useEffect(() => {
    setVenuesList(computedVenues);
  }, [computedVenues]);

  const venues = venuesList;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Telemetry Refreshed",
        description: "Checked physical gate sensors and cameras uplink streams.",
        variant: "success",
      });
    }, 600);
  };

  const simulateCrowdSpike = (venueId: string) => {
    setVenuesList(prev => prev.map(venue => {
      if (venue.id === venueId) {
        const excess = Math.floor(venue.capacity * 0.08);
        const newOccupancy = Math.min(venue.capacity, venue.occupancy + excess);
        const newRisk = Math.min(99, venue.riskScore + 15);
        toast({
          title: "Rush Hour Inflow Active",
          description: `Crowd occupancy at ${venue.name} spiked to ${newOccupancy.toLocaleString()}.`,
          variant: "default",
        });
        return {
          ...venue,
          occupancy: newOccupancy,
          riskScore: newRisk,
          status: newRisk > 75 ? "emergency" : newRisk > 35 ? "elevated" : "secure",
        };
      }
      return venue;
    }));
  };

  const simulateExitsUnlock = (venueId: string) => {
    setVenuesList(prev => prev.map(venue => {
      if (venue.id === venueId) {
        toast({
          title: "Emergency Overrides Active",
          description: `All exits at ${venue.name} commanded to emergency open. Obstructions cleared.`,
          variant: "success",
        });
        return {
          ...venue,
          emergencyExits: { open: venue.emergencyExits.total, total: venue.emergencyExits.total, blocked: 0 },
          riskScore: Math.max(10, venue.riskScore - 20),
          status: "secure" as const,
        };
      }
      return venue;
    }));
  };

  const selectedVenue = venues.find(v => v.id === selectedVenueId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Venue Directory"
        description="Auditing capacity parameters, emergency exits availability, staff allocations, and camera feeds latency."
        actions={
          <>
            {selectedVenueId && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 cursor-pointer"
                onClick={() => setSelectedVenueId(null)}
              >
                Back to All Venues
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Audit Sensors</span>
            </Button>
          </>
        }
      />

      {/* KPI Stats Section */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Monitored Arenas"
          value={`${venues.length} Venues`}
          icon={LayoutGrid}
          description="Integrated visual telemetry"
          variant="safe"
          apiEndpoint="GET /api/venues"
          collection="Venue"
        />
        <KpiCard
          title="Security Forces Deployed"
          value={`${venues.reduce((acc, v) => acc + v.securityStaff.active, 0)} Officers`}
          icon={Shield}
          description={`${venues.reduce((acc, v) => acc + v.securityStaff.standby, 0)} reserve units standby`}
          apiEndpoint="GET /api/venues/staff"
          collection="Venue"
        />
        <KpiCard
          title="Total Camera Uplinks"
          value={`${venues.reduce((acc, v) => acc + v.cameraStatus.online, 0)} / ${venues.reduce((acc, v) => acc + v.cameraStatus.total, 0)} Streams`}
          icon={Video}
          description={`${venues.reduce((acc, v) => acc + v.cameraStatus.degraded, 0)} streams degraded`}
          variant={venues.some(v => v.cameraStatus.degraded > 0) ? "warning" : "safe"}
          apiEndpoint="GET /api/venues/cameras"
          collection="Venue"
        />
      </div>

      {!selectedVenue ? (
        /* GRID VIEW: ALL VENUES CARDS */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => {
            const occupancyPercentage = Math.round((venue.occupancy / venue.capacity) * 100);
            
            return (
              <div
                key={venue.id}
                className={cn(
                  "rounded-xl border p-5 bg-card text-card-foreground shadow-xs transition-all hover:shadow-md space-y-4 border-muted-foreground/10 flex flex-col justify-between"
                )}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold tracking-tight text-foreground">{venue.name}</h3>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" /> {venue.location}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0",
                        venue.status === "emergency"
                          ? "border-rose-500/30 text-rose-600 bg-rose-500/10 dark:text-rose-400"
                          : venue.status === "elevated"
                            ? "border-amber-500/30 text-amber-600 bg-amber-500/10 dark:text-amber-400"
                            : "border-emerald-500/30 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
                      )}
                    >
                      {venue.status === "emergency" ? "Emergency alert" : venue.status === "elevated" ? "Monitoring" : "Secure"}
                    </Badge>
                  </div>

                  {/* Occupancy gauge slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                      <span>Occupancy</span>
                      <span className="text-foreground">{venue.occupancy.toLocaleString()} / {venue.capacity.toLocaleString()} ({occupancyPercentage}%)</span>
                    </div>
                    <Progress 
                      value={occupancyPercentage} 
                      className="h-2" 
                      barClassName={
                        occupancyPercentage > 90 
                          ? "bg-rose-500" 
                          : occupancyPercentage > 75 
                            ? "bg-amber-500" 
                            : "bg-emerald-500"
                      } 
                    />
                  </div>

                  {/* Operational Metrics Subgrid */}
                  <div className="grid grid-cols-2 gap-3.5 pt-1 text-xs">
                    <div className="space-y-0.5 rounded-lg bg-muted/20 border p-2.5">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5 text-primary shrink-0" /> AI Risk Index
                      </p>
                      <p className={cn(
                        "font-bold text-sm",
                        venue.riskScore > 75 ? "text-rose-500" : venue.riskScore > 35 ? "text-amber-500" : "text-emerald-500"
                      )}>
                        {venue.riskScore}% Anomaly
                      </p>
                    </div>

                    <div className="space-y-0.5 rounded-lg bg-muted/20 border p-2.5">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-primary shrink-0" /> Camera streams
                      </p>
                      <p className="font-bold text-sm text-foreground">
                        {venue.cameraStatus.online} / {venue.cameraStatus.total} Online
                      </p>
                    </div>

                    <div className="space-y-0.5 rounded-lg bg-muted/20 border p-2.5">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                        <DoorOpen className="h-3.5 w-3.5 text-primary shrink-0" /> Emergency Exits
                      </p>
                      <p className={cn(
                        "font-bold text-sm",
                        venue.emergencyExits.blocked > 0 ? "text-rose-500" : "text-emerald-500"
                      )}>
                        {venue.emergencyExits.blocked > 0 
                          ? `${venue.emergencyExits.blocked} Blocked` 
                          : `${venue.emergencyExits.open} Exits Clear`}
                      </p>
                    </div>

                    <div className="space-y-0.5 rounded-lg bg-muted/20 border p-2.5">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5 text-primary shrink-0" /> Security Staff
                      </p>
                      <p className="font-bold text-sm text-foreground">
                        {venue.securityStaff.active} deployed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Operations Control Actions Row */}
                <div className="flex flex-col gap-2 pt-4 border-t border-muted-foreground/5 mt-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => simulateCrowdSpike(venue.id)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-[11px] h-8 gap-1 cursor-pointer"
                    >
                      <Users className="h-3 w-3" /> Simulate Rush
                    </Button>
                    <Button
                      onClick={() => simulateExitsUnlock(venue.id)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-[11px] h-8 gap-1 cursor-pointer border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/5 dark:text-emerald-400"
                    >
                      <DoorOpen className="h-3 w-3" /> Unlock Exits
                    </Button>
                  </div>
                  <Button
                    onClick={() => setSelectedVenueId(venue.id)}
                    size="sm"
                    className="w-full text-xs h-8 cursor-pointer gap-1 bg-primary text-primary-foreground hover:bg-primary/95"
                  >
                    <Eye className="h-3.5 w-3.5" /> Inspect Sector Telemetry
                  </Button>
                  <div className="mt-2 pt-2 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
                    <span>API: GET /api/venues/{venue.id}</span>
                    <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">Venue</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DETAILED VENUE VIEW: SECTORS GRID */
        <div className="space-y-6 animate-fade-in">
          {/* Back Header Banner */}
          <div className="border border-muted-foreground/10 bg-card rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Detailed Auditing
              </span>
              <h3 className="text-lg font-bold text-foreground">{selectedVenue.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedVenue.location} &mdash; Capacity limits monitoring</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => simulateCrowdSpike(selectedVenue.id)}
                size="sm"
                variant="outline"
                className="h-8 text-xs cursor-pointer gap-1"
              >
                <Users className="h-3 w-3" /> Simulate Rush
              </Button>
              <Button
                onClick={() => simulateExitsUnlock(selectedVenue.id)}
                size="sm"
                variant="outline"
                className="h-8 text-xs cursor-pointer gap-1 border-emerald-500/25 text-emerald-600 hover:bg-emerald-500/5 dark:text-emerald-400"
              >
                <DoorOpen className="h-3 w-3" /> Unlock Exits
              </Button>
            </div>
          </div>

          {/* Sector Tables log */}
          <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-foreground">Active Sector Telemetry Grid</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-muted-foreground/10 text-muted-foreground uppercase text-[10px] font-bold">
                    <th className="pb-3.5 font-semibold">Sector / Zone Area</th>
                    <th className="pb-3.5 font-semibold">Occupancy Rate</th>
                    <th className="pb-3.5 font-semibold text-center">Density Index Rating</th>
                    <th className="pb-3.5 font-semibold text-center">Camera Uplink</th>
                    <th className="pb-3.5 font-semibold text-center">Emergency Exits</th>
                    <th className="pb-3.5 font-semibold text-center">Marshals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted-foreground/5">
                  {selectedVenue.sectors.map((sector, idx) => {
                    const pct = Math.round((sector.occupancy / sector.capacity) * 100);
                    return (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors">
                        <td className="py-3.5 font-semibold text-foreground">{sector.name}</td>
                        <td className="py-3.5 space-y-1.5 w-[200px]">
                          <div className="flex justify-between items-center font-medium">
                            <span>{sector.occupancy.toLocaleString()} / {sector.capacity.toLocaleString()}</span>
                            <span>{pct}%</span>
                          </div>
                          <Progress 
                            value={pct} 
                            className="h-1.5" 
                            barClassName={
                              pct > 90 
                                ? "bg-rose-500" 
                                : pct > 75 
                                  ? "bg-amber-500" 
                                  : "bg-emerald-500"
                            } 
                          />
                        </td>
                        <td className="py-3.5 text-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold uppercase rounded-sm px-2 py-0.5",
                              sector.risk === "critical"
                                ? "border-rose-500/30 text-rose-600 bg-rose-500/10 dark:text-rose-400"
                                : sector.risk === "high"
                                  ? "border-orange-500/30 text-orange-600 bg-orange-500/10 dark:text-orange-400"
                                  : sector.risk === "medium"
                                    ? "border-amber-500/30 text-amber-600 bg-amber-500/10 dark:text-amber-400"
                                    : "border-emerald-500/30 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
                            )}
                          >
                            {sector.risk}
                          </Badge>
                        </td>
                        <td className="py-3.5 text-center font-semibold">{sector.cameras}</td>
                        <td className="py-3.5 text-center font-semibold text-foreground">
                          {sector.exits.includes("Blocked") ? (
                            <span className="text-rose-500 flex items-center justify-center gap-1 font-bold">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {sector.exits}
                            </span>
                          ) : (
                            <span className="text-emerald-500 flex items-center justify-center gap-1 font-bold">
                              <CheckCircle className="h-3.5 w-3.5 shrink-0" /> {sector.exits}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-center font-bold text-foreground">{sector.staff} Staff</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
