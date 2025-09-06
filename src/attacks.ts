import type { Attack } from "./entity";

/**
 * Parse a single attack
 * @param attack a string describing a single attack
 */
export function parseAttack(attack: string): Attack {
  let matches = attack.match(
    /^(?<qty>\d+) (?<name>.+)( (?<bonus>(\+|-)(\d+)) \((?<damage>.+)\))$/,
  );
  if (!matches) {
    matches = attack.match(/^(?<qty>\d+) (?<name>.*)( (?<bonus>(\+|-)(\d+)))$/);
  }
  if (!matches) {
    matches = attack.match(/^(?<qty>\d+) (?<name>.*)$/);
  }
  if (!matches) {
    matches = attack.match(/^(?<name>.*)$/);
  }

  const weaponName = matches?.groups?.name?.match(/^[^(]+/)?.[0].trim();
  const weaponRange = matches?.groups?.name?.match(/\((.+)\)/)?.[1]?.trim();

  if (!weaponName) {
    throw new Error(`Failed to parse attack: ${attack}`);
  }

  return {
    type: "attack",
    quantity: matches?.groups?.qty,
    name: weaponName,
    range: weaponRange,
    bonus: matches?.groups?.bonus,
    damage: matches?.groups?.damage,
  };
}

/**
 * Parse the attack line of a statblock
 * Group the attacks based on the "and" and "or" usage
 * @param attacks A string of attacks
 * @returns a 2D array of attacks. Each sub-array is a set of attacks
 * that can all happen on the same turn
 */
export function parseAttacks(attacks: string): Attack[][] {
  return attacks
    .split(" or ")
    .map((group) => group.split(" and ").map((atk) => parseAttack(atk)));
}
