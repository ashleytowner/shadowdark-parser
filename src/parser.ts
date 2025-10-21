import { Entity } from "./entity";
import { parseMagicItem } from "./magicitem";
import { parseRollTable } from "./rolltable";
import { parseSpell } from "./spell";
import { splitBulkEntries, type EntryIdentifierStrategy } from "./splitbulk";
import { parseStatblock } from "./statblock";

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
  if (/^\d+/.test(entity.trim()) || /^d\d+/.test(entity.trim())) {
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
        `Could not identify the type of entry. This parser only supports monsters, spells, magic items & roll tables currently:\n${entity}`,
      );
  }
}

/**
 * Parse a bulk list of entries, it will use a strategy to split them up, then will parse each of them individually and return tehm as an array
 * @param entities the bulk list of entities
 * @param strategy the strategy to use to split up entities
 * @returns a tuple where the first entry is the parsed statblocks, and the second is the statblocks that failed to be parsed
 */
export function bulkParse(entities: string, strategy: EntryIdentifierStrategy) {
  const entries = splitBulkEntries(entities, strategy);
  const parsedEntries: Entity[] = [];
  const failures: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    try {
      parsedEntries.push(parse(entry));
    } catch (e) {
      failures.push(entry);
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }
    }
  }
  return [
    /** Successfully parsed entities */ parsedEntries,
    /** Faiures */ failures,
  ] as const;
}
