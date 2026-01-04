import { Sun, CloudRain } from "lucide-react";

interface WelcomeHeaderProps {
  farmName?: string;
}

const WelcomeHeader = ({ farmName = "Green Valley Farm" }: WelcomeHeaderProps) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good Morning" : currentHour < 17 ? "Good Afternoon" : "Good Evening";

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-foreground mb-2">
            {greeting}, Farmer! 🌾
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening at <span className="font-medium text-primary">{farmName}</span>{" "}
            today.
          </p>
          <p className="text-sm text-muted-foreground mt-1">{currentDate}</p>
        </div>

        {/* Weather widget */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-sky/20 to-sun/20 border border-sky/20">
          <Sun className="w-10 h-10 text-sun animate-pulse-slow" />
          <div>
            <p className="text-2xl font-semibold text-foreground">28°C</p>
            <p className="text-sm text-muted-foreground">Sunny • 65% Humidity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
