import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Bot, ShieldAlert, FileText, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

export type NotificationType = "system" | "ai" | "security" | "report";

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  isRead: boolean;
  onMarkRead?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export function NotificationCard({
  id,
  title,
  message,
  timestamp,
  type,
  isRead,
  onMarkRead,
  onClick,
  className,
}: NotificationCardProps) {
  const typeConfig = {
    system: { icon: Bell, color: "text-blue-500 bg-blue-500/10 dark:text-blue-400" },
    ai: { icon: Bot, color: "text-purple-500 bg-purple-500/10 dark:text-purple-400" },
    security: { icon: ShieldAlert, color: "text-rose-500 bg-rose-500/10 dark:text-rose-400" },
    report: { icon: FileText, color: "text-amber-500 bg-amber-500/10 dark:text-amber-400" },
  };

  const Icon = typeConfig[type].icon;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 border border-muted-foreground/10",
      !isRead ? "bg-primary/5 border-primary/20 shadow-sm" : "hover:bg-muted/30",
      className
    )}>
      <CardContent className="p-4 flex gap-3.5 items-start">
        {/* Glow unread indicator */}
        {!isRead && (
          <span className="absolute top-4 right-4 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        )}

        <div className={cn("p-2 rounded-lg shrink-0 mt-0.5", typeConfig[type].color)}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 space-y-1 min-w-0 pr-4">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className={cn("text-sm font-semibold tracking-tight leading-none", !isRead ? "text-foreground" : "text-muted-foreground")}>
              {title}
            </h4>
            <span className="text-[10px] text-muted-foreground shrink-0">{timestamp}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-normal line-clamp-2 pt-0.5">
            {message}
          </p>
          
          <div className="flex items-center gap-3 pt-2 justify-end">
            {!isRead && onMarkRead && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] px-2 font-medium flex items-center gap-1 text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(id);
                }}
              >
                <Check className="h-3 w-3" /> Mark as read
              </Button>
            )}
            {onClick && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] px-2 font-medium text-muted-foreground hover:bg-muted"
                onClick={() => onClick(id)}
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
