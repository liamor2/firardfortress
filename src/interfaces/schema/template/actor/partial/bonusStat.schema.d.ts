import type {
  StringField,
  NumberField,
  SchemaField,
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/fields.d.mts";

import type { BaseStatType } from "@app/types";

export interface BonusStatSchema extends DataSchema {
  key: StringField<{
    required: true;
    initial: string;
  }>;
  label: StringField<{
    required: true;
    initial: string;
  }>;
  stats: SchemaField<{
    [K in BaseStatType]?: NumberField<{ required: false; initial: 0 }>;
  }>;
  duration: NumberField<{
    required: true;
    initial: number;
    min: -1;
  }>;
  source: StringField<{
    required: true;
    initial: string;
  }>;
  isActive: booleanField<{
    required: true;
    initial: true;
  }>;
  condition: StringField<{
    required: false;
    initial: "";
  }>;
  type: StringField<{
    required: true;
    initial: "additive";
    choices: ["additive", "multiplicative", "override"];
  }>;
  priority: NumberField<{
    required: true;
    initial: 0;
  }>;
}
