"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/widgets/dashboard/KpiCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Users, Shield, Plus, Phone } from "lucide-react";

export default function UsersPage() {
  const usersList = [
    { id: "USR-01", name: "David Miller", role: "Super Admin", status: "Active", location: "Central Command Room", phone: "+1 (555) 019-2834" },
    { id: "USR-02", name: "Sarah Connor", role: "Operator", status: "Active", location: "Gate 4 Camera Sector", phone: "+1 (555) 014-9988" },
    { id: "USR-03", name: "Marcus Wright", role: "Responder Officer", status: "In Dispatch", location: "Sector B Entrance", phone: "+1 (555) 012-7634" },
    { id: "USR-04", name: "Elena Fisher", role: "Responder Officer", status: "On Break", location: "Sector F Lounge", phone: "+1 (555) 018-4521" },
  ];

  const handleCall = (name: string) => {
    toast({
      title: "Initiating Voice Link",
      description: `Opening radio frequency relay connection to officer ${name}...`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personnel Directory"
        description="Manage active system administrators, telemetry operators, and field responder officers."
        actions={
          <Button size="sm" className="h-9 gap-1.5 cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Authorize Officer
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Authorized Personnel"
          value="4 Active Users"
          icon={Users}
          description="In command center session"
          variant="safe"
          apiEndpoint="GET /api/users"
          collection="User"
        />
        <KpiCard
          title="Active Responders"
          value="2 Dispatched"
          icon={Shield}
          description="Field units deployed"
          apiEndpoint="GET /api/users/responders"
          collection="User"
        />
        <KpiCard
          title="Radio Relays Open"
          value="3 Active"
          icon={Phone}
          description="Uptime checking active"
          variant="safe"
          apiEndpoint="GET /api/users/relays"
          collection="User"
        />
      </div>

      <div className="rounded-xl border border-muted-foreground/10 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location Sector</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {usersList.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/10 transition-colors">
                <TableCell className="font-semibold text-muted-foreground">{user.id}</TableCell>
                <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] font-semibold">{user.role}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "Active" ? "outline" : user.status === "In Dispatch" ? "destructive" : "secondary"}
                    className="text-[10px] font-semibold uppercase tracking-wider"
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-lg hover:bg-muted"
                    onClick={() => handleCall(user.name)}
                  >
                    <Phone className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    <span className="sr-only">Call responder</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-3 border-t border-muted-foreground/10 bg-muted/5 flex items-center justify-between text-[9px] font-mono text-muted-foreground/60">
          <span>API: GET /api/users</span>
          <span className="shrink-0 bg-muted px-1.5 py-0.5 rounded text-[8px] font-semibold text-primary">User</span>
        </div>
      </div>
    </div>
  );
}
