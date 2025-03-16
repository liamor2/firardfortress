import { DataField } from "@foundry/src/foundry/common/data/fields.mjs";

declare global {
  namespace ClientSettings {
    interface SettingConfig {
      firardfortressdev: {
        system: string;
        enableAdvanceRolls: boolean;
      };
    }

    interface Values {
      "firardfortressdev.system": string;
      "firardfortressdev.enableAdvanceRolls": boolean;
    }
  }

  interface Game {
    firardfortressdev: {
      config: typeof CONFIG;
    };
  }

  interface DataSchema {
    [key: string]: DataField;
  }

  interface StringFieldOptions {
    required?: boolean;
    initial?: string;
    choices?: string[] | readonly string[];
  }

  interface NumberFieldOptions {
    required?: boolean;
    initial?: number;
    min?: number;
    max?: number;
    integer?: boolean;
    positive?: boolean;
    choices?: number[] | readonly number[];
  }

  interface BooleanFieldOptions {
    required?: boolean;
    initial?: boolean;
  }

  interface ColorFieldOptions {
    required?: boolean;
    initial?: string;
  }
}

export {};

declare module "@app/*";
