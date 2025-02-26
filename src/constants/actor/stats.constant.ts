import { StatType } from "../../types/entity/actor/stat.type";

export const STATS = {
  PHYSICAL: {
    ACTION: "STR" as StatType,
    PRECISION: "DEX" as StatType,
    RESISTANCE: "CON" as StatType,
  },
  MENTAL: {
    ACTION: "INT" as StatType,
    PRECISION: "WIS" as StatType,
    RESISTANCE: "WIL" as StatType,
  },
  SOCIAL: {
    ACTION: "CHA" as StatType,
    PRECISION: "LUK" as StatType,
    RESISTANCE: "HON" as StatType,
  },
} as const;

export const STAT_CHOICES: StatType[] = [
  "STR",
  "DEX",
  "CON",
  "INT",
  "WIS",
  "WIL",
  "CHA",
  "LUK",
  "HON",
];

export const ALL_STATS = ["STR", "DEX", "CON", "INT", "WIS", "WIL", "CHA", "LUK", "HON"] as const;
export const PHYSICAL_STATS = ["STR", "DEX", "CON"] as const;
export const MENTAL_STATS = ["INT", "WIS", "WIL"] as const;
export const SOCIAL_STATS = ["CHA", "LUK", "HON"] as const;
export const ACTION_STATS = ["STR", "INT", "CHA"] as const;
export const PRECISION_STATS = ["DEX", "WIS", "LUK"] as const;
export const RESISTANCE_STATS = ["CON", "WIL", "HON"] as const;
