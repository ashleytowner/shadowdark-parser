/**
 * Break a single string into an array of lines
 * @param str
 */
function getLines(str: string) {
  return str
    .split("\n")
    .map((line) => line.trim().replace(/  */g, " "))
    .filter(Boolean);
}

/**
 * Get the name of an entity.
 * In most cases, this identifies the first line as the name,
 * but in cases where there are 2+ lines in all caps at the start,
 * it will assume they are all part of the name.
 * @param lines
 */
function getName(lines: string[]) {
  const allCapsPattern = /^[A-Z -']+$/;
  const nameLines = [];

  while (lines[0] && allCapsPattern.test(lines[0])) {
    nameLines.push(lines.shift());
  }

  if (nameLines.length === 0) {
    return lines.shift();
  } else {
    return nameLines.join(" ").trim();
  }
}

type Attack = {
  /** The number of this attack that can be made per turn */
  quantity?: string;
  /** The name of this attack */
  name: string;
  /** The range of this attack */
  range?: string;
  /** The to-hit bonus for this attack */
  bonus?: string;
  /** The damage this attack does */
  damage?: string;
};

/**
 * Parse a single attack
 * @param attack a string describing a single attack
 */
function parseAttack(attack: string): Attack {
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
function parseAttacks(attacks: string): Attack[][] {
  return attacks
    .split(" or ")
    .map((group) => group.split(" and ").map((atk) => parseAttack(atk)));
}

/**
 * Determine whether a line is the beginning of a new trait
 * @param line The line of the statblock
 */
function isTraitStart(line: string): boolean {
  if (line.indexOf(".") === -1) return false;
  if (!/^[A-Z]$/.test(line.charAt(0))) return false;
  const lastWordBeforePeriod = line.match(/[a-zA-Z0-9_)-]+\./)?.[0];
  if (!lastWordBeforePeriod) {
    throw new Error(`Failed to parse possible trait start, ${line}`);
  }
  if (!/^[A-Z]$/.test(lastWordBeforePeriod.charAt(0))) return false;
  return true;
}

/**
 * A trait is an aspect of some kind on items, monsters, etc
 */
type Trait = {
  /** The name of the trait */
  name: string;
  /** The description of the trait */
  description: string;
};

/**
 * Parse the traits section of a statblock
 * @param lines the statblock lines containing traits
 */
function parseTraits(lines: string[]): Trait[] {
  const parsed = [];
  let current = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (isTraitStart(line)) {
      parsed.push(current.trim());
      current = line;
    } else {
      current += ` ${line}`;
    }
  }
  parsed.push(current.trim());
  return parsed.filter(Boolean).map((trait) => {
    const indexOfPeriod = trait.indexOf(". ");
    const name = trait.slice(0, indexOfPeriod).trim();
    const description = trait.slice(indexOfPeriod + 1, trait.length).trim();
    return {
      name,
      description,
    };
  });
}

type Monster = {
  /** Name */
  name: string;
  /** Description */
  description: string;
  /**
   * Armor Class
   * Usually a number, but in some cases where the AC is variable, it will be a string
   */
  ac: number | string;
  /**
   * The type of armor & shields used
   * Will be undefined if not specified in the statblock
   */
  armor: string;
  /**
   * Hit Points
   * Usually a number, but in some cases where the HP is variable, it will be a string
   */
  hp: number | string;
  /**
   * An array of arrays of attacks.
   * Each top-level sub-array is a grouping of "and" attacks
   *
   * @example
   * "1 attackA and 1 attackB or 1 attackC" would come out as `[[attackA, attackB], [attackC]]`
   */
  attacks: Attack[][];
  /**
   * The distance that can be moved
   */
  movementDistance: string;
  /**
   * The type of movement, e.g. "fly"
   */
  movementType: string;
  /** Strength */
  strength: number;
  /** Dexterity */
  dexterity: number;
  /** Constitution */
  constitution: number;
  /** Intelligence */
  intelligence: number;
  /** Wisdom */
  wisdom: number;
  /** Charisma */
  charisma: number;
  /**
   * Alignment
   * */
  alignment: "Lawful" | "Neutral" | "Chaotic" | "*";
  /**
   * Level
   * Usually a number, but in some cases where the level is variable, it can be a string
   */
  level: number | string;
  /**
   * An array of traits
   */
  traits: Trait[];
};

/**
 * Parse a shadowdark statblock
 * @param statblockText The text which makes up the statblock
 */
