import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Sprout, 
  Leaf, 
  Calendar, 
  TrendingUp, 
  Droplets,
  ThermometerSun,
  FlaskConical,
  Check,
  ArrowRight,
  MessageCircle,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCrop, SelectedCrop } from "@/contexts/CropContext";

interface SoilType {
  id: string;
  nameKey: string;
  descKey: string;
}

const soilTypes: SoilType[] = [
  { id: "black", nameKey: "blackSoil", descKey: "blackSoilDesc" },
  { id: "red", nameKey: "redSoil", descKey: "redSoilDesc" },
  { id: "alluvial", nameKey: "alluvialSoil", descKey: "alluvialSoilDesc" },
  { id: "clay", nameKey: "claySoil", descKey: "claySoilDesc" },
  { id: "sandy", nameKey: "sandySoil", descKey: "sandySoilDesc" },
  { id: "loamy", nameKey: "loamySoil", descKey: "loamySoilDesc" },
  { id: "laterite", nameKey: "lateriteSoil", descKey: "lateriteSoilDesc" },
];

interface CropRecommendation {
  id: number;
  name: string;
  matchScore: number;
  yieldRange: string;
  sowingTime: string;
  harvestTime: string;
  waterNeeds: "Low" | "Medium" | "High";
  fertilizerTips: string;
  imageEmoji: string;
}

