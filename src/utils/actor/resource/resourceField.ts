import {
  BooleanFieldOptions,
  ColorFieldOptions,
  ResourceFieldOptions,
  ResourceFieldType,
  ResourceNumberFieldOptions,
  ResourceStringFieldOptions,
} from "@app/types";

const { SchemaField, NumberField, StringField, ColorField, BooleanField } = foundry.data.fields;

export class ResourceField extends SchemaField<ResourceFieldType> {
  constructor(options: ResourceFieldOptions) {
    const min = options.allowNegative
      ? (options.min ?? Number.MIN_SAFE_INTEGER)
      : (options.max ?? 0);
    const max = options.max ?? options.initial;

    const createNumberField = (opts: Partial<ResourceNumberFieldOptions> = {}) => {
      return new NumberField({
        required: false,
        nullable: false,
        integer: true,
        label: "",
        hint: "",
        readonly: false,
        gmOnly: false,
        ...opts,
        min: opts.min ?? min,
        max: opts.max,
        initial: (opts.initial ?? options.initial) as number,
      });
    };

    const createStringField = (opts: Partial<ResourceStringFieldOptions> = {}) => {
      return new StringField({
        required: false,
        nullable: false,
        label: "",
        hint: "",
        readonly: false,
        gmOnly: false,
        blank: true,
        trim: true,
        ...opts,
      });
    };

    const createColorField = (opts: Partial<ColorFieldOptions> = {}) => {
      return new ColorField({
        required: false,
        nullable: false,
        label: "",
        hint: "",
        readonly: false,
        gmOnly: false,
        ...opts,
      });
    };

    const createBooleanField = (opts: Partial<BooleanFieldOptions> = {}) => {
      return new BooleanField({
        required: false,
        nullable: false,
        label: "",
        hint: "",
        readonly: false,
        gmOnly: false,
        ...opts,
      });
    };

    super({
      value: createNumberField({ required: true, initial: options.initial }),
      temp: createNumberField({ required: true, initial: 0 }),
      max: createNumberField({ initial: max, max: undefined }),
      min: createNumberField({ initial: min, max: undefined }),
      type: createStringField({ required: true, initial: options.type }),
      metadata: new SchemaField({
        label: createStringField({ initial: options.metadata?.label ?? "" }),
        icon: createStringField({ initial: options.metadata?.icon ?? "" }),
        color: createColorField({ initial: options.metadata?.color ?? "#000000" }),
        stack: createBooleanField({ initial: options.metadata?.stack ?? false }),
        maxStack: createNumberField({ initial: options.metadata?.maxStack ?? 0 }),
        recoveryRate: createStringField({ initial: options.metadata?.recoveryRate ?? "never" }),
        recoveryPeriod: createStringField({
          initial: options.metadata?.recoveryPeriod ?? "never",
          choices: ["turn", "round", "rest", "never"],
        }),
      }),
    });
  }
}
