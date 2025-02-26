import { BonusStat } from "@app/types";
import {
  ALL_STATS,
  MENTAL_STATS,
  PHYSICAL_STATS,
  SOCIAL_STATS,
  ACTION_STATS,
  RESISTANCE_STATS,
} from "./stats.constant";

const createStance = (
  label: string,
  stats: Record<string, number>,
  priority: number = 0
): BonusStat => ({
  stats,
  key: "stance",
  label,
  duration: 0,
  source: "",
  isActive: false,
  type: "additive",
  priority,
});

export const STANCES_BONUSES: Record<string, BonusStat> = {
  Offensive: createStance("Offensive", {
    ...Object.fromEntries(ACTION_STATS.map((stat) => [stat, 1])),
    ...Object.fromEntries(RESISTANCE_STATS.map((stat) => [stat, -1])),
  }),

  Defensive: createStance("Defensive", {
    ...Object.fromEntries(RESISTANCE_STATS.map((stat) => [stat, 1])),
    ...Object.fromEntries(ACTION_STATS.map((stat) => [stat, -1])),
  }),

  Prowess: createStance("Prowess", {
    ...Object.fromEntries(PHYSICAL_STATS.map((stat) => [stat, 2])),
    ...Object.fromEntries([...MENTAL_STATS, ...SOCIAL_STATS].map((stat) => [stat, -1])),
  }),

  Focus: createStance("Focus", {
    ...Object.fromEntries(MENTAL_STATS.map((stat) => [stat, 2])),
    ...Object.fromEntries([...PHYSICAL_STATS, ...SOCIAL_STATS].map((stat) => [stat, -1])),
  }),

  Presence: createStance("Presence", {
    ...Object.fromEntries(SOCIAL_STATS.map((stat) => [stat, 2])),
    ...Object.fromEntries([...PHYSICAL_STATS, ...MENTAL_STATS].map((stat) => [stat, -1])),
  }),

  Balance: createStance("Balance", {
    ...Object.fromEntries(ALL_STATS.map((stat) => [stat, 0])),
  }),

  Elemental: createStance("Elemental", {
    ...Object.fromEntries(ALL_STATS.map((stat) => [stat, 2])),
  }),
};
