import { StringField, SchemaField, ArrayField } from "@foundry/src/foundry/common/data/fields.mjs";
import { ResourceSchema } from "./partial/resource.schema";
import { StatSchema } from "./partial/stat.schema";
import { BonusStatSchema } from "./partial/bonusStat.schema";
import { ResourceType } from "@app/types/entity/actor/resource";

export interface ActorSchema extends DataSchema {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  stats: SchemaField<{
    STR: SchemaField<StatSchema>;
    DEX: SchemaField<StatSchema>;
    CON: SchemaField<StatSchema>;
    INT: SchemaField<StatSchema>;
    WIS: SchemaField<StatSchema>;
    WIL: SchemaField<StatSchema>;
    CHA: SchemaField<StatSchema>;
    LUK: SchemaField<StatSchema>;
    HON: SchemaField<StatSchema>;
  }>;
  resources: SchemaField<{
    basic: SchemaField<{
      [key in ResourceType]: SchemaField<ResourceSchema>;
    }>;
    custom: SchemaField<{
      [key: string]: SchemaField<ResourceSchema>;
    }>;
  }>;
  bonus: ArrayField<SchemaField<BonusStatSchema>>;
  stance: StringField<{
    required: boolean;
    initial: string;
  }>;
}
