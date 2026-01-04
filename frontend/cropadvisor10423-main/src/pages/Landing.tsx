import { Link } from "react-router-dom";
import { 
  Leaf, 
  Sprout, 
  CloudSun, 
  Bell, 
  MessageCircle, 
  ArrowRight,
  Droplets,
  ThermometerSun,
  FlaskConical,
  ChevronDown,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, languages } from "@/contexts/LanguageContext";

const Landing = () => {
  const { language, setLanguage, t } = useLanguage();

  const features = [
    {
      icon: Sprout,
      title: t("aiCropRecommendation"),
      description: t("aiCropRecommendationDesc"),
    },
    {
      icon: CloudSun,
      title: t("realTimeWeather"),
      description: t("realTimeWeatherDesc"),
    },
    {
      icon: Bell,
      title: t("smartAlerts"),
      description: t("smartAlertsDesc"),
    },
    {
      icon: MessageCircle,
      title: t("multilingualChatbot"),
      description: t("multilingualChatbotDesc"),
    },
  ];

  const howItWorks = [
    {
      step: "1",
      icon: FlaskConical,
      title: t("soilAnalysis"),
      description: t("soilAnalysisDesc"),
    },
    {
      step: "2",
      icon: CloudSun,
      title: t("weatherData"),
      description: t("weatherDataDesc"),
    },
    {
      step: "3",
      icon: Sprout,
      title: t("aiProcessing"),
      description: t("aiProcessingDesc"),
    },
    {
      step: "4",
      icon: Leaf,
      title: t("recommendation"),
      description: t("recommendationDesc"),
    },
  ];

  const sensors = [
    { icon: Sprout, title: t("npkSensor"), desc: t("npkSensorDesc") },
    { icon: Droplets, title: t("moistureSensor"), desc: t("moistureSensorDesc") },
    { icon: ThermometerSun, title: t("dhtSensor"), desc: t("dhtSensorDesc") },
    { icon: FlaskConical, title: t("phSensor"), desc: t("phSensorDesc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">
                CropAdvisor
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as typeof language)}
                  className="bg-transparent text-foreground text-sm border-none focus:ring-0 cursor-pointer"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <nav className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("features")}
                </a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("howItWorks")}
                </a>
                <Link to="/dashboard">
                  <Button variant="default" size="lg">
                    {t("viewDashboard")}
                  </Button>
                </Link>
              </nav>
              <Link to="/dashboard" className="md:hidden">
                <Button size="sm">{t("dashboard")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
              <Sprout className="w-4 h-4" />
              <span className="text-sm font-medium">{t("smartFarming")}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 animate-fade-in">
              {t("heroTitle")}
              <span className="block text-primary">{t("heroTitleSub")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
              {t("heroDescription")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link to="/recommendations">
                <Button size="lg" className="text-lg px-8 py-6 gap-2">
                  {t("getRecommendation")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  {t("viewDashboard")}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="flex justify-center mt-16 animate-bounce">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className="w-8 h-8" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              {t("keyFeatures")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("keyFeaturesDesc")}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-card shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              {t("howItWorksTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("howItWorksDesc")}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div
                key={item.title}
                className="relative text-center animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground mb-4">
                  <item.icon className="w-8 h-8" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sensor Overview */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {t("iotIntegration")}
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {t("iotIntegrationDesc")}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sensors.map((sensor, index) => (
              <div
                key={sensor.title}
                className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-center animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <sensor.icon className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{sensor.title}</h3>
                <p className="text-sm text-primary-foreground/80">{sensor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              {t("readyToOptimize")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("readyToOptimizeDesc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/recommendations">
                <Button size="lg" className="text-lg px-8 py-6 gap-2">
                  {t("getStartedNow")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t("talkToAI")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-serif font-semibold text-foreground">CropAdvisor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Smart Crop Advisor System • AI & IoT Powered Agriculture
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
