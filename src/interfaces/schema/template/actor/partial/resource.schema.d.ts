import type {
  NumberField,
  StringField,
  booleanField,
  ColorField,
} from "@foundry/src/foundry/common/data/fields.mjs";

export interface ResourceSchema extends DataSchema {
  value: NumberField<{
    required: true;
    integer: true;
    min?: number;
    initial: number;
  }>;
  temp: NumberField<{
    required: true;
    integer: true;
    min?: number;
    initial: number;
  }>;
  max: NumberField<{
    required: true;
    integer: true;
    min?: number;
    initial: number;
  }>;
  min: NumberField<{
    required: true;
    integer: true;
    min?: number;
    initial: number;
  }>;
  metadata: SchemaField<{
    label: StringField<{ required: true; initial: string }>;
    icon: StringField<{ required: false; initial: string }>;
    color: ColorField<{ required: false; initial: Color }>;
    stack: booleanField<{ required: false; initial: false }>;
    maxStack: NumberField<{ required: false; initial: 0 }>;
    recoveryRate: StringField<{ required: true; initial: string }>;
    recoveryPeriod: StringField<{
      required: false;
      initial: "never";
      choices: ["turn", "round", "rest", "never"];
    }>;
  }>;
}
