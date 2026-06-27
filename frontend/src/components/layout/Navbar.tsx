"use client";

import { Bell, Menu, Search, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur-md dark:bg-background/90 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="relative hidden w-full max-w-xs sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search dashboard..."
            className="w-full pl-8 bg-muted/40 hover:bg-muted/70 focus-visible:bg-background transition-colors h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Security Alert quick status indicator */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive group"
        >
          <ShieldAlert className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
          <span className="sr-only">View alerts</span>
        </Button>

        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
