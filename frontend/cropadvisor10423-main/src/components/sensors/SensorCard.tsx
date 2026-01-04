import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SensorCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  variant?: "npk" | "moisture" | "temp" | "ph";
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  className?: string;
}

const SensorCard = ({
  title,
  icon,
  children,
  variant = "npk",
  trend,
  trendValue,
  className,
}: SensorCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-leaf" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div
      className={cn(
        "sensor-card",
        `sensor-card-${variant}`,
        "animate-slide-up opacity-0",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm">
            {getTrendIcon()}
            {trendValue && (
              <span className="text-muted-foreground">{trendValue}</span>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default SensorCard;
