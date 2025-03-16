export interface ActorEventMap {
  resourceDepleted: {
    resource: string;
  };
  statChanged: {
    stat: string;
    oldValue: number;
    newValue: number;
  };
  resourceModified: {
    resource: string;
    oldValue: number;
    newValue: number;
    spillover?: number;
  };
  stanceChanged: {
    oldStance: string;
    newStance: string;
  };
  stanceResourcesApplied: {
    stance: string;
    effects: Record<string, number>;
  };
}
