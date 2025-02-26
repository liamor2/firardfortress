import {
  NumberFieldOptions,
  StringFieldOptions,
  ColorFieldOptions,
  BooleanFieldOptions,
  TypedFieldOptions,
} from "@app/types";
import {
  NumberField,
  StringField,
  SchemaField,
  ColorField,
  BooleanField,
} from "@foundry/src/foundry/common/data/fields.mjs";

interface ResourceNumberFieldOptions extends FieldCreationOptions {
  initial?: number;
  min?: number;
  max?: number;
  integer?: boolean;
}

interface ResourceStringFieldOptions extends FieldCreationOptions {
  initial?: string;
  choices?: string[];
  blank?: boolean;
  trim?: boolean;
}

type ResourceColorFieldOptions = TypedFieldOptions<string>;
type ResourceBooleanFieldOptions = TypedFieldOptions<boolean>;

// Resource Types and Values
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
  value: number | null;
  temp: number | null;
  max: number | null;
  min: number | null;
}

// Metadata Types
export interface ResourceMetadata {
  label: string;
  icon?: string;
  color?: string;
  stack?: boolean;
  maxStack?: number;
  recoveryRate: string;
  recoveryPeriod?: RecoveryPeriod;
}

// Field Definitions
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

// Resource Data Structures
export type NumericFieldOptions = Pick<NumberFieldOptions, "initial" | "min" | "max"> & {
  allowNegative?: boolean;
};

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

// Schema Definitions
export interface ResourceFieldType extends DataSchema {
  value: NumberField<NumberFieldOptions>;
  temp: NumberField<NumberFieldOptions>;
  max: NumberField<NumberFieldOptions>;
  min: NumberField<NumberFieldOptions>;
  type: StringField<StringFieldOptions>;
  metadata: SchemaField<ResourceFieldMetadataSchema>;
}

// Schema Interface
export interface ResourceFieldSchema {
  value: number;
  temp: number;
  max: number;
  min: number;
  type: string;
  metadata: Required<ResourceMetadata>;
}

// Add field creation helper types
export interface FieldCreationOptions {
  required?: boolean;
  nullable?: boolean;
  label?: string;
  hint?: string;
  readonly?: boolean;
  gmOnly?: boolean;
}
