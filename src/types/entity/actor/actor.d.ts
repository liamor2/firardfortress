import { BonusStat } from "./bonus";
import { ResourceData, ResourceType } from "./resource";
import { StanceType } from "./stance";
import { StatData, StatType } from "./stat.type";

export interface ActorDataSource {
  resources: {
    basic: Record<ResourceType, ResourceData>;
  };
  stats: Record<StatType, StatData>;
  bonus: BonusStat[];
  stance: StanceType;
}
