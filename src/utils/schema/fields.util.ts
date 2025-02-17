import { ResourceFieldOption, ResourceMetadata, BaseNumberFieldOption } from "@app/types";
import { BonusStatSchema } from "@app/interfaces";
import { STAT_CHOICES } from "@app/constants";

const { SchemaField, NumberField, StringField, ArrayField, ColorField } = foundry.data.fields;

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
  options: ResourceFieldOption & { metadata?: ResourceMetadata }
) => {
  const min = options.allowNegative ? (options.min ?? Number.MIN_SAFE_INTEGER) : (options.min ?? 0);
  const max = options.max ?? options.initial;

  return new SchemaField({
    value: createBaseNumberField({ initial: options.initial, min, max, required: true }),
    temp: createBaseNumberField({ initial: 0, min, max }),
    max: createBaseNumberField({ initial: max, min }),
    min: createBaseNumberField({ initial: min }),
    metadata: new SchemaField({
      label: new StringField({ required: true, initial: options.metadata?.label ?? "" }),
      icon: new StringField({ required: false, initial: options.metadata?.icon ?? "" }),
      color: new ColorField({ required: false, initial: options.metadata?.color ?? "#000000" }),
      stack: new foundry.data.fields.BooleanField({
        required: false,
        initial: options.metadata?.stack ?? false,
      }),
      maxStack: createBaseNumberField({
        initial: options.metadata?.maxStack ?? 0,
        required: false,
      }),
      recoveryRate: new StringField({
        required: true,
        initial: options.metadata?.recoveryRate ?? "never",
      }),
      recoveryPeriod: new StringField({
        required: false,
        initial: options.metadata?.recoveryPeriod ?? "never",
        choices: ["turn", "round", "rest", "never"],
      }),
    }),
  });
};

export const createBonusField = () => {
  const bonusTypes: ["additive", "multiplicative", "override"] = [
    "additive",
    "multiplicative",
    "override",
  ];

  return new SchemaField<BonusStatSchema>({
    key: new StringField({ required: true, initial: "" }),
    stats: new ArrayField(new StringField({ required: true, choices: STAT_CHOICES })),
    value: new NumberField({ required: true, initial: 0 }),
    duration: new NumberField({ required: true, initial: -1, min: -1 }),
    source: new StringField({ required: true, initial: "" }),
    isActive: new foundry.data.fields.BooleanField({ required: true, initial: true }),
    condition: new StringField({ required: false, initial: "" }),
    type: new StringField({ required: true, initial: "additive", choices: bonusTypes }),
    priority: new NumberField({ required: true, initial: 0 }),
  });
};
