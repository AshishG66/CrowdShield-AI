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
import { MessageSquare, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export interface SmsLogItem {
  id: string;
  timestamp: string;
  sector: string;
  message: string;
  audienceCount: number;
  status: "delivered" | "pending" | "failed";
}

const defaultSmsHistory: SmsLogItem[] = [
  {
    id: "SMS-342",
    timestamp: "19:08:12",
    sector: "Sector B (Gate 4)",
    message: "CRITICAL ADVISORY: Gate 4 entry bottleneck detected. Please divert to Gates 1 and 2 to access the concourse area.",
    audienceCount: 4200,
    status: "delivered",
  },
  {
    id: "SMS-340",
    timestamp: "18:42:05",
    sector: "Sector A (Gate 1/2)",
    message: "FLOW RESTORED: Concourse ingress pathways clear. Standard ticket validation protocols active.",
    audienceCount: 7800,
    status: "delivered",
  },
  {
    id: "SMS-312",
    timestamp: "17:15:30",
    sector: "VIP Zone Concourse",
    message: "SAFETY WARNING: Excessive arrivals lane queue times. Plan alternative dropoff routes.",
    audienceCount: 920,
    status: "delivered",
  },
];

interface SmsHistoryTableProps {
  logs?: SmsLogItem[];
  className?: string;
}

export function SmsHistoryTable({ logs = defaultSmsHistory, className }: SmsHistoryTableProps) {
  const getStatusIcon = (status: SmsLogItem["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-3 w-3 text-emerald-500 mr-1.5 inline" />;
      case "pending":
        return <Clock className="h-3 w-3 text-amber-500 mr-1.5 inline animate-pulse" />;
      case "failed":
        return <AlertTriangle className="h-3 w-3 text-rose-500 mr-1.5 inline" />;
    }
  };

  const getStatusBadge = (status: SmsLogItem["status"]) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15 border-0">Delivered</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/15 border-0">Pending</Badge>;
      case "failed":
        return <Badge className="bg-rose-500/15 text-rose-500 hover:bg-rose-500/15 border-0">Failed</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <MessageSquare className="h-4.5 w-4.5 text-primary" /> SMS Broadcast Registry
        </CardTitle>
        <CardDescription className="text-xs">
          Historical record of mass mobile warning alerts dispatched to crowd handsets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground font-medium border border-dashed rounded-lg">
            No SMS broadcasts recorded in this session.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider text-muted-foreground">ID</TableHead>
                <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider text-muted-foreground">Sent</TableHead>
                <TableHead className="w-[150px] text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Sector</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message Body</TableHead>
                <TableHead className="w-[100px] text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Audience</TableHead>
                <TableHead className="w-[120px] text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-bold">{log.id}</TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="text-xs font-semibold">{log.sector}</TableCell>
                  <TableCell className="text-xs max-w-md truncate font-medium text-muted-foreground" title={log.message}>
                    {log.message}
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold">{log.audienceCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-xs">
                    <span className="inline-flex items-center">
                      {getStatusIcon(log.status)}
                      {getStatusBadge(log.status)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="w-full mt-4 pt-3 border-t border-muted-foreground/10 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
          <span className="truncate pr-1">API: GET /api/notifications/sms</span>
          <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">SMSLog</span>
        </div>
      </CardContent>
    </Card>
  );
}
