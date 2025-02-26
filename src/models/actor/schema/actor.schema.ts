import { ActorSchema } from "@app/interfaces";
import { DEFAULT_RESOURCE_METADATA } from "@app/constants";
import { createStatField, createResourceField, createBonusField } from "@app/utils";
import { StanceType } from "@app/types";

const { SchemaField, StringField, ArrayField } = foundry.data.fields;

/**
 * Defines the schema structure for actor data.
 * @returns {ActorSchema} The schema definition for actor data
 */
export function defineActorSchema(): ActorSchema {
  return {
    stats: new SchemaField({
      STR: createStatField(),
      DEX: createStatField(),
      CON: createStatField(),
      INT: createStatField(),
      WIS: createStatField(),
      WIL: createStatField(),
      CHA: createStatField(),
      LUK: createStatField(),
      HON: createStatField(),
    }),
    resources: new SchemaField({
      basic: new SchemaField({
        HealthPoints: createResourceField({
          initial: 10,
          allowNegative: true,
          type: "HealthPoints",
          metadata: DEFAULT_RESOURCE_METADATA.HealthPoints,
        }),
        ManaPoints: createResourceField({
          initial: 10,
          type: "ManaPoints",
          metadata: DEFAULT_RESOURCE_METADATA.ManaPoints,
        }),
        StaminaPoints: createResourceField({
          initial: 10,
          type: "StaminaPoints",
          metadata: DEFAULT_RESOURCE_METADATA.StaminaPoints,
        }),
        PhysicalArmor: createResourceField({
          initial: 0,
          type: "PhysicalArmor",
          metadata: DEFAULT_RESOURCE_METADATA.PhysicalArmor,
        }),
        MagicalArmor: createResourceField({
          initial: 0,
          type: "MagicalArmor",
          metadata: DEFAULT_RESOURCE_METADATA.MagicalArmor,
        }),
        ActionPoints: createResourceField({
          initial: 0,
          type: "ActionPoints",
          metadata: DEFAULT_RESOURCE_METADATA.ActionPoints,
        }),
      }),
      custom: new SchemaField({}),
    }),
    bonus: new ArrayField(createBonusField()),
    stance: new StringField({
      required: true,
      initial: "BALANCE",
      choices: [
        "OFFENSIVE",
        "DEFENSIVE",
        "PROWESS",
        "FOCUS",
        "PRESENCE",
        "BALANCE",
        "ELEMENTAL",
      ] as StanceType[],
    }),
  };
}
