"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PhoneCall, Radio, Power, PowerOff, Shield } from "lucide-react";

export interface VoiceCallLogItem {
  id: string;
  timestamp: string;
  responder: string;
  channel: string;
  duration: string;
  signalStrength: number;
  status: "connected" | "ended";
}

const defaultVoiceHistory: VoiceCallLogItem[] = [
  {
    id: "CALL-904",
    timestamp: "19:06:22",
    responder: "Officer R. Davis (Sector B Lead)",
    channel: "Channel Red-01",
    duration: "1m 45s",
    signalStrength: 98,
    status: "ended",
  },
  {
    id: "CALL-883",
    timestamp: "18:32:10",
    responder: "Medic Center Alpha Dispatcher",
    channel: "Channel Blue-02",
    duration: "4m 12s",
    signalStrength: 95,
    status: "ended",
  },
  {
    id: "CALL-841",
    timestamp: "17:48:05",
    responder: "Command Fire Safety Coordinator",
    channel: "Channel Fire-04",
    duration: "2m 10s",
    signalStrength: 92,
    status: "ended",
  },
];

interface VoiceCallHistoryTableProps {
  logs?: VoiceCallLogItem[];
  className?: string;
}

export function VoiceCallHistoryTable({ logs = defaultVoiceHistory, className }: VoiceCallHistoryTableProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <PhoneCall className="h-4.5 w-4.5 text-primary" /> Radio Bridge Call Registry
        </CardTitle>
        <CardDescription className="text-xs">
          Historical log of encrypted tactical radio frequency patches established during events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground font-medium border border-dashed rounded-lg">
            No radio voice bridges recorded in this session.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider text-muted-foreground">ID</TableHead>
                <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider text-muted-foreground">Established</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Responder Unit</TableHead>
                <TableHead className="w-[150px] text-xs font-bold uppercase tracking-wider text-muted-foreground">Tactical Channel</TableHead>
                <TableHead className="w-[100px] text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</TableHead>
                <TableHead className="w-[100px] text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Signal</TableHead>
                <TableHead className="w-[120px] text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-bold">{log.id}</TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="text-xs font-semibold flex items-center gap-1.5">
                    <Shield className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span>{log.responder}</span>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground font-mono">{log.channel}</TableCell>
                  <TableCell className="text-right text-xs font-bold">{log.duration}</TableCell>
                  <TableCell className="text-right text-xs font-bold text-emerald-500">{log.signalStrength}%</TableCell>
                  <TableCell className="text-right text-xs">
                    {log.status === "connected" ? (
                      <span className="inline-flex items-center gap-1">
                        <Power className="h-3 w-3 text-emerald-500 animate-pulse" />
                        <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15 border-0">Active</Badge>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <PowerOff className="h-3 w-3 text-muted-foreground" />
                        <Badge className="bg-muted text-muted-foreground hover:bg-muted border-0">Closed</Badge>
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="w-full mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
          <span className="truncate pr-1">API: GET /api/notifications/voice</span>
          <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">CallLog</span>
        </div>
      </CardContent>
    </Card>
  );
}
