"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import React from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Split the path into segments, filtering out empty ones
  const segments = pathname.split("/").filter(Boolean);

  if (pathname === "/") {
    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5 text-xs">
              <Home className="h-3.5 w-3.5" />
              <span>Overview</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/" passHref legacyBehavior>
            <BreadcrumbLink className="flex items-center gap-1.5 text-xs cursor-pointer">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          
          // Capitalize and format segment text (e.g. "ai-assistant" -> "AI Assistant")
          const label = segment
            .split("-")
            .map((word) => {
              if (word === "ai") return "AI";
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-xs font-medium text-foreground">{label}</BreadcrumbPage>
                ) : (
                  <Link href={href} passHref legacyBehavior>
                    <BreadcrumbLink className="text-xs cursor-pointer">{label}</BreadcrumbLink>
                  </Link>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
