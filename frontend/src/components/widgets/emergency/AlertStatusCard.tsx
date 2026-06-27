"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellRing, Volume2, Wifi, Radio } from "lucide-react";
import { cn } from "@/lib/cn";

interface AlertStatusCardProps {
  activeAlarmsCount?: number;
  paVolume?: number; // 0-100
  signalStrength?: number; // 0-100
  frequency?: string;
  className?: string;
}

export function AlertStatusCard({
  activeAlarmsCount = 2,
  paVolume = 85,
  signalStrength = 98,
  frequency = "462.56 MHz",
  className,
}: AlertStatusCardProps) {
  return (
    <Card className={cn("overflow-hidden border border-muted-foreground/10 bg-card hover:shadow-md transition-all duration-200", className)}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground tracking-tight">Emergency Link Status</p>
          <Badge variant={activeAlarmsCount > 0 ? "destructive" : "secondary"} className="text-[10px] font-bold uppercase tracking-wider animate-pulse">
            {activeAlarmsCount > 0 ? `${activeAlarmsCount} Active Alarms` : "Nominal State"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Active Alarms Indicator */}
          <div className="p-3.5 rounded-lg border border-rose-500/20 bg-rose-500/5 space-y-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-rose-500">
              <BellRing className="h-3.5 w-3.5" /> Alarms
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-foreground">{activeAlarmsCount}</span>
              <span className="text-[9px] text-muted-foreground font-semibold">Active Zones</span>
            </div>
          </div>

          {/* PA Grid Volume Indicator */}
          <div className="p-3.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 space-y-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-indigo-500">
              <Volume2 className="h-3.5 w-3.5" /> PA Volume
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-foreground">{paVolume}%</span>
              <span className="text-[9px] text-muted-foreground font-semibold">Decibel Level</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 text-[10px] font-bold uppercase text-muted-foreground">
          <div className="space-y-1">
            <span className="flex items-center gap-1"><Wifi className="h-3.5 w-3.5 text-primary" /> Radio Uplink</span>
            <p className="text-xs font-bold text-foreground">{signalStrength}% Signal Quality</p>
          </div>
          <div className="space-y-1">
            <span className="flex items-center gap-1"><Radio className="h-3.5 w-3.5 text-primary" /> Broadcast Frequency</span>
            <p className="text-xs font-bold text-foreground">{frequency}</p>
          </div>
        </div>
        <div className="w-full mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
          <span className="truncate pr-1">API: GET /api/emergency/status</span>
          <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">Incident, Event</span>
        </div>
      </CardContent>
    </Card>
  );
}
