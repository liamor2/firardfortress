import { ActorData } from "@app/models";
import { StatType, StatFieldData } from "@app/types";

export class StatManager {
  constructor(private readonly actor: ActorData) {}

  /**
   * Gets a stat's current data
   * @param stat - The stat to retrieve
   * @returns The stat data
   */
  public getStat(stat: StatType): StatFieldData {
    return this.actor.stats[stat] as StatFieldData;
  }

  /**
   * Gets a stat's modifier for use in roll formulas
   * @param stat - The stat to get the modifier for
   * @returns The modifier in a format usable in roll formulas
   */
  public getModifier(stat: StatType): string {
    const statField = this.getStat(stat);
    const mod = statField.mod;
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  /**
   * Modifies a stat value and recalculates its modifier.
   * @param stat - The stat to modify
   * @param value - The new value for the stat
   */
  public modifyStat(stat: StatType, value: number): void {
    const statField = this.getStat(stat);
    statField.value = value;
    this._recalculateModifier(stat);
  }

  private _recalculateModifier(stat: StatType): void {
    const statField = this.getStat(stat);
    if (statField.value != null) {
      statField.mod = Math.floor((statField.value - 10) / 2);
    }
  }

  /**
   * Recalculates the total modifier for all stats including bonuses.
   */
  public recalculateTotalModifier(): void {
    for (const stat of Object.keys(this.actor.stats) as StatType[]) {
      this._recalculateModifier(stat);

      const bonus = this.actor.getBonusModifier(stat);

      const statField = this.getStat(stat);
      statField.totalMod = statField.mod + (bonus ?? 0);
    }
  }

  /**
   * Gets the current main casting stat
   * @returns The stat type that is set as main casting stat, or undefined if none is set
   */
  public getMainCastingStat(): StatType | undefined {
    for (const stat of Object.keys(this.actor.stats) as StatType[]) {
      const statField = this.getStat(stat);
      if (statField.isMainCastingStat) {
        return stat;
      }
    }
    return undefined;
  }

  /**
   * Sets the main casting stat
   * @param stat - The stat to set as main casting stat
   */
  public setMainCastingStat(stat: StatType): void {
    // First, clear any existing main casting stat
    for (const existingStat of Object.keys(this.actor.stats) as StatType[]) {
      const statField = this.getStat(existingStat);
      if (statField.isMainCastingStat) {
        statField.isMainCastingStat = false;
      }
    }

    // Set the new main casting stat
    const statField = this.getStat(stat);
    statField.isMainCastingStat = true;
  }
}
