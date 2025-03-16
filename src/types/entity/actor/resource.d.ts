import {
  NumberField,
  StringField,
  SchemaField,
  ColorField,
  BooleanField,
  ArrayField,
} from "@foundry/src/foundry/common/data/fields.mjs";
import { CustomStringField, CustomNumberField } from "@app/types";

export type BaseResourceType =
  | "HealthPoints"
  | "ManaPoints"
  | "StaminaPoints"
  | "PhysicalArmor"
  | "MagicalArmor"
  | "ActionPoints";

export type CustomResourceKey = `custom.${string}`;
export type ResourceType = BaseResourceType | CustomResourceKey;
export type RecoveryPeriod = "rest" | "turn" | "round" | "never";

export interface ResourceValues {
  value: number;
  temp: number;
  max: number;
  min: number;
}

export interface ResourceMetadata {
  label: string;
  icon?: string;
  color?: string;
  stack?: boolean;
  maxStack?: number;
  recoveryRate: string;
  recoveryPeriod?: RecoveryPeriod;
  spilloverThreshold?: number;
  spilloverTarget?: ResourceType;
}

export interface ResourceFieldOptions extends NumberFieldOptions {
  type: ResourceType;
  metadata?: ResourceMetadata;
  allowNegative?: boolean;
}

export interface ResourceFieldMetadataSchema {
  label: StringField<StringFieldOptions>;
  icon: StringField<StringFieldOptions>;
  color: ColorField<ColorFieldOptions>;
  stack: BooleanField<BooleanFieldOptions>;
  maxStack: NumberField<NumberFieldOptions>;
  recoveryRate: StringField<StringFieldOptions>;
  recoveryPeriod: StringField<StringFieldOptions>;
}

export interface ResourceFieldDefaults {
  initialValue?: number;
  initialCurrent?: number;
  initialTemp?: number;
  initialMax?: number;
  initialMin?: number;
  label?: string;
  icon?: string;
  color?: string;
  stack?: boolean;
  maxStack?: number;
  recoveryRate?: string;
  recoveryPeriod?: RecoveryPeriod;
  spilloverThreshold?: number;
  spilloverTarget?: ResourceType;
}

export type ResourceMetadataField<T extends ResourceFieldDefaults = Record<string, never>> =
  SchemaField<{
    label: CustomStringField<{ initial: T["label"] extends string ? T["label"] : "" }>;
    icon: CustomStringField<{
      required: false;
      initial: T["icon"] extends string ? T["icon"] : undefined;
    }>;
    color: ColorField<{
      required: false;
      initial: T["color"] extends string ? T["color"] : "#000000";
    }>;
    stack: SchemaField<
      {
        value: CustomNumberField<{
          integer: true;
          min: 0;
        }>;
        maxStack: CustomNumberField<{
          initial: T["maxStack"] extends number ? T["maxStack"] : 1;
          integer: true;
          min: 1;
        }>;
      },
      { required: false }
    >;
    recovery: SchemaField<
      {
        rate: CustomStringField<{
          initial: T["recoveryRate"] extends string ? T["recoveryRate"] : "1d4";
        }>;
        period: CustomStringField<{
          initial: T["recoveryPeriod"] extends RecoveryPeriod ? T["recoveryPeriod"] : "never";
          choices: RecoveryPeriod;
        }>;
      },
      { required: false }
    >;
    spillover: SchemaField<{
      threshold: CustomNumberField<{
        initial: T["spilloverThreshold"] extends number ? T["spilloverThreshold"] : 0;
        integer: true;
        min: number;
        max: number;
      }>;
      target: CustomStringField<{
        initial: T["spilloverTarget"] extends ResourceType ? T["spilloverTarget"] : "";
        choices: ResourceType[];
      }>;
    }>;
  }>;

export interface NumericFieldOptions extends Pick<NumberFieldOptions, "initial" | "min" | "max"> {
  allowNegative?: boolean;
}

export interface CustomResourceData extends NumericFieldOptions {
  key: CustomResourceKey;
  metadata: ResourceMetadata;
}

export interface ResourceData extends ResourceValues {
  metadata: ResourceMetadata;
  [key: string]: unknown;
}

export interface ResourceModificationOptions extends Partial<ResourceValues> {
  bypass?: boolean;
  silent?: boolean;
}

