import SensorCard from "./SensorCard";
import { FlaskConical } from "lucide-react";

interface PHSensorProps {
  value: number;
  className?: string;
}

const PHSensor = ({ value, className }: PHSensorProps) => {
  const getPHStatus = (ph: number) => {
    if (ph < 5.5) return { text: "Too Acidic", color: "text-destructive" };
    if (ph > 7.5) return { text: "Too Alkaline", color: "text-water" };
    return { text: "Optimal", color: "text-leaf" };
  };

  const status = getPHStatus(value);
  const percentage = ((value - 0) / (14 - 0)) * 100;

  const phColors = [
    { range: "0-4", color: "bg-red-500", label: "Very Acidic" },
    { range: "4-5.5", color: "bg-orange-400", label: "Acidic" },
    { range: "5.5-7", color: "bg-leaf", label: "Neutral" },
    { range: "7-8.5", color: "bg-sky", label: "Alkaline" },
    { range: "8.5-14", color: "bg-purple-600", label: "Very Alkaline" },
  ];

  return (
    <SensorCard
      title="Soil pH"
      icon={<FlaskConical className="w-5 h-5" />}
      variant="ph"
      trend={value > 6 && value < 7.5 ? "stable" : "down"}
      className={className}
    >
      <div className="flex flex-col items-center py-4">
        <div className="text-5xl font-bold text-foreground mb-2">
          {value.toFixed(1)}
        </div>
        <div className={`text-sm font-medium ${status.color}`}>
          {status.text}
        </div>

        {/* pH Scale */}
        <div className="w-full mt-6">
          <div className="relative h-4 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-red-500" />
            <div className="flex-1 bg-orange-400" />
            <div className="flex-1 bg-leaf" />
            <div className="flex-1 bg-sky" />
            <div className="flex-1 bg-ph" />
          </div>
          {/* Indicator */}
          <div
            className="relative -mt-1 transition-all duration-500"
            style={{ left: `${percentage}%`, transform: "translateX(-50%)" }}
          >
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-foreground mx-auto" />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0</span>
            <span>7</span>
            <span>14</span>
          </div>
        </div>
      </div>
    </SensorCard>
  );
};

export default PHSensor;
