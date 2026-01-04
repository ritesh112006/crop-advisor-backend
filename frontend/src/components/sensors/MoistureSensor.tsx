import SensorCard from "./SensorCard";
import GaugeChart from "./GaugeChart";
import { Droplets } from "lucide-react";

interface MoistureSensorProps {
  value: number;
  className?: string;
}

const MoistureSensor = ({ value, className }: MoistureSensorProps) => {
  const getStatus = () => {
    if (value < 30) return { text: "Too Dry", color: "text-destructive" };
    if (value > 70) return { text: "Too Wet", color: "text-water" };
    return { text: "Optimal", color: "text-leaf" };
  };

  const status = getStatus();

  return (
    <SensorCard
      title="Soil Moisture"
      icon={<Droplets className="w-5 h-5" />}
      variant="moisture"
      trend={value > 50 ? "up" : "down"}
      trendValue={`${Math.abs(value - 50)}%`}
      className={className}
    >
      <div className="flex flex-col items-center py-2">
        <GaugeChart
          value={value}
          max={100}
          min={0}
          label=""
          unit="%"
          color="hsl(var(--water-blue))"
        />
        <div className={`mt-2 text-sm font-medium ${status.color}`}>
          {status.text}
        </div>
      </div>
    </SensorCard>
  );
};

export default MoistureSensor;
