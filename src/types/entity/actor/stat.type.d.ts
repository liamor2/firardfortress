import { SchemaField, BooleanField } from "@foundry/src/foundry/common/data/fields.mjs";
import { CustomNumberField, CustomStringField } from "@app/types";

export type StatType = "STR" | "DEX" | "CON" | "INT" | "WIS" | "WIL" | "CHA" | "LUK" | "HON";

export type StatGroup = "PHYSICAL" | "MENTAL" | "SOCIAL";

export type StatCategory = "ACTION" | "PRECISION" | "RESISTANCE";

export interface StatData {
  key: StatType;
  group: StatGroup;
  category: StatCategory;
  value: number;
  mod: number;
  totalMod: number;
  isMainCastingStat: boolean;
}

export interface StatPointsConfig {
  maxPoints: number;
  bonusPoints: number;
  spentPoints: number;
}

export type SystemSingleStatField = SchemaField<{
  value: CustomNumberField<{
    min: 0;
    max: number;
    integer: true;
  }>;
  mod: CustomNumberField<{
    integer: true;
  }>;
  totalMod: CustomNumberField<{
    integer: true;
  }>;
  key: CustomStringField<{ choices: StatType }>;
  statGroup: CustomStringField<{ choices: StatGroup }>;
  statCategory: CustomStringField<{ choices: StatCategory }>;
  isMainCastingStat: BooleanField<{
    required: true;
    initial: false;
  }>;
}>;

export type SystemBaseActorStatField = SchemaField<{
  [Key in StatType]: SystemSingleStatField;
}>;
