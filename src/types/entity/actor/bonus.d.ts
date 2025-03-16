import { ArrayField, SchemaField, BooleanField } from "@foundry/src/foundry/common/data/fields.mjs";
import { CustomStringField, CustomNumberField, StatType } from "@app/types";

export type BonusType = "additive" | "multiplicative" | "override";

export interface BonusStat {
  key: string;
  stats: {
    [K in StatType]?: number;
  };
  label: string;
  duration: number | null;
  source: string;
  isActive: boolean;
  condition?: string;
  type: BonusType;
  priority: number | null;
}

export type SystemBonusField = ArrayField<
  SchemaField<{
    key: CustomStringField;
    label: CustomStringField;
    stats: SchemaField<{
      [Key in StatType]: CustomNumberField<{
        required: false;
      }>;
    }>;
    value: CustomNumberField<{
      integer: true;
    }>;
    duration: CustomNumberField<{
      initial: -1;
      min: -1;
    }>;
    source: CustomStringField;
    isActive: BooleanField<{
      required: true;
      initial: true;
    }>;
    condition: CustomStringField<{ required: false }>;
    type: CustomStringField<{
      initial: "additive";
      choices: ["additive", "multiplicative", "override"];
    }>;
    priority: CustomNumberField<{
      integer: true;
    }>;
  }>
>;
