import { ActorData } from "@app/models";
import { NPCSchema } from "@app/interfaces";

export class NPCData extends ActorData {
  static defineSchema(): NPCSchema {
    return {
      ...super.defineSchema(),
    } as NPCSchema;
  }
}
