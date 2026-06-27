import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sliders, Activity } from "lucide-react";
import { cn } from "@/lib/cn";

interface PredictionSummaryCardProps {
  confidence: number;
  activeModels: number;
  latencyMs: number;
  className?: string;
}

export function PredictionSummaryCard({
  confidence = 94.8,
  activeModels = 4,
  latencyMs = 45,
  className,
}: PredictionSummaryCardProps) {
  return (
    <Card className={cn("overflow-hidden border hover:shadow-md transition-shadow duration-200 border-muted-foreground/10", className)}>
      <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px] space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground tracking-tight">AI Predictions Engine</p>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Brain className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="space-y-0.5">
            <h3 className="text-2xl font-bold tracking-tight">{confidence}%</h3>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Average Confidence</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-muted-foreground/5 text-[10px] font-bold uppercase text-muted-foreground">
          <div className="space-y-1">
            <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-primary" /> Active Model relays</span>
            <p className="text-xs font-bold text-foreground">{activeModels} Inferences</p>
          </div>
          <div className="space-y-1">
            <span className="flex items-center gap-1"><Sliders className="h-3 w-3 text-primary" /> Edge latency</span>
            <p className="text-xs font-bold text-foreground">{latencyMs} ms</p>
          </div>
        </div>
        <div className="w-full mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
          <span className="truncate pr-1">API: GET /api/predictions/latest</span>
          <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">Prediction</span>
        </div>
      </CardContent>
    </Card>
  );
}
