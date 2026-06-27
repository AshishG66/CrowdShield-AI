"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/widgets/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import {
  FileSpreadsheet,
  Download,
  FileDown,
  Plus,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  Trash2,
  Calendar,
  Play,
  FileCheck,
  CheckCircle,
  FileCode
} from "lucide-react";
import { useEventLifecycle } from "@/context/EventLifecycleContext";

interface ReportItem {
  id: string;
  date: string;
  name: string;
  format: "PDF" | "Excel" | "CSV";
  size: string;
}

interface ScheduleItem {
  id: string;
  name: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  format: "PDF" | "Excel" | "CSV";
  time: string;
}

export default function ReportsPage() {
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const { stage, telemetry, incidents } = useEventLifecycle();

  // Custom reports state
  const [reports, setReports] = useState<ReportItem[]>([
    { id: "REP-431", date: "2026-06-25", name: "Daily Density Summary - Olympus Stadium", format: "PDF", size: "2.4 MB" },
    { id: "REP-429", date: "2026-06-24", name: "Incident Log Summary - Centennial Arena", format: "CSV", size: "342 KB" },
    { id: "REP-421", date: "2026-06-23", name: "AI Flow Accuracy Report - June 2026", format: "Excel", size: "1.8 MB" },
    { id: "REP-409", date: "2026-06-20", name: "Weekly Safety Audit Report", format: "PDF", size: "8.1 MB" },
  ]);

  // Scheduled reports state
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: "SCH-01", name: "Daily Crowd Density Summary", frequency: "Daily", format: "PDF", time: "23:59" },
    { id: "SCH-02", name: "Weekly Incident Log Audit", frequency: "Weekly", format: "CSV", time: "Sunday 23:00" },
    { id: "SCH-03", name: "Monthly Safety Metrics Review", frequency: "Monthly", format: "Excel", time: "1st 06:00" }
  ]);

  // Form states
  const [reportType, setReportType] = useState("density");
  const [reportRange, setReportRange] = useState("today");
  const [reportFormat, setReportFormat] = useState<"PDF" | "Excel" | "CSV">("PDF");

  const [scheduleName, setScheduleName] = useState("");
  const [scheduleFreq, setScheduleFreq] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [scheduleFormat, setScheduleFormat] = useState<"PDF" | "Excel" | "CSV">("PDF");

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const handleDownload = (id: string, name: string, format: string) => {
    toast({
      title: "Download Initiated",
      description: `Downloading ${name} (${format}). Size: 1.2 MB.`,
      variant: "success",
    });
  };

  const handleCompileReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompiling(true);

    const typeNames: Record<string, string> = {
      density: "Crowd Density Audit",
      incidents: "Active Incidents Log",
      alarms: "Triage Alert Analytics",
      compliance: "Safety Standards Compliance"
    };

    setTimeout(() => {
      setIsCompiling(false);
      const time = new Date().toISOString().split("T")[0];
      const newReport: ReportItem = {
        id: `REP-${Math.floor(500 + Math.random() * 500)}`,
        date: time,
        name: `${typeNames[reportType]} - Range: ${reportRange.toUpperCase()}`,
        format: reportFormat,
        size: reportFormat === "CSV" ? "128 KB" : reportFormat === "Excel" ? "1.1 MB" : "2.2 MB"
      };

      setReports(prev => [newReport, ...prev]);
      toast({
        title: "Report Compiled",
        description: `Successfully compiled and added ${newReport.id} to registry.`,
        variant: "success",
      });
    }, 1200);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleName.trim()) {
      toast({
        title: "Validation Error",
        description: "Schedule name is required.",
        variant: "destructive"
      });
      return;
    }

    const timeString = scheduleFreq === "Daily"
      ? "Every day at 23:59"
      : scheduleFreq === "Weekly"
        ? "Sundays at 23:00"
        : "1st of month at 06:00";

    const newSchedule: ScheduleItem = {
      id: `SCH-${Math.floor(10 + Math.random() * 90)}`,
      name: scheduleName,
      frequency: scheduleFreq,
      format: scheduleFormat,
      time: timeString
    };

    setSchedules(prev => [...prev, newSchedule]);
    setScheduleName("");
    toast({
      title: "Schedule Created",
      description: `New automated report scheduled: "${newSchedule.name}".`,
      variant: "success",
    });
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Schedule Deleted",
      description: `Automated report schedule ${id} deleted.`,
      variant: "default",
    });
  };

  const handleSynthesizeAISummary = () => {
    setIsSynthesizing(true);
    setAiSummary(null);

    setTimeout(() => {
      setIsSynthesizing(false);
      
      let summaryText = "";
      if (stage === "nominal") {
        summaryText = "AI SUMMARY: All systems secure. Operations today scanned and analyzed safety metrics across active venues. General safety levels remained high (98% safety index). Ingress velocity remains nominal at 120/min. Camera stream latencies remained steady at 38ms. System core health reported 100% telemetry online. RECOMMENDED: Maintain standard surveillance parameters.";
      } else if (stage === "telemetry_spike" || stage === "ai_analysis") {
        summaryText = `AI WARNING: High crowd ingress telemetry spike detected (headcount = ${telemetry.crowdCount.toLocaleString()} / 45,000 capacity). Ingress velocity is currently high at 520 people/min. Heat index is elevated (36°C), resulting in scanning lag. Anomaly algorithm flags bottleneck warnings near Sector B Gate 4. RECOMMENDED: Prepare primary triage dispatches and brace Gate 4 exits.`;
      } else if (stage === "incident_triggered") {
        summaryText = `AI SAFETY ALERT: Critical congestion crisis active at Sector B East Gate (Gate 4). Crowd occupancy has reached ${telemetry.crowdCount.toLocaleString()} / 45,000 capacity limits (92% occupancy). Inflow rate stands at 520 people/min against exit rates of 80/min, resulting in a density bottleneck of 4.6 people/m². Incident #${incidents[0]?.id || "INC-241"} has been created. Automated SMS warnings and radio voice bridges are active. RECOMMENDED: Force divert incoming crowd streams from Gate 4 to Gate 1 and Gate 2 immediately.`;
      } else {
        summaryText = "AI SUMMARY: Overcrowding crisis at Sector B Gate 4 resolved. Telemetry sensors have cleared and queue inflow rates returned to standard safety limits. General safety levels returned to secure status. RECOMMENDED: Maintain standard surveillance scans.";
      }

      setAiSummary(summaryText);
      toast({
        title: "AI Synthesis Complete",
        description: "Today's telemetry logs compiled into natural language summary.",
        variant: "success",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Telemetry Reports"
        description="Compile safety audits, configure automated report crons, and synthesize AI natural language summaries."
      />

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total Reports Database"
          value={`${reports.length} Files`}
          icon={FileText}
          description="Stored in cloud archives"
          variant="safe"
          apiEndpoint="GET /api/reports"
          collection="Report"
        />
        <KpiCard
          title="Automated Crons"
          value={`${schedules.length} Active`}
          icon={Clock}
          description="Scheduled reports"
          apiEndpoint="GET /api/reports/crons"
          collection="Report"
        />
        <KpiCard
          title="Last Audit Status"
          value="Locked & Clear"
          icon={FileCheck}
          description="Block hash verified today"
          variant="safe"
          apiEndpoint="GET /api/reports/audit"
          collection="Report"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: REPORTS GENERATOR & HISTORY & AI SUMMARY (7/12 width) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* REPORT COMPILER FORM */}
          <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileCheck className="h-4.5 w-4.5 text-primary" /> Reports Compiler Console
              </h3>
              <p className="text-xs text-muted-foreground">Select telemetry data source parameters and compile to PDF, Excel, or CSV sheets.</p>
            </div>

            <form onSubmit={handleCompileReport} className="space-y-4 pt-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Select Audit Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="density">Crowd Density Auditing</option>
                    <option value="incidents">Active Incidents List</option>
                    <option value="alarms">Triage Alerts Timeline</option>
                    <option value="compliance">Safety Compliance Rating</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Date Scope</label>
                  <select
                    value={reportRange}
                    onChange={(e) => setReportRange(e.target.value)}
                    className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="today">Today (Live feeds)</option>
                    <option value="yesterday">Yesterday (24h scope)</option>
                    <option value="last-7-days">Last 7 Days (Weekly scope)</option>
                    <option value="month-to-date">Month to Date (June 2026)</option>
                  </select>
                </div>
              </div>

              {/* PDF, EXCEL, CSV FORMAT SELECTORS */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Export File Format</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setReportFormat("PDF")}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all flex items-center justify-center gap-2 cursor-pointer",
                      reportFormat === "PDF"
                        ? "border-rose-500 bg-rose-500/5 text-rose-500 font-bold"
                        : "border-muted-foreground/10 text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    <FileText className="h-4.5 w-4.5" /> PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportFormat("Excel")}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all flex items-center justify-center gap-2 cursor-pointer",
                      reportFormat === "Excel"
                        ? "border-emerald-500 bg-emerald-500/5 text-emerald-500 font-bold"
                        : "border-muted-foreground/10 text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    <FileSpreadsheet className="h-4.5 w-4.5" /> Excel
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportFormat("CSV")}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all flex items-center justify-center gap-2 cursor-pointer",
                      reportFormat === "CSV"
                        ? "border-indigo-500 bg-indigo-500/5 text-indigo-500 font-bold"
                        : "border-muted-foreground/10 text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    <FileCode className="h-4.5 w-4.5" /> CSV
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isCompiling}
                className="w-full h-10 gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 font-bold text-xs"
              >
                {isCompiling ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Compiling Telemetry Buffers...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Compile & Download Telemetry Report
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* AI SUMMARY GENERATOR */}
          <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-purple-500" /> AI Safety Insight Summarizer
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Synthesize raw logs, weather anomalies, and responder dispatches into a text summary.</p>
              </div>
              <Button
                onClick={handleSynthesizeAISummary}
                disabled={isSynthesizing}
                size="sm"
                className="h-8 gap-1 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
              >
                {isSynthesizing ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>Synthesize</span>
              </Button>
            </div>

            {isSynthesizing && (
              <div className="p-8 border border-dashed rounded-lg text-center animate-pulse bg-muted/10">
                <RefreshCw className="h-8 w-8 text-purple-500 animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-semibold">AI engine scanning database logs for safety indicators...</p>
              </div>
            )}

            {aiSummary && (
              <div className="p-4 border border-purple-500/20 bg-purple-500/5 rounded-lg space-y-3.5 animate-fade-in">
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {aiSummary}
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(aiSummary);
                      toast({ title: "Copied", description: "AI Summary copied to clipboard.", variant: "success" });
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] border-purple-500/35 hover:bg-purple-500/5 text-purple-600 dark:text-purple-400 cursor-pointer"
                    onClick={() => handleDownload("AI-SUM", "AI Insights Summary", "PDF")}
                  >
                    Export text PDF
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* COMPILED REPORTS DATABASE LIST */}
          <div className="rounded-xl border border-muted-foreground/10 bg-card overflow-hidden shadow-sm">
            <div className="p-4 border-b border-muted-foreground/10 bg-muted/20">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Reports Database Registry</h3>
            </div>
            <div className="divide-y divide-muted-foreground/5 text-xs">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <div className={cn(
                      "p-2 rounded-lg shrink-0",
                      rep.format === "PDF"
                        ? "text-rose-500 bg-rose-500/10"
                        : rep.format === "Excel"
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-indigo-500 bg-indigo-500/10"
                    )}>
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{rep.name}</p>
                      <p className="text-[10px] text-muted-foreground">Generated: {rep.date} &bull; Size: {rep.size} &bull; ID: {rep.id}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 shrink-0 cursor-pointer text-[10px] font-semibold"
                    onClick={() => handleDownload(rep.id, rep.name, rep.format)}
                  >
                    <Download className="h-3 w-3" /> Get {rep.format}
                  </Button>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-muted-foreground/10 bg-muted/5 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
              <span>API: GET /api/reports</span>
              <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">Report</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SCHEDULED REPORTS MANAGEMENT (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SCHEDULE LIST */}
          <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-muted-foreground/10 pb-3">
              <Calendar className="h-4 w-4 text-primary" /> Active Schedules Cron
            </h3>

            <div className="space-y-3">
              {schedules.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No automated reports scheduled.</p>
              ) : (
                schedules.map((sch) => (
                  <div key={sch.id} className="flex justify-between items-center p-3.5 border rounded-lg bg-muted/20 text-xs">
                    <div className="space-y-1 min-w-0 pr-2">
                      <p className="font-semibold text-foreground truncate">{sch.name}</p>
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-semibold text-muted-foreground">
                        <Badge variant="outline" className="text-[8px] tracking-wider uppercase px-1 rounded-sm border-muted-foreground/20">
                          {sch.frequency}
                        </Badge>
                        <Badge variant="outline" className={cn(
                          "text-[8px] tracking-wider uppercase px-1 rounded-sm border-0",
                          sch.format === "PDF" ? "bg-rose-500/10 text-rose-500" : sch.format === "Excel" ? "bg-emerald-500/10 text-emerald-500" : "bg-indigo-500/10 text-indigo-500"
                        )}>
                          {sch.format}
                        </Badge>
                        <span>&bull; {sch.time}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteSchedule(sch.id)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SCHEDULE CREATOR FORM */}
          <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-primary" /> Create Report Schedule
            </h3>

            <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Schedule Report Name</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Security Patrol Audit"
                  value={scheduleName}
                  onChange={(e) => setScheduleName(e.target.value)}
                  className="w-full h-9 rounded-md border border-input px-3 bg-background text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Recurrence</label>
                  <select
                    value={scheduleFreq}
                    onChange={(e) => setScheduleFreq(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input px-2 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="Daily">Daily Summary</option>
                    <option value="Weekly">Weekly Digest</option>
                    <option value="Monthly">Monthly Analytics</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Output Format</label>
                  <select
                    value={scheduleFormat}
                    onChange={(e) => setScheduleFormat(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input px-2 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="PDF">PDF document</option>
                    <option value="Excel">Excel workbook</option>
                    <option value="CSV">CSV tabular sheet</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-9 gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 font-bold text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Configure Schedule Cron
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
