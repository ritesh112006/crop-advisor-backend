import { NavLink } from "react-router-dom";
import { History, Bell, Lightbulb, MessageCircle, Leaf, LayoutDashboard, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { useCrop } from "@/contexts/CropContext";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { selectedCrop } = useCrop();

  const navItems = [
    { title: t("dashboard"), path: "/dashboard", icon: LayoutDashboard },
    { title: t("history"), path: "/history", icon: History },
    { title: t("alerts"), path: "/alerts", icon: Bell },
    { title: t("recommendations"), path: "/recommendations", icon: Lightbulb },
    { title: t("chatbot"), path: "/chatbot", icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg font-semibold text-foreground">
                CropAdvisor
              </h1>
              {selectedCrop ? (
                <p className="text-xs text-primary flex items-center gap-1">
                  {selectedCrop.imageEmoji} {selectedCrop.name}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Smart Farming</p>
              )}
            </div>
          </NavLink>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "text-muted-foreground hover:text-foreground hover:bg-muted",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center gap-1 overflow-x-auto ml-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-center p-2.5 rounded-lg transition-all duration-200",
                    "text-muted-foreground hover:text-foreground hover:bg-muted",
                    isActive && "bg-primary text-primary-foreground"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
