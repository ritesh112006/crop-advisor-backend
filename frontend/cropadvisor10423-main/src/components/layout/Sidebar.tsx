import { NavLink, useLocation } from "react-router-dom";
import { Home, History, Bell, Lightbulb, MessageCircle, Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", path: "/", icon: Home },
  { title: "History", path: "/history", icon: History },
  { title: "Alerts", path: "/alerts", icon: Bell },
  { title: "Recommendations", path: "/recommendations", icon: Lightbulb },
  { title: "Chatbot", path: "/chatbot", icon: MessageCircle },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar text-sidebar-foreground lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-sidebar text-sidebar-foreground z-50 transition-transform duration-300 flex flex-col",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-sidebar-foreground">
                CropAdvisor
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Smart Farming</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "nav-item",
                  isActive && "active"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="p-4 rounded-lg bg-sidebar-accent">
            <p className="text-sm text-sidebar-foreground/80">
              🌱 Healthy crops start with healthy soil
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
