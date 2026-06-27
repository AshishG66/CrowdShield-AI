"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { AnalyticsCard } from "@/components/cards/AnalyticsCard";

interface IncidentFrequencyData {
  day: string;
  critical: number;
  warning: number;
  info: number;
}

const defaultIncidentTimelineData: IncidentFrequencyData[] = [
  { day: "Mon", critical: 0, warning: 2, info: 5 },
  { day: "Tue", critical: 1, warning: 1, info: 3 },
  { day: "Wed", critical: 0, warning: 3, info: 4 },
  { day: "Thu", critical: 2, warning: 2, info: 6 },
  { day: "Fri", critical: 1, warning: 5, info: 8 },
  { day: "Sat", critical: 4, warning: 8, info: 12 }, // Event day peak
  { day: "Sun", critical: 3, warning: 6, info: 9 },
];

interface IncidentTimelineChartProps {
  data?: IncidentFrequencyData[];
  className?: string;
}

export function IncidentTimelineChart({ data = defaultIncidentTimelineData, className }: IncidentTimelineChartProps) {
  const [filter, setFilter] = React.useState("Weekly View");

  const chartData = React.useMemo(() => {
    if (filter === "Bi-Weekly") {
      // Append some mock past data or double the values to look like consolidated view
      return [
        { day: "Week 1", critical: 6, warning: 15, info: 30 },
        { day: "Week 2", critical: 11, warning: 27, info: 47 },
      ];
    }
    return data;
  }, [filter, data]);

  return (
    <AnalyticsCard
      title="Incident Frequencies & Severity Log"
      description="Visualizes security dispatch events logged by safety officers and AI detection engines."
      filterOptions={["Weekly View", "Bi-Weekly"]}
      activeFilter={filter}
      onFilterChange={setFilter}
      className={className}
    >
      <div className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/10" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
            
            <Line
              type="monotone"
              dataKey="critical"
              name="Critical Alerts"
              stroke="#ef4444"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="warning"
              name="Warnings"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="info"
              name="Minor / Info Logs"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
        <span className="truncate pr-1">API: GET /api/analytics/incidents-timeline</span>
        <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">Incident</span>
      </div>
    </AnalyticsCard>
  );
}
