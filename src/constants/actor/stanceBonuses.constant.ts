import { BonusStat } from "@app/types";

export const STANCES_BONUSES: Record<string, BonusStat> = {
  Offensive: {
    stats: {
      STR: 1,
      INT: 1,
      CHA: 1,
      CON: -1,
      WIL: -1,
      HON: -1,
    },
    key: "stance",
    label: "Offensive",
    duration: 0,
    source: "",
    isActive: false,
    type: "additive",
    priority: 0,
  },
};
