"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import {
  Bell,
  Check,
  Bot,
  Send,
  Hash,
  ChevronDown,
  User,
  Radio,
  Sliders,
  Smile,
  Paperclip,
  Volume2,
  Trash2,
  AlertTriangle,
  FileCheck,
  Terminal,
  Activity,
  Plus
} from "lucide-react";

interface AttachmentField {
  label: string;
  value: string;
}

interface SlackAttachment {
  color: "green" | "yellow" | "red" | "blue";
  title: string;
  fields: AttachmentField[];
}

interface SlackMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  isBot: boolean;
  timestamp: string;
  channel: string;
  text: string;
  attachment?: SlackAttachment;
}

export default function NotificationsPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>("ai-predictions");
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Slack messages state containing preloaded notification logs
  const [messages, setMessages] = useState<SlackMessage[]>([
    {
      id: "msg-1",
      sender: "CrowdFlow AI",
      senderAvatar: "CF",
      isBot: true,
      timestamp: "19:02:15",
      channel: "ai-predictions",
      text: "Prediction execution run complete. Bottleneck hazard check performed for Olympus Stadium.",
      attachment: {
        color: "yellow",
        title: "Prediction Complete: Inflow Alert (Sector B Concourse)",
        fields: [
          { label: "Anomaly Index", value: "74.8% Anomaly Rate" },
          { label: "Expected Inflow", value: "380 people/min" },
          { label: "Confidence Score", value: "93.4% Accuracy" }
        ]
      }
    },
    {
      id: "msg-2",
      sender: "SMS Gateway Bot",
      senderAvatar: "SG",
      isBot: true,
      timestamp: "19:04:30",
      channel: "sms-dispatches",
      text: "Mass SMS warning alert successfully broadcast to local handsets located in Sector B Gate 4 concourse.",
      attachment: {
        color: "green",
        title: "SMS Delivered Successfully",
        fields: [
          { label: "Dispatched", value: "1,240 Handsets" },
          { label: "Delivery Rate", value: "100% Delivered" },
          { label: "Carrier Latency", value: "85ms" }
        ]
      }
    },
    {
      id: "msg-3",
      sender: "Radio Bridge Bot",
      senderAvatar: "RB",
      isBot: true,
      timestamp: "19:05:12",
      channel: "voice-relays",
      text: "Uplink bridged. Secure voice connection initialized with security force dispatch unit.",
      attachment: {
        color: "blue",
        title: "Radio Call Connected",
        fields: [
          { label: "Officer", value: "Marcus Vance (Sector B Lead)" },
          { label: "Channel ID", value: "Channel Red-01 (462.56 MHz)" },
          { label: "Signal Strength", value: "98% (Secure uplink)" }
        ]
      }
    },
    {
      id: "msg-4",
      sender: "Triage Manager Bot",
      senderAvatar: "TM",
      isBot: true,
      timestamp: "19:15:22",
      channel: "incidents-triage",
      text: "Incident registry ticket INC-342 has been resolved and archived by command supervisor.",
      attachment: {
        color: "green",
        title: "Incident Closed: INC-342 Overcrowding",
        fields: [
          { label: "Resolved By", value: "Command Admin" },
          { label: "Action Taken", value: "Overflow turnstiles opened. VIP shuttle buses diverted." },
          { label: "Resolution Time", value: "14 minutes" }
        ]
      }
    }
  ]);

  // Unread badge indicators state helper
  const [unreadChannels, setUnreadChannels] = useState<Record<string, boolean>>({
    "ai-predictions": false,
    "sms-dispatches": false,
    "voice-relays": false,
    "incidents-triage": false,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChannel]);

  // Handle switching channels
  const handleSelectChannel = (channel: string) => {
    setSelectedChannel(channel);
    setUnreadChannels(prev => ({ ...prev, [channel]: false }));
  };

  // Dispatch Custom Simulated Events
  const triggerSimulation = (type: "prediction" | "sms" | "voice" | "incident") => {
    const time = new Date().toTimeString().split(" ")[0];
    let newMsg: SlackMessage;

    if (type === "prediction") {
      newMsg = {
        id: `sim-pred-${Date.now()}`,
        sender: "CrowdFlow AI",
        senderAvatar: "CF",
        isBot: true,
        timestamp: time,
        channel: "ai-predictions",
        text: "Prediction execution run complete. Bottleneck hazard check performed for Centennial Arena.",
        attachment: {
          color: "red",
          title: "Prediction Complete: Critical Congestion Forecast",
          fields: [
            { label: "Anomaly Index", value: "88.2% Anomaly Rate" },
            { label: "Expected Inflow", value: "420 people/min" },
            { label: "Confidence Score", value: "96.2% Accuracy" }
          ]
        }
      };
      toast({ title: "AI Forecast Event", description: "AI Prediction complete log pushed to channel.", variant: "default" });
    } else if (type === "sms") {
      newMsg = {
        id: `sim-sms-${Date.now()}`,
        sender: "SMS Gateway Bot",
        senderAvatar: "SG",
        isBot: true,
        timestamp: time,
        channel: "sms-dispatches",
        text: "Mass SMS warning alert successfully broadcast to local handsets located in Sector A concourse.",
        attachment: {
          color: "green",
          title: "SMS Delivered Successfully",
          fields: [
            { label: "Dispatched", value: "850 Handsets" },
            { label: "Delivery Rate", value: "100% Delivered" },
            { label: "Carrier Latency", value: "92ms" }
          ]
        }
      };
      toast({ title: "SMS Gateway Event", description: "SMS Delivered log pushed to channel.", variant: "success" });
    } else if (type === "voice") {
      newMsg = {
        id: `sim-voice-${Date.now()}`,
        sender: "Radio Bridge Bot",
        senderAvatar: "RB",
        isBot: true,
        timestamp: time,
        channel: "voice-relays",
        text: "Uplink bridged. Secure voice connection initialized with medical dispatch coordinator.",
        attachment: {
          color: "blue",
          title: "Radio Call Connected",
          fields: [
            { label: "Coordinator", value: "Medic Dispatch Alpha" },
            { label: "Channel ID", value: "Channel Blue-02 (462.61 MHz)" },
            { label: "Signal Strength", value: "95% (Secure uplink)" }
          ]
        }
      };
      toast({ title: "Radio Relay Event", description: "Radio Voice Call Connected log pushed to channel.", variant: "default" });
    } else {
      newMsg = {
        id: `sim-inc-${Date.now()}`,
        sender: "Triage Manager Bot",
        senderAvatar: "TM",
        isBot: true,
        timestamp: time,
        channel: "incidents-triage",
        text: "Incident registry ticket INC-339 has been resolved and archived by dispatch officer.",
        attachment: {
          color: "green",
          title: "Incident Closed: INC-339 Suspicious Baggage",
          fields: [
            { label: "Resolved By", value: "Officer Sarah Jenkins" },
            { label: "Action Taken", value: "Luggage inspected and identified as owner lost item." },
            { label: "Resolution Time", value: "18 minutes" }
          ]
        }
      };
      toast({ title: "Incident Triage Event", description: "Incident Closed log pushed to channel.", variant: "success" });
    }

    setMessages(prev => [...prev, newMsg]);
    if (selectedChannel !== newMsg.channel) {
      setUnreadChannels(prev => ({ ...prev, [newMsg.channel]: true }));
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const time = new Date().toTimeString().split(" ")[0];
    const newMsg: SlackMessage = {
      id: `user-${Date.now()}`,
      sender: "Command Admin",
      senderAvatar: "AD",
      isBot: false,
      timestamp: time,
      channel: selectedChannel,
      text: typedMessage
    };

    setMessages(prev => [...prev, newMsg]);
    setTypedMessage("");
  };

  const filteredMessages = messages.filter(msg => msg.channel === selectedChannel);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Slack-style Command Workspace"
        description="Monitor automated AI forecasts, SMS logs, responder voice connections, and incident status streams."
      />

      {/* Dynamic Event Simulation Panel */}
      <div className="rounded-xl border border-muted-foreground/10 bg-card p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-muted-foreground/10 pb-2.5">
          <Terminal className="h-4 w-4 text-primary" /> Operations Simulation Trigger
        </h3>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
          <Button
            onClick={() => triggerSimulation("prediction")}
            size="sm"
            variant="outline"
            className="text-[11px] h-8.5 gap-1.5 cursor-pointer hover:bg-muted"
          >
            <Bot className="h-3.5 w-3.5 text-purple-500" /> Trigger Prediction Complete
          </Button>
          <Button
            onClick={() => triggerSimulation("sms")}
            size="sm"
            variant="outline"
            className="text-[11px] h-8.5 gap-1.5 cursor-pointer hover:bg-muted"
          >
            <Send className="h-3.5 w-3.5 text-emerald-500" /> Trigger SMS Delivered
          </Button>
          <Button
            onClick={() => triggerSimulation("voice")}
            size="sm"
            variant="outline"
            className="text-[11px] h-8.5 gap-1.5 cursor-pointer hover:bg-muted"
          >
            <Radio className="h-3.5 w-3.5 text-blue-500" /> Trigger Call Connected
          </Button>
          <Button
            onClick={() => triggerSimulation("incident")}
            size="sm"
            variant="outline"
            className="text-[11px] h-8.5 gap-1.5 cursor-pointer hover:bg-muted"
          >
            <Check className="h-3.5 w-3.5 text-rose-500 animate-pulse" /> Trigger Incident Closed
          </Button>
        </div>
      </div>

      {/* SLACK LAYOUT WRAPPER GRID */}
      <div className="grid gap-0 lg:grid-cols-12 rounded-xl border border-muted-foreground/10 bg-card overflow-hidden shadow-sm h-[580px]">
        
        {/* SLACK LEFT SIDEBAR (3/12 width) */}
        <div className="lg:col-span-3 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-950">
          <div className="p-4 space-y-5">
            {/* Header Workspace Title */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white tracking-tight">CrowdShield Workspace</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Command center active
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>

            {/* Channels Feed Section */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2.5">
                Channels
              </span>
              <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1">
                {[
                  { id: "ai-predictions", label: "ai-predictions" },
                  { id: "sms-dispatches", label: "sms-dispatches" },
                  { id: "voice-relays", label: "voice-relays" },
                  { id: "incidents-triage", label: "incidents-triage" }
                ].map((ch) => {
                  const isSelected = selectedChannel === ch.id;
                  const hasUnread = unreadChannels[ch.id];
                  return (
                    <div
                      key={ch.id}
                      onClick={() => handleSelectChannel(ch.id)}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold select-none cursor-pointer transition-colors",
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 shrink-0 opacity-75" /> {ch.label}
                      </span>
                      {hasUnread && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* App integrations lists */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2.5">
                App Integrations
              </span>
              <div className="space-y-1 pl-2">
                {[
                  { name: "CrowdFlow AI", active: true },
                  { name: "SMS Gateway Bot", active: true },
                  { name: "Radio Bridge Bot", active: true },
                  { name: "Triage Manager Bot", active: true }
                ].map((bot, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-300">{bot.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-[10px] font-bold text-slate-400">
            Version 4.2 Uplink Secure
          </div>
        </div>

        {/* SLACK RIGHT THREAD FEED PANEL (9/12 width) */}
        <div className="lg:col-span-9 flex flex-col h-full bg-card">
          {/* Thread Header Banner */}
          <div className="p-4 border-b border-muted-foreground/10 flex items-center justify-between bg-muted/10">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Hash className="h-4 w-4 text-primary" /> {selectedChannel}
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {selectedChannel === "ai-predictions" && "Automated LSTM neural network flow and anomaly forecasts."}
                {selectedChannel === "sms-dispatches" && "Logs and delivery records for bulk emergency SMS broadcasts."}
                {selectedChannel === "voice-relays" && "Encrypted audio bridges and call statistics for responder networks."}
                {selectedChannel === "incidents-triage" && "Archive logs and resolutions summaries for safety tickets."}
              </p>
            </div>
          </div>

          {/* Scrolling messages feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[420px]">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground font-semibold">
                No logs or messages in this channel yet.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3 items-start text-xs select-text">
                  {/* Sender initials avatar */}
                  <div className={cn(
                    "h-8 w-8 rounded-md flex items-center justify-center font-bold uppercase shrink-0 text-[10px]",
                    msg.isBot ? "bg-purple-600/10 text-purple-600 dark:text-purple-400" : "bg-primary/10 text-primary"
                  )}>
                    {msg.senderAvatar}
                  </div>
                  
                  <div className="flex-1 space-y-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground">{msg.sender}</span>
                      {msg.isBot && (
                        <span className="text-[9px] px-1 bg-muted border font-bold text-muted-foreground uppercase rounded-xs">
                          APP
                        </span>
                      )}
                      <span className="text-[9px] text-muted-foreground font-semibold pl-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-normal font-semibold">
                      {msg.text}
                    </p>

                    {/* SLACK ATTACHMENTS LAYOUT */}
                    {msg.attachment && (
                      <div className={cn(
                        "mt-2 border-l-4 rounded-r-md bg-muted/20 border p-3 max-w-xl",
                        msg.attachment.color === "red" && "border-rose-500 bg-rose-500/5",
                        msg.attachment.color === "yellow" && "border-amber-500 bg-amber-500/5",
                        msg.attachment.color === "green" && "border-emerald-500 bg-emerald-500/5",
                        msg.attachment.color === "blue" && "border-blue-500 bg-blue-500/5"
                      )}>
                        <h4 className="text-xs font-bold text-foreground mb-2">
                          {msg.attachment.title}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                          {msg.attachment.fields.map((f, idx) => (
                            <div key={idx} className="space-y-0.5">
                              <span className="text-muted-foreground">{f.label}</span>
                              <p className="text-foreground">{f.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Slack style message sender input box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-muted-foreground/10 bg-muted/10">
            <div className="border border-input rounded-lg bg-background flex flex-col focus-within:ring-1 focus-within:ring-primary">
              <input
                placeholder={`Message #${selectedChannel}`}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="w-full h-10 px-3 bg-transparent text-xs focus:outline-none"
              />
              <div className="px-3 pb-2 flex items-center justify-between border-t border-muted-foreground/5 pt-1.5">
                <div className="flex gap-2 text-muted-foreground">
                  <Smile className="h-4 w-4 cursor-pointer hover:text-foreground shrink-0" />
                  <Paperclip className="h-4 w-4 cursor-pointer hover:text-foreground shrink-0" />
                </div>
                <Button type="submit" size="sm" className="h-7 w-7 p-0 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 shrink-0">
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
