import {
  BookOpen, GraduationCap, Globe, Heart, Award, BarChart3,
  Star, Users, Shield, Lightbulb, Rocket, Target,
  ClipboardList, FileText, CreditCard, Trophy,
  Calendar, Bell, CheckCircle2, Settings, Home, Mail,
  Phone, MapPin, Clock, Bookmark, Flag, Zap,
  type LucideIcon,
} from "lucide-react";

// ─── Master Icon Registry ───
// When connecting to a backend, store the icon KEY (string) in the database.
// On the frontend, use getIconComponent(key) to resolve it back to a React component.
export const iconRegistry: Record<string, LucideIcon> = {
  BookOpen, GraduationCap, Globe, Heart, Award, BarChart3,
  Star, Users, Shield, Lightbulb, Rocket, Target,
  ClipboardList, FileText, CreditCard, Trophy,
  Calendar, Bell, CheckCircle2, Settings, Home, Mail,
  Phone, MapPin, Clock, Bookmark, Flag, Zap,
};

export const iconKeys = Object.keys(iconRegistry);

export function getIconComponent(key: string): LucideIcon {
  return iconRegistry[key] || Star;
}

// ─── Color Presets ───
// Harmonious bg/text color pairs using design tokens
export const colorPresets = [
  { label: "Hijau Tua", value: "bg-primary/10 text-primary" },
  { label: "Hijau", value: "bg-success/10 text-success" },
  { label: "Oranye", value: "bg-warning/10 text-warning" },
  { label: "Merah", value: "bg-destructive/10 text-destructive" },
  { label: "Biru", value: "bg-info/10 text-info" },
  { label: "Ungu", value: "bg-purple-100 text-purple-600" },
  { label: "Pink", value: "bg-pink-100 text-pink-600" },
  { label: "Teal", value: "bg-teal-100 text-teal-600" },
  { label: "Amber", value: "bg-amber-100 text-amber-600" },
  { label: "Indigo", value: "bg-indigo-100 text-indigo-600" },
];
