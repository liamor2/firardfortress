// import { RollOptions } from "@app/types/generic/roll/roll.types";

// /**
//  * Performs a roll with the given parameters
//  * @param {string} formula - The roll formula (e.g., "1d20", "2d6+4")
//  * @param {RollOptions} options - Additional roll options
//  * @returns {Promise<Roll>} The resulting roll
//  */
// export async function _performRoll(formula: string, options: RollOptions = {}): Promise<Roll> {
//   let rollFormula = formula;

//   // Handle advantage/disadvantage
//   if (options.advantage && !options.disadvantage) {
//     rollFormula = `2d20kh + ${formula.slice(4)}`;
//   } else if (options.disadvantage && !options.advantage) {
//     rollFormula = `2d20kl + ${formula.slice(4)}`;
//   }

//   // Add bonus if present
//   if (options.bonus) {
//     rollFormula += ` + ${options.bonus}`;
//   }

//   const roll = await new Roll(rollFormula).evaluate({ async: true });

//   if (options.flavor) {
//     roll.toMessage({
//       flavor: options.flavor,
//       speaker: { alias: this?.name ?? "System" },
//     });
//   }

//   return roll;
// }
