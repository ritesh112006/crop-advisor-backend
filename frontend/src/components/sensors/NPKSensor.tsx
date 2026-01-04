import SensorCard from "./SensorCard";
import { Sprout } from "lucide-react";

interface NPKData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface NPKSensorProps {
  data: NPKData;
  className?: string;
}

const NPKSensor = ({ data, className }: NPKSensorProps) => {
  const getStatusColor = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage < 30) return "bg-destructive";
    if (percentage < 70) return "bg-accent";
    return "bg-leaf";
  };

  const nutrients = [
    { name: "Nitrogen (N)", value: data.nitrogen, unit: "mg/kg", max: 100, color: "nitrogen" },
    { name: "Phosphorus (P)", value: data.phosphorus, unit: "mg/kg", max: 80, color: "phosphorus" },
    { name: "Potassium (K)", value: data.potassium, unit: "mg/kg", max: 120, color: "potassium" },
  ];

  return (
    <SensorCard
      title="NPK Levels"
      icon={<Sprout className="w-5 h-5" />}
      variant="npk"
      trend="up"
      trendValue="+5%"
      className={className}
    >
      <div className="space-y-4">
        {nutrients.map((nutrient) => (
          <div key={nutrient.name}>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm text-muted-foreground">{nutrient.name}</span>
              <span className="text-sm font-medium">
                {nutrient.value} {nutrient.unit}
              </span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out bg-${nutrient.color}`}
                style={{ width: `${(nutrient.value / nutrient.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SensorCard>
  );
};

export default NPKSensor;
