import { NamedActorSchema } from "@app/interfaces";
import {
  createTextField,
  createNumericField,
  createHTMLField,
  createPointsField,
} from "@app/utils";
import { defineActorSchema } from "./actor.schema";

const { SchemaField } = foundry.data.fields;

/**
 * Defines the schema structure for named actor data.
 * @returns {NamedActorSchema} The schema definition for named actor data
 */
export function defineNamedActorSchema(): NamedActorSchema {
  return {
    ...defineActorSchema(),
    race: createTextField({}),
    class: createTextField({}),
    level: createNumericField({ initial: 1, min: 1 }),
    speed: new SchemaField({
      base: createNumericField({ initial: 10, min: 0 }),
      total: createNumericField({ initial: 10, min: 0 }),
    }),
    weight: new SchemaField({
      max: createNumericField({ initial: 10, min: 0 }),
      value: createNumericField({ initial: 10, min: 0 }),
    }),
    points: new SchemaField({
      statPoints: createPointsField(),
      resourcePoints: createPointsField(),
      proficiencyPoints: createPointsField(),
    }),
    description: new SchemaField({
      biography: createHTMLField(
        game.i18n?.localize("FI.Actor.initial.Description.Biography") ?? ""
      ),
      notes: createHTMLField(game.i18n?.localize("FI.Actor.initial.Description.Notes") ?? ""),
      appearance: createHTMLField(
        game.i18n?.localize("FI.Actor.initial.Description.Appearance") ?? ""
      ),
      background: createHTMLField(
        game.i18n?.localize("FI.Actor.initial.Description.Background") ?? ""
      ),
      personality: createHTMLField(
        game.i18n?.localize("FI.Actor.initial.Description.Personality") ?? ""
      ),
      alignment: new SchemaField({
        x: createNumericField({ integer: false, initial: 0 }),
        y: createNumericField({ integer: false, initial: 0 }),
      }),
    }),
  };
}
