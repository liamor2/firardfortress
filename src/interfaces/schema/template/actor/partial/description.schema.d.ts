import type {
  HTMLField,
  NumberField,
  SchemaField,
} from "@foundry/src/foundry/common/data/fields.mjs";

export interface DescriptionSchema extends DataSchema {
  biography: HTMLField<{
    required: true;
    initial: string;
  }>;
  appearance: HTMLField<{
    required: true;
    initial: string;
  }>;
  personality: HTMLField<{
    required: true;
    initial: string;
  }>;
  background: HTMLField<{
    required: true;
    initial: string;
  }>;
  notes: HTMLField<{
    required: true;
    initial: string;
  }>;
  alignment: SchemaField<{
    x: NumberField<{
      required: true;
      integer: false;
      initial: number;
    }>;
    y: NumberField<{
      required: true;
      integer: false;
      initial: number;
    }>;
  }>;
}
