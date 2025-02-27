export type StatType = "STR" | "DEX" | "CON" | "INT" | "WIS" | "WIL" | "CHA" | "LUK" | "HON";

export type StatGroup = "PHYSICAL" | "MENTAL" | "SOCIAL";

export type StatCategory = "ACTION" | "PRECISION" | "RESISTANCE";

export type StatData = {
  key: StatType;
  group: StatGroup;
  category: StatCategory;
  label: string;
  value: number;
  mod: number;
  totalMod: number;
  max: number;
  min: number;
};

export type StatFieldData = {
  value: number;
  mod: number;
  totalMod: number;
  isMainCastingStat?: boolean;
};

export interface StatPointsConfig {
  maxPoints: number;
  bonusPoints: number;
  spentPoints: number;
}
