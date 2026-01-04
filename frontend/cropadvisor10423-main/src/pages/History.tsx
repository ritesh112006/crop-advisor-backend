import DashboardLayout from "@/components/layout/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar } from "recharts";
import { CloudSun, TrendingUp, Droplets, ThermometerSun, AlertTriangle, Sprout, FlaskConical, Leaf } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// Weather data
const weeklyWeatherData = [
  { date: "Mon", temperature: 30, humidity: 55, rainfall: 0 },
  { date: "Tue", temperature: 32, humidity: 52, rainfall: 0 },
  { date: "Wed", temperature: 28, humidity: 68, rainfall: 15 },
  { date: "Thu", temperature: 26, humidity: 75, rainfall: 25 },
  { date: "Fri", temperature: 29, humidity: 60, rainfall: 5 },
  { date: "Sat", temperature: 31, humidity: 58, rainfall: 0 },
  { date: "Sun", temperature: 33, humidity: 50, rainfall: 0 },
];

const monthlyWeatherData = [
  { month: "Jan", avgTemp: 22, rainfall: 15, humidity: 65 },
  { month: "Feb", avgTemp: 25, rainfall: 10, humidity: 58 },
  { month: "Mar", avgTemp: 30, rainfall: 5, humidity: 50 },
  { month: "Apr", avgTemp: 35, rainfall: 8, humidity: 45 },
  { month: "May", avgTemp: 38, rainfall: 20, humidity: 55 },
  { month: "Jun", avgTemp: 35, rainfall: 120, humidity: 75 },
  { month: "Jul", avgTemp: 32, rainfall: 280, humidity: 85 },
  { month: "Aug", avgTemp: 30, rainfall: 250, humidity: 88 },
  { month: "Sep", avgTemp: 29, rainfall: 150, humidity: 80 },
  { month: "Oct", avgTemp: 28, rainfall: 80, humidity: 70 },
  { month: "Nov", avgTemp: 25, rainfall: 25, humidity: 65 },
  { month: "Dec", avgTemp: 22, rainfall: 10, humidity: 62 },
];

// Sensor data history
const weeklySensorData = [
  { date: "Mon", nitrogen: 60, phosphorus: 42, potassium: 78, moisture: 52, ph: 6.4 },
  { date: "Tue", nitrogen: 62, phosphorus: 44, potassium: 79, moisture: 48, ph: 6.5 },
  { date: "Wed", nitrogen: 65, phosphorus: 45, potassium: 80, moisture: 58, ph: 6.5 },
  { date: "Thu", nitrogen: 63, phosphorus: 46, potassium: 82, moisture: 62, ph: 6.6 },
  { date: "Fri", nitrogen: 64, phosphorus: 44, potassium: 81, moisture: 55, ph: 6.5 },
  { date: "Sat", nitrogen: 66, phosphorus: 45, potassium: 80, moisture: 53, ph: 6.4 },
  { date: "Sun", nitrogen: 65, phosphorus: 45, potassium: 80, moisture: 55, ph: 6.5 },
];

const monthlySensorData = [
  { month: "Jan", nitrogen: 55, phosphorus: 40, potassium: 75, moisture: 45, ph: 6.3 },
  { month: "Feb", nitrogen: 58, phosphorus: 42, potassium: 76, moisture: 42, ph: 6.4 },
  { month: "Mar", nitrogen: 60, phosphorus: 43, potassium: 78, moisture: 38, ph: 6.5 },
  { month: "Apr", nitrogen: 62, phosphorus: 44, potassium: 79, moisture: 35, ph: 6.5 },
  { month: "May", nitrogen: 63, phosphorus: 45, potassium: 80, moisture: 40, ph: 6.4 },
  { month: "Jun", nitrogen: 65, phosphorus: 46, potassium: 82, moisture: 55, ph: 6.6 },
  { month: "Jul", nitrogen: 68, phosphorus: 48, potassium: 85, moisture: 65, ph: 6.7 },
  { month: "Aug", nitrogen: 70, phosphorus: 50, potassium: 88, moisture: 68, ph: 6.8 },
  { month: "Sep", nitrogen: 67, phosphorus: 47, potassium: 84, moisture: 60, ph: 6.6 },
  { month: "Oct", nitrogen: 65, phosphorus: 45, potassium: 80, moisture: 55, ph: 6.5 },
  { month: "Nov", nitrogen: 62, phosphorus: 44, potassium: 78, moisture: 50, ph: 6.4 },
  { month: "Dec", nitrogen: 58, phosphorus: 42, potassium: 76, moisture: 48, ph: 6.3 },
];

