"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { AnalyticsCard } from "@/components/cards/AnalyticsCard";

interface HourDensityData {
  time: string;
  density: number; // people per m2
  headcount: number;
}

const defaultPeakHoursData: HourDensityData[] = [
  { time: "08:00 - 10:00", density: 1.4, headcount: 3800 },
  { time: "10:00 - 12:00", density: 2.9, headcount: 8200 },
  { time: "12:00 - 14:00", density: 4.3, headcount: 12500 }, // Threshold warning
  { time: "14:00 - 16:00", density: 4.8, headcount: 14800 }, // Critical
  { time: "16:00 - 18:00", density: 3.7, headcount: 11200 },
  { time: "18:00 - 20:00", density: 2.8, headcount: 8900 },
  { time: "20:00 - 22:00", density: 1.6, headcount: 4200 },
];

interface PeakHoursChartProps {
  data?: HourDensityData[];
  className?: string;
}

export function PeakHoursChart({ data = defaultPeakHoursData, className }: PeakHoursChartProps) {
  const [filter, setFilter] = React.useState("This Weekend");

  const chartData = React.useMemo(() => {
    if (filter === "Last Weekend") {
      return data.map((d) => ({
        ...d,
        density: +(d.density * 0.95).toFixed(1),
        headcount: Math.round(d.headcount * 0.93),
      }));
    }
    if (filter === "Baseline Avg") {
      return data.map((d) => ({
        ...d,
        density: +(d.density * 0.75).toFixed(1),
        headcount: Math.round(d.headcount * 0.75),
      }));
    }
    return data;
  }, [filter, data]);

  return (
    <AnalyticsCard
      title="Peak Ingress & Density Analysis"
      description="Identifies bottlenecks by overlaying headcount with physical density indicators."
      filterOptions={["This Weekend", "Last Weekend", "Baseline Avg"]}
      activeFilter={filter}
      onFilterChange={setFilter}
      className={className}
    >
      <div className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/10" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            
            {/* Left Y Axis for density index */}
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Density (p/m²)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { textAnchor: "middle", fill: "#94a3b8", fontSize: 10, fontWeight: "600" },
              }}
            />
            
            {/* Right Y Axis for raw headcounts */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Headcount",
                angle: 90,
                position: "insideRight",
                offset: -5,
                style: { textAnchor: "middle", fill: "#94a3b8", fontSize: 10, fontWeight: "600" },
              }}
            />
            
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
            
            {/* Density threshold level at 4.0 p/m² */}
            <ReferenceLine yAxisId="left" y={4.0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Critical Threshold (4.0)", fill: "#ef4444", fontSize: 10, position: "top" }} />
            
            {/* Density bar column chart */}
            <Bar yAxisId="left" dataKey="density" name="Density (p/m²)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={45} />
            
            {/* Headcount line chart */}
            <Line yAxisId="right" type="monotone" dataKey="headcount" name="Est. Headcount" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
        <span className="truncate pr-1">API: GET /api/analytics/peak-hours</span>
        <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">CrowdReading, Event</span>
      </div>
    </AnalyticsCard>
  );
}
