import type { StringField } from "@foundry/foundry/common/data/fields.mjs";
import { NamedActorSchema } from "./NamedActor.schema";

export interface PCSchema extends NamedActorSchema {
  guild: StringField<{
    required: boolean;
    initial: string;
  }>;
  playerName: StringField<{
    required: boolean;
    initial: string;
  }>;
}
