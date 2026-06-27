"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/widgets/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import {
  ShieldAlert,
  CheckCircle2,
  Plus,
  User,
  Clock,
  MapPin,
  MessageSquare,
  AlertTriangle,
  History,
  FileImage,
  Send,
  Lock,
  ChevronRight,
  ClipboardList,
  Sliders
} from "lucide-react";
import { useEventLifecycle } from "@/context/EventLifecycleContext";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

interface HistoryItem {
  timestamp: string;
  author: string;
  action: string;
}

interface Evidence {
  type: "image" | "sensor";
  label: string;
  value?: string;
  url?: string;
}

interface IncidentItem {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  status: "active" | "investigating" | "resolved";
  assignedOfficer: string;
  assignedAvatar: string;
  priority: "low" | "medium" | "high" | "critical";
  evidence: Evidence[];
  comments: Comment[];
  history: HistoryItem[];
  resolution?: string;
}

export default function IncidentsPage() {
  const {
    stage,
    incidents: globalIncidents,
    updateIncidentStatus,
    addCommentToIncident,
    updateIncidentOfficer,
    resolveIncident,
  } = useEventLifecycle();

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("INC-109");
  const [commentInput, setCommentInput] = useState("");
  const [resolutionInput, setResolutionInput] = useState("");
  const [showResolutionForm, setShowResolutionForm] = useState(false);

  // Map global incidents to rich items
  const incidents = React.useMemo(() => {
    return globalIncidents.map(inc => {
      const comments: Comment[] = inc.comments.map((text, idx) => ({
        id: `c-${idx}-${inc.id}`,
        author: idx === 0 && inc.id === "INC-241" ? "AI Core System" : "Command Admin",
        avatar: idx === 0 && inc.id === "INC-241" ? "AI" : "AD",
        text,
        timestamp: inc.timestamp,
      }));

      const evidence: Evidence[] = inc.id === "INC-241"
        ? [
            { type: "image", label: "CAM-B4_BOTTLENECK_INGRESS.png", url: "#" },
            { type: "sensor", label: "Inflow Volume Rate", value: "520 people/min" },
            { type: "sensor", label: "Exit Volume Rate", value: "80 people/min" }
          ]
        : inc.id === "INC-109"
        ? [
            { type: "image", label: "CAM-A2_TICKETBOX_OBJECT.png", url: "#" },
            { type: "sensor", label: "Unattended Duration", value: "14 minutes" }
          ]
        : [];

      const history: HistoryItem[] = inc.id === "INC-241"
        ? [
            { timestamp: inc.timestamp, author: "AI Core System", action: "Incident registry auto-created." },
            { timestamp: inc.timestamp, author: "System Dispatcher", action: "Bulk SMS warning alerts dispatched." },
            { timestamp: inc.timestamp, author: "System Dispatcher", action: "Officer Davis voice radio bridge connected." }
          ]
        : [
            { timestamp: inc.timestamp, author: "AI Core System", action: "Incident registry auto-created." }
          ];

      return {
        ...inc,
        assignedAvatar: inc.assignedOfficer ? inc.assignedOfficer.split(" ").map(w => w[0]).join("") : "UN",
        comments,
        evidence,
        history,
      };
    });
  }, [globalIncidents]);

  // Fallback if current selected ID is not in active incidents
  const selectedIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    addCommentToIncident(selectedIncident.id, commentInput);
    setCommentInput("");
    toast({
      title: "Comment Logged",
      description: "Added comments to incident activity stream.",
      variant: "success",
    });
  };

  const handleStatusChange = (newStatus: "active" | "investigating" | "resolved") => {
    if (newStatus === "resolved") {
      setShowResolutionForm(true);
      return;
    }

    updateIncidentStatus(selectedIncident.id, newStatus);
    toast({
      title: "Workflow Shifted",
      description: `Incident marked as ${newStatus.toUpperCase()}.`,
      variant: "default",
    });
  };

  const submitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionInput.trim()) return;

    resolveIncident(selectedIncident.id, resolutionInput);
    setResolutionInput("");
    setShowResolutionForm(false);
  };

  const handleOfficerAssign = (officer: string) => {
    updateIncidentOfficer(selectedIncident.id, officer);
    toast({
      title: "Officer Assigned",
      description: `Assigned incident ${selectedIncident.id} to ${officer}.`,
      variant: "success",
    });
  };

  const activeCount = incidents.filter(inc => inc.status !== "resolved").length;
  const criticalCount = incidents.filter(inc => inc.severity === "critical" && inc.status !== "resolved").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Triage Logs"
        description="Jira-style command incident manager to track responder timeline audits, evidence, and comments."
        actions={
          <Button size="sm" className="h-9 gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95">
            <Plus className="h-3.5 w-3.5" /> Log Manual Incident
          </Button>
        }
      />

      {/* KPI Counters Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Active Incident Triage"
          value={`${activeCount} Tickets`}
          icon={ShieldAlert}
          description="In progress dispatches"
          variant={activeCount > 0 ? "warning" : "default"}
        />
        <KpiCard
          title="High Severity Alerts"
          value={`${criticalCount} Alarms`}
          icon={AlertTriangle}
          description="Requires immediate action"
          variant={criticalCount > 0 ? "critical" : "default"}
        />
        <KpiCard
          title="Resolved Incidents Today"
          value={`${incidents.filter(i => i.status === "resolved").length} Resolved`}
          icon={CheckCircle2}
          description="Target dispatch: <3 mins"
          variant="safe"
        />
      </div>

      {/* JIRA SPLIT LAYOUT CONTAINER */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: TICKETS Backlog LIST (5/12 width) */}
        <div className="lg:col-span-4 rounded-xl border border-muted-foreground/10 bg-card p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-muted-foreground/10 pb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-primary" /> Incident Backlog
            </h3>
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
              {incidents.length} Tickets
            </Badge>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {incidents.map((inc) => {
              const isSelected = inc.id === selectedIncident.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    setShowResolutionForm(false);
                  }}
                  className={cn(
                    "p-3 rounded-lg border text-left cursor-pointer transition-all hover:bg-muted/30 select-none flex items-center justify-between gap-3",
                    isSelected
                      ? "border-primary bg-primary/5 dark:bg-primary/5"
                      : "border-muted-foreground/10"
                  )}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-muted-foreground">{inc.id}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full",
                          inc.status === "resolved"
                            ? "border-emerald-500/20 text-emerald-600 bg-emerald-500/5 dark:text-emerald-400"
                            : inc.status === "investigating"
                              ? "border-amber-500/20 text-amber-600 bg-amber-500/5 dark:text-amber-400"
                              : "border-rose-500/20 text-rose-600 bg-rose-500/5 dark:text-rose-400"
                        )}
                      >
                        {inc.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full text-white border-0",
                          inc.priority === "critical" ? "bg-rose-600" : inc.priority === "high" ? "bg-orange-500" : "bg-blue-500"
                        )}
                      >
                        {inc.priority}
                      </Badge>
                    </div>

                    <h4 className="text-xs font-bold text-foreground truncate pr-1">{inc.title}</h4>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" /> {inc.location}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: JIRA TICKET DETAILS WORKSPACE (8/12 width) */}
        <div className="lg:col-span-8 rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm space-y-6">
          {/* Ticket Header summary */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-muted-foreground/10 pb-4">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-muted-foreground">{selectedIncident.id}</span>
              <h2 className="text-lg font-bold tracking-tight text-foreground">{selectedIncident.title}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1 pt-0.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {selectedIncident.location} &bull; <Clock className="h-3.5 w-3.5 shrink-0" /> Reported: {selectedIncident.timestamp}
              </p>
            </div>
            
            {/* Status Workflow select button */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Workflow Status:</span>
              <select
                value={selectedIncident.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="text-xs font-bold rounded-md border border-input p-2 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="active">Active Dispatch</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Mark Resolved</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-12">
            
            {/* MAIN WORKSPACE SECTION (8/12 of right) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground">Incident Description</h4>
                <p className="text-xs text-muted-foreground leading-relaxed p-3.5 border rounded-lg bg-muted/10">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Evidence Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground">Evidence & Telemetry Attachments</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedIncident.evidence.map((ev, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg bg-card text-xs">
                      {ev.type === "image" ? (
                        <FileImage className="h-8 w-8 text-primary shrink-0" />
                      ) : (
                        <Sliders className="h-8 w-8 text-emerald-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-foreground">{ev.label}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {ev.type === "image" ? "Camera Snapshot Visual" : `Sensor: ${ev.value}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Action Log */}
              {selectedIncident.resolution && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> Resolution Summary Report
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedIncident.resolution}
                  </p>
                </div>
              )}

              {/* Dynamic Resolution Popup Form */}
              {showResolutionForm && (
                <form onSubmit={submitResolution} className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3 animate-fade-in">
                  <h4 className="text-xs font-bold text-foreground">Document Incident Resolution Details</h4>
                  <p className="text-[10px] text-muted-foreground">Explain what steps were taken to clear and secure the concourse area.</p>
                  <textarea
                    placeholder="e.g. Cleared overcrowding bottlenecks, opened backup ticketing turnstiles, and checked sensors."
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    className="w-full min-h-[70px] text-xs rounded-md border border-input p-3 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowResolutionForm(false)}
                      className="h-8 text-xs cursor-pointer text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="h-8 text-xs cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Archive Resolution & Close
                    </Button>
                  </div>
                </form>
              )}

              {/* Activity Comments Log */}
              <div className="space-y-4 pt-2 border-t border-muted-foreground/10">
                <h4 className="text-xs font-bold text-foreground">Officer Activity & Comments Log</h4>
                
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {selectedIncident.comments.map((comm) => (
                    <div key={comm.id} className="p-3 border rounded-lg bg-muted/20 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-extrabold uppercase shrink-0">
                            {comm.avatar}
                          </div>
                          <span>{comm.author}</span>
                        </div>
                        <span className="text-muted-foreground font-semibold">{comm.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-7 leading-relaxed">
                        {comm.text}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2 items-center">
                  <input
                    placeholder="Add comment to audit feed..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 h-9 rounded-md border border-input px-3 bg-background text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <Button type="submit" size="sm" className="h-9 gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95">
                    <Send className="h-3.5 w-3.5" /> <span>Comment</span>
                  </Button>
                </form>
              </div>
            </div>

            {/* SIDEBAR WORKSPACE SECTION (4/12 of right) */}
            <div className="md:col-span-4 space-y-5 border-l border-muted-foreground/10 pl-0 md:pl-5 pt-4 md:pt-0">
              
              {/* Officer Assignee */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-primary" /> Assigned Officer
                </span>
                <select
                  value={selectedIncident.assignedOfficer}
                  onChange={(e) => handleOfficerAssign(e.target.value)}
                  className="w-full text-xs font-bold rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="Officer Marcus Vance">Officer Marcus Vance</option>
                  <option value="Officer Sarah Jenkins">Officer Sarah Jenkins</option>
                  <option value="Engineer James Cole">Engineer James Cole</option>
                  <option value="Unassigned Standby">Unassigned Standby</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> Triage Priority
                </span>
                <div className="flex items-center h-10 px-3 bg-muted border border-muted-foreground/10 rounded-md text-xs font-bold text-foreground gap-1.5 select-none uppercase">
                  {selectedIncident.priority}
                </div>
              </div>

              {/* Audit Timeline logs */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <History className="h-3.5 w-3.5 text-primary" /> Audit Log Trail
                </span>
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {selectedIncident.history.map((hist, idx) => (
                    <div key={idx} className="text-[10px] border-l border-muted-foreground/10 pl-2.5 pb-2 relative space-y-0.5">
                      <div className="absolute h-1.5 w-1.5 rounded-full bg-primary -left-[4px] top-1" />
                      <div className="flex items-center justify-between text-muted-foreground font-semibold">
                        <span>{hist.author}</span>
                        <span>{hist.timestamp}</span>
                      </div>
                      <p className="text-foreground leading-normal">{hist.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
