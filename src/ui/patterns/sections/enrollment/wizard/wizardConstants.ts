import { ShieldCheck, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import type { RiskLevel } from "@/features/enrollment/store/types";

export const POPULAR_LOCATIONS = [
  { name: "Florida", emoji: "☀️" },
  { name: "Arizona", emoji: "🌵" },
  { name: "North Carolina", emoji: "🏔️" },
  { name: "South Carolina", emoji: "🌴" },
] as const;

export type PopularLocation = (typeof POPULAR_LOCATIONS)[number];

export const COMFORT_LEVELS: {
  key: RiskLevel;
  label: string;
  desc: string;
  icon: LucideIcon;
  popular?: boolean;
}[] = [
  { key: "conservative", label: "Conservative", desc: "Low risk, stable growth.", icon: ShieldCheck },
  { key: "balanced", label: "Balanced", desc: "Moderate growth and moderate risk.", icon: Zap, popular: true },
  { key: "growth", label: "Growth", desc: "Higher growth potential with market fluctuations.", icon: TrendingUp },
  { key: "aggressive", label: "Aggressive", desc: "Highest growth potential with higher volatility.", icon: TrendingUp },
];
