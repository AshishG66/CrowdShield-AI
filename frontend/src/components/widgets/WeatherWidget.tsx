import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, CloudRain, Wind, Droplets } from "lucide-react";
import { cn } from "@/lib/cn";
import { WeatherData } from "@/services/mockApi";

interface WeatherWidgetProps {
  weather: WeatherData;
  className?: string;
}

export function WeatherWidget({ weather, className }: WeatherWidgetProps) {
  const isOptimal = weather.condition.toLowerCase() === "clear" || weather.condition.toLowerCase() === "sunny";

  return (
    <Card className={cn("overflow-hidden border hover:shadow-md transition-shadow duration-200 border-muted-foreground/10", className)}>
      <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground tracking-tight">Venue Climate Status</p>
          <div className={cn(
            "p-2 rounded-lg bg-muted/40",
            isOptimal ? "text-amber-500" : "text-blue-500"
          )}>
            {isOptimal ? (
              <Sun className="h-4 w-4 animate-spin" style={{ animationDuration: "12s" }} />
            ) : (
              <CloudRain className="h-4 w-4" />
            )}
          </div>
        </div>

        <div className="mt-2.5 flex items-baseline justify-between">
          <div className="space-y-0.5">
            <h3 className="text-2xl font-bold tracking-tight">{weather.temp}°C</h3>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{weather.condition} Conditions</p>
          </div>
          <div className="text-[10px] text-right font-bold text-muted-foreground uppercase">
            Olympus Arena
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-3.5 border-t border-muted-foreground/5 text-xs">
          <div className="flex items-center gap-2">
            <Wind className="h-3.5 w-3.5 text-muted-foreground/75" />
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground block leading-none">Wind</span>
              <span className="font-bold text-foreground">{weather.windSpeed} km/h</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-3.5 w-3.5 text-muted-foreground/75" />
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground block leading-none">Humidity</span>
              <span className="font-bold text-foreground">{weather.humidity}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