const getCropRecommendations = (soilType: string): CropRecommendation[] => {
  const recommendations: Record<string, CropRecommendation[]> = {
    black: [
      { id: 1, name: "Cotton", matchScore: 96, yieldRange: "2-3 tons/hectare", sowingTime: "April-May", harvestTime: "October-December", waterNeeds: "Medium", fertilizerTips: "Apply NPK 60:30:30 kg/ha. Black soil retains moisture well.", imageEmoji: "☁️" },
      { id: 2, name: "Soybean", matchScore: 92, yieldRange: "1.5-2.5 tons/hectare", sowingTime: "June-July", harvestTime: "October-November", waterNeeds: "Medium", fertilizerTips: "Nitrogen fixation reduces fertilizer needs. Apply phosphorus.", imageEmoji: "🫘" },
      { id: 3, name: "Sugarcane", matchScore: 88, yieldRange: "70-100 tons/hectare", sowingTime: "February-March", harvestTime: "December-February", waterNeeds: "High", fertilizerTips: "Heavy nitrogen feeder. Apply in splits.", imageEmoji: "🎋" },
      { id: 4, name: "Wheat", matchScore: 85, yieldRange: "3-5 tons/hectare", sowingTime: "October-November", harvestTime: "March-April", waterNeeds: "Medium", fertilizerTips: "Apply urea in 3 splits during growth stages.", imageEmoji: "🌾" },
    ],
    red: [
      { id: 1, name: "Groundnut", matchScore: 95, yieldRange: "1.5-2.5 tons/hectare", sowingTime: "June-July", harvestTime: "October-November", waterNeeds: "Low", fertilizerTips: "Apply gypsum at flowering. Red soil drains well.", imageEmoji: "🥜" },
      { id: 2, name: "Millets (Ragi)", matchScore: 92, yieldRange: "2-3 tons/hectare", sowingTime: "July-August", harvestTime: "November-December", waterNeeds: "Low", fertilizerTips: "Minimal fertilizer needed. Drought resistant.", imageEmoji: "🌾" },
      { id: 3, name: "Tobacco", matchScore: 87, yieldRange: "1.5-2 tons/hectare", sowingTime: "August-September", harvestTime: "January-February", waterNeeds: "Medium", fertilizerTips: "Potassium-rich fertilizers improve quality.", imageEmoji: "🍃" },
      { id: 4, name: "Pulses (Pigeon Pea)", matchScore: 84, yieldRange: "1-1.5 tons/hectare", sowingTime: "June-July", harvestTime: "December-January", waterNeeds: "Low", fertilizerTips: "Fixes nitrogen, needs minimal input.", imageEmoji: "🫛" },
    ],
    alluvial: [
      { id: 1, name: "Rice (Paddy)", matchScore: 97, yieldRange: "4-6 tons/hectare", sowingTime: "June-July", harvestTime: "October-November", waterNeeds: "High", fertilizerTips: "Apply NPK 100:50:50 kg/ha. Alluvial soil is highly fertile.", imageEmoji: "🌾" },
      { id: 2, name: "Wheat", matchScore: 94, yieldRange: "4-5 tons/hectare", sowingTime: "October-November", harvestTime: "March-April", waterNeeds: "Medium", fertilizerTips: "Apply nitrogen in 3 splits for best results.", imageEmoji: "🌾" },
      { id: 3, name: "Sugarcane", matchScore: 90, yieldRange: "80-120 tons/hectare", sowingTime: "February-March", harvestTime: "December-February", waterNeeds: "High", fertilizerTips: "Heavy feeder. Regular irrigation essential.", imageEmoji: "🎋" },
      { id: 4, name: "Maize (Corn)", matchScore: 87, yieldRange: "6-8 tons/hectare", sowingTime: "June-July", harvestTime: "September-October", waterNeeds: "Medium", fertilizerTips: "High nitrogen at knee height stage.", imageEmoji: "🌽" },
    ],
    clay: [
      { id: 1, name: "Rice (Paddy)", matchScore: 95, yieldRange: "4-6 tons/hectare", sowingTime: "June-July", harvestTime: "October-November", waterNeeds: "High", fertilizerTips: "Clay retains water well. Apply NPK 100:50:50.", imageEmoji: "🌾" },
      { id: 2, name: "Wheat", matchScore: 88, yieldRange: "3-5 tons/hectare", sowingTime: "October-November", harvestTime: "March-April", waterNeeds: "Medium", fertilizerTips: "Apply urea in 3 splits.", imageEmoji: "🌾" },
      { id: 3, name: "Cabbage", matchScore: 82, yieldRange: "25-35 tons/hectare", sowingTime: "August-September", harvestTime: "December-January", waterNeeds: "Medium", fertilizerTips: "Add compost before planting.", imageEmoji: "🥬" },
      { id: 4, name: "Broccoli", matchScore: 78, yieldRange: "8-12 tons/hectare", sowingTime: "July-August", harvestTime: "October-November", waterNeeds: "Medium", fertilizerTips: "High nitrogen requirement.", imageEmoji: "🥦" },
    ],
    sandy: [
      { id: 1, name: "Groundnut", matchScore: 94, yieldRange: "1.5-2.5 tons/hectare", sowingTime: "June-July", harvestTime: "October-November", waterNeeds: "Low", fertilizerTips: "Apply gypsum at flowering.", imageEmoji: "🥜" },
      { id: 2, name: "Carrot", matchScore: 90, yieldRange: "20-30 tons/hectare", sowingTime: "October-November", harvestTime: "January-February", waterNeeds: "Medium", fertilizerTips: "Avoid fresh manure.", imageEmoji: "🥕" },
      { id: 3, name: "Watermelon", matchScore: 85, yieldRange: "30-50 tons/hectare", sowingTime: "February-March", harvestTime: "May-June", waterNeeds: "Medium", fertilizerTips: "Increase potassium for sweetness.", imageEmoji: "🍉" },
      { id: 4, name: "Pearl Millet", matchScore: 80, yieldRange: "2-3 tons/hectare", sowingTime: "June-July", harvestTime: "September-October", waterNeeds: "Low", fertilizerTips: "Minimal fertilizer needed.", imageEmoji: "🌾" },
    ],
    loamy: [
      { id: 1, name: "Tomato", matchScore: 96, yieldRange: "40-60 tons/hectare", sowingTime: "September-October", harvestTime: "January-March", waterNeeds: "Medium", fertilizerTips: "Apply calcium to prevent blossom end rot.", imageEmoji: "🍅" },
      { id: 2, name: "Maize (Corn)", matchScore: 92, yieldRange: "5-8 tons/hectare", sowingTime: "June-July", harvestTime: "September-October", waterNeeds: "Medium", fertilizerTips: "High nitrogen at knee height.", imageEmoji: "🌽" },
      { id: 3, name: "Potato", matchScore: 89, yieldRange: "20-30 tons/hectare", sowingTime: "October-November", harvestTime: "February-March", waterNeeds: "Medium", fertilizerTips: "Apply potassium for tuber growth.", imageEmoji: "🥔" },
      { id: 4, name: "Onion", matchScore: 85, yieldRange: "25-35 tons/hectare", sowingTime: "October-November", harvestTime: "April-May", waterNeeds: "Medium", fertilizerTips: "Sulfur improves flavor and storage.", imageEmoji: "🧅" },
    ],
    laterite: [
      { id: 1, name: "Cashew", matchScore: 93, yieldRange: "1-2 tons/hectare", sowingTime: "June-July", harvestTime: "March-May", waterNeeds: "Low", fertilizerTips: "Tolerates acidic laterite soil well.", imageEmoji: "🥜" },
      { id: 2, name: "Tea", matchScore: 89, yieldRange: "2-3 tons/hectare", sowingTime: "June-July", harvestTime: "Year-round", waterNeeds: "Medium", fertilizerTips: "Prefers acidic soil. Apply nitrogen regularly.", imageEmoji: "🍵" },
      { id: 3, name: "Coffee", matchScore: 86, yieldRange: "1-2 tons/hectare", sowingTime: "June-July", harvestTime: "November-February", waterNeeds: "Medium", fertilizerTips: "Shade-grown. Apply organic compost.", imageEmoji: "☕" },
      { id: 4, name: "Rubber", matchScore: 82, yieldRange: "1.5-2 tons/hectare", sowingTime: "June-July", harvestTime: "Year-round (after 7 years)", waterNeeds: "High", fertilizerTips: "Potassium-rich fertilizers for latex production.", imageEmoji: "🌳" },
    ],
  };
  return recommendations[soilType] || recommendations.loamy;
};

