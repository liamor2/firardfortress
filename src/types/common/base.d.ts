import { NumberField, StringField } from "@foundry/src/foundry/common/data/fields.mjs";

// #region Fields

export type CustomStringField<
  Options extends {
    required?: boolean;
    initial?: string;
    choices?: string | readonly string[];
  } = Record<string, never>,
> = StringField<
  {
    required: Options["required"] extends boolean ? Options["required"] : true;
    initial: Options["initial"] extends string ? Options["initial"] : "";
  } & (Options["choices"] extends string ? { choices: Options["choices"] } : Record<string, never>)
>;

export type CustomNumberField<
  Options extends {
    required?: boolean;
    initial?: number;
    min?: number;
    max?: number;
    integer?: boolean;
    positive?: boolean;
    choices?: number[] | readonly number[];
  } = Record<string, never>,
> = NumberField<
  {
    required: Options["required"] extends boolean ? Options["required"] : true;
    initial: Options["initial"] extends number ? Options["initial"] : 0;
    min: Options["min"] extends number ? Options["min"] : undefined;
    max: Options["max"] extends number ? Options["max"] : undefined;
    integer: Options["integer"] extends boolean ? Options["integer"] : false;
    positive: Options["positive"] extends boolean ? Options["positive"] : false;
  } & (Options["choices"] extends number[] | readonly number[]
    ? { choices: Options["choices"] }
    : Record<string, never>)
>;
