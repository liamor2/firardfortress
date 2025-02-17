import { NamedActorData } from "@app/models";
import { FollowerNPCSchema } from "@app/interfaces";

const { StringField } = foundry.data.fields;

export class FollowerNPCData extends NamedActorData {
  static defineSchema(): FollowerNPCSchema {
    return {
      ...super.defineSchema(),
      PCaffiliation: new StringField({
        required: true,
        initial: "",
      }),
    } as FollowerNPCSchema;
  }
}
