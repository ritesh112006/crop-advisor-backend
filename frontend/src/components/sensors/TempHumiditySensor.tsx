import SensorCard from "./SensorCard";
import { Thermometer, Wind } from "lucide-react";

interface TempHumidityData {
  temperature: number;
  humidity: number;
}

interface TempHumiditySensorProps {
  data: TempHumidityData;
  className?: string;
}

const TempHumiditySensor = ({ data, className }: TempHumiditySensorProps) => {
  const getTempStatus = (temp: number) => {
    if (temp < 15) return { text: "Cold", color: "text-sky" };
    if (temp > 35) return { text: "Hot", color: "text-destructive" };
    return { text: "Optimal", color: "text-leaf" };
  };

  const tempStatus = getTempStatus(data.temperature);

  return (
    <SensorCard
      title="Temperature & Humidity"
      icon={<Thermometer className="w-5 h-5" />}
      variant="temp"
      trend="stable"
      className={className}
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-sun/10 to-sky/10">
          <Thermometer className="w-8 h-8 mx-auto mb-2 text-sun" />
          <div className="text-3xl font-bold text-foreground">
            {data.temperature}°C
          </div>
          <p className={`text-sm mt-1 ${tempStatus.color}`}>{tempStatus.text}</p>
        </div>

        {/* Humidity */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-water/10 to-sky/10">
          <Wind className="w-8 h-8 mx-auto mb-2 text-water" />
          <div className="text-3xl font-bold text-foreground">
            {data.humidity}%
          </div>
          <p className="text-sm mt-1 text-muted-foreground">Humidity</p>
        </div>
      </div>
    </SensorCard>
  );
};

export default TempHumiditySensor;
