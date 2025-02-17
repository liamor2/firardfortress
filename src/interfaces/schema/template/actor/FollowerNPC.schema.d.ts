import { StringField } from "@foundry/src/foundry/common/data/fields.mjs";
import { NamedActorSchema } from "./NamedActor.schema";

export interface FollowerNPCSchema extends NamedActorSchema {
  PCaffiliation: StringField<{
    required: boolean;
    initial: string;
  }>;
}
