import { ActorData } from "@app/models";
import {
  ResourceType,
  ResourceModificationOptions,
  BaseResourceType,
  CustomResourceKey,
  ResourceData,
} from "@app/types";

export class ResourceManager {
  private readonly baseResources: Set<BaseResourceType>;

  constructor(private readonly actor: ActorData) {
    this.baseResources = new Set([
      "HealthPoints",
      "ManaPoints",
      "StaminaPoints",
      "PhysicalArmor",
      "MagicalArmor",
      "ActionPoints",
    ]);
  }

  /**
   * Gets a resource's current data
   * @param resource - The resource to retrieve
   * @returns The resource data or undefined if not found
   */
  public getResource(resource: ResourceType): ResourceData | undefined {
    return this.isCustomResource(resource)
      ? this.actor.resources.custom[resource]
      : this.actor.resources.basic[resource as BaseResourceType];
  }

  /**
   * Adds a new custom resource to the actor
   * @param key - The custom resource key
   * @param data - The resource data to add
   * @throws {Error} If the resource already exists or trying to add a base resource
   */
  public addResource(key: CustomResourceKey, data: ResourceData): void {
    if (this.isBaseResource(key)) {
      throw new Error("Cannot add base resources");
    }

    if (this.getResource(key)) {
      throw new Error(`Resource ${key} already exists`);
    }

    const schemaData = {
      value: data.value ?? 0,
      temp: data.temp ?? 0,
      max: data.max ?? null,
      min: data.min ?? null,
      metadata: {
        label: data.metadata.label,
        icon: data.metadata.icon ?? "",
        color: data.metadata.color ?? "",
        stack: data.metadata.stack ?? false,
        maxStack: data.metadata.maxStack ?? 0,
        recoveryRate: data.metadata.recoveryRate,
        recoveryPeriod: data.metadata.recoveryPeriod ?? "never",
      },
    };

    this.actor.updateSource({
      [`resources.custom.${key}`]: schemaData,
    });
  }

  /**
   * Deletes a custom resource from the actor
   * @param resource - The resource to delete
   * @throws {Error} If trying to delete a base resource
   */
  public deleteResource(resource: ResourceType): void {
    if (this.isBaseResource(resource)) {
      throw new Error("Cannot delete base resources");
    }

    delete this.actor.resources.custom[resource as CustomResourceKey];
  }

  /**
   * Modifies a specific resource value for the actor while handling validation and spillover effects.
   *
   * @param resource - The type of resource to modify (e.g., "HealthPoints")
   * @param value - The value to modify the resource by. Can be a number or a string representation
   * @param options - Optional configuration object for the resource modification
   * @param options.bypass - If true, skips resource value validation
   * @param options.silent - If true, prevents triggering related events and spillover effects
   * @param options.temp - Optional temporary value to set
   * @param options.max - Optional maximum value to set
   * @param options.min - Optional minimum value to set
   * @throws {Error} May throw an error during resource validation
   */
  private applyResourceChanges(
    field: ResourceData,
    value: number,
    options: ResourceModificationOptions
  ): Partial<ResourceData> {
    return {
      value: value,
      temp: options.temp ?? field.temp,
      max: options.max ?? field.max,
      min: options.min ?? field.min,
    };
  }

  private handleSpillover(spillover: number, options: ResourceModificationOptions): void {
    if (spillover < 0 && !options.silent) {
      this.modifyResource("HealthPoints", spillover.toString(), { silent: true });
    }
  }

  private emitModificationEvent(
    resource: ResourceType,
    currentValue: number,
    newValue: number,
    spillover: number
  ): void {
    this.actor._emitEvent("resourceModified", {
      resource: resource as string,
      oldValue: currentValue,
      newValue,
      spillover,
    });
  }

  /**
   * Modifies a specific resource value while handling validation, depletion, and spillover effects.
   *
   * @param resource - The type of resource to modify
   * @param value - The value to modify the resource by. Can be a number or a string expression (e.g. "+5", "-3")
   * @param options - Configuration options for resource modification
   * @param options.bypass - If true, skips validation of the new value
   * @param options.silent - If true, prevents emission of modification events
   * @throws {Error} When the specified resource is not found
   * @remarks
   * The method performs the following steps:
   * 1. Retrieves the resource field
   * 2. Parses and validates the new value
   * 3. Handles resource depletion and spillover effects
   * 4. Applies changes to the resource
   * 5. Emits modification events (unless silent)
   */
  public modifyResource(
    resource: ResourceType,
    value: number | string,
    options: ResourceModificationOptions = {}
  ): void {
    const field = this.getResource(resource);
    if (!field) {
      throw new Error(`Resource ${resource} not found`);
    }

    const currentValue = field.value ?? field.max ?? 0;
    let newValue = this.parseResourceValue(currentValue, value);

    if (!options.bypass) {
      newValue = this.validateResourceValue(resource, newValue, field);
    }

    const { value: modifiedValue, spillover } = this.handleResourceDepletion(resource, newValue);

    Object.assign(field, this.applyResourceChanges(field, modifiedValue, options));
    this.handleSpillover(spillover, options);

    if (!options.silent) {
      this.emitModificationEvent(resource, currentValue, modifiedValue, spillover);
    }
  }

  private isBaseResource(resource: ResourceType): boolean {
    return this.baseResources.has(resource as BaseResourceType);
  }

  private isCustomResource(resource: ResourceType): boolean {
    return resource.startsWith("custom.");
  }

  /**
   * Parses and calculates a new resource value based on the current value and an input value
   * @param current - The current numeric value of the resource
   * @param value - The new value to parse, can be either a number or a string with format "+n" or "-n"
   * @returns The calculated new resource value
   *
   * @example
   * // Returns 15
   * parseResourceValue(10, "+5")
   *
   * @example
   * // Returns 5
   * parseResourceValue(10, "-5")
   *
   * @example
   * // Returns 7
   * parseResourceValue(10, 7)
   */
  private parseResourceValue(current: number, value: number | string): number {
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
   * Validates and clamps a resource value within specified bounds.
   * @param _resource - The type of resource being validated
   * @param value - The numeric value to validate
   * @param field - The resource field containing min/max constraints
   * @returns The clamped value between field.min (or 0) and field.max (or MAX_SAFE_INTEGER)
   */
  private validateResourceValue(
    _resource: ResourceType,
    value: number,
    field: ResourceData
  ): number {
    return Math.clamp(value, field.min ?? 0, field.max ?? Number.MAX_SAFE_INTEGER);
  }

  /**
   * Handles resource depletion calculations and determines spillover effects.
   *
   * @param resource - The type of resource being depleted (e.g., ManaPoints, StaminaPoints)
   * @param value - The current value of the resource after depletion
   * @returns An object containing the final resource value and any spillover amount
   *          - value: The final value of the resource after depletion
   *          - spillover: The amount of excess depletion (only applies to ManaPoints and StaminaPoints)
   *
   * @remarks
   * For ManaPoints and StaminaPoints, negative values are converted to 0 and the negative amount
   * is returned as spillover. For other resource types, negative values are preserved and no
   * spillover is calculated.
   *
   * @private
   */
  private handleResourceDepletion(
    resource: ResourceType,
    value: number
  ): { value: number; spillover: number } {
    if (value >= 0)
      return {
        value,
        spillover: 0,
      };

    // Only apply spillover effect for base resources Mana and Stamina
    const shouldSpillover = resource === "ManaPoints" || resource === "StaminaPoints";
    return {
      value: shouldSpillover ? 0 : value,
      spillover: shouldSpillover ? value : 0,
    };
  }
}
