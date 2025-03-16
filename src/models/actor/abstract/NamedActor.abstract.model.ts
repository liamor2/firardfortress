import { NamedActorSchema } from "@app/interfaces";
import { ActorData } from "@app/models";
import { defineNamedActorSchema } from "../schema/namedActor.schema";

export abstract class NamedActorData extends ActorData {
  static defineSchema(): NamedActorSchema {
    return defineNamedActorSchema();
  }
}
