import DashboardLayout from "@/components/layout/DashboardLayout";
import NPKSensor from "@/components/sensors/NPKSensor";
import MoistureSensor from "@/components/sensors/MoistureSensor";
import TempHumiditySensor from "@/components/sensors/TempHumiditySensor";
import PHSensor from "@/components/sensors/PHSensor";
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Sun,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Sprout
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/lib/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Mock sensor data - in real app, this would come from API/backend
  const sensorData = {
    npk: {
      nitrogen: 65,
      phosphorus: 45,
      potassium: 80,
    },
    moisture: 55,
    tempHumidity: {
      temperature: 28,
      humidity: 65,
    },
    ph: 6.5,
  };

  const { data: weatherApiData, isLoading, error } = useQuery({
    queryKey: ["weather", "Pune"],
    queryFn: () => fetchWeather("Pune"),
    refetchInterval: 1000 * 60 * 5 // refresh every 5 minutes
  });

  const weatherData = {
    current: {
      temp: weatherApiData?.temperature_c ?? 32,
      humidity: weatherApiData?.humidity ?? 58,
      wind: 12,
      condition: weatherApiData?.condition ?? "Partly Cloudy",
    },
    forecast: [
      { day: "Today", high: weatherApiData?.temperature_c ?? 34, low: 24, icon: Sun },
      { day: "Tomorrow", high: 32, low: 23, icon: CloudSun },
      { day: "Wed", high: 30, low: 22, icon: Droplets },
    ],
  };

  const soilStatus = {
    overall: "Good",
    message: "Soil condition is suitable for crop growth",
    details: [
      { label: "Moisture", status: "optimal", value: "55%" },
      { label: "NPK Balance", status: "good", value: "Normal" },
      { label: "pH Level", status: "optimal", value: "6.5" },
      { label: "Temperature", status: "good", value: "28°C" },
    ],
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
          Farm Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Real-time overview of your farm conditions
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8 animate-fade-in">
        <Link to="/recommendations">
          <Button className="gap-2">
            <Sprout className="w-4 h-4" />
            Get Crop Advice
          </Button>
        </Link>
        <Link to="/chatbot">
          <Button variant="outline" className="gap-2">
            Ask AI Assistant
          </Button>
        </Link>
      </div>

      {/* Crop Health Status */}
      <div className="p-6 rounded-2xl bg-card shadow-md mb-8 animate-slide-up">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-leaf/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-leaf" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Crop Health Status: <span className="text-leaf">{soilStatus.overall}</span>
            </h2>
            <p className="text-muted-foreground">{soilStatus.message}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {soilStatus.details.map((detail) => (
            <div
              key={detail.label}
              className="p-4 rounded-xl bg-muted/50 flex items-center gap-3"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  detail.status === "optimal" ? "bg-leaf" : "bg-accent"
                }`}
              />
              <div>
                <p className="text-sm text-muted-foreground">{detail.label}</p>
                <p className="font-semibold text-foreground">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
        {/* Sensor Data */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Live Sensor Data</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <NPKSensor data={sensorData.npk} className="animate-slide-up stagger-1" />
            <MoistureSensor value={sensorData.moisture} className="animate-slide-up stagger-2" />
            <TempHumiditySensor data={sensorData.tempHumidity} className="animate-slide-up stagger-3" />
            <PHSensor value={sensorData.ph} className="animate-slide-up stagger-4" />
          </div>
        </div>

        {/* Weather Summary */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <CloudSun className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Weather Summary</h2>
          </div>
          
          {/* Current Weather */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-sky/20 to-primary/10 shadow-md animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Weather</p>
                <p className="text-4xl font-bold text-foreground">
                  {isLoading ? "--" : `${weatherData.current.temp}°C`}
                </p>
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : weatherData.current.condition}
                </p>
                {error && (
                  <p className="text-xs text-destructive mt-1">Unable to load weather</p>
                )}
              </div>
              <Sun className="w-16 h-16 text-sun" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-water" />
                <span className="text-sm text-muted-foreground">
                  Humidity: {weatherData.current.humidity}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-sky" />
                <span className="text-sm text-muted-foreground">
                  Wind: {weatherData.current.wind} km/h
                </span>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up stagger-2">
            <h3 className="font-semibold text-foreground mb-4">3-Day Forecast</h3>
            <div className="space-y-3">
              {weatherData.forecast.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <day.icon className="w-6 h-6 text-primary" />
                    <span className="font-medium text-foreground">{day.day}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">{day.high}°</span>
                    <span className="text-muted-foreground"> / {day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/history" className="block mt-4">
              <Button variant="outline" className="w-full">
                View Weather History
              </Button>
            </Link>
          </div>

          {/* Recent Alert */}
          <div className="p-4 rounded-xl bg-accent/20 border border-accent/30 animate-slide-up stagger-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm">Irrigation Reminder</p>
                <p className="text-sm text-muted-foreground">
                  Schedule watering in next 24 hours
                </p>
                <Link to="/alerts" className="text-sm text-primary font-medium hover:underline">
                  View all alerts →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
