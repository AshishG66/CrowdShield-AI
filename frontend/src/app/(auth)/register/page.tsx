"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Lock, Mail, User, Building, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [venue, setVenue] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !venue || !password) {
      toast({
        title: "Incomplete details",
        description: "All fields are required to initialize a safety node.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Node Registered",
        description: "Safety telemetry node initialized successfully.",
        variant: "success",
      });
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Initialize Command Node</h2>
        <p className="text-xs text-zinc-400">
          Setup administrator profile for CrowdShield AI
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5 relative">
          <label className="text-xs text-zinc-400 font-semibold" htmlFor="name">
            Administrator Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-zinc-100 h-10 w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-xs text-zinc-400 font-semibold" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="email"
              type="email"
              placeholder="admin@stadium.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-zinc-100 h-10 w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-xs text-zinc-400 font-semibold" htmlFor="venue">
            Command Center Location / Venue Name
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="venue"
              type="text"
              placeholder="Metropolis Arena"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-zinc-100 h-10 w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-xs text-zinc-400 font-semibold" htmlFor="password">
            Command Encryption Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-zinc-100 h-10 w-full"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-zinc-50 font-bold h-10 gap-1.5 mt-2 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Deploying Node...</span>
          ) : (
            <>
              <span>Initialize Node</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-800/40">
        Already registered?{" "}
        <Link href="/login" className="text-indigo-400 hover:underline font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
