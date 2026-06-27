import * as React from "react";
import { IncidentCard } from "@/components/cards/IncidentCard";
import { Badge } from "@/components/ui/badge";
import { FileCheck2, ShieldAlert } from "lucide-react";
import { IncidentItem } from "@/services/mockApi";

interface IncidentTimelineProps {
  incidents: IncidentItem[];
  onRespond: (id: string) => void;
  onResolve: (id: string) => void;
}

export function IncidentTimeline({
  incidents,
  onRespond,
  onResolve,
}: IncidentTimelineProps) {
  const activeIncidents = incidents.filter(i => i.status !== "resolved");
  const activeCount = activeIncidents.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-muted-foreground/10 pb-2">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" /> Critical Command Alerts
        </h3>
        {activeCount > 0 && (
          <Badge variant="destructive" className="animate-pulse text-[10px] font-bold uppercase rounded-full">
            {activeCount} Action Required
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {activeCount === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl bg-emerald-500/5 border-emerald-500/20">
            <FileCheck2 className="h-10 w-10 text-emerald-500 mb-2 animate-bounce" />
            <h4 className="text-sm font-bold text-foreground">All Incidents Cleared</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              No active safety hazards are flagged in the command feed.
            </p>
          </div>
        ) : (
          activeIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              id={incident.id}
              title={incident.title}
              description={incident.description}
              location={incident.location}
              timestamp={incident.timestamp}
              severity={incident.severity}
              status={incident.status}
              onRespond={onRespond}
              onResolve={onResolve}
            />
          ))
        )}
      </div>
    </div>
  );
}
