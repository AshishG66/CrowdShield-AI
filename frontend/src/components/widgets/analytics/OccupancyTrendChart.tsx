"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { AnalyticsCard } from "@/components/cards/AnalyticsCard";
import { mockPredictionData, PredictionData } from "@/services/mockApi";

interface OccupancyTrendChartProps {
  data?: PredictionData[];
  className?: string;
}

export function OccupancyTrendChart({ data = mockPredictionData, className }: OccupancyTrendChartProps) {
  const [filter, setFilter] = React.useState("Today");

  // Mock filter data changes
  const chartData = React.useMemo(() => {
    if (filter === "Yesterday") {
      return data.map((d) => ({
        ...d,
        occupancy: Math.round(d.occupancy * 0.9),
        predicted: Math.round(d.predicted * 0.92),
      }));
    }
    if (filter === "Last 7 Days") {
      return data.map((d) => ({
        ...d,
        occupancy: Math.round(d.occupancy * 1.15),
        predicted: Math.round(d.predicted * 1.12),
      }));
    }
    return data;
  }, [filter, data]);

  return (
    <AnalyticsCard
      title="Occupancy & Inflow Trend"
      description="Comparison between actual crowd count and AI predictive flow modeling."
      filterOptions={["Today", "Yesterday", "Last 7 Days"]}
      activeFilter={filter}
      onFilterChange={setFilter}
      className={className}
    >
      <div className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/10" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
            <Area
              type="monotone"
              dataKey="occupancy"
              stroke="#4f46e5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOccupancy)"
              name="Live Occupancy"
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#06b6d4"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorPredicted)"
              name="AI Prediction"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
        <span className="truncate pr-1">API: GET /api/analytics/occupancy-trend</span>
        <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">CrowdReading, Venue</span>
      </div>
    </AnalyticsCard>
  );
}
