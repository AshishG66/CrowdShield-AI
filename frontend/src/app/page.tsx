import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BrainCircuit,
  ShieldAlert,
  Users,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 relative overflow-hidden font-sans flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-zinc-950 to-zinc-950 z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl z-0"></div>

      {/* Navbar header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/75 backdrop-blur-md px-6 md:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="CrowdShield AI Logo" width={28} height={28} />
          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            CrowdShield AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-300 hover:text-zinc-50 text-xs font-semibold h-9 cursor-pointer">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-zinc-50 text-xs font-semibold px-4 h-9 cursor-pointer">
              Request Demo
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center py-20 px-6 max-w-6xl mx-auto text-center gap-12">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold animate-pulse">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Next-Gen Crowd Safety Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Intelligent Crowd Safety <br className="hidden sm:inline" /> Powered by Computer Vision
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            CrowdShield AI connects real-time video telemetry with predictive flow models, automating crowd density warnings, incident dispatches, and emergency responses.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-zinc-50 font-bold px-6 h-12 gap-2 text-sm shadow-lg shadow-indigo-600/20 scale-100 hover:scale-[1.01] transition-transform cursor-pointer">
              Enter Command Console <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="border-zinc-850 hover:bg-zinc-900 text-zinc-300 hover:text-zinc-50 font-semibold px-6 h-12 text-sm cursor-pointer">
              Deploy Local Node
            </Button>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full pt-10 text-left">
          {/* Card 1 */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Live Crowd Counting</h3>
            <p className="text-xs text-zinc-400 leading-normal">
              Extract crowd density estimates in real-time across multiple camera sectors, preventing bottleneck surges.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Flow Rate Prediction</h3>
            <p className="text-xs text-zinc-400 leading-normal">
              Predict queuing congestion up to 30 minutes in advance using AI modeling of arrival rates and path velocities.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 w-fit">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Incident Auto-Dispatch</h3>
            <p className="text-xs text-zinc-400 leading-normal">
              Automatically trigger alarms, dispatch responder alerts, and broadcast instructions if crowd limits are breached.
            </p>
          </div>
        </div>

        {/* Trust banner */}
        <div className="flex flex-col sm:flex-row gap-6 md:gap-12 items-center justify-center pt-8 border-t border-zinc-800/60 w-full text-zinc-500 text-xs font-semibold">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-indigo-500/75" /> <span>Real-time Video Processing</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-indigo-500/75" /> <span>94.8% AI Inference Accuracy</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-indigo-500/75" /> <span>Zero Latency SMS Broadcasting</span></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-850 bg-zinc-950 py-6 px-6 md:px-12 text-center text-xs text-zinc-500 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} CrowdShield AI. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:underline hover:text-zinc-300">Privacy Policy</a>
          <a href="#" className="hover:underline hover:text-zinc-300">Terms of Service</a>
          <a href="#" className="hover:underline hover:text-zinc-300">Contact Command Support</a>
        </div>
      </footer>
    </div>
  );
}
