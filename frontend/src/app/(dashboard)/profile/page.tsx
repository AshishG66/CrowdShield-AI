"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { User, Mail, Shield, Save } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("Command Administrator");
  const [email, setEmail] = useState("admin@crowdshield.ai");
  const [department, setDepartment] = useState("Metropolis Security Group");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "User profile changes saved successfully.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Profile"
        description="Manage your account profile details, security access tokens, and passwords."
      />

      <div className="grid gap-6 md:grid-cols-3 max-w-4xl">
        {/* Left side: Avatar Overview */}
        <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4 md:col-span-1">
          <Avatar className="h-24 w-24 border-2 border-primary/20">
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">AD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground">{department}</p>
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <Shield className="h-3 w-3" /> Root Access
          </div>
        </div>

        {/* Right side: Profile Form */}
        <div className="rounded-xl border border-muted-foreground/10 bg-card p-6 shadow-sm md:col-span-2">
          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground" htmlFor="name">
                Administrator Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 w-full border h-10 text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground" htmlFor="email">
                Command Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 w-full border h-10 text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground" htmlFor="department">
                Agency / Department Name
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  id="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="pl-9 w-full border h-10 text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="h-10 px-5 gap-1.5 cursor-pointer">
                <Save className="h-4 w-4" /> Save Profile Details
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
