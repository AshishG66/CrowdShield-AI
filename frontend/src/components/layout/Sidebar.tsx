"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { sidebarItems } from "@/constants/sidebar";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export default function Sidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col h-full border-r bg-card text-card-foreground", className)}>
      <div className="flex h-16 items-center px-6 border-b gap-3">
        <Image src={logo} alt="CrowdShield AI Logo" width={28} height={28} className="animate-pulse" />
        <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
          CrowdShield AI
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.01]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></div>
          <span>System Secure & Active</span>
        </div>
      </div>
    </aside>
  );
}
