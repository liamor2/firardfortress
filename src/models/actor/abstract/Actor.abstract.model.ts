import { AnyObject } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";
import { ActorSchema } from "@app/interfaces";
import {
  BasicResources,
  ResourceModificationOptions,
  ResourceType,
  ActorEventMap,
  StatType,
} from "@app/types";
import { DEFAULT_RESOURCE_METADATA } from "@app/constants";
import { createStatField, createResourceField, createBonusField } from "@app/utils";
// import { RollOptions } from "@app/types/generic/roll/roll.types";

const { SchemaField, StringField, ArrayField } = foundry.data.fields;

/**
 * Abstract base class representing actor data in the game system.
 * @abstract
 * @extends foundry.abstract.TypeDataModel
 */
export abstract class ActorData extends foundry.abstract.TypeDataModel<
  ActorSchema,
  Actor,
  AnyObject,
  AnyObject
> {
  protected _eventHandlers: Map<
    keyof ActorEventMap,
    Set<(data: ActorEventMap[keyof ActorEventMap]) => void>
  > = new Map();

  // #region Static Schema and Migration Methods
  /**
   * Defines the schema structure for actor data.
   * @static
   * @returns {ActorSchema} The schema definition for actor data
   */
  static defineSchema(): ActorSchema {
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
            metadata: DEFAULT_RESOURCE_METADATA.HealthPoints,
          }),
          ManaPoints: createResourceField({
            initial: 10,
            metadata: DEFAULT_RESOURCE_METADATA.ManaPoints,
          }),
          StaminaPoints: createResourceField({
            initial: 10,
            metadata: DEFAULT_RESOURCE_METADATA.StaminaPoints,
          }),
          PhysicalArmor: createResourceField({
            initial: 0,
            metadata: DEFAULT_RESOURCE_METADATA.PhysicalArmor,
          }),
          MagicalArmor: createResourceField({
            initial: 0,
            metadata: DEFAULT_RESOURCE_METADATA.MagicalArmor,
          }),
          ActionPoints: createResourceField({
            initial: 0,
            metadata: DEFAULT_RESOURCE_METADATA.ActionPoints,
          }),
        }),
        custom: new SchemaField({}),
      }),
      bonus: new ArrayField(createBonusField()),
      stance: new StringField({ required: true, initial: "" }),
    };
  }

  /**
   * Migrates old actor data to the new schema format.
   * @static
   * @param {ActorSchema} source - The source data to migrate
   * @returns {ActorSchema} The migrated actor data
   */
  static migrateData(source: ActorSchema): ActorSchema {
    if (!source.resources?.fields) {
      const basicResourcesSchema = new SchemaField({
        HealthPoints: createResourceField({
          initial: 10,
          allowNegative: true,
          metadata: DEFAULT_RESOURCE_METADATA.HealthPoints,
        }),
        ManaPoints: createResourceField({
          initial: 10,
          metadata: DEFAULT_RESOURCE_METADATA.ManaPoints,
        }),
        StaminaPoints: createResourceField({
          initial: 10,
          metadata: DEFAULT_RESOURCE_METADATA.StaminaPoints,
        }),
        PhysicalArmor: createResourceField({
          initial: 0,
          metadata: DEFAULT_RESOURCE_METADATA.PhysicalArmor,
        }),
        MagicalArmor: createResourceField({
          initial: 0,
          metadata: DEFAULT_RESOURCE_METADATA.MagicalArmor,
        }),
        ActionPoints: createResourceField({
          initial: 0,
          metadata: DEFAULT_RESOURCE_METADATA.ActionPoints,
        }),
      });
      source.resources = new SchemaField({
        basic: basicResourcesSchema,
        custom: new SchemaField({}),
      });
    }

    const migrateResource = (
      resources: BasicResources,
      resourceKey: keyof BasicResources["fields"]
    ) => {
      if (resourceKey in source && !(resourceKey in resources.fields)) {
        resources.fields[resourceKey] = source[resourceKey];
      }
    };

    const resources = source.resources.fields.basic as unknown as BasicResources;
    resources.fields = resources.fields ?? {};

    (
      [
        "HealthPoints",
        "ManaPoints",
        "StaminaPoints",
        "PhysicalArmor",
        "MagicalArmor",
        "ActionPoints",
      ] as const
    ).forEach((key) => migrateResource(resources, key));

    return {
      ...source,
      resources: new SchemaField({
        basic: resources as unknown as typeof source.resources.fields.basic,
        custom: new SchemaField({}),
      }),
    };
  }
  // #endregion

  // #region Lifecycle Methods
  /**
   * Prepares derived data for the actor.
   * @override
   */
  prepareDerivedData(): void {
    super.prepareDerivedData();
    (this as ActorData)._recalculateTotalModifier();
    console.log("prepareDerivedData", this);
  }
  // #endregion

  // #region Event Handling Methods
  /**
   * Registers an event handler for a specific actor event.
   * @param {K} event - The event type to listen for
   * @param {(data: ActorEventMap[K]) => void} handler - The callback function to handle the event
   * @example
   * actor.on('resourceDepleted', (data) => {
   *   console.log(`${data.resource} was depleted`);
   * });
   */
  public on<K extends keyof ActorEventMap>(
    event: K,
    handler: (data: ActorEventMap[K]) => void
  ): void {
    if (!this._eventHandlers.has(event)) {
      this._eventHandlers.set(event, new Set());
    }
    const handlers = this._eventHandlers.get(event);
    if (handlers) {
      handlers.add(handler as (data: ActorEventMap[keyof ActorEventMap]) => void);
    }
  }

  /**
   * Emits an event to all registered handlers.
   * @protected
   * @param {K} event - The event type to emit
   * @param {ActorEventMap[K]} data - The event data to pass to handlers
   */
  protected _emitEvent<K extends keyof ActorEventMap>(event: K, data: ActorEventMap[K]): void {
    const handlers = this._eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        (handler as (data: ActorEventMap[K]) => void)(data);
      });
    }
  }
  // #endregion

  // #region Resource Management Methods
  /**
   * Modifies a resource value with various options.
   * @param {ResourceType} resource - The resource to modify (HealthPoints, ManaPoints, StaminaPoints, etc.)
   * @param {number | string} value - The value to set or modify (can be absolute number or relative change like '+5' or '-3')
   * @param {ResourceModificationOptions} [options={}] - Additional options for modification
   * @example
   * actor.modifyResource('HealthPoints', '+5'); // Heals 5 HealthPoints
   * actor.modifyResource('ManaPoints', -3); // Reduces ManaPoints by 3
   * actor.modifyResource('StaminaPoints', 10, { bypass: true }); // Sets StaminaPoints to 10 bypassing validation
   */
  public modifyResource(
    resource: ResourceType,
    value: number | string,
    options: ResourceModificationOptions = {}
  ): void {
    const field = this.resources.basic[resource];
    const currentValue = field.value ?? field.max ?? 0;

    let newValue = this._parseResourceValue(currentValue, value);
    if (!options.bypass) {
      newValue = this._validateResourceValue(resource, newValue, field);
    }

    const { value: modifiedValue, spillover } = this._handleResourceDepletion(resource, newValue);

    const changes = {
      value: modifiedValue,
      temp: options.temp ?? field.temp,
      max: options.max ?? field.max,
      min: options.min ?? field.min,
    };

    if (spillover < 0 && !options.silent) {
      this.modifyResource("HealthPoints", spillover.toString(), { silent: true });
    }

    Object.assign(field, changes);

    if (!options.silent) {
      this._emitEvent("resourceDepleted", { resource });
    }
  }

  /**
   * Parses a resource value from either number or string format.
   * @protected
   * @param {number} current - The current value of the resource
   * @param {number | string} value - The value to parse
   * @returns {number} The parsed value
   * @example
   * this._parseResourceValue(10, '+5'); // Returns 15
   * this._parseResourceValue(10, '-3'); // Returns 7
   */
  protected _parseResourceValue(current: number, value: number | string): number {
    if (typeof value === "string") {
      const match = /^([+-])(\d+)$/.exec(value);
      if (!match) return current;

      const [, operator, numStr] = match;
      const num = parseInt(numStr, 10);
      let result: number;
      if (operator === "-") {
        result = current - num;
      } else if (operator === "+") {
        result = current + num;
      } else {
        result = num;
      }
      return result;
    }
    return value;
  }

  /**
   * Validates a resource value against its minimum and maximum bounds.
   * @protected
   * @param {ResourceType} _resource - The resource type being validated
   * @param {number} value - The value to validate
   * @param {typeof this.resources.basic[ResourceType]} field - The resource field containing validation rules
   * @returns {number} The validated value
   */
  protected _validateResourceValue(
    _resource: ResourceType,
    value: number,
    field: (typeof this.resources.basic)[ResourceType]
  ): number {
    return Math.clamp(value, field.min ?? 0, field.max ?? Number.MAX_SAFE_INTEGER);
  }

  /**
   * Handles resource depletion and spillover effects.
   * @protected
   * @param {ResourceType} resource - The resource being depleted
   * @param {number} value - The new value to handle
   * @returns {{ value: number; spillover: number }} Object containing the final value and any spillover amount
   */
  protected _handleResourceDepletion(
    resource: ResourceType,
    value: number
  ): { value: number; spillover: number } {
    if (value >= 0)
      return {
        value,
        spillover: 0,
      };

    const spillover = resource === "ManaPoints" || resource === "StaminaPoints" ? value : 0;
    return {
      value: resource === "ManaPoints" || resource === "StaminaPoints" ? 0 : value,
      spillover,
    };
  }
  // #endregion

  // #region Roll Management Methods
  // /**
  //  * Performs a roll for the specified stat
  //  * @param {StatType} stat - The stat to roll for
  //  * @param {RollOptions} options - Roll options
  //  * @returns {Promise<Roll>} The resulting roll
  //  * @example
  //  * await actor.roll('STR', { advantage: true, flavor: 'Strength Check' });
  //  */
  // public async roll(stat: StatType, options: RollOptions = {}): Promise<Roll> {
  //   const statField = this.stats[stat as keyof typeof this.stats];
  //   const modifier = statField.mod ?? 0;

  //   const formula = `1d20 + ${modifier}`;
  //   const flavor = options.flavor ?? `${stat} Check`;

  //   return _performRoll(formula, { ...options, flavor });
  // }
  // #endregion

  // #region Stat Management Methods
  /**
   * Modifies a stat value and recalculates its modifier.
   * @param {StatType} stat - The stat to modify
   * @param {number} value - The new value for the stat
   * @example
   * actor.modifyStat('STR', 14); // Sets strength to 14 and recalculates modifier
   */
  public modifyStat(stat: StatType, value: number): void {
    const statField = this.stats[stat as keyof typeof this.stats];
    statField.value = value;
    this._recalculateModifier(stat);
  }

  /**
   * Recalculates the modifier for a given stat.
   * @protected
   * @param {StatType} stat - The stat to recalculate
   */
  protected _recalculateModifier(stat: StatType): void {
    const statField = this.stats[stat as keyof typeof this.stats];
    if (statField.value != null) {
      statField.mod = Math.floor((statField.value - 10) / 2);
    }
  }

  /**
   * Recalculates the total modifier for all stats including bonuses.
   * @protected
   */
  protected _recalculateTotalModifier(): void {
    for (const stat of Object.keys(this.stats) as StatType[]) {
      this._recalculateModifier(stat);

      const bonus = this.getBonusModifier(stat);

      if (bonus !== 0) {
        const statField = this.stats[stat as keyof typeof this.stats];
        statField.totalMod = (statField.mod ?? 0) + bonus;
      }
    }
  }

  /**
   * Gets a stat's modifier for use in roll formulas
   * @param {StatType} stat - The stat to get the modifier for
   * @returns {string} The modifier in a format usable in roll formulas
   */
  public getModifier(stat: StatType): string {
    const statField = this.stats[stat as keyof typeof this.stats];
    const mod = statField.mod ?? 0;
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }
  // #endregion

  // #region Bonus Stat Management Methods
  /**
   * Adds a bonus stat to the actor.
   * @param {BonusStatSchema} bonus - The bonus stat to add
   * @example
   * actor.addBonusStat({ name: 'Strength', value: 2 });
   */
  public addBonusStat(bonus: ActorSchema["bonus"]["element"]): void {
    this.bonus.push({
      ...bonus,
      key: "",
      stats: {} as {
        STR: undefined;
        DEX: undefined;
        CON: undefined;
        INT: undefined;
        WIS: undefined;
        WIL: undefined;
        CHA: undefined;
        LUK: undefined;
        HON: undefined;
      },
      duration: null,
      source: "",
      isActive: undefined,
      condition: undefined,
      type: "additive",
      priority: null,
    });
  }

  /**
   * Removes a bonus stat from the actor.
   * @param {string} key - The key of the bonus stat to remove
   * @example
   * actor.removeBonusStat('Strength');
   */
  public removeBonusStat(key: string): void {
    this.bonus = this.bonus.filter((bonus) => bonus.key !== key);
  }

  /**
   * Updates a bonus stat with new data.
   * @param {string} key - The key of the bonus stat to update
   * @param {Partial<BonusStatSchema>} data - The new data to apply
   * @example
   * actor.updateBonusStat('Strength', { value: 3 });
   */
  public updateBonusStat(key: string, data: Partial<ActorSchema["bonus"]["element"]>): void {
    const bonus = this.bonus.find((b) => b.key === key);
    if (bonus) {
      Object.assign(bonus, data);
    }
  }

  /**
   * Gets the total bonus modifier for a given stat.
   * @param {StatType} stat - The stat to get the total bonus modifier for
   * @returns {number} The total bonus modifier
   */
  public getBonusModifier(stat: StatType): number {
    return this.bonus.reduce((total, bonus) => total + (bonus.stats[stat] ?? 0), 0);
  }
  // #endregion
}
