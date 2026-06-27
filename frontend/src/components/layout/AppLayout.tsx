"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar (visible on md and up) */}
      <Sidebar className="hidden md:flex md:w-64 md:shrink-0" />

      {/* Mobile Drawer Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-card">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Access dashboard features and configuration settings</SheetDescription>
          </SheetHeader>
          <Sidebar className="w-full h-full border-r-0" onLinkClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8 flex flex-col">
          <Breadcrumbs />
          <div className="flex-1 flex flex-col mb-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
