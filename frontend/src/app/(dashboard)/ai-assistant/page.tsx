"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import {
  Bot,
  Send,
  User,
  Sparkles,
  MapPin,
  AlertTriangle,
  DoorOpen,
  Users,
  Video,
  Shield,
  FileText,
  Download,
  CheckCircle,
  RefreshCw,
  Activity,
  ClipboardList,
  Flame,
  Wrench,
  Radio
} from "lucide-react";

interface RichCardData {
  type: "venue" | "incidents" | "recommendations" | "report";
  venueData?: {
    name: string;
    risk: number;
    occupancy: string;
    exits: string;
    staff: string;
  };
  incidentData?: {
    id: string;
    title: string;
    severity: "info" | "warning" | "critical";
    status: string;
  }[];
  recommendationData?: {
    id: string;
    title: string;
    desc: string;
    actionLabel: string;
    type: "override" | "staff" | "sms";
  }[];
  reportData?: {
    id: string;
    name: string;
    format: string;
    size: string;
  };
}

interface Message {
  role: "user" | "assistant";
  text: string;
  richCard?: RichCardData;
}

export default function AiAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      text: "Welcome to CrowdShield AI Copilot. Ask me questions about active venue risk parameters, summaries of incident logs, or recommended emergency bypass overrides." 
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Execute AI responses for queries
  const handleQuery = (queryText: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: "user", text: queryText }]);
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let responseText = "";
      let richCard: RichCardData | undefined;

      const normalized = queryText.toLowerCase();

      if (normalized.includes("venue") && (normalized.includes("risk") || normalized.includes("risky"))) {
        responseText = "Current camera and sensor feeds indicate Centennial Indoor Arena carries the highest risk rating due to exit bottlenecks.";
        richCard = {
          type: "venue",
          venueData: {
            name: "Centennial Indoor Arena",
            risk: 78,
            occupancy: "17,200 / 18,500 (93%)",
            exits: "1 Blocked (Exit 4 concourse)",
            staff: "48 Active marshals"
          }
        };
      } else if (normalized.includes("summarize") && normalized.includes("incident")) {
        responseText = "I have scanned the active log database. There are currently 2 unresolved incidents and 1 resolved incident today:";
        richCard = {
          type: "incidents",
          incidentData: [
            { id: "INC-342", title: "Overcrowding Sector B", severity: "critical", status: "Active Dispatch" },
            { id: "INC-339", title: "Suspicious Baggage Sector A", severity: "warning", status: "Investigating" },
            { id: "INC-331", title: "Power Fault Relay A", severity: "info", status: "Resolved" }
          ]
        };
      } else if (normalized.includes("recommend") && normalized.includes("action")) {
        responseText = "Based on flow propagation modeling, I recommend executing these three triage overrides immediately:";
        richCard = {
          type: "recommendations",
          recommendationData: [
            {
              id: "rec-01",
              title: "Emergency Exit Override",
              desc: "Remote override unlock and clear Centennial Indoor Arena Exit 4 doors.",
              actionLabel: "Execute Override",
              type: "override"
            },
            {
              id: "rec-02",
              title: "Security Force Allocation",
              desc: "Divert 15 backup security officers to Gate 4 turnstile queues.",
              actionLabel: "Deploy Officers",
              type: "staff"
            },
            {
              id: "rec-03",
              title: "Ingress SMS Advisory",
              desc: "Dispatch SMS warnings directing incoming guests to Gates 1 and 2.",
              actionLabel: "Bypass Flow",
              type: "sms"
            }
          ]
        };
      } else if (normalized.includes("generate") && normalized.includes("report")) {
        responseText = "Successfully generated today's Telemetry & Flow Forecast PDF report. Ready for download.";
        richCard = {
          type: "report",
          reportData: {
            id: "REP-AI-829",
            name: "CrowdShield AI Incident & Ingress Report",
            format: "PDF",
            size: "2.1 MB"
          }
        };
      } else {
        responseText = "I'm processing that prompt. Try selecting one of the command chips below (e.g. Which venue is risky?, Summarize incidents., Recommend action., or Generate report.).";
      }

      setMessages(prev => [...prev, { role: "assistant", text: responseText, richCard }]);
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleQuery(input);
    setInput("");
  };

  const handleExecuteAction = (label: string) => {
    toast({
      title: "Action Executed",
      description: `AI Copilot Command Dispatched: "${label}" triggered.`,
      variant: "success",
    });
  };

  const handleDownloadReport = (id: string) => {
    toast({
      title: "Downloading Report",
      description: `Downloading generated file ${id}.pdf...`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 flex flex-col h-full min-h-[580px]">
      <PageHeader
        title="AI Copilot Command Assistant"
        description="Ask natural language questions to analyze risky venues, summarize active incidents, recommend triage actions, or compile PDF report downloads."
      />

      <div className="flex-1 rounded-xl border border-muted-foreground/10 bg-card overflow-hidden flex flex-col h-[540px] shadow-sm">
        
        {/* Assistant Header */}
        <div className="p-4 border-b border-muted-foreground/10 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bot className="h-5 w-5 text-purple-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground">Safety Dispatch Copilot</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Online & scanning crowd sensors feeds</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-bold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>LLM-4x Engine</span>
          </div>
        </div>

        {/* Message Logs Pane */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[380px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 max-w-[85%] text-xs",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Initials profile box */}
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center font-bold uppercase shrink-0 border text-[10px] select-none",
                msg.role === "user" 
                  ? "bg-primary/10 text-primary border-primary/20" 
                  : "bg-purple-500/10 text-purple-600 border-purple-500/25 dark:text-purple-400"
              )}>
                {msg.role === "user" ? "AD" : "AI"}
              </div>

              <div className="space-y-3">
                <div className={cn(
                  "p-3 rounded-lg leading-relaxed shadow-2xs font-semibold",
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted/40 text-foreground border"
                )}>
                  {msg.text}
                </div>

                {/* RICH WORKSPACE INTERACTIVE CARDS */}
                {msg.richCard && (
                  <div className="animate-fade-in">
                    
                    {/* VENUE CARD DETAILS */}
                    {msg.richCard.type === "venue" && msg.richCard.venueData && (
                      <div className="border border-rose-500/25 bg-rose-500/5 rounded-xl p-4.5 space-y-3.5 max-w-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-foreground">{msg.richCard.venueData.name}</h4>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" /> Localized concourse bottleneck
                            </p>
                          </div>
                          <Badge variant="destructive" className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                            {msg.richCard.venueData.risk}% Anomaly Score
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold border-t border-rose-500/10 pt-2.5">
                          <div>
                            <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Attendance</span>
                            <p className="text-foreground">{msg.richCard.venueData.occupancy}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground flex items-center gap-1"><DoorOpen className="h-3 w-3" /> Exits Check</span>
                            <p className="text-foreground">{msg.richCard.venueData.exits}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* INCIDENTS CHECKLIST */}
                    {msg.richCard.type === "incidents" && msg.richCard.incidentData && (
                      <div className="border border-muted-foreground/10 bg-card rounded-xl p-4 space-y-3 max-w-sm shadow-xs">
                        <h4 className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 border-b pb-2">
                          <ClipboardList className="h-3.5 w-3.5 text-primary" /> Incidents Summary Checklist
                        </h4>
                        <div className="space-y-2">
                          {msg.richCard.incidentData.map((inc, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] border-b border-muted-foreground/5 pb-2 last:border-0 last:pb-0">
                              <div className="space-y-0.5 min-w-0 pr-2">
                                <p className="font-bold text-foreground truncate">{inc.title}</p>
                                <p className="text-[9px] font-semibold text-muted-foreground font-mono">{inc.id}</p>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <Badge variant="outline" className="text-[8px] uppercase tracking-wider rounded-xs border-muted-foreground/20">
                                  {inc.status}
                                </Badge>
                                <Badge className={cn(
                                  "text-[8px] uppercase tracking-wider rounded-xs border-0 text-white",
                                  inc.severity === "critical" ? "bg-rose-600" : inc.severity === "warning" ? "bg-orange-500" : "bg-blue-500"
                                )}>
                                  {inc.severity}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ACTIONS RECOMMENDATIONS */}
                    {msg.richCard.type === "recommendations" && msg.richCard.recommendationData && (
                      <div className="space-y-3 max-w-md">
                        {msg.richCard.recommendationData.map((rec, idx) => (
                          <div key={idx} className="border border-muted-foreground/10 bg-card rounded-xl p-4 flex justify-between items-start gap-4 hover:shadow-xs transition-shadow">
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                {rec.type === "override" && <DoorOpen className="h-4 w-4 text-rose-500 shrink-0" />}
                                {rec.type === "staff" && <Shield className="h-4 w-4 text-emerald-500 shrink-0" />}
                                {rec.type === "sms" && <Radio className="h-4 w-4 text-indigo-500 shrink-0" />}
                                {rec.title}
                              </h4>
                              <p className="text-[10px] text-muted-foreground leading-relaxed">
                                {rec.desc}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleExecuteAction(rec.title)}
                              size="sm"
                              className={cn(
                                "h-8 text-[10px] cursor-pointer shrink-0 font-bold border",
                                rec.type === "override" 
                                  ? "bg-rose-600 text-white hover:bg-rose-700 border-rose-500/20" 
                                  : rec.type === "staff"
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-500/20"
                                    : "bg-primary text-primary-foreground hover:bg-primary/95"
                              )}
                            >
                              {rec.actionLabel}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* REPORT DOWNLOAD COMPONENT */}
                    {msg.richCard.type === "report" && msg.richCard.reportData && (
                      <div className="border border-purple-500/25 bg-purple-500/5 rounded-xl p-4 flex items-center justify-between gap-4 max-w-sm">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-8 w-8 text-purple-600 shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-foreground truncate">{msg.richCard.reportData.name}</h4>
                            <p className="text-[9px] text-muted-foreground">{msg.richCard.reportData.size} &bull; {msg.richCard.reportData.id}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownloadReport(msg.richCard?.reportData?.id || "")}
                          size="sm"
                          variant="outline"
                          className="h-8 text-[10px] cursor-pointer shrink-0 font-semibold border-purple-500/25 hover:bg-purple-500/5 text-purple-600 dark:text-purple-400"
                        >
                          <Download className="h-3 w-3" /> Get PDF
                        </Button>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking typing indicator loader */}
          {isThinking && (
            <div className="flex gap-3 max-w-[85%] text-xs mr-auto">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-600 border border-purple-500/25 dark:text-purple-400 shrink-0 font-bold uppercase select-none">
                AI
              </div>
              <div className="p-3.5 border rounded-lg bg-muted/40 text-muted-foreground flex gap-1.5 items-center font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
        </div>

        {/* Input prompt bar & Suggestion chips */}
        <div className="p-4 border-t border-muted-foreground/10 bg-muted/20 space-y-3.5">
          {/* Quick command suggestion chips */}
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase">
            {[
              { text: "Which venue is risky?", label: "Risky Venues" },
              { text: "Summarize incidents.", label: "Incidents Summary" },
              { text: "Recommend action.", label: "Bypass Action" },
              { text: "Generate report.", label: "Compile Report" }
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuery(chip.text)}
                className="px-2.5 py-1.5 rounded-full bg-card hover:bg-muted text-foreground border border-muted-foreground/10 hover:border-primary/20 shadow-2xs transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Text Input bar */}
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              placeholder="Ask Safety Copilot (e.g. Which venue is risky?)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs border bg-background h-10"
            />
            <Button type="submit" className="h-10 px-4 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
