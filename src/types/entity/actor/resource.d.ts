export type ResourceType =
  | "HealthPoints"
  | "ManaPoints"
  | "StaminaPoints"
  | "PhysicalArmor"
  | "MagicalArmor";
export type ResourceModificationOptions = {
  temp?: number;
  max?: number;
  min?: number;
  bypass?: boolean;
  silent?: boolean;
};

export type ResourceFieldOption = {
  initial: number;
  min?: number;
  max?: number;
  allowNegative?: boolean;
};

export type RecoveryPeriod = "rest" | "turn" | "round" | "never";

export type ResourceMetadata = {
  label: string;
  icon?: string;
  color?: string;
  stack?: boolean;
  maxStack?: number;
  recoveryRate: string;
  recoveryPeriod?: RecoveryPeriod;
};

export type CustomResourceKey = `custom.${string}`;

export type CustomResourceData = {
  key: CustomResourceKey;
  metadata: ResourceMetadata;
} & ResourceFieldOption;

export type ResourceFields = {
  fields: {
    [key: string]: unknown;
  };
};

export type BasicResources = {
  fields: {
    HealthPoints?: number;
    ManaPoints?: number;
    StaminaPoints?: number;
    PhysicalArmor?: number;
    MagicalArmor?: number;
  };
};
