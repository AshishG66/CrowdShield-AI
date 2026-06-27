import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";

export type RiskLevel = "low" | "medium" | "high" | "critical";

interface RiskCardProps {
  zoneName: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  trend: "up" | "down" | "stable";
  factors: string[];
  className?: string;
}

export function RiskCard({
  zoneName,
  riskScore,
  riskLevel,
  trend,
  factors,
  className,
}: RiskCardProps) {
  const levelConfig = {
    low: { label: "Low Risk", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400", barColor: "bg-emerald-500" },
    medium: { label: "Medium Risk", color: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400", barColor: "bg-amber-500" },
    high: { label: "High Risk", color: "text-orange-600 bg-orange-500/10 border-orange-500/20 dark:text-orange-400", barColor: "bg-orange-500" },
    critical: { label: "Critical Risk", color: "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400", barColor: "bg-rose-500" },
  };

  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-shadow duration-200 border border-muted-foreground/10", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground">{zoneName}</CardTitle>
        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", levelConfig[riskLevel].color)}>
          {levelConfig[riskLevel].label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold tracking-tight">{riskScore}</span>
            <span className="text-xs text-muted-foreground">/100 Index</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold">
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
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Aggregated Risk Score</span>
            <span>{riskScore}%</span>
          </div>
          <Progress value={riskScore} className="h-2" barClassName={levelConfig[riskLevel].barColor} />
        </div>

        {factors.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Primary Risk Drivers</p>
            <div className="flex flex-wrap gap-1.5">
              {factors.map((factor) => (
                <span key={factor} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium border">
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