export type CustomResourceField<T extends ResourceFieldDefaults = Record<string, never>> =
  SchemaField<{
    value: CustomNumberField<{
      initial: T["initialValue"] extends number ? T["initialValue"] : 0;
      min: number;
      max: number;
      integer: true;
    }>;
    current: CustomNumberField<{
      initial: T["initialCurrent"] extends number ? T["initialCurrent"] : 10;
      min: number;
      max: number;
      integer: true;
    }>;
    temp: CustomNumberField<{
      initial: T["initialTemp"] extends number ? T["initialTemp"] : 0;
      min: number;
      max: number;
      integer: true;
    }>;
    max: CustomNumberField<{
      initial: T["initialMax"] extends number ? T["initialMax"] : 10;
      min: 0;
      max: number;
      integer: true;
    }>;
    min: CustomNumberField<{
      initial: T["initialMin"] extends number ? T["initialMin"] : 0;
      min: number;
      max: number;
      integer: true;
    }>;
    metadata: ResourceMetadataField<T>;
  }>;

export interface ResourceFieldType extends DataSchema {
  value: NumberField<NumberFieldOptions>;
  temp: NumberField<NumberFieldOptions>;
  max: NumberField<NumberFieldOptions>;
  min: NumberField<NumberFieldOptions>;
  type: StringField<StringFieldOptions>;
  metadata: SchemaField<ResourceFieldMetadataSchema>;
}

export interface ResourceFieldSchema {
  value: number;
  temp: number;
  max: number;
  min: number;
  type: string;
  metadata: Required<ResourceMetadata>;
}

export type SystemBaseActorResourceField = SchemaField<{
  basic: SchemaField<{
    health: HealthResourceField;
    mana: ManaResourceField;
    stamina: StaminaResourceField;
    physicalArmor: PhysicalArmorResourceField;
    magicalArmor: MagicalArmorResourceField;
    actionPoints: ActionPointsResourceField;
  }>;
  custom: ArrayField<CustomResourceField>;
}>;

export type HealthResourceField = CustomResourceField<{
  initialMax: 10;
  initialCurrent: 10;
  label: "Health Points";
  icon: "fa-duotone fa-solid fa-heart-half-stroke";
  color: "#e53e3e";
  recoveryRate: "1d6";
  recoveryPeriod: "rest";
}>;

export type ManaResourceField = CustomResourceField<{
  initialMax: 10;
  initialCurrent: 10;
  label: "Mana Points";
  icon: "fa-duotone fa-solid fa-fire-flame-curved";
  color: "#3182ce";
  recoveryRate: "1d4";
  recoveryPeriod: "rest";
  spilloverTarget: "HealthPoints";
  spilloverThreshold: 0;
}>;

export type StaminaResourceField = CustomResourceField<{
  initialMax: 10;
  initialCurrent: 10;
  label: "Stamina Points";
  icon: "fa-duotone fa-solid fa-dumbbell";
  color: "#38a169";
  recoveryRate: "1d4";
  recoveryPeriod: "rest";
  spilloverTarget: "HealthPoints";
  spilloverThreshold: 0;
}>;

export type PhysicalArmorResourceField = CustomResourceField<{
  initialMax: 10;
  initialCurrent: 10;
  label: "Physical Armor";
  icon: "fa-duotone fa-solid fa-shield-cross";
  color: "#f6e05e";
  recoveryRate: "1";
  recoveryPeriod: "never";
}>;

export type MagicalArmorResourceField = CustomResourceField<{
  initialMax: 10;
  initialCurrent: 10;
  label: "Magical Armor";
  icon: "fa-duotone fa-solid fa-brain-circuit";
  color: "#d53f8c";
  recoveryRate: "1";
  recoveryPeriod: "never";
}>;

export type ActionPointsResourceField = CustomResourceField<{
  initialMax: 10;
  initialCurrent: 10;
  label: "Action Points";
  icon: "fa-duotone fa-solid fa-hourglass-clock";
  color: "#5a67d8";
  recoveryRate: "3";
  recoveryPeriod: "turn";
}>;

export interface BasicResourcesSchema extends DataSchema {
  HealthPoints: SchemaField<ResourceFieldType>;
  ManaPoints: SchemaField<ResourceFieldType>;
  StaminaPoints: SchemaField<ResourceFieldType>;
  PhysicalArmor: SchemaField<ResourceFieldType>;
  MagicalArmor: SchemaField<ResourceFieldType>;
  ActionPoints: SchemaField<ResourceFieldType>;
}

export interface CustomResourcesSchema extends DataSchema {
  [key: string]: SchemaField<ResourceFieldType>;
}
