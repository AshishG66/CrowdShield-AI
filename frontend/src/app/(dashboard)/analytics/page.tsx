"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/widgets/dashboard/KpiCard";
import { Users, BarChart3, TrendingUp } from "lucide-react";
import { OccupancyTrendChart } from "@/components/widgets/analytics/OccupancyTrendChart";
import { RiskDistributionChart } from "@/components/widgets/analytics/RiskDistributionChart";
import { PeakHoursChart } from "@/components/widgets/analytics/PeakHoursChart";
import { IncidentTimelineChart } from "@/components/widgets/analytics/IncidentTimelineChart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Crowd Analytics"
        description="Detailed telemetry charts, occupancy growth rates, and flow velocity metrics."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Peak Density Index"
          value="4.6 p/m²"
          icon={Users}
          description="Recorded at East Gate (14:00)"
          variant="warning"
        />
        <KpiCard
          title="Average Stay Duration"
          value="182 Mins"
          icon={BarChart3}
          description="Typical visitor session"
        />
        <KpiCard
          title="Crowd Growth Vector"
          value="+12.4%"
          icon={TrendingUp}
          trend={{ value: "Steady increase", isPositive: true }}
          description="Compared to past event match"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <OccupancyTrendChart />
        <RiskDistributionChart />
        <PeakHoursChart />
        <IncidentTimelineChart />
      </div>
    </div>
  );
}

