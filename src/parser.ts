import { parseMagicItem } from "./magicitem.js";
import { parseRollTable } from "./rolltable.js";
import { parseSpell } from "./spell.js";
import { parseStatblock } from "./statblock.js";

/**
 * Identify what type of entry is being processed
 * @param entity The entity to identify
 */
export function identify(
  entity: string,
): "MONSTER" | "TABLE" | "SPELL" | "MAGICITEM" | undefined {
  if (
    /Duration:/.test(entity) &&
    /Range:/.test(entity) &&
    /Tier \d+,/.test(entity)
  ) {
    return "SPELL";
  }
  if (/AC \d+/.test(entity) && /ATK/.test(entity)) {
    return "MONSTER";
  }
  if (/\n(Benefit|Bonus|Personality|Curse)\./.test(entity)) {
    return "MAGICITEM";
  }
  if (/^\d+/.test(entity.trim())) {
    return "TABLE";
  }
  return undefined;
}

/**
 * Parse a generic entry, it will decide what kind of entry it is and return the appropriate JSON
 * @param entity The body text of the entity to parse
 */
export function parse(entity: string) {
  const identity = identify(entity);
  switch (identity) {
    case "MONSTER":
      return parseStatblock(entity);
    case "SPELL":
      return parseSpell(entity);
    case "TABLE":
      return parseRollTable(entity);
    case "MAGICITEM":
      return parseMagicItem(entity);
    default:
      throw new Error(
        "Could not identify the type of entry. This parser only supports monsters, spells, magic items & roll tables currently",
      );
  }
}