const seasonalData = [
  { season: "Summer", avgTemp: 36, rainfall: 33, insight: "Hot and dry, irrigation essential" },
  { season: "Monsoon", avgTemp: 30, rainfall: 680, insight: "Heavy rainfall, watch for waterlogging" },
  { season: "Autumn", avgTemp: 27, rainfall: 255, insight: "Moderate conditions, good for planting" },
  { season: "Winter", avgTemp: 23, rainfall: 35, insight: "Cool weather, ideal for rabi crops" },
];

const insights = [
  { type: "info", message: "Rainfall was below average last month", icon: Droplets },
  { type: "warning", message: "Temperature trending 2°C above seasonal average", icon: ThermometerSun },
  { type: "info", message: "Humidity levels favorable for current crop stage", icon: CloudSun },
];

const History = () => {
  const { t } = useLanguage();
  const [dataType, setDataType] = useState<"weather" | "sensors">("weather");
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "seasonal">("weekly");

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-sky/20 flex items-center justify-center">
            <CloudSun className="w-6 h-6 text-sky" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">
              {t("weatherSensorHistory")}
            </h1>
            <p className="text-muted-foreground">
              {t("understandTrends")}
            </p>
          </div>
        </div>
      </div>

      {/* Data Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setDataType("weather")}
          className={cn(
            "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
            dataType === "weather"
              ? "bg-sky text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <CloudSun className="w-5 h-5" />
          {t("weather")}
        </button>
        <button
          onClick={() => setDataType("sensors")}
          className={cn(
            "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
            dataType === "sensors"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Sprout className="w-5 h-5" />
          {t("sensors")}
        </button>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-xl flex items-start gap-3 animate-slide-up opacity-0",
              insight.type === "warning" 
                ? "bg-accent/20 border border-accent/30" 
                : "bg-sky/10 border border-sky/20"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <insight.icon className={cn(
              "w-5 h-5 mt-0.5",
              insight.type === "warning" ? "text-accent-foreground" : "text-sky"
            )} />
            <p className="text-sm text-foreground">{insight.message}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "weekly", label: t("weekly") },
          { id: "monthly", label: t("monthly") },
          { id: "seasonal", label: t("seasonal") },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Weather Data Views */}
      {dataType === "weather" && (
        <>
          {/* Weekly View */}
          {activeTab === "weekly" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0">
                <div className="flex items-center gap-2 mb-6">
                  <ThermometerSun className="w-5 h-5 text-sun" />
                  <h2 className="text-xl font-semibold text-foreground">Temperature & Humidity - This Week</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyWeatherData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="hsl(var(--sun-yellow))" strokeWidth={3} name="Temperature (°C)" />
                      <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="hsl(var(--water-blue))" strokeWidth={3} name="Humidity (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0 stagger-1">
                <div className="flex items-center gap-2 mb-6">
                  <Droplets className="w-5 h-5 text-water" />
                  <h2 className="text-xl font-semibold text-foreground">Rainfall - This Week</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyWeatherData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Bar dataKey="rainfall" fill="hsl(var(--water-blue))" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Monthly View */}
          {activeTab === "monthly" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Monthly Weather Trends</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyWeatherData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="avgTemp" stroke="hsl(var(--sun-yellow))" fill="hsl(var(--sun-yellow) / 0.2)" name="Avg Temperature (°C)" />
                      <Area yAxisId="right" type="monotone" dataKey="rainfall" stroke="hsl(var(--water-blue))" fill="hsl(var(--water-blue) / 0.2)" name="Rainfall (mm)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Seasonal View */}
          {activeTab === "seasonal" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {seasonalData.map((season, index) => (
                  <div key={season.season} className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0" style={{ animationDelay: `${index * 0.1}s` }}>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{season.season}</h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Avg Temp</span>
                        <span className="font-semibold text-foreground">{season.avgTemp}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Rainfall</span>
                        <span className="font-semibold text-foreground">{season.rainfall}mm</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm text-foreground">💡 {season.insight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Sensor Data Views */}
      {dataType === "sensors" && (
        <>
          {activeTab === "weekly" && (
            <div className="space-y-6">
              {/* NPK Chart */}
              <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0">
                <div className="flex items-center gap-2 mb-6">
                  <Sprout className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">NPK Levels - This Week</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklySensorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Legend />
                      <Line type="monotone" dataKey="nitrogen" stroke="#4ade80" strokeWidth={3} name="Nitrogen (mg/kg)" />
                      <Line type="monotone" dataKey="phosphorus" stroke="#f97316" strokeWidth={3} name="Phosphorus (mg/kg)" />
                      <Line type="monotone" dataKey="potassium" stroke="#a855f7" strokeWidth={3} name="Potassium (mg/kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Moisture & pH Chart */}
              <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0 stagger-1">
                <div className="flex items-center gap-2 mb-6">
                  <Droplets className="w-5 h-5 text-water" />
                  <h2 className="text-xl font-semibold text-foreground">Moisture & pH - This Week</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklySensorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="right" orientation="right" domain={[5, 8]} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="moisture" stroke="hsl(var(--water-blue))" strokeWidth={3} name="Moisture (%)" />
                      <Line yAxisId="right" type="monotone" dataKey="ph" stroke="#ef4444" strokeWidth={3} name="pH Level" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "monthly" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Monthly Sensor Trends</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySensorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Legend />
                      <Area type="monotone" dataKey="nitrogen" stroke="#4ade80" fill="#4ade80" fillOpacity={0.2} name="Nitrogen" />
                      <Area type="monotone" dataKey="moisture" stroke="hsl(var(--water-blue))" fill="hsl(var(--water-blue))" fillOpacity={0.2} name="Moisture" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: "Avg Nitrogen", value: "63 mg/kg", icon: Leaf, color: "text-green-500" },
                  { label: "Avg Phosphorus", value: "45 mg/kg", icon: FlaskConical, color: "text-orange-500" },
                  { label: "Avg Potassium", value: "80 mg/kg", icon: Sprout, color: "text-purple-500" },
                  { label: "Avg Moisture", value: "52%", icon: Droplets, color: "text-blue-500" },
                ].map((stat, index) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-card shadow-sm animate-slide-up opacity-0" style={{ animationDelay: `${index * 0.1}s` }}>
                    <stat.icon className={cn("w-6 h-6 mb-2", stat.color)} />
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "seasonal" && (
            <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0">
              <h2 className="text-xl font-semibold text-foreground mb-6">Seasonal Sensor Analysis</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { season: "Summer", nitrogen: "Low", moisture: "Very Low", recommendation: "Increase irrigation and add nitrogen fertilizer" },
                  { season: "Monsoon", nitrogen: "High", moisture: "High", recommendation: "Good growing conditions, monitor for waterlogging" },
                  { season: "Autumn", nitrogen: "Medium", moisture: "Medium", recommendation: "Ideal for planting rabi crops" },
                  { season: "Winter", nitrogen: "Medium", moisture: "Low", recommendation: "Reduce watering, focus on cold-resistant crops" },
                ].map((data, index) => (
                  <div key={data.season} className="p-4 rounded-xl bg-muted/50 animate-slide-up opacity-0" style={{ animationDelay: `${index * 0.1}s` }}>
                    <h3 className="font-semibold text-foreground mb-3">{data.season}</h3>
                    <div className="space-y-2 text-sm mb-3">
                      <p className="text-muted-foreground">Nitrogen: <span className="text-foreground font-medium">{data.nitrogen}</span></p>
                      <p className="text-muted-foreground">Moisture: <span className="text-foreground font-medium">{data.moisture}</span></p>
                    </div>
                    <p className="text-xs text-primary bg-primary/10 p-2 rounded-lg">💡 {data.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default History;
