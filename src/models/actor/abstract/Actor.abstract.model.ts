import { AnyObject } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";
import { ActorSchema } from "@app/interfaces";
import {
  ResourceModificationOptions,
  ResourceType,
  ActorEventMap,
  StatType,
  BonusStat,
  CustomResourceKey,
  ResourceData,
  StanceType,
} from "@app/types";
import { defineActorSchema } from "@app/models";
import { ResourceManager, StatManager, BonusManager, StanceManager } from "@app/utils";

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

  private readonly resourceManager: ResourceManager;
  private readonly statManager: StatManager;
  private readonly bonusManager: BonusManager;
  private readonly stanceManager: StanceManager;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(...args: any[]) {
    super(...args);
    this.resourceManager = new ResourceManager(this);
    this.statManager = new StatManager(this);
    this.bonusManager = new BonusManager(this);
    this.stanceManager = new StanceManager(this);
  }

  // #region Static Schema and Migration Methods
  /**
   * Defines the schema structure for actor data.
   * @static
   * @returns {ActorSchema} The schema definition for actor data
   */
  static defineSchema(): ActorSchema {
    return defineActorSchema();
  }

  /**
   * Migrates old actor data to the new schema format.
   * @static
   * @param {ActorSchema} source - The source data to migrate
   * @returns {ActorSchema} The migrated actor data
   */
  // static migrateData(source: ActorSchema): ActorSchema {
  // }

  // #endregion

  // #region Lifecycle Methods
  /**
   * Prepares derived data for the actor.
   * @override
   */
  prepareDerivedData(): void {
    super.prepareDerivedData();
    this.statManager.recalculateTotalModifier();
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
   * @public
   * @param {K} event - The event type to emit
   * @param {ActorEventMap[K]} data - The event data to pass to handlers
   */
  public _emitEvent<K extends keyof ActorEventMap>(event: K, data: ActorEventMap[K]): void {
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
    this.resourceManager.modifyResource(resource, value, options);
  }

  /**
   * Gets a resource's current data
   * @param resource - The resource to retrieve
   * @returns The resource data or undefined if not found
   */
  public getResource(resource: ResourceType) {
    return this.resourceManager.getResource(resource);
  }

  /**
   * Adds a new custom resource to the actor
   * @param key - The custom resource key
   * @param data - The resource data to add
   * @throws {Error} If the resource already exists or trying to add a base resource
   */
  public addResource(key: CustomResourceKey, data: ResourceData): void {
    this.resourceManager.addResource(key, data);
  }

  /**
   * Deletes a custom resource from the actor
   * @param resource - The resource to delete
   * @throws {Error} If trying to delete a base resource
   */
  public deleteResource(resource: ResourceType): void {
    this.resourceManager.deleteResource(resource);
  }
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
    this.statManager.modifyStat(stat, value);
  }

  /**
   * Gets a stat's modifier for use in roll formulas
   * @param {StatType} stat - The stat to get the modifier for
   * @returns {string} The modifier in a format usable in roll formulas
   */
  public getModifier(stat: StatType): string {
    return this.statManager.getModifier(stat);
  }

  /**
   * Gets the total modifier for a stat including base modifier and all bonuses
   * @param {StatType} stat - The stat to get the total modifier for
   * @returns {number} The total modifier value
   * @example
   * const totalMod = actor.getTotalModifier('STR'); // Gets total strength modifier
   */
  public getTotalModifier(stat: StatType): number {
    const statField = this.statManager.getStat(stat);
    return statField.totalMod;
  }

  /**
   * Gets the current main casting stat
   * @returns The stat type that is set as main casting stat, or undefined if none is set
   */
  public get mainCastingStat(): StatType | undefined {
    return this.statManager.getMainCastingStat();
  }

  /**
   * Sets the main casting stat
   * @param stat - The stat to set as main casting stat
   */
  public set mainCastingStat(stat: StatType) {
    this.statManager.setMainCastingStat(stat);
  }
  // #endregion

  // #region Bonus Management Methods
  /**
   * Adds a bonus stat to the actor's bonus manager.
   * @param bonus - The bonus stat to be added to the actor.
   * @example
   * actor.addBonusStat({
   *   key: 'magicRing',
   *   stats: { INT: 2, WIS: 1 },
   *   label: 'Ring of Magic',
   *   duration: -1, // permanent
   *   source: 'item',
   *   isActive: true,
   *   type: 'additive',
   *   priority: 1
   * });
   */
  public addBonusStat(bonus: BonusStat): void {
    this.bonusManager.addBonus(bonus);
  }

  /**
   * Removes a bonus stat from the actor's bonus manager using the specified key.
   * @param key - The unique identifier of the bonus stat to remove.
   * @example
   * actor.removeBonusStat('magicRing');
   */
  public removeBonusStat(key: string): void {
    this.bonusManager.removeBonus(key);
  }

  /**
   * Updates a bonus stat in the bonus manager with the provided key and data.
   * @param key - The unique identifier for the bonus stat to update.
   * @param data - Partial data of BonusStat type to update the existing bonus stat with.
   * @throws {Error} If the bonus stat with the given key does not exist in the bonus manager.
   * @example
   * actor.updateBonusStat('magicRing', { stats: { INT: 3 } });
   */
  public updateBonusStat(key: string, data: Partial<BonusStat>): void {
    this.bonusManager.updateBonus(key, data);
  }

  /**
   * Retrieves the total bonus modifier value for a specified stat.
   *
   * @param {StatType} stat - The type of stat to calculate the bonus modifier for
   * @returns {number} The total calculated bonus modifier value for the specified stat
   * @example
   * const totalBonus = actor.getBonusModifier('STR');
   */
  public getBonusModifier(stat: StatType): number {
    return this.bonusManager.calculateTotalModifier(stat);
  }
  // #endregion

  // #region Stance Management Methods

  /**
   * Sets the actor's current stance.
   * @param {StanceType} stance - The new stance to set
   */
  public setStance(stance: StanceType): void {
    this.stanceManager.setStance(stance);
  }

  /**
   * Gets the actor's current stance.
   * @returns {StanceType} The current stance
   */
  public getCurrentStance(): StanceType {
    return this.stanceManager.getCurrentStance();
  }
  // #endregion
}
