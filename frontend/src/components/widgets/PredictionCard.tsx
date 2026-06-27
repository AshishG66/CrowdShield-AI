import * as React from "react";
import { AnalyticsCard } from "@/components/cards/AnalyticsCard";
import { PredictionData } from "@/services/mockApi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface PredictionCardProps {
  data: PredictionData[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function PredictionCard({
  data,
  activeFilter,
  onFilterChange,
}: PredictionCardProps) {
  return (
    <AnalyticsCard
      title="Crowd Growth & Predictions"
      description="Comparing live visual camera counting with AI flow predictions."
      filterOptions={["Live feed", "Hourly", "Daily"]}
      activeFilter={activeFilter}
      onFilterChange={onFilterChange}
    >
      <div className="h-[280px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="150">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="150">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            />
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
    </AnalyticsCard>
  );
}
