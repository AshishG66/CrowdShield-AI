"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { AnalyticsCard } from "@/components/cards/AnalyticsCard";

interface RiskData {
  sector: string;
  risk: number; // 0 to 100
  occupancy: number; // percentage
}

const defaultRiskData: RiskData[] = [
  { sector: "Sector A", risk: 28, occupancy: 45 },
  { sector: "Sector B", risk: 84, occupancy: 92 }, // High Risk
  { sector: "Sector C", risk: 52, occupancy: 68 }, // Warning
  { sector: "Sector D", risk: 18, occupancy: 30 },
  { sector: "Sector E", risk: 65, occupancy: 78 }, // Warning
  { sector: "Sector F", risk: 32, occupancy: 50 },
];

interface RiskDistributionChartProps {
  data?: RiskData[];
  className?: string;
}

export function RiskDistributionChart({ data = defaultRiskData, className }: RiskDistributionChartProps) {
  const [filter, setFilter] = React.useState("Live Metrics");

  const chartData = React.useMemo(() => {
    if (filter === "Peak Simulation") {
      return data.map((d) => ({
        ...d,
        risk: Math.min(100, Math.round(d.risk * 1.2)),
        occupancy: Math.min(100, Math.round(d.occupancy * 1.15)),
      }));
    }
    if (filter === "Off-Peak") {
      return data.map((d) => ({
        ...d,
        risk: Math.max(5, Math.round(d.risk * 0.5)),
        occupancy: Math.max(10, Math.round(d.occupancy * 0.6)),
      }));
    }
    return data;
  }, [filter, data]);

  const getBarColor = (risk: number) => {
    if (risk >= 75) return "#ef4444"; // red-500
    if (risk >= 45) return "#f59e0b"; // amber-500
    return "#10b981"; // emerald-500
  };

  return (
    <AnalyticsCard
      title="Sector Risk Index Distribution"
      description="Aggregated real-time AI security & flow congestion risk metrics across sectors."
      filterOptions={["Live Metrics", "Peak Simulation", "Off-Peak"]}
      activeFilter={filter}
      onFilterChange={setFilter}
      className={className}
    >
      <div className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/10" vertical={false} />
            <XAxis dataKey="sector" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30, 41, 59, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#f8fafc",
              }}
              itemStyle={{ color: "#f8fafc" }}
              labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            <Bar dataKey="risk" name="AI Risk Level (%)" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.risk)} />
              ))}
            </Bar>
            <Bar dataKey="occupancy" name="Occupancy Capacity (%)" fill="#6366f1" opacity={0.6} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
        <span className="truncate pr-1">API: GET /api/analytics/risk-distribution</span>
        <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">Prediction, Venue</span>
      </div>
    </AnalyticsCard>
  );
}
