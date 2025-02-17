export type ActorEventMap = {
  resourceDepleted: {
    resource: string;
  };
  statChanged: {
    stat: string;
    oldValue: number;
    newValue: number;
  };
  resourceChanged: {
    resource: string;
    oldValue: number;
    newValue: number;
    type: "basic" | "custom";
    spillover?: number;
  };
  stanceChanged: {
    oldStance: string;
    newStance: string;
  };
};