function parseStatblock(statblockText: string) {
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
    /AC (?<ac>.+), HP (?<hp>[0-9/*]+), ATK (?<atks>.+), MV (?<mv>.+), S (?<str>(\+|-) *\d+), D (?<dex>(\+|-) *\d+), C (?<con>(\+|-) *\d+), I (?<int>(\+|-) *\d+), W (?<wis>(\+|-) *\d+), (Ch|X|Z) (?<cha>(\+|-) *\d+), AL (?<al>L|N|C|\*), LV (?<lv>[0-9/*]+)/;

  const matches = stats.match(statPattern);

  const armor = matches?.groups?.ac?.match(/\((.+)\)$/)?.[1];
  if (!armor) {
    throw new Error(`Failed to parse armor in statblock:\n\n${statblockText}`);
  }
  const movementType = matches?.groups?.mv?.match(/\((.+)\)$/)?.[1];

  const ac =
    Number(matches?.groups?.ac?.replace(armor, "")) ||
    matches?.groups?.ac?.replace(armor, "").trim();
  const hp = Number(matches?.groups?.hp) || matches?.groups?.hp;
  const attacks = matches?.groups?.atks
    ? parseAttacks(matches.groups.atks)
    : "";
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

  if (
    !ac ||
    !hp ||
    !attacks ||
    !movementDistance ||
    !strength ||
    !dexterity ||
    !constitution ||
    !intelligence ||
    !wisdom ||
    !charisma ||
    !alignment ||
    !level
  ) {
    throw new Error(`Could not parse monster stats:\n\n${statblockText}`);
  }

  const alignmentMap = new Map([
    ["L", "Lawful"],
    ["N", "Neutral"],
    ["C", "Chaotic"],
    ["*", "*"],
  ]);

  return {
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
    alignment: alignmentMap.get(alignment),
    level,
    traits: parseTraits(lines),
  };
}

type Table = {
  /** The name of the table */
  name: string;
  /** The table rows */
  results: {
    type: "text";
    /** The text of the row result */
    text: string;
    /** The number range within which this result is rolled */
    range: [number, number];
  }[];
};

/**
 * Parses an encounter table in the format of
 * 01 First Encounter
 * 02-03 Second Encounter
 * @param tableText The rows of the table
 * @param [tableName] The name of the table
 * @returns a JSON object usable in Foundry
 */
function parseRollTable(
  tableText: string,
  tableName = "Imported Table",
): Table {
  const rows = getLines(tableText)
    .reduce((arr: string[], line) => {
      if (/^[0-9]/.test(line)) {
        return [...arr, line];
      } else {
        arr[arr.length - 1] += ` ${line}`;
        return arr;
      }
    }, [])
    .map((line) => {
      const matches = line.match(
        /^(?<range>[0-9]+|[0-9]+-[0-9]+) (?<detail>.+)/,
      );
      const range = matches?.groups?.range;
      const detail = matches?.groups?.detail;
      const rangeParts = range?.split("-").map(Number);
      if (rangeParts && rangeParts.length === 1) {
        rangeParts.push(rangeParts[0]!);
      }
      if (!detail) {
        throw new Error(`Could not parse row result:\n\n${line}`);
      }
      if (!rangeParts) {
        throw new Error(`Could not parse row range:\n\n${line}`);
      }
      return {
        type: "text" as const,
        text: detail,
        range: rangeParts as [number, number],
      };
    });
  return {
    name: tableName,
    results: rows,
  };
}

/**
 * Parse a spell
 * @param spellText The text of the spell body
 */
function parseSpell(spellText: string) {
  const lines = getLines(spellText);
  if (lines.length === 0) {
    throw new Error(`Not enough lines in spell:\n\n${spellText}`);
  }
  const name = getName(lines);
  const tierAndClasses = lines.shift();
  const [tierPart, ...classes] = tierAndClasses!
    .split(",")
    .map((part) => part.trim());
  const tier = Number(tierPart?.match(/\d+$/)?.[0]);
  const duration = lines.shift()?.match(/^Duration: (.+)$/)?.[1];
  if (!duration) {
    throw new Error("Expected a duration!");
  }
  const range = lines
    ?.shift()
    ?.match(/^Range: (.+)$/)?.[1]
    ?.toLowerCase();
  if (!range) {
    throw new Error("Expected a range!");
  }
  let descriptionLines = [];
  let current = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (/^[A-Z]/.test(line) && (current === "" || /\.$/.test(current))) {
      descriptionLines.push(current);
      current = line;
    } else {
      current += ` ${line}`;
    }
  }
  descriptionLines.push(current);
  descriptionLines = descriptionLines
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    name,
    tier,
    classes,
    duration,
    range,
    description: descriptionLines.join("\n"),
  };
}

/**
 * Parse a magic item
 * @param itemText The body text of the magic item
 */
function parseMagicItem(itemText: string) {
  const lines = getLines(itemText);
  if (lines.length === 0) {
    throw new Error(`Not enough lines in spell:\n\n${itemText}`);
  }
  const name = getName(lines);
  const description = [];
  while (lines.length > 0 && !isTraitStart(lines[0]!)) {
    description.push(lines.shift());
  }
  const traits = parseTraits(lines);
  return {
    name,
    description: description.join(" "),
    traits,
  };
}

/**
 * Identify what type of entry is being processed
 * @param entity The entity to identify
 */
function identify(entity: string): 'MONSTER' | 'TABLE' | 'SPELL' | 'MAGICITEM' | undefined {
  if (/AC \d+/.test(entity) && /ATK/.test(entity)) {
    return "MONSTER";
  }
  if (/Duration:/.test(entity) && /Range:/.test(entity)) {
    return "SPELL";
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
function parse(entity: string) {
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

const shadowdarkParser = {
  identify,
  isTraitStart,
  parse,
  parseAttack,
  parseAttacks,
  parseMagicItem,
  parseRollTable,
  parseSpell,
  parseStatblock,
  parseTraits,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = shadowdarkParser;
} else {
  (window as any).shadowdarkParser = shadowdarkParser;
}
