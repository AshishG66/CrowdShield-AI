import * as React from "react";
import Image from "next/image";
import logo from "@/assets/logo.svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-50 relative overflow-hidden font-sans">
      {/* Background radial gradients for premium aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-zinc-950 to-zinc-950 z-0"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl z-0 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl z-0 animate-pulse"></div>

      <div className="w-full max-w-md px-4 py-8 relative z-10 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="CrowdShield AI Logo" width={36} height={36} className="animate-pulse" />
          <span className="font-bold text-2xl tracking-wider bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            CrowdShield AI
          </span>
        </div>
        
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