const Recommendations = () => {
  const { t } = useLanguage();
  const { selectedCrop, setSelectedCrop, sensorData } = useCrop();
  const [selectedSoil, setSelectedSoil] = useState<string>("");
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleGetRecommendation = () => {
    if (!selectedSoil) return;
    setRecommendations(getCropRecommendations(selectedSoil));
    setShowResults(true);
  };

  const handleSelectCrop = (crop: CropRecommendation) => {
    setSelectedCrop(crop);
  };

  const handleChangeCrop = () => {
    setSelectedCrop(null);
    setShowResults(false);
    setSelectedSoil("");
  };

  const getWaterNeedsColor = (needs: string) => {
    switch (needs) {
      case "Low": return "text-leaf bg-leaf/10";
      case "Medium": return "text-water bg-water/10";
      case "High": return "text-sky bg-sky/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  // If a crop is already selected, show crop management view
  if (selectedCrop) {
    return (
      <DashboardLayout>
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-4xl">
                {selectedCrop.imageEmoji}
              </div>
              <div>
                <p className="text-sm text-primary font-medium">{t("cropSelected")}</p>
                <h1 className="text-3xl font-serif font-semibold text-foreground">
                  {selectedCrop.name}
                </h1>
                <p className="text-muted-foreground">
                  {t("manageYourCrop")}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleChangeCrop} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {t("changeCrop")}
            </Button>
          </div>
        </div>

        {/* Crop-specific recommendations */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Watering Schedule */}
          <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-water/20 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-water" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">{t("wateringSchedule")}</h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Current Moisture</p>
                <p className="text-2xl font-bold text-foreground">{sensorData.moisture}%</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full",
                      sensorData.moisture < 40 ? "bg-destructive" : sensorData.moisture < 60 ? "bg-accent" : "bg-leaf"
                    )}
                    style={{ width: `${sensorData.moisture}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-foreground">
                  {selectedCrop.waterNeeds === "High" 
                    ? `💧 ${selectedCrop.name} requires frequent watering. Irrigate every 2-3 days.`
                    : selectedCrop.waterNeeds === "Medium"
                    ? `💧 ${selectedCrop.name} needs moderate watering. Irrigate every 4-5 days.`
                    : `💧 ${selectedCrop.name} is drought-tolerant. Irrigate weekly or when moisture drops below 35%.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Fertilizer Schedule */}
          <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0 stagger-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-leaf/20 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-leaf" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">{t("fertilizerSchedule")}</h2>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-green-500/10 text-center">
                  <p className="text-xs text-muted-foreground">N</p>
                  <p className="font-bold text-green-600">{sensorData.nitrogen}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 text-center">
                  <p className="text-xs text-muted-foreground">P</p>
                  <p className="font-bold text-orange-600">{sensorData.phosphorus}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 text-center">
                  <p className="text-xs text-muted-foreground">K</p>
                  <p className="font-bold text-purple-600">{sensorData.potassium}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-foreground">💡 {selectedCrop.fertilizerTips}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Crop Details */}
        <div className="p-6 rounded-2xl bg-card shadow-md animate-slide-up opacity-0 stagger-2">
          <h2 className="text-xl font-semibold text-foreground mb-4">Crop Details</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                {t("expectedYield")}
              </div>
              <p className="font-semibold text-foreground">{selectedCrop.yieldRange}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Calendar className="w-4 h-4" />
                {t("bestSowing")}
              </div>
              <p className="font-semibold text-foreground">{selectedCrop.sowingTime}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Calendar className="w-4 h-4" />
                {t("harvestTime")}
              </div>
              <p className="font-semibold text-foreground">{selectedCrop.harvestTime}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Droplets className="w-4 h-4" />
                {t("waterNeeds")}
              </div>
              <span className={cn("font-semibold px-2 py-0.5 rounded-full text-sm", getWaterNeedsColor(selectedCrop.waterNeeds))}>
                {selectedCrop.waterNeeds}
              </span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t("needMoreHelp")}
              </h3>
              <p className="text-muted-foreground">
                {t("needMoreHelpDesc")}
              </p>
            </div>
            <Link to="/chatbot">
              <Button size="lg" className="gap-2 whitespace-nowrap">
                <MessageCircle className="w-5 h-5" />
                {t("talkToAI")}
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sprout className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">
              {t("aiCropRecommendations")}
            </h1>
            <p className="text-muted-foreground">
              {t("getPersonalizedAdvice")}
            </p>
          </div>
        </div>
      </div>

      {/* Current Sensor Readings */}
      <div className="p-6 rounded-2xl bg-card shadow-md mb-8 animate-slide-up opacity-0">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {t("currentSensorReadings")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { label: "Nitrogen", value: `${sensorData.nitrogen} mg/kg`, icon: Sprout, color: "text-green-500" },
            { label: "Phosphorus", value: `${sensorData.phosphorus} mg/kg`, icon: Leaf, color: "text-orange-500" },
            { label: "Potassium", value: `${sensorData.potassium} mg/kg`, icon: Leaf, color: "text-purple-500" },
            { label: "Moisture", value: `${sensorData.moisture}%`, icon: Droplets, color: "text-water" },
            { label: "Temperature", value: `${sensorData.temperature}°C`, icon: ThermometerSun, color: "text-sun" },
            { label: "Humidity", value: `${sensorData.humidity}%`, icon: Droplets, color: "text-sky" },
            { label: "pH Level", value: sensorData.ph.toString(), icon: FlaskConical, color: "text-red-500" },
          ].map((reading) => (
            <div key={reading.label} className="p-3 rounded-xl bg-muted/50 text-center">
              <reading.icon className={cn("w-5 h-5 mx-auto mb-1", reading.color)} />
              <p className="text-xs text-muted-foreground">{reading.label}</p>
              <p className="font-semibold text-foreground">{reading.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Soil Type Selection */}
      <div className="p-6 rounded-2xl bg-card shadow-md mb-8 animate-slide-up opacity-0 stagger-1">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t("selectSoilType")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          {soilTypes.map((soil) => (
            <button
              key={soil.id}
              onClick={() => setSelectedSoil(soil.id)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                selectedSoil === soil.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-muted/30"
              )}
            >
              <p className="font-semibold text-foreground text-sm">{t(soil.nameKey)}</p>
              <p className="text-xs text-muted-foreground mt-1">{t(soil.descKey)}</p>
              {selectedSoil === soil.id && (
                <div className="mt-2 flex items-center gap-1 text-primary text-xs">
                  <Check className="w-3 h-3" />
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>
        <Button
          onClick={handleGetRecommendation}
          disabled={!selectedSoil}
          className="gap-2"
          size="lg"
        >
          {t("getAIRecommendations")}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Recommendations Results */}
      {showResults && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              {t("top4Crops")}
            </h2>
            <Link to="/chatbot">
              <Button variant="outline" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                {t("askAIDetails")}
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((crop, index) => (
              <div
                key={crop.id}
                className="p-6 rounded-2xl bg-card shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{crop.imageEmoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        #{index + 1} Match
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-leaf/10 text-leaf font-medium">
                        {crop.matchScore}% Compatible
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{crop.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <TrendingUp className="w-4 h-4" />
                      {t("expectedYield")}
                    </div>
                    <p className="font-semibold text-foreground">{crop.yieldRange}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <Droplets className="w-4 h-4" />
                      {t("waterNeeds")}
                    </div>
                    <span className={cn("font-semibold px-2 py-0.5 rounded-full text-sm", getWaterNeedsColor(crop.waterNeeds))}>
                      {crop.waterNeeds}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{t("bestSowing")}:</span>
                    <span className="font-medium text-foreground">{crop.sowingTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-leaf" />
                    <span className="text-muted-foreground">{t("harvestTime")}:</span>
                    <span className="font-medium text-foreground">{crop.harvestTime}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground mb-1">💡 {t("fertilizerTip")}</p>
                    <p className="text-foreground">{crop.fertilizerTips}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSelectCrop(crop)}
                  className="w-full gap-2"
                  variant="default"
                >
                  <Check className="w-4 h-4" />
                  {t("selectThisCrop")}
                </Button>
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("needMoreHelp")}
                </h3>
                <p className="text-muted-foreground">
                  {t("needMoreHelpDesc")}
                </p>
              </div>
              <Link to="/chatbot">
                <Button size="lg" className="gap-2 whitespace-nowrap">
                  <MessageCircle className="w-5 h-5" />
                  {t("talkToAI")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Recommendations;
