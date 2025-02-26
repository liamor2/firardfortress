import type { DataFieldOptions } from "@league-of-foundry-developers/foundry-vtt-types";

export interface BaseFieldOptions extends DataFieldOptions {
  required?: boolean;
  label?: string;
  hint?: string;
  validationError?: string;
  readonly?: boolean;
  gmOnly?: boolean;
}

export interface TypedFieldOptions<T> extends BaseFieldOptions {
  initial?: T;
  nullable?: boolean;
}

export interface BaseNumberFieldOption {
  required?: boolean;
  integer?: boolean;
  initial: number;
  min?: number;
  max?: number;
}

export interface NumberFieldOptions extends TypedFieldOptions<number> {
  integer?: boolean;
  min?: number;
  max?: number;
}

export interface StringFieldOptions extends TypedFieldOptions<string> {
  choices?: string[];
  blank?: boolean;
  trim?: boolean;
}

export type ColorFieldOptions = TypedFieldOptions<string>;
export type BooleanFieldOptions = TypedFieldOptions<boolean>;
