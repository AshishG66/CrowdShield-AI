"use client";

import * as React from "react";
import { useEventLifecycle } from "@/context/EventLifecycleContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  Activity,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
  Brain,
  AlertOctagon,
  CheckCircle,
} from "lucide-react";

export function SimulationController() {
  const {
    stage,
    telemetry,
    triggerNominal,
    triggerSpike,
    runAiPrediction,
    resolveIncident,
    incidents,
  } = useEventLifecycle();

  const activeIncident = incidents.find((i) => i.id === "INC-241");

  const steps = [
    { key: "nominal", label: "Nominal", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { key: "telemetry_spike", label: "IPL Telemetry Spike", icon: Zap, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { key: "ai_analysis", label: "AI Prediction Core", icon: Brain, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    { key: "incident_triggered", label: "Crisis Active", icon: AlertOctagon, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  ];

  return (
    <div className="w-full bg-card/60 backdrop-blur-md border border-muted-foreground/15 rounded-xl p-4 shadow-lg mb-6 transition-all duration-300 relative overflow-hidden">
      {/* Glow highlight based on stage */}
      <div
        className={cn(
          "absolute -right-20 -top-20 h-40 w-40 rounded-full blur-[80px] opacity-10 transition-all duration-500",
          stage === "incident_triggered"
            ? "bg-rose-500"
            : stage === "telemetry_spike"
            ? "bg-amber-500"
            : stage === "ai_analysis"
            ? "bg-indigo-500"
            : "bg-emerald-500"
        )}
      />

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 relative z-10">
        {/* Left Section: Info and Steps */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-primary animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              IPL Emergency Sandbox Controller
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 md:gap-3">
            {steps.map((step, idx) => {
              const isCurrent = stage === step.key;
              const isPassed =
                (stage === "telemetry_spike" && idx < 1) ||
                (stage === "ai_analysis" && idx < 2) ||
                (stage === "incident_triggered" && idx < 3) ||
                (stage === "resolved" && idx <= 3);

              return (
                <React.Fragment key={step.key}>
                  {idx > 0 && (
                    <div
                      className={cn(
                        "h-0.5 w-4 md:w-6 transition-all duration-300 shrink-0",
                        isPassed ? "bg-primary" : "bg-muted-foreground/20"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold select-none transition-all duration-300 shrink-0",
                      isCurrent
                        ? step.color + " ring-1 ring-primary/35 shadow-xs scale-105"
                        : isPassed
                        ? "text-primary border-primary/20 bg-primary/5"
                        : "text-muted-foreground/60 border-muted-foreground/10 bg-muted/30"
                    )}
                  >
                    <step.icon className={cn("h-3.5 w-3.5", isCurrent && "animate-pulse")} />
                    <span>{step.label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Section: Interactive Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {stage === "nominal" && (
            <Button
              onClick={triggerSpike}
              size="sm"
              className="h-9 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              <Zap className="h-3.5 w-3.5 animate-pulse" /> Trigger IPL Match Telemetry
            </Button>
          )}

          {stage === "telemetry_spike" && (
            <Button
              onClick={runAiPrediction}
              size="sm"
              className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              <Brain className="h-3.5 w-3.5 animate-bounce" /> Run AI Flow Predictor
            </Button>
          )}

          {stage === "ai_analysis" && (
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 animate-pulse">
              <Brain className="h-4.5 w-4.5 animate-spin" />
              <span>AI Core Normalizing Telemetry...</span>
            </div>
          )}

          {stage === "incident_triggered" && activeIncident && activeIncident.status !== "resolved" && (
            <Button
              onClick={() => resolveIncident("INC-241")}
              size="sm"
              className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer border border-emerald-500/25"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Resolve Incident #INC-241
            </Button>
          )}

          {stage !== "nominal" && (
            <Button
              onClick={triggerNominal}
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset System
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
