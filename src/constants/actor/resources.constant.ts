import { ResourceType, ResourceMetadata } from "@app/types/entity/actor/resource";

export const RESOURCES = {
  VITALITY: {
    HEALTH: "HP",
    MANA: "MP",
    STAMINA: "SP",
  },
  ARMOR: {
    PHYSICAL: "PA",
    MAGICAL: "MA",
  },
};

export const DEFAULT_RESOURCE_METADATA: Record<ResourceType, ResourceMetadata> = {
  HP: {
    label: "Hit Points",
    icon: "fas fa-heart",
    color: "#ff0000",
    recoveryRate: "1d8 + CON",
    recoveryPeriod: "rest",
  },
  MP: {
    label: "Mana Points",
    icon: "fas fa-star",
    color: "#0000ff",
    recoveryRate: "1d6 + INT",
    recoveryPeriod: "rest",
  },
  SP: {
    label: "Stamina Points",
    icon: "fas fa-bolt",
    color: "#00ff00",
    recoveryRate: "1d6 + CON",
    recoveryPeriod: "rest",
  },
  PA: {
    label: "Physical Actions",
    icon: "fas fa-fist-raised",
    color: "#ffff00",
    recoveryRate: "1",
    recoveryPeriod: "turn",
  },
  MA: {
    label: "Mental Actions",
    icon: "fas fa-brain",
    color: "#ff00ff",
    recoveryRate: "1",
    recoveryPeriod: "turn",
  },
} as const;
