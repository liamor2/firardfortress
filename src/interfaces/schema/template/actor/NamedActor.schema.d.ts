import type {
  NumberField,
  StringField,
  SchemaField,
} from "@foundry/src/foundry/common/data/fields.mjs";
import type { ActorSchema } from "./Actor.schema";
import type { DescriptionSchema } from "./partial/description.schema";
import type { PointsSchema } from "./partial/points.schema";

export interface NamedActorSchema extends ActorSchema {
  race: StringField<{
    required: boolean;
    initial: string;
  }>;
  class: StringField<{
    required: boolean;
    initial: string;
  }>;
  level: NumberField<{
    required: boolean;
    integer: boolean;
    min: number;
    initial: number;
  }>;
  speed: SchemaField<{
    base: NumberField<{
      required: boolean;
      integer: boolean;
      min: number;
      initial: number;
    }>;
    total: NumberField<{
      required: boolean;
      integer: boolean;
      min: number;
      initial: number;
    }>;
  }>;
  weight: SchemaField<{
    max: NumberField<{
      required: boolean;
      integer: boolean;
      min: number;
      initial: number;
    }>;
    value: NumberField<{
      required: boolean;
      integer: boolean;
      min: number;
      initial: number;
    }>;
  }>;
  points: SchemaField<PointsSchema>;
  description: SchemaField<DescriptionSchema>;
}
