"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Sliders, Bell, Save } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [densityLimit, setDensityLimit] = useState("80");
  const [smsToggled, setSmsToggled] = useState(true);
  const [voiceToggled, setVoiceToggled] = useState(false);
  const [aiAnalysisToggled, setAiAnalysisToggled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "App configurations updated successfully.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Configuration"
        description="Configure safety limits, visual telemetry feeds, and alert thresholds."
      />

      <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-2 max-w-4xl">
        {/* Safety Limits Card */}
        <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Sliders className="h-5 w-5 text-indigo-500" />
            <h3 className="text-base font-bold text-foreground">Safety Alert Thresholds</h3>
          </div>
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground" htmlFor="density-limit">
                Critical Density Alert Threshold (% of Capacity)
              </label>
              <Input
                id="density-limit"
                type="number"
                min="10"
                max="100"
                value={densityLimit}
                onChange={(e) => setDensityLimit(e.target.value)}
                className="w-full border h-10 animate-none"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Alarms will trigger automatically when crowd visual estimates exceed this density parameter.
            </p>
          </div>
        </div>

        {/* Dispatch Notification Channels */}
        <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Bell className="h-5 w-5 text-indigo-500" />
            <h3 className="text-base font-bold text-foreground">Notification Channels</h3>
          </div>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-2 border rounded-lg bg-muted/20">
              <div>
                <p className="font-semibold">SMS Responder Alerts</p>
                <p className="text-[10px] text-muted-foreground">Dispatch via SMS relays</p>
              </div>
              <input
                type="checkbox"
                checked={smsToggled}
                onChange={(e) => setSmsToggled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-305 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg bg-muted/20">
              <div>
                <p className="font-semibold">Automated Radio Dispatch</p>
                <p className="text-[10px] text-muted-foreground">Broadcast via digital speech text-to-radio</p>
              </div>
              <input
                type="checkbox"
                checked={voiceToggled}
                onChange={(e) => setVoiceToggled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-305 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg bg-muted/20">
              <div>
                <p className="font-semibold">AI Continuous Inference</p>
                <p className="text-[10px] text-muted-foreground">Inference engine active on all camera streams</p>
              </div>
              <input
                type="checkbox"
                checked={aiAnalysisToggled}
                onChange={(e) => setAiAnalysisToggled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-305 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" className="h-10 px-6 gap-1.5 cursor-pointer">
            <Save className="h-4 w-4" /> Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
