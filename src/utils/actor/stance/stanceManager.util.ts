import { ActorData } from "@app/models";
import { STANCES_BONUSES } from "@app/constants";
import { BaseResourceType, StanceType } from "@app/types";

export class StanceManager {
  private static readonly STANCE_BONUS_SOURCE = "stance";
  private static readonly DEFAULT_STANCE: StanceType = "BALANCE";

  private static readonly STANCE_RESOURCE_EFFECTS: Record<
    StanceType,
    Partial<Record<BaseResourceType, number>>
  > = {
    DEFENSIVE: { HealthPoints: 2 },
    PROWESS: { ManaPoints: 1, StaminaPoints: 1 },
    FOCUS: { ManaPoints: 1, StaminaPoints: 1 },
    PRESENCE: { ManaPoints: 1, StaminaPoints: 1 },
    ELEMENTAL: {
      HealthPoints: 10,
      ManaPoints: 10,
      StaminaPoints: 10,
      PhysicalArmor: 10,
      MagicalArmor: 10,
    },
    OFFENSIVE: {},
    BALANCE: {},
  };

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
    this.applyStanceResources();
  }

  /**
   * Applies resource modifications based on the actor's current stance.
   * First clears any existing stance resources, then applies new resource effects
   * according to the current stance configuration.
   *
   * After applying resources, emits a 'stanceResourcesApplied' event with the stance
   * and effect details.
   *
   * @fires stanceResourcesApplied - Emitted when stance resources are applied
   * @eventProperty {string} stance - The current stance that was applied
   * @eventProperty {Record<string, number>} effects - The resource effects that were applied
   */
  public applyStanceResources(): void {
    const currentStance = this.getCurrentStance();
    const resourceEffects = StanceManager.STANCE_RESOURCE_EFFECTS[currentStance];

    this.clearStanceResources();

    for (const [resource, amount] of Object.entries(resourceEffects)) {
      this.actor.modifyResource(resource as BaseResourceType, amount, {
        temp: amount,
        silent: true,
      });
    }

    this.actor._emitEvent("stanceResourcesApplied", {
      stance: currentStance,
      effects: resourceEffects,
    });
  }

  /**
   * Clears all temporary resource values granted by stances
   * This should be called before applying new stance resources
   */
  private clearStanceResources(): void {
    const basicResources: BaseResourceType[] = [
      "HealthPoints",
      "ManaPoints",
      "StaminaPoints",
      "PhysicalArmor",
      "MagicalArmor",
      "ActionPoints",
    ];

    basicResources.forEach((resource) => {
      const currentTemp = this.actor.getResource(resource)?.temp ?? 0;
      if (currentTemp > 0) {
        this.actor.modifyResource(resource, 0, {
          temp: -currentTemp,
          silent: true,
        });
      }
    });
  }
}
