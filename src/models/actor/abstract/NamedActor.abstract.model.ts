import { NamedActorSchema } from "@app/interfaces";
import { ActorData } from "@app/models";

const { HTMLField, SchemaField, NumberField, StringField } = foundry.data.fields;

export abstract class NamedActorData extends ActorData {
  static defineSchema(): NamedActorSchema {
    return {
      ...super.defineSchema(),
      race: new StringField({
        required: true,
        initial: "",
      }),
      class: new StringField({
        required: true,
        initial: "",
      }),
      level: new NumberField({
        required: true,
        integer: true,
        min: 1,
        initial: 1,
      }),
      speed: new SchemaField({
        base: new NumberField({
          required: true,
          integer: true,
          min: 0,
          initial: 10,
        }),
      }),
      weight: new SchemaField({
        baseMax: new NumberField({
          required: true,
          integer: true,
          min: 0,
          initial: 10,
        }),
        value: new NumberField({
          required: true,
          integer: true,
          min: 0,
          initial: 10,
        }),
      }),
      description: new SchemaField({
        biography: new HTMLField({
          required: true,
          initial: game.i18n?.localize("FI.Actor.initial.Description.Biography") ?? "",
        }),
        notes: new HTMLField({
          required: true,
          initial: game.i18n?.localize("FI.Actor.initial.Description.Notes") ?? "",
        }),
        appearance: new HTMLField({
          required: true,
          initial: game.i18n?.localize("FI.Actor.initial.Description.Appearance") ?? "",
        }),
        background: new HTMLField({
          required: true,
          initial: game.i18n?.localize("FI.Actor.initial.Description.Background") ?? "",
        }),
        personality: new HTMLField({
          required: true,
          initial: game.i18n?.localize("FI.Actor.initial.Description.Personality") ?? "",
        }),
        alignment: new SchemaField({
          x: new NumberField({
            required: true,
            integer: false,
            initial: 0,
          }),
          y: new NumberField({
            required: true,
            integer: false,
            initial: 0,
          }),
        }),
      }),
    } as NamedActorSchema;
  }
}
