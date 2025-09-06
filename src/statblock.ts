import { parseAttacks } from "./attacks";
import type { Alignment, Monster } from "./entity";
import { parseTraits } from "./traits";
import { getLines, getName } from "./util";

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
  while (lines.length > 0 && !/LV [0-9/*]+\s?$/.test(lines[0]!)) {
    stats += ` ${lines.shift()}`;
  }
  stats += ` ${lines.shift()}`;
  stats = stats.trim().replace(/  */g, " ");

  const statPattern =
    /AC (?<ac>.+), HP (?<hp>[0-9/*]+), ATK (?<atks>.+), MV (?<mv>.+), S (?<str>(\+|-)? *\d+), D (?<dex>(\+|-)? *\d+), C (?<con>(\+|-)? *\d+), I (?<int>(\+|-)? *\d+), W (?<wis>(\+|-)? *\d+), (Ch|X|Z) (?<cha>(\+|-)? *\d+), AL (?<al>L|N|C|\*), LV (?<lv>[0-9/*]+)/;

  const matches = stats.match(statPattern);

  const armor = matches?.groups?.ac?.match(/\((.+)\)$/)?.[1];
  const movementType = matches?.groups?.mv?.match(/\((.+)\)$/)?.[1];

  const cleanedAc = matches?.groups?.ac?.replace(`(${armor})` || "", "");

  const ac = Number(cleanedAc) || cleanedAc;
  const hp = Number(matches?.groups?.hp) || matches?.groups?.hp;
  const attacks = matches?.groups?.atks
    ? parseAttacks(matches.groups.atks)
    : [];
  const movementDistance = matches?.groups?.mv
    ?.replace(`(${movementType})`, "")
    .trim();
  const strength = Number(matches?.groups?.str?.replace(/ /g, ""));
  const dexterity = Number(matches?.groups?.dex?.replace(/ /g, ""));
  const constitution = Number(matches?.groups?.con?.replace(/ /g, ""));
  const intelligence = Number(matches?.groups?.int?.replace(/ /g, ""));
  const wisdom = Number(matches?.groups?.wis?.replace(/ /g, ""));
  const charisma = Number(matches?.groups?.cha?.replace(/ /g, ""));
  const alignment = matches?.groups?.al;
  const level = Number(matches?.groups?.lv) || matches?.groups?.lv;

  if (!ac || !hp || !movementDistance || !level || !alignment) {
    throw new Error(
      `Could not parse stats from statblock:\n\n${statblockText}`,
    );
  }

  const alignmentMap = new Map<string, Alignment>([
    ["L", "Lawful"],
    ["N", "Neutral"],
    ["C", "Chaotic"],
    ["*", "*"],
  ]);

  const mappedAlignment = alignmentMap.get(alignment);

  if (!mappedAlignment) {
    throw new Error(`Invalid alignment: ${alignment}`);
  }

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
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    alignment: mappedAlignment,
    level,
    traits: parseTraits(lines),
  };
}
