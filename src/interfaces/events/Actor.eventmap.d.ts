import type { ActorEventMap } from "../../types/entity/actor/Actor.eventmap";

export interface IActorEventEmitter {
  emit<K extends keyof ActorEventMap>(event: K, data: ActorEventMap[K]): boolean;
  on<K extends keyof ActorEventMap>(event: K, callback: (data: ActorEventMap[K]) => void): this;
  off<K extends keyof ActorEventMap>(event: K, callback: (data: ActorEventMap[K]) => void): this;
}
