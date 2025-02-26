import { ActorData } from "@app/models";
import { STANCES_BONUSES } from "@app/constants";
import { StanceType } from "@app/types";

export class StanceManager {
  private static readonly STANCE_BONUS_SOURCE = "stance";
  private static readonly DEFAULT_STANCE: StanceType = "BALANCE";

  constructor(private readonly actor: ActorData) {
    if (!this.getCurrentStance()) {
      this.setStance(StanceManager.DEFAULT_STANCE);
    }
  }

  /**
   * Gets the current stance of the actor
   * @returns The current stance
   */
  public getCurrentStance(): StanceType {
    return this.actor.stance as StanceType;
  }

  /**
   * Sets the actor's stance and updates associated bonuses
   * @param stance - The new stance to set
   */
  public setStance(stance: StanceType): void {
    const existingStanceBonus = this.actor.bonus.find(
      (b) => b.source === StanceManager.STANCE_BONUS_SOURCE
    );

    if (existingStanceBonus) {
      this.actor.updateBonusStat(existingStanceBonus.key, STANCES_BONUSES[stance]);
    } else {
      this.actor.addBonusStat(STANCES_BONUSES[stance]);
    }

    this.actor.updateSource({ stance });
  }
}
