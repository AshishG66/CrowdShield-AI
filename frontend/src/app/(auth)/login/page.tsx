"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Mock login timeout
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome Back",
        description: "Successfully authenticated as Command Admin.",
        variant: "success",
      });
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Command Console Sign In</h2>
        <p className="text-xs text-zinc-400">
          Enter credentials to connect to safety nodes
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5 relative">
          <label className="text-xs text-zinc-400 font-semibold" htmlFor="email">
            Node Administrator Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="email"
              type="email"
              placeholder="admin@crowdshield.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-zinc-100 h-10 w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5 relative">
          <div className="flex items-center justify-between">
            <label className="text-xs text-zinc-400 font-semibold" htmlFor="password">
              Security Token Password
            </label>
            <a href="#" className="text-[10px] text-indigo-400 hover:underline">
              Reset Key?
            </a>
          </div>
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
            <span>Connecting...</span>
          ) : (
            <>
              <span>Establish Session</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-800/40">
        Need to register a node?{" "}
        <Link href="/register" className="text-indigo-400 hover:underline font-semibold">
          Create account
        </Link>
      </div>
    </div>
  );
}
