"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import {
  ShieldAlert,
  PhoneCall,
  Radio,
  Send,
  Users,
  MessageSquare,
  Volume2,
  AlertTriangle,
  Heart,
  PlusCircle,
  Clock,
  Play,
  PhoneOff,
  Mic,
  Activity,
} from "lucide-react";

interface EmergencyActionPanelProps {
  onDispatchLog: (
    type: "sms" | "voice" | "broadcast" | "police" | "hospital" | "incident" | "system",
    message: string
  ) => void;
  // SMS Controlled states for external AI recommendation pre-fills
  smsSector: string;
  setSmsSector: (val: string) => void;
  smsMessage: string;
  setSmsMessage: (val: string) => void;
  activeTab: "sms" | "voice" | "broadcast" | "police" | "hospital" | "incident";
  setActiveTab: (val: "sms" | "voice" | "broadcast" | "police" | "hospital" | "incident") => void;
  className?: string;
}

export function EmergencyActionPanel({
  onDispatchLog,
  smsSector,
  setSmsSector,
  smsMessage,
  setSmsMessage,
  activeTab,
  setActiveTab,
  className,
}: EmergencyActionPanelProps) {
  const apiMap = {
    sms: { endpoint: "POST /api/emergency/sms", collection: "SMSLog" },
    voice: { endpoint: "POST /api/emergency/voice", collection: "CallLog" },
    broadcast: { endpoint: "POST /api/emergency/broadcast", collection: "Notification" },
    police: { endpoint: "POST /api/emergency/dispatch/police", collection: "Incident" },
    hospital: { endpoint: "POST /api/emergency/dispatch/hospital", collection: "Incident" },
    incident: { endpoint: "POST /api/emergency/incident", collection: "Incident" },
  };

  // --- SMS FORM ---
  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim()) {
      toast({ title: "Validation Error", description: "SMS text cannot be blank.", variant: "destructive" });
      return;
    }
    onDispatchLog("sms", `Mass SMS broadcast dispatched to ${smsSector}: "${smsMessage}"`);
    toast({ title: "SMS Dispatched", description: `Dispatched warning alerts to ${smsSector} handsets.`, variant: "success" });
    setSmsMessage("");
  };

  // --- VOICE CALL STATE ---
  const [activeCallContact, setActiveCallContact] = useState<string | null>(null);
  const [callState, setCallState] = useState<"idle" | "dialing" | "connected">("idle");
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const startVoiceCall = (contact: string) => {
    setActiveCallContact(contact);
    setCallState("dialing");
    onDispatchLog("voice", `Initiating encrypted radio voice bridge call to ${contact}...`);
    
    setTimeout(() => {
      setCallState("connected");
      onDispatchLog("voice", `Voice bridge connected with ${contact}. Signal strength 98%.`);
    }, 1500);
  };

  const endVoiceCall = () => {
    if (activeCallContact) {
      onDispatchLog("voice", `Voice link disconnected with ${activeCallContact}. Duration: ${callDuration}s.`);
      toast({ title: "Call Terminated", description: `Encrypted bridge with ${activeCallContact} closed.`, variant: "default" });
    }
    setCallState("idle");
    setActiveCallContact(null);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining.toString().padStart(2, "0")}`;
  };

  // --- AUDIO BROADCAST STATE ---
  const [isBroadcastingAudio, setIsBroadcastingAudio] = useState(false);
  const [broadcastText, setBroadcastText] = useState("");

  const handleStartBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) {
      toast({ title: "Validation Error", description: "Audio broadcast text cannot be empty.", variant: "destructive" });
      return;
    }
    setIsBroadcastingAudio(true);
    onDispatchLog("broadcast", `Public Address (PA) Audio broadcast active: "${broadcastText}"`);
    toast({ title: "Audio Broadcast Active", description: "Broadcasting simulated audio across stadium PA grid.", variant: "success" });
    
    setTimeout(() => {
      setIsBroadcastingAudio(false);
      onDispatchLog("broadcast", "PA Audio broadcast loop finished.");
      setBroadcastText("");
    }, 4000);
  };

  // --- POLICE DISPATCH STATE ---
  const [policeSector, setPoliceSector] = useState("Sector B Gate 4");
  const [policeSquads, setPoliceSquads] = useState("3 Dispatch Units");
  const [policeUrgency, setPoliceUrgency] = useState("critical");

  const handleNotifyPolice = (e: React.FormEvent) => {
    e.preventDefault();
    onDispatchLog("police", `Emergency police dispatch dispatched to ${policeSector} (${policeSquads}, Priority: ${policeUrgency.toUpperCase()}).`);
    toast({
      title: "Police Squads Dispatched",
      description: `Automated Incident Report logged. ETA for squads: 6 minutes.`,
      variant: "success",
    });
  };

  // --- MEDICAL DISPATCH STATE ---
  const [hospitalLocation, setHospitalLocation] = useState("North Triage Area");
  const [hospitalAmbulances, setHospitalAmbulances] = useState(2);
  const [hospitalPriority, setHospitalPriority] = useState("high");

  const handleNotifyHospital = (e: React.FormEvent) => {
    e.preventDefault();
    onDispatchLog("hospital", `Medical dispatch requested at ${hospitalLocation} (${hospitalAmbulances} units, Priority: ${hospitalPriority.toUpperCase()}).`);
    toast({
      title: "Medical Dispatch Active",
      description: `Hospital dispatchers notified. Support vehicles allocated.`,
      variant: "success",
    });
  };

  // --- INCIDENT REGISTRATION STATE ---
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("Sector B Gate 4");
  const [incidentSeverity, setIncidentSeverity] = useState<"warning" | "critical">("critical");
  const [incidentDetails, setIncidentDetails] = useState("");

  const handleGenerateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim()) {
      toast({ title: "Validation Error", description: "Incident title is required.", variant: "destructive" });
      return;
    }
    onDispatchLog("incident", `MANUAL INCIDENT LOGGED: [${incidentSeverity.toUpperCase()}] ${incidentTitle} at ${incidentLocation}. Details: ${incidentDetails}`);
    toast({
      title: "Telemetry Logged",
      description: `Incident logged under registry ID INC-${Math.floor(100 + Math.random() * 900)}.`,
      variant: "success",
    });
    setIncidentTitle("");
    setIncidentDetails("");
  };

  return (
    <div className={cn("rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm space-y-5", className)}>
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Activity className="h-4.5 w-4.5 text-rose-500 animate-pulse" /> Dispatch Terminal
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">Select a triage service button below to configure the command dispatcher.</p>
      </div>

      {/* Grid of service selector buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={() => { setActiveTab("sms"); endVoiceCall(); }}
          className={cn(
            "p-3.5 rounded-lg border text-left transition-all flex flex-col gap-2.5 cursor-pointer",
            activeTab === "sms"
              ? "border-primary/30 bg-primary/5 text-primary shadow-xs ring-1 ring-primary/20"
              : "hover:bg-muted/30 border-muted-foreground/10 text-muted-foreground"
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold">1. Send SMS</p>
            <p className="text-[10px] opacity-75">Mass mobile text alert</p>
          </div>
        </button>

        <button
          onClick={() => { setActiveTab("voice"); }}
          className={cn(
            "p-3.5 rounded-lg border text-left transition-all flex flex-col gap-2.5 cursor-pointer",
            activeTab === "voice"
              ? "border-primary/30 bg-primary/5 text-primary shadow-xs ring-1 ring-primary/20"
              : "hover:bg-muted/30 border-muted-foreground/10 text-muted-foreground"
          )}
        >
          <PhoneCall className="h-5 w-5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold">2. Voice Call</p>
            <p className="text-[10px] opacity-75">Connect responder radios</p>
          </div>
        </button>

        <button
          onClick={() => { setActiveTab("broadcast"); endVoiceCall(); }}
          className={cn(
            "p-3.5 rounded-lg border text-left transition-all flex flex-col gap-2.5 cursor-pointer",
            activeTab === "broadcast"
              ? "border-primary/30 bg-primary/5 text-primary shadow-xs ring-1 ring-primary/20"
              : "hover:bg-muted/30 border-muted-foreground/10 text-muted-foreground"
          )}
        >
          <Volume2 className="h-5 w-5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold">3. Broadcast</p>
            <p className="text-[10px] opacity-75">Speaker PA alerts</p>
          </div>
        </button>

        <button
          onClick={() => { setActiveTab("police"); endVoiceCall(); }}
          className={cn(
            "p-3.5 rounded-lg border text-left transition-all flex flex-col gap-2.5 cursor-pointer",
            activeTab === "police"
              ? "border-primary/30 bg-primary/5 text-primary shadow-xs ring-1 ring-primary/20"
              : "hover:bg-muted/30 border-muted-foreground/10 text-muted-foreground"
          )}
        >
          <ShieldAlert className="h-5 w-5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold">4. Notify Police</p>
            <p className="text-[10px] opacity-75">Dispatch patrol support</p>
          </div>
        </button>

        <button
          onClick={() => { setActiveTab("hospital"); endVoiceCall(); }}
          className={cn(
            "p-3.5 rounded-lg border text-left transition-all flex flex-col gap-2.5 cursor-pointer",
            activeTab === "hospital"
              ? "border-primary/30 bg-primary/5 text-primary shadow-xs ring-1 ring-primary/20"
              : "hover:bg-muted/30 border-muted-foreground/10 text-muted-foreground"
          )}
        >
          <Heart className="h-5 w-5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold">5. Notify Hospital</p>
            <p className="text-[10px] opacity-75">Dispatch medical teams</p>
          </div>
        </button>

        <button
          onClick={() => { setActiveTab("incident"); endVoiceCall(); }}
          className={cn(
            "p-3.5 rounded-lg border text-left transition-all flex flex-col gap-2.5 cursor-pointer",
            activeTab === "incident"
              ? "border-primary/30 bg-primary/5 text-primary shadow-xs ring-1 ring-primary/20"
              : "hover:bg-muted/30 border-muted-foreground/10 text-muted-foreground"
          )}
        >
          <PlusCircle className="h-5 w-5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold">6. Generate Incident</p>
            <p className="text-[10px] opacity-75">Record active telemetry</p>
          </div>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="border-t border-muted-foreground/10 pt-5 mt-2">
        {/* SMS Form */}
        {activeTab === "sms" && (
          <form onSubmit={handleSendSMS} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Select Target Sector</label>
                <select
                  value={smsSector}
                  onChange={(e) => setSmsSector(e.target.value)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="All Stadium Sectors">All Stadium Sectors (14,820 people)</option>
                  <option value="Sector A (Gate 1/2)">Sector A concourse</option>
                  <option value="Sector B (Gate 4)">Sector B concourse</option>
                  <option value="Sector C (VIP Entrance)">Sector C concourse</option>
                </select>
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Alert Urgency Rating</label>
                <div className="flex items-center h-10 px-3 bg-muted border rounded-md text-xs font-bold text-rose-500 gap-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> HIGH PRIORITY
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground">SMS Warning Message Text</label>
                <span className="text-[10px] text-muted-foreground font-semibold">{smsMessage.length}/160 chars</span>
              </div>
              <textarea
                placeholder="e.g. Evacuate Zone Sector B immediately. Divert entry protocols."
                value={smsMessage}
                maxLength={160}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full min-h-[90px] text-xs rounded-md border border-input p-3 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <Button type="submit" className="w-full h-10 gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95">
              <Send className="h-4 w-4" /> Dispatch SMS Warning Broadcast
            </Button>
          </form>
        )}

        {/* Voice Call Window */}
        {activeTab === "voice" && (
          <div className="space-y-4">
            {callState === "idle" ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground">Select responder unit to bridge voice communications:</p>
                <div className="grid gap-3">
                  {[
                    { name: "Officer R. Davis (Sector B Lead)", channel: "Channel Red-01", role: "Security Marshall" },
                    { name: "Medic Center Alpha Dispatcher", channel: "Channel Blue-02", role: "First Aid Marshall" },
                    { name: "Command Fire Safety Coordinator", channel: "Channel Fire-04", role: "Logistics Lead" }
                  ].map((unit, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">{unit.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{unit.role} &mdash; {unit.channel}</p>
                      </div>
                      <Button
                        onClick={() => startVoiceCall(unit.name)}
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 cursor-pointer border border-primary/25 hover:bg-primary/5 text-primary"
                      >
                        <PhoneCall className="h-3 w-3" /> Connect Radio
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-primary/20 rounded-xl bg-primary/5 p-6 text-center space-y-4 animate-pulse">
                <div className="flex h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto items-center justify-center">
                  <Radio className="h-6 w-6 animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">{activeCallContact}</h4>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                    {callState === "dialing" ? "Connecting radio relay..." : "Relay bridge active"}
                  </p>
                </div>

                {callState === "connected" && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono font-bold text-foreground">Duration: {formatTime(callDuration)}</p>
                    <div className="flex justify-center gap-1.5 items-center text-[10px] text-emerald-500 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Uplink secure (462.56 MHz)
                    </div>
                  </div>
                )}

                <Button
                  onClick={endVoiceCall}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-9 text-xs cursor-pointer gap-1.5 mx-auto"
                >
                  <PhoneOff className="h-4 w-4" /> End Radio Relay Connection
                </Button>
              </div>
            )}
          </div>
        )}

        {/* PA Broadcast Form */}
        {activeTab === "broadcast" && (
          <form onSubmit={handleStartBroadcast} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Write Public Address (PA) Audio Message</label>
              <textarea
                placeholder="e.g. Attention all stadium guests. Gates 3 and 4 are currently closed due to traffic buildup. Please use Gates 1 and 2."
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                className="w-full min-h-[90px] text-xs rounded-md border border-input p-3 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {isBroadcastingAudio ? (
              <div className="p-4 border border-emerald-500/25 bg-emerald-500/5 rounded-lg flex items-center justify-center gap-3">
                <Mic className="h-5 w-5 text-emerald-500 animate-bounce" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">Broadcasting Live Text-To-Speech (PA Loop)...</p>
                  <div className="flex gap-1 items-center mt-1.5">
                    <span className="h-3 w-1 bg-emerald-500 animate-pulse" style={{ animationDelay: "0.1s" }} />
                    <span className="h-4 w-1 bg-emerald-500 animate-pulse" style={{ animationDelay: "0.3s" }} />
                    <span className="h-2 w-1 bg-emerald-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="h-5 w-1 bg-emerald-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
                    <span className="h-3 w-1 bg-emerald-500 animate-pulse" style={{ animationDelay: "0.1s" }} />
                  </div>
                </div>
              </div>
            ) : (
              <Button type="submit" className="w-full h-10 gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95">
                <Volume2 className="h-4 w-4" /> Start PA Audio Broadcast
              </Button>
            )}
          </form>
        )}

        {/* Notify Police Form */}
        {activeTab === "police" && (
          <form onSubmit={handleNotifyPolice} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Deployment Location</label>
                <input
                  type="text"
                  value={policeSector}
                  onChange={(e) => setPoliceSector(e.target.value)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Requested Squads</label>
                <select
                  value={policeSquads}
                  onChange={(e) => setPoliceSquads(e.target.value)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="1 Dispatch Unit">1 Dispatch Unit (2 Officers)</option>
                  <option value="3 Dispatch Units">3 Dispatch Units (6 Officers)</option>
                  <option value="Tactical Squad">Tactical Inflow Squad (Crowd Team)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Urgency Level</label>
                <select
                  value={policeUrgency}
                  onChange={(e) => setPoliceUrgency(e.target.value)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Urgent (Panic)</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full h-10 gap-1.5 cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-bold border border-rose-500/20">
              <ShieldAlert className="h-4 w-4" /> Summon Police Dispatch Squads
            </Button>
          </form>
        )}

        {/* Notify Hospital Form */}
        {activeTab === "hospital" && (
          <form onSubmit={handleNotifyHospital} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Triage Location</label>
                <input
                  type="text"
                  value={hospitalLocation}
                  onChange={(e) => setHospitalLocation(e.target.value)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Ambulance Squads</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={hospitalAmbulances}
                  onChange={(e) => setHospitalAmbulances(Number(e.target.value))}
                  className="w-full text-xs rounded-md border border-input p-2 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Priority Rating</label>
                <select
                  value={hospitalPriority}
                  onChange={(e) => setHospitalPriority(e.target.value)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="low">Standard Standby</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Triage Urgent</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full h-10 gap-1.5 cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-bold border border-rose-500/20">
              <Heart className="h-4 w-4" /> Notify General Hospital Triage
            </Button>
          </form>
        )}

        {/* Generate Incident Form */}
        {activeTab === "incident" && (
          <form onSubmit={handleGenerateIncident} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Incident Title</label>
                <input
                  type="text"
                  placeholder="e.g. Overcrowding at Gate 4 concourse"
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Incident Sector Location</label>
                <input
                  type="text"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Severity Level</label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value as any)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="warning">Warning Level</option>
                  <option value="critical">Critical Urgent (Threat)</option>
                </select>
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Details / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Queue length exceeding 150 meters, ticketing slowdowns."
                  value={incidentDetails}
                  onChange={(e) => setIncidentDetails(e.target.value)}
                  className="w-full text-xs rounded-md border border-input p-2.5 bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-10 gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95">
              <PlusCircle className="h-4 w-4" /> Generate Active Incident Record
            </Button>
          </form>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
        <span className="truncate pr-1">Action API: {apiMap[activeTab].endpoint}</span>
        <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">{apiMap[activeTab].collection}</span>
      </div>
    </div>
  );
}
