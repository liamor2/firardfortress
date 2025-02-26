import { ActorData } from "@app/models";
import { BonusStat, StatType, BonusType } from "@app/types";

export class BonusManager {
  constructor(private readonly actor: ActorData) {}

  private static readonly defaultBonusPriority = 1;

  /**
   * Adds a new bonus to the actor
   * @param bonus - The bonus to add
   */
  public addBonus(bonus: BonusStat): void {
    const schemaData: BonusStat = {
      key: bonus.key,
      stats: bonus.stats,
      label: bonus.label,
      duration: bonus.duration ?? -1,
      source: bonus.source ?? "",
      isActive: bonus.isActive ?? true,
      condition: bonus.condition,
      type: bonus.type ?? "additive",
      priority: bonus.priority ?? 0,
    };

    this.actor.updateSource({
      bonus: [...this.actor.bonus, schemaData],
    });
  }

  /**
   * Removes a bonus from the actor
   * @param key - The key of the bonus to remove
   */
  public removeBonus(key: string): void {
    this.actor.updateSource({
      bonus: this.actor.bonus.filter((bonus) => bonus.key !== key),
    });
  }

  /**
   * Updates an existing bonus with new data
   * @param key - The key of the bonus to update
   * @param data - The new data to apply
   */
  public updateBonus(key: string, data: Partial<BonusStat>): void {
    const index = this.actor.bonus.findIndex((b) => b.key === key);
    if (index === -1) return;

    const updatedBonus = {
      ...this.actor.bonus[index],
      ...data,
    };

    const bonuses = [...this.actor.bonus];
    bonuses[index] = updatedBonus;

    this.actor.updateSource({ bonus: bonuses });
  }

  /**
   * Gets a bonus by its key
   * @param key - The key of the bonus to get
   * @returns The bonus if found, undefined otherwise
   */
  public getBonus(key: string): BonusStat | undefined {
    const bonus = this.actor.bonus.find((b) => b.key === key);
    if (!bonus) return undefined;

    return {
      key: bonus.key,
      stats: bonus.stats,
      label: bonus.label,
      duration: bonus.duration ?? -1,
      source: bonus.source,
      isActive: bonus.isActive,
      condition: bonus.condition,
      type: bonus.type,
      priority: bonus.priority,
    };
  }

  /**
   * Gets all bonuses from a specific source
   * @param source - The source to filter by
   * @returns Array of bonuses from the specified source
   */
  public getBonusesBySource(source: string): BonusStat[] {
    return this.actor.bonus.filter((b) => b.source === source);
  }

  /**
   * Gets all active bonuses for a specific stat
   * @param stat - The stat to get bonuses for
   * @returns Array of active bonuses affecting the stat
   */
  public getActiveBonusesForStat(stat: StatType): BonusStat[] {
    return this.actor.bonus.filter((b) => b.isActive && b.stats[stat] !== undefined);
  }

  /**
   * Calculates the total bonus modifier for a stat
   * @param stat - The stat to calculate the modifier for
   * @returns The total modifier value
   */
  public calculateTotalModifier(stat: StatType): number {
    const bonuses = this.getActiveBonusesForStat(stat);

    // Sort by priority and type
    bonuses.sort((a, b) => {
      if (a.priority === b.priority) {
        const typeOrder: Record<BonusType, number> = {
          additive: 0,
          multiplicative: 1,
          override: 2,
        };
        return typeOrder[a.type] - typeOrder[b.type];
      }
      return (
        (a.priority ?? BonusManager.defaultBonusPriority) -
        (b.priority ?? BonusManager.defaultBonusPriority)
      );
    });

    let total = 0;
    let multiplier = 1;
    let hasOverride = false;
    let overrideValue = 0;

    for (const bonus of bonuses) {
      const value = bonus.stats[stat] ?? 0;
      switch (bonus.type) {
        case "override":
          hasOverride = true;
          overrideValue = value;
          break;
        case "multiplicative":
          multiplier += value;
          break;
        case "additive":
          total += value;
          break;
      }
    }

    return hasOverride ? overrideValue : total * multiplier;
  }
}
