import DashboardLayout from "@/components/layout/DashboardLayout";
import { Bell, AlertTriangle, CheckCircle, Info, X, CloudRain, ThermometerSun, Droplets, Sprout } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCrop } from "@/contexts/CropContext";

interface Alert {
  id: number;
  type: "warning" | "danger" | "success" | "info";
  severity: "Low" | "Medium" | "High";
  title: string;
  message: string;
  action: string;
  time: string;
  read: boolean;
  icon: "rain" | "temp" | "moisture" | "general" | "crop";
}

const Alerts = () => {
  const { t } = useLanguage();
  const { selectedCrop, sensorData, weatherData } = useCrop();

  // Generate logical alerts based on real-time data and selected crop
  const generateAlerts = useMemo((): Alert[] => {
    const alerts: Alert[] = [];
    let alertId = 1;

    // Moisture-based alerts
    if (sensorData.moisture < 40) {
      alerts.push({
        id: alertId++,
        type: "danger",
        severity: "High",
        title: "Low Soil Moisture Alert",
        message: `Soil moisture is critically low at ${sensorData.moisture}%. Crops may experience severe water stress.`,
        action: "Irrigate immediately to prevent crop damage.",
        time: "Just now",
        read: false,
        icon: "moisture",
      });
    } else if (sensorData.moisture < 50) {
      alerts.push({
        id: alertId++,
        type: "warning",
        severity: "Medium",
        title: "Irrigation Required",
        message: `Soil moisture has dropped to ${sensorData.moisture}%. Crops may experience water stress.`,
        action: "Schedule irrigation within next 12 hours.",
        time: "2 hours ago",
        read: false,
        icon: "moisture",
      });
    }

    // Temperature-based alerts
    if (sensorData.temperature > 40) {
      alerts.push({
        id: alertId++,
        type: "danger",
        severity: "High",
        title: "Extreme Heat Warning",
        message: `Temperature is extremely high at ${sensorData.temperature}°C. Heat stress risk for all crops.`,
        action: "Provide shade, increase irrigation, apply mulching immediately.",
        time: "30 minutes ago",
        read: false,
        icon: "temp",
      });
    } else if (sensorData.temperature > 35) {
      alerts.push({
        id: alertId++,
        type: "warning",
        severity: "Medium",
        title: "High Temperature Alert",
        message: `Temperature is ${sensorData.temperature}°C. Some crops may experience heat stress.`,
        action: "Apply mulching and increase irrigation frequency.",
        time: "1 hour ago",
        read: false,
        icon: "temp",
      });
    }

    // Weather-based alerts
    if (weatherData.condition === "rainy" || weatherData.rainfall > 20) {
      alerts.push({
        id: alertId++,
        type: "warning",
        severity: "Medium",
        title: "Heavy Rainfall Expected",
        message: `${weatherData.rainfall}mm rainfall expected. Risk of waterlogging in low-lying areas.`,
        action: "Ensure proper drainage. Avoid sowing today.",
        time: "3 hours ago",
        read: false,
        icon: "rain",
      });
    }

    // pH-based alerts
    if (sensorData.ph < 5.5 || sensorData.ph > 7.5) {
      alerts.push({
        id: alertId++,
        type: "warning",
        severity: "Medium",
        title: "Soil pH Imbalance",
        message: `Soil pH is ${sensorData.ph}, which is ${sensorData.ph < 5.5 ? 'too acidic' : 'too alkaline'} for optimal growth.`,
        action: sensorData.ph < 5.5 ? "Apply lime to increase pH." : "Apply sulfur or organic matter to decrease pH.",
        time: "5 hours ago",
        read: true,
        icon: "general",
      });
    }

    // Crop-specific alerts
    if (selectedCrop) {
      if (selectedCrop.waterNeeds === "High" && sensorData.moisture < 55) {
        alerts.push({
          id: alertId++,
          type: "warning",
          severity: "High",
          title: `${selectedCrop.name} Needs Water`,
          message: `${selectedCrop.name} requires high water levels. Current moisture (${sensorData.moisture}%) is below optimal.`,
          action: `Irrigate immediately. ${selectedCrop.name} needs moisture above 60%.`,
          time: "Just now",
          read: false,
          icon: "crop",
        });
      }

      if (selectedCrop.waterNeeds === "Low" && sensorData.moisture > 70) {
        alerts.push({
          id: alertId++,
          type: "info",
          severity: "Low",
          title: `${selectedCrop.name} - Reduce Watering`,
          message: `${selectedCrop.name} is drought-tolerant. Current moisture (${sensorData.moisture}%) may cause root rot.`,
          action: "Reduce irrigation frequency. Let soil dry between waterings.",
          time: "2 hours ago",
          read: false,
          icon: "crop",
        });
      }

      // NPK alerts for selected crop
      if (sensorData.nitrogen < 50) {
        alerts.push({
          id: alertId++,
          type: "warning",
          severity: "Medium",
          title: `Low Nitrogen for ${selectedCrop.name}`,
          message: `Nitrogen level (${sensorData.nitrogen} mg/kg) is low for optimal ${selectedCrop.name} growth.`,
          action: "Apply urea or nitrogen-rich fertilizer.",
          time: "4 hours ago",
          read: true,
          icon: "crop",
        });
      }
    }

    // Good conditions alert
    if (sensorData.moisture >= 50 && sensorData.moisture <= 70 && 
        sensorData.temperature >= 20 && sensorData.temperature <= 35 &&
        sensorData.ph >= 6 && sensorData.ph <= 7) {
      alerts.push({
        id: alertId++,
        type: "success",
        severity: "Low",
        title: "Optimal Growing Conditions",
        message: "All soil parameters are within optimal range for crop growth.",
        action: "Continue current farming practices.",
        time: "1 day ago",
        read: true,
        icon: "general",
      });
    }

    return alerts;
  }, [sensorData, weatherData, selectedCrop]);

  const [alerts, setAlerts] = useState(generateAlerts);
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const markAsRead = (id: number) => {
    setAlerts(alerts.map((alert) => alert.id === id ? { ...alert, read: true } : alert));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((alert) => ({ ...alert, read: true })));
  };

  const getAlertIcon = (iconType: Alert["icon"]) => {
    switch (iconType) {
      case "rain": return CloudRain;
      case "temp": return ThermometerSun;
      case "moisture": return Droplets;
      case "crop": return Sprout;
      default: return Bell;
    }
  };

  const getAlertStyles = (type: Alert["type"]) => {
    switch (type) {
      case "danger": return { bg: "bg-destructive/10 border-destructive/30", iconBg: "bg-destructive/20", iconColor: "text-destructive" };
      case "warning": return { bg: "bg-accent/20 border-accent", iconBg: "bg-accent/30", iconColor: "text-accent-foreground" };
      case "success": return { bg: "bg-leaf/10 border-leaf/30", iconBg: "bg-leaf/20", iconColor: "text-leaf" };
      case "info": return { bg: "bg-sky/10 border-sky/30", iconBg: "bg-sky/20", iconColor: "text-sky" };
    }
  };

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-accent text-accent-foreground";
      case "Low": return "bg-muted text-muted-foreground";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "unread") return !alert.read;
    if (filter === "high") return alert.severity === "High";
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold text-foreground">
                {selectedCrop ? `${t("selectedCropAlerts")} ${selectedCrop.name}` : t("alertsWarnings")}
              </h1>
              <p className="text-muted-foreground">{t("stayInformed")}</p>
            </div>
          </div>
          {unreadCount > 0 && <Button variant="outline" onClick={markAllAsRead}>{t("markAllRead")}</Button>}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ id: "all", label: t("allAlerts") }, { id: "unread", label: t("unread") }, { id: "high", label: t("highPriority") }].map((tab) => (
          <button key={tab.id} onClick={() => setFilter(tab.id as typeof filter)} className={cn("px-4 py-2 rounded-lg font-medium transition-all", filter === tab.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => {
          const styles = getAlertStyles(alert.type);
          const IconComponent = getAlertIcon(alert.icon);
          return (
            <div key={alert.id} className={cn("p-5 rounded-2xl border-l-4 transition-all duration-300 animate-slide-up opacity-0", styles.bg, !alert.read && "shadow-md")} style={{ animationDelay: `${index * 0.1}s` }} onClick={() => markAsRead(alert.id)}>
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", styles.iconBg)}>
                  <IconComponent className={cn("w-6 h-6", styles.iconColor)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getSeverityColor(alert.severity))}>{alert.severity} Priority</span>
                    {!alert.read && <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full font-medium">New</span>}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{alert.title}</h3>
                  <p className="text-muted-foreground mt-1">{alert.message}</p>
                  <div className="mt-4 p-3 rounded-xl bg-card/50 border border-border">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2"><span className="text-primary">👉</span>{t("suggestedAction")}:</p>
                    <p className="text-sm text-muted-foreground mt-1">{alert.action}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">{alert.time}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }} className="p-2 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
            </div>
          );
        })}
        {filteredAlerts.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle className="w-20 h-20 text-leaf mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground">{t("allClear")}</h3>
            <p className="text-muted-foreground mt-2">{t("noActiveAlerts")}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
