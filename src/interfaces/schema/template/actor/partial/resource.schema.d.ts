import type {
  NumberField,
  StringField,
  BooleanField,
  ColorField,
} from "@foundry/src/foundry/common/data/fields.mjs";

export interface ResourceMetadataSchema extends DataSchema {
  label: StringField<{ required: true; initial: string }>;
  icon: StringField<{ required: false; initial: string }>;
  color: ColorField<{ required: false; initial: Color }>;
  stack: BooleanField<{ required: false; initial: boolean }>;
  maxStack: NumberField<{ required: false; initial: number }>;
  recoveryRate: StringField<{ required: true; initial: string }>;
  recoveryPeriod: StringField<{
    required: false;
    initial: "never";
    choices: ["turn", "round", "rest", "never"];
  }>;
}

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
  metadata: SchemaField<ResourceMetadataSchema>;
}
