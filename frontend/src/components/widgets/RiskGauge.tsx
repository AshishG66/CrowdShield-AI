import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

export type RiskLevel = "low" | "medium" | "high" | "critical";

interface RiskGaugeProps {
  zoneName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  trend: "up" | "down" | "stable";
  factors: string[];
  className?: string;
}

export function RiskGauge({
  zoneName,
  riskScore,
  riskLevel,
  trend,
  factors,
  className,
}: RiskGaugeProps) {
  const levelConfig = {
    low: { label: "Low Risk", color: "text-emerald-600 border-emerald-500/20 bg-emerald-500/5 dark:text-emerald-400", stroke: "stroke-emerald-500" },
    medium: { label: "Medium Risk", color: "text-amber-600 border-amber-500/20 bg-amber-500/5 dark:text-amber-400", stroke: "stroke-amber-500" },
    high: { label: "High Risk", color: "text-orange-600 border-orange-500/20 bg-orange-500/5 dark:text-orange-400", stroke: "stroke-orange-500" },
    critical: { label: "Critical Risk", color: "text-rose-600 border-rose-500/20 bg-rose-500/5 dark:text-rose-400", stroke: "stroke-rose-500 animate-pulse" },
  };

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <Card className={cn("overflow-hidden border hover:shadow-md transition-all duration-200 border-muted-foreground/10", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-muted-foreground/5 bg-muted/5">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate max-w-[70%]">
          {zoneName}
        </CardTitle>
        <Badge variant="outline" className={cn("text-[9px] font-extrabold uppercase rounded-full px-2 py-0.5", levelConfig[riskLevel].color)}>
          {levelConfig[riskLevel].label}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-5 flex flex-col items-center justify-center space-y-4">
        {/* SVG Circular Gauge */}
        <div className="relative flex items-center justify-center h-28 w-28">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track Circle */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-muted fill-none"
              strokeWidth="6.5"
            />
            {/* Foreground Fill Circle */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              className={cn("fill-none transition-all duration-500 ease-out", levelConfig[riskLevel].stroke)}
              strokeWidth="6.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          {/* Inner Text parameters */}
          <div className="absolute text-center space-y-0.5">
            <span className="text-2xl font-extrabold tracking-tighter text-foreground">{riskScore}</span>
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Index</p>
          </div>
        </div>

        {/* Trend Metrics Indicator */}
        <div className="flex items-center justify-between w-full text-xs font-semibold pt-1 border-t border-muted-foreground/5">
          <span className="text-muted-foreground">Anomaly Direction</span>
          {trend === "up" && (
            <span className="text-rose-500 flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> Rising
            </span>
          )}
          {trend === "down" && (
            <span className="text-emerald-500 flex items-center gap-0.5">
              <TrendingDown className="h-3.5 w-3.5" /> Falling
            </span>
          )}
          {trend === "stable" && (
            <span className="text-muted-foreground">Stable</span>
          )}
        </div>

        {/* Risk factors list */}
        {factors.length > 0 && (
          <div className="w-full space-y-1.5 pt-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-500" /> Active Risk Drivers
            </span>
            <div className="flex flex-wrap gap-1">
              {factors.map((factor) => (
                <span key={factor} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold border border-muted-foreground/10">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
