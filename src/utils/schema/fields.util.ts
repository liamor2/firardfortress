import { ResourceMetadata, NumericFieldOptions, ResourceType } from "@app/types";
import { BonusStatSchema } from "@app/interfaces";
import { ResourceField } from "@app/utils";

const { SchemaField, NumberField, StringField, HTMLField } = foundry.data.fields;

export const createBaseNumberField = (options: BaseNumberFieldOption) => {
  return new NumberField({
    required: true,
    integer: true,
    initial: options.initial,
    min: options.min,
    max: options.max,
  });
};

export const createStatField = (initial: number = 10) => {
  return new SchemaField({
    value: createBaseNumberField({ initial }),
    mod: createBaseNumberField({ initial: 0 }),
    totalMod: createBaseNumberField({ initial: 0 }),
  });
};

export const createResourceField = (
  options: NumericFieldOptions & {
    type: ResourceType;
    metadata?: ResourceMetadata;
  }
): ResourceField => {
  return new ResourceField(options);
};

export const createBonusField = () => {
  const bonusTypes: ["additive", "multiplicative", "override"] = [
    "additive",
    "multiplicative",
    "override",
  ];

  return new SchemaField<BonusStatSchema>({
    key: new StringField({ required: true, initial: "" }),
    label: new StringField({ required: true, initial: "" }),
    stats: new SchemaField({
      STR: new NumberField({ required: false, initial: 0 }),
      DEX: new NumberField({ required: false, initial: 0 }),
      CON: new NumberField({ required: false, initial: 0 }),
      INT: new NumberField({ required: false, initial: 0 }),
      WIS: new NumberField({ required: false, initial: 0 }),
      CHA: new NumberField({ required: false, initial: 0 }),
      LUK: new NumberField({ required: false, initial: 0 }),
      SPD: new NumberField({ required: false, initial: 0 }),
      PER: new NumberField({ required: false, initial: 0 }),
    }),
    value: new NumberField({ required: true, initial: 0 }),
    duration: new NumberField({ required: true, initial: -1, min: -1 }),
    source: new StringField({ required: true, initial: "" }),
    isActive: new foundry.data.fields.BooleanField({ required: true, initial: true }),
    condition: new StringField({ required: false, initial: "" }),
    type: new StringField({ required: true, initial: "additive", choices: bonusTypes }),
    priority: new NumberField({ required: true, initial: 0 }),
  });
};

export const createNumericField = (options: {
  required?: boolean;
  integer?: boolean;
  initial?: number;
  min?: number;
  max?: number;
}) => {
  return new NumberField({
    required: options.required ?? true,
    integer: options.integer ?? true,
    initial: options.initial ?? 0,
    min: options.min,
    max: options.max,
  });
};

export const createTextField = (options: {
  required?: boolean;
  initial?: string;
  choices?: string[];
}) => {
  return new StringField({
    required: options.required ?? true,
    initial: options.initial ?? "",
    choices: options.choices,
  });
};

export const createHTMLField = (initial: string = "") => {
  return new HTMLField({
    required: true,
    initial,
  });
};

export const createPointsField = () => {
  return new SchemaField({
    max: createNumericField({ initial: 0, min: 0 }),
    bonus: createNumericField({ initial: 0, min: 0 }),
    spent: createNumericField({ initial: 0, min: 0 }),
  });
};
