export type BonusType = "additive" | "multiplicative" | "override";

export type BonusStat = {
  key: string;
  stats: {
    [K in StatType]?: number;
  };
  label: string;
  duration: number | null;
  source: string;
  isActive: boolean;
  condition?: string;
  type: BonusType;
  priority: number | null;
};
