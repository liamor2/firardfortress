import type { NumberField, SchemaField } from "@foundry/src/foundry/common/data/fields.mjs";

interface PointCategorySchema extends DataSchema {
  max: NumberField<{
    required: boolean;
    integer: boolean;
    min: number;
    initial: number;
  }>;
  bonus: NumberField<{
    required: boolean;
    integer: boolean;
    min: number;
    initial: number;
  }>;
  spent: NumberField<{
    required: boolean;
    integer: boolean;
    min: number;
    initial: number;
  }>;
}

export interface PointsSchema extends DataSchema {
  statPoints: SchemaField<PointCategorySchema>;
  resourcePoints: SchemaField<PointCategorySchema>;
  proficiencyPoints: SchemaField<PointCategorySchema>;
}
