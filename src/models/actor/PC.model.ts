import { NamedActorData } from "@app/models";
import { PCSchema } from "@app/interfaces";

const { StringField } = foundry.data.fields;

export class PCData extends NamedActorData {
  static defineSchema(): PCSchema {
    const schema = super.defineSchema();
    return {
      ...schema,
      guild: new StringField({
        required: true,
        initial: "",
      }),
      playerName: new StringField({
        required: true,
        initial: "",
      }),
    };
  }
}
