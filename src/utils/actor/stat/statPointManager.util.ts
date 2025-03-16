import { NamedActorData } from "@app/models";

export class StatPointsManager {
  constructor(private readonly actor: NamedActorData) {}

  public calculateMaxPoints(): number {
    return this.actor.level * 10;
  }
}
