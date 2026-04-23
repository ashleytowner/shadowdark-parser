import { parseAttacks } from "./attacks";
import type { Alignment, Attack, Monster } from "./entity";
import { parseTraits } from "./traits";
import { getLines, getName } from "./util";

/**
 * Parse the AC value of the statline
 * @param ac the AC value
 */
function parseArmor(ac: string) {
  const matches = ac.match(/^(?<ac>\d+) *(\((?<type>.+)\))?$/);
  const val = matches?.groups?.ac;
  const armor = matches?.groups?.type;
  if (!val) {
    throw new Error(`Invalid AC value: "${ac}"`);
  }
  return { ac: Number(val), armor };
}

function parseMovement(mv: string) {
  const matches = mv.match(/^(?<mv>[^\(\)]+) *(\((?<type>.+)\))?$/);
  const distance = matches?.groups?.mv?.trim();
  const type = matches?.groups?.type?.trim();
  if (!distance) {
    throw new Error(`Invalid MV value: "${mv}"`);
  }
  return { distance, type };
}

const STAT_KEYS = [
  "AC",
  "HP",
  "ATK",
  "MV",
  "S",
  "D",
  "C",
  "I",
  "W",
  "Ch",
  "X",
  "Z",
  "AL",
  "LV",
] as const;

type StatKey = (typeof STAT_KEYS)[number];

function isStatKey(key: string): key is StatKey {
  const index = STAT_KEYS.findIndex((k) => key === k);
  return index !== -1;
}

function getStatSections(statline: string): [StatKey, string][] {
  const chars = statline.split("");
  const parts: string[] = [];
  let line = "";
  let inBracket = false;
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (
      char === "," &&
      !inBracket &&
      chars[i + 1] &&
      chars[i + 1] === chars[i + 1]!.toUpperCase()
    ) {
      parts.push(line);
      line = "";
      continue;
    }

    if (char === "(") {
      inBracket = true;
    }

    if (char === ")") {
      inBracket = false;
    }

    line += char;
  }
  parts.push(line);
  return parts.map((part) => {
    const [prefix, ...rest] = part.trim().split(" ");
    if (!prefix) throw new Error(`Invalid statline section ${part}`);
    if (!isStatKey(prefix))
      throw new Error(`"${prefix}" is not a valid stat key`);
    return [prefix, rest.join(" ")];
  });
}

type CoreStat = "str" | "dex" | "con" | "int" | "wis" | "cha";

function getStatNameFromPrefix(prefix: string): CoreStat {
  switch (prefix) {
    case "S":
      return "str";
    case "D":
      return "dex";
    case "C":
      return "con";
    case "I":
      return "int";
    case "W":
      return "wis";
    case "Ch":
    case "X":
    case "Z":
      return "cha";
    default:
      throw new Error(`Invalid core stat ${prefix}`);
  }
}

/**
 * Parse a shadowdark statblock
 * @param statblockText The text which makes up the statblock
 */
export function parseStatblock(statblockText: string): Monster {
  const lines = getLines(statblockText);
  const name = getName(lines);
  let description = "";
  while (lines.length > 0 && !lines[0]!.startsWith("AC ")) {
    description += ` ${lines.shift()}`;
  }
  description = description.trim();
  let stats = "";
  while (lines.length > 0 && !/LV( [0-9/*]+)?\s?$/.test(lines[0]!)) {
    stats += ` ${lines.shift()}`;
  }
  const lastLine = lines.shift();
  stats += ` ${lastLine}`;
  // If LV was on its own line, grab the next line with the number
  if (
    lastLine &&
    /LV\s?$/.test(lastLine) &&
    lines.length > 0 &&
    /^\d+/.test(lines[0]!)
  ) {
    stats += ` ${lines.shift()}`;
  }
  stats = stats.trim().replace(/  */g, " ");

  const statSections = getStatSections(stats);

  let hp: number | string;
  let attacks: Attack[][];
  const coreStats: Record<CoreStat, number | undefined> = {
    str: undefined,
    dex: undefined,
    con: undefined,
    int: undefined,
    wis: undefined,
    cha: undefined,
  };
  let alignment: Alignment;
  let level: number | string;
  let ac: number;
  let armor: string | undefined;
  let movementDistance: string;
  let movementType: string | undefined;

  for (const statSection of statSections) {
    const [key, value] = statSection;
    switch (key) {
      case "AC":
        const parsedArmor = parseArmor(value);
        ac = parsedArmor.ac;
        armor = parsedArmor.armor;
        break;
      case "HP":
        if (!/^[0-9/*]+$/.test(value)) {
          throw new Error(`Invalid HP value: "${value}"`);
        }
        hp = Number(value) || String(value);
        break;
      case "ATK":
        attacks = parseAttacks(value);
        break;
      case "MV":
        const movement = parseMovement(value);
        movementDistance = movement.distance;
        movementType = movement.type;
        break;
      case "S":
      case "D":
      case "C":
      case "I":
      case "W":
      case "Ch":
      case "X":
      case "Z":
        const statNum = Number(value.replaceAll(" ", ""));
        if (isNaN(statNum)) {
          throw new Error(`Invalid ${key} value: "${value}"`);
        }
        coreStats[getStatNameFromPrefix(key)] = statNum;
        break;
      case "AL":
        if (!/^L|N|C|\*$/.test(value)) {
          throw new Error(`Invalid AL value: "${value}"`);
        }
        const alignmentMap = new Map<string, Alignment>([
          ["L", "Lawful"],
          ["N", "Neutral"],
          ["C", "Chaotic"],
          ["*", "*"],
        ]);

        const al = alignmentMap.get(value);
        if (!al) {
          throw new Error(`Invalid AL value: "${value}"`);
        }
        alignment = al;
        break;
      case "LV":
        if (!/^[0-9/*]+$/.test(value)) {
          throw new Error(`Invalid LV value: "${value}"`);
        }
        level = Number(value) || String(value);
        break;
    }
  }

  if (ac! === undefined) throw new Error(`AC missing from "${stats}"`);
  if (hp! === undefined) throw new Error(`HP missing from "${stats}"`);
  if (attacks! === undefined) throw new Error(`ATK missing from "${stats}"`);
  if (coreStats.str === undefined)
    throw new Error(`Missing Str stat from "${stats}"`);
  if (coreStats.dex === undefined)
    throw new Error(`Missing Dex stat from "${stats}"`);
  if (coreStats.con === undefined)
    throw new Error(`Missing Con stat from "${stats}"`);
  if (coreStats.int === undefined)
    throw new Error(`Missing Int stat from "${stats}"`);
  if (coreStats.wis === undefined)
    throw new Error(`Missing Wis stat from "${stats}"`);
  if (coreStats.cha === undefined)
    throw new Error(`Missing Cha stat from "${stats}"`);
  if (movementDistance! === undefined)
    throw new Error(`MV missing from "${stats}"`);
  if (alignment! === undefined) throw new Error(`Missing AL from "${stats}"`);
  if (level! === undefined) throw new Error(`Missing LV from "${stats}"`);

  return {
    type: "monster",
    name,
    description,
    ac,
    armor,
    hp,
    attacks,
    movementDistance,
    movementType,
    strength: coreStats.str,
    dexterity: coreStats.dex,
    constitution: coreStats.con,
    intelligence: coreStats.int,
    wisdom: coreStats.wis,
    charisma: coreStats.cha,
    alignment,
    level,
    traits: parseTraits(lines),
  };
}
