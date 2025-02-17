import { BaseStatType } from "../../types/entity/actor/stat.type";

export const STATS = {
  PHYSICAL: {
    ACTION: "STR" as BaseStatType,
    PRECISION: "DEX" as BaseStatType,
    RESISTANCE: "CON" as BaseStatType,
  },
  MENTAL: {
    ACTION: "INT" as BaseStatType,
    PRECISION: "WIS" as BaseStatType,
    RESISTANCE: "WIL" as BaseStatType,
  },
  SOCIAL: {
    ACTION: "CHA" as BaseStatType,
    PRECISION: "LUK" as BaseStatType,
    RESISTANCE: "HON" as BaseStatType,
  },
} as const;

export const STAT_CHOICES: BaseStatType[] = [
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
