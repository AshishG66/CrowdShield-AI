"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/widgets/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  Radio,
  Users,
  AlertTriangle,
  Terminal,
} from "lucide-react";

import { EmergencyActionPanel } from "@/components/widgets/emergency/EmergencyActionPanel";
import { AlertStatusCard } from "@/components/widgets/emergency/AlertStatusCard";
import { SmsHistoryTable } from "@/components/widgets/emergency/SmsHistoryTable";
import { VoiceCallHistoryTable } from "@/components/widgets/emergency/VoiceCallHistoryTable";

import { useEventLifecycle } from "@/context/EventLifecycleContext";

interface DispatchLog {
  timestamp: string;
  type: "sms" | "voice" | "broadcast" | "police" | "hospital" | "incident" | "system";
  message: string;
}

export default function EmergencyPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[450px] items-center justify-center border border-dashed rounded-xl p-8 bg-muted/10">
        <div className="text-center space-y-3">
          <Radio className="h-10 w-10 text-primary animate-pulse mx-auto" />
          <p className="text-xs text-muted-foreground font-semibold">Synchronizing command control room channels...</p>
        </div>
      </div>
    }>
      <EmergencyControlRoomContent />
    </Suspense>
  );
}

function EmergencyControlRoomContent() {
  const searchParams = useSearchParams();
  const incidentParam = searchParams.get("incident");
  const confidenceParam = searchParams.get("confidence");

  // Active terminal screen states
  const [activeTab, setActiveTab] = useState<"sms" | "voice" | "broadcast" | "police" | "hospital" | "incident">("sms");

  const {
    stage,
    telemetry,
    dispatchLogs,
    smsLogs,
    voiceCallLogs,
    addManualDispatchLog,
  } = useEventLifecycle();

  // SMS State
  const [smsMessage, setSmsMessage] = useState("");
  const [smsSector, setSmsSector] = useState("Sector B (Gate 4)");

  // Terminal Ref for auto scrolling
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dispatchLogs]);

  // Read URL query params to auto-configure alerts
  useEffect(() => {
    if (incidentParam === "SectorB_Bottleneck") {
      toast({
        title: "AI Alerts Loaded",
        description: "Emergency hub configured with Sector B Overcrowding forecast metrics.",
        variant: "default",
      });
      addManualDispatchLog("system", `AI Prediction trigger received. Hazard bottleneck Sector B (Confidence ${confidenceParam || "94.8"}%).`);
    }
  }, [incidentParam, confidenceParam]);

  const applyAIRecommendation = () => {
    setSmsSector("Sector B (Gate 4)");
    setSmsMessage("CRITICAL ADVISORY: Gate 4 entry bottleneck detected. Please divert to Gates 1 and 2 to access the concourse area.");
    setActiveTab("sms");
    toast({
      title: "Recommended Action Loaded",
      description: "SMS broadcast pre-filled with optimal diversion warning message.",
      variant: "success",
    });
  };

  // Derive alert statistics
  const activeDispatchesCount = dispatchLogs.filter(l => ["sms", "police", "hospital"].includes(l.type)).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Control Center"
        description="Command room console to broadcast mass alerts, link responder voice radios, and summon police/medical squads."
      />

      {/* AI Recommendation notification banner */}
      {incidentParam === "SectorB_Bottleneck" && (
        <div className="border border-rose-500/20 bg-rose-500/5 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-rose-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">AI Predictive Incident Dispatch Triggered</p>
              <p className="text-[10px] text-muted-foreground">Source: AI Prediction Module &mdash; Potential Bottleneck Gate 4 concourse area.</p>
            </div>
          </div>
          <Button
            onClick={applyAIRecommendation}
            size="sm"
            className="w-full md:w-auto h-8 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer border border-rose-500/20"
          >
            Apply Recommended Dispatch Plan
          </Button>
        </div>
      )}

      {/* Control Room Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <AlertStatusCard activeAlarmsCount={activeDispatchesCount} className="sm:col-span-2" />
        <KpiCard
          title="Active Radio Responders"
          value="18 Ground Units"
          icon={Users}
          description="All 4 zones patrols ready"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: COMMAND BUTTONS & CONTROL INTERFACES */}
        <div className="lg:col-span-7">
          <EmergencyActionPanel
            onDispatchLog={addManualDispatchLog}
            smsSector={smsSector}
            setSmsSector={setSmsSector}
            smsMessage={smsMessage}
            setSmsMessage={setSmsMessage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* RIGHT COLUMN: LIVE DISPATCH TERMINAL SCREEN */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[350px]">
          <div className="flex-1 rounded-xl border border-muted-foreground/10 bg-black text-emerald-400 p-5 font-mono text-xs flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between border-b border-emerald-950 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-bold uppercase tracking-wider text-emerald-500">Live Dispatch Console Log</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] font-bold text-emerald-500">UPLINK STABLE</span>
                </div>
              </div>

              {/* Ticker stream logs */}
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {dispatchLogs.map((log, index) => (
                  <div key={index} className="flex gap-2 items-start leading-relaxed text-[11px]">
                    <span className="text-emerald-700 shrink-0 font-bold">[{log.timestamp}]</span>
                    
                    {log.type === "sms" && (
                      <span className="text-indigo-400 font-bold shrink-0">[SMS]</span>
                    )}
                    {log.type === "voice" && (
                      <span className="text-emerald-300 font-bold shrink-0">[VOICE]</span>
                    )}
                    {log.type === "broadcast" && (
                      <span className="text-purple-400 font-bold shrink-0">[PA]</span>
                    )}
                    {log.type === "police" && (
                      <span className="text-blue-400 font-bold shrink-0">[POLICE]</span>
                    )}
                    {log.type === "hospital" && (
                      <span className="text-rose-400 font-bold shrink-0">[MED]</span>
                    )}
                    {log.type === "incident" && (
                      <span className="text-amber-400 font-bold shrink-0">[INC]</span>
                    )}
                    {log.type === "system" && (
                      <span className="text-emerald-500 font-bold shrink-0">[SYS]</span>
                    )}

                    <span className="text-emerald-100 flex-1 break-words">{log.message}</span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>

            <div className="border-t border-emerald-950/75 pt-3 mt-5 flex items-center justify-between text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              <span>Relay channel: Command-1</span>
              <span>Buffer: Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* HISTORICAL REGISTRIES */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <SmsHistoryTable logs={smsLogs} />
        <VoiceCallHistoryTable logs={voiceCallLogs} />
      </div>
    </div>
  );
}
