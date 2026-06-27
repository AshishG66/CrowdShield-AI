import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calendar } from "lucide-react";
import { cn } from "@/lib/cn";

interface AnalyticsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  filterOptions?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  className?: string;
}

export function AnalyticsCard({
  title,
  description,
  children,
  filterOptions,
  activeFilter,
  onFilterChange,
  className,
}: AnalyticsCardProps) {
  return (
    <Card className={cn("overflow-hidden border border-muted-foreground/10 flex flex-col h-full", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 border-b border-muted-foreground/5 bg-muted/5">
        <div className="space-y-1 pr-4">
          <CardTitle className="text-base font-bold tracking-tight text-foreground">{title}</CardTitle>
          {description && <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>}
        </div>
        
        {filterOptions && filterOptions.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{activeFilter || filterOptions[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className="cursor-pointer text-xs"
                    onClick={() => onFilterChange?.(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted rounded-lg">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-6 flex flex-col justify-center min-h-[280px]">
        {children}
      </CardContent>
    </Card>
  );
}
