export type BonusType = "additive" | "multiplicative" | "override";

export type BonusStat = {
  key: string;
  stats: {
    [K in BaseStatType]?: number;
  };
  label: string;
  duration: number;
  source: string;
  isActive: boolean;
  condition?: string;
  type: BonusType;
  priority: number;
};
