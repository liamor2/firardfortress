import type { NumberField } from "@foundry/src/foundry/common/data/fields.mjs";

export interface StatSchema extends DataSchema {
  value: NumberField<{
    required: boolean;
    integer: boolean;
    min?: number;
    max?: number;
    initial: number;
  }>;
  mod: NumberField<{
    required: boolean;
    integer: boolean;
    initial: number;
  }>;
  totalMod: NumberField<{
    required: boolean;
    integer: boolean;
    initial: number;
  }>;
}
