export type RollOptions = {
  advantage?: boolean;
  disadvantage?: boolean;
  bonus?: number;
  difficulty?: number;
  flavor?: string;
};

export type RollData = {
  formula: string;
  total: number;
  result: number;
  terms: unknown[];
};

export type RollResult = {
  roll: Roll;
  success?: boolean;
  critical?: boolean;
  fumble?: boolean;
};
