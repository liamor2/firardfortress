import type {
  ArrayField,
  StringField,
  NumberField,
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/fields.d.mts";

export interface BonusStatSchema extends DataSchema {
  key: StringField<{
    required: true;
    initial: string;
  }>;
  stats: ArrayField<
    StringField<{
      required: true;
      choices: string[];
    }>
  >;
  value: NumberField<{
    required: true;
    initial: number;
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
