/// <reference types="@league-of-foundry-developers/foundry-vtt-types" />

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
}

export {};

declare module "@app/*";
