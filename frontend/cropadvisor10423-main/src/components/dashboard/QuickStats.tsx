import { Leaf, AlertTriangle, CheckCircle, Cloud } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatCard = ({ title, value, icon, color, bgColor }: StatCardProps) => (
  <div className={`p-4 rounded-xl ${bgColor} flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

const QuickStats = () => {
  const stats = [
    {
      title: "Crop Health",
      value: "Good",
      icon: <Leaf className="w-6 h-6 text-primary-foreground" />,
      color: "bg-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Alerts",
      value: "2",
      icon: <AlertTriangle className="w-6 h-6 text-accent-foreground" />,
      color: "bg-accent",
      bgColor: "bg-accent/20",
    },
    {
      title: "All Systems",
      value: "Online",
      icon: <CheckCircle className="w-6 h-6 text-primary-foreground" />,
      color: "bg-leaf",
      bgColor: "bg-leaf/10",
    },
    {
      title: "Weather",
      value: "Clear",
      icon: <Cloud className="w-6 h-6 text-primary-foreground" />,
      color: "bg-sky",
      bgColor: "bg-sky/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default QuickStats;
