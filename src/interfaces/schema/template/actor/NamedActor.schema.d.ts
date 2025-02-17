import type {
  NumberField,
  StringField,
  SchemaField,
} from "@foundry/src/foundry/common/data/fields.mjs";
import type { ActorSchema } from "./Actor.schema";
import type { DescriptionSchema } from "./partial/description.schema";
import { DescriptionSchema } from "./partial/description.schema";

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
  }>;
  weight: SchemaField<{
    baseMax: NumberField<{
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
  description: SchemaField<DescriptionSchema>;
}
