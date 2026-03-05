import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "accent" | "info";
}

const variantStyles = {
  default: "bg-card border",
  primary: "gradient-primary text-primary-foreground",
  accent: "gradient-gold text-accent-foreground",
  info: "bg-card border",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  accent: "bg-accent-foreground/10 text-accent-foreground",
  info: "bg-info/10 text-info",
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl p-5 shadow-card transition-shadow hover:shadow-card-hover ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={`text-xs font-medium ${variant === "default" || variant === "info" ? "text-muted-foreground" : "opacity-80"}`}>
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className={`text-xs ${variant === "default" || variant === "info" ? "text-muted-foreground" : "opacity-70"}`}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={`text-xs font-medium ${trend.value >= 0 ? "text-success" : "text-destructive"}`}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconVariantStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
