/**
 * Split a string into two parts, based on a substring
 * @param {string} str
 * @param {string} sub
 */
function splitBeforeSubstring(str, sub) {
  const index = str.indexOf(sub);
  if (index === -1) {
    return ["", str];
  } else {
    return [str.slice(0, index), str.slice(index, str.length).replace(sub, "")];
  }
}

/**
 * Parse a single attack
 * @param {string} attack
 */
function parseAttack(attack) {
  let matches = attack.match(
    /^(?<qty>\w+) (?<name>.+)( (?<bonus>(\+|-)(\d+)) \((?<damage>.+)\))$/,
  );
  if (!matches) {
    matches = attack.match(/^(?<qty>\w+) (?<name>.*)$/);
  }

  const weaponName = matches.groups.name.match(/^[^(]+/)[0].trim();
  const weaponRange = matches.groups.name.match(/\((.+)\)/)?.[1].trim();

  return {
    /** The number of this attack that can be made per turn */
    quantity: matches.groups.qty,
    /** The name of this attack */
    name: weaponName,
    /** The range of this attack */
    range: weaponRange,
    /** The to-hit bonus for this attack */
    bonus: matches?.groups.bonus,
    /** The damage this attack does */
    damage: matches?.groups.damage,
  };
}

/**
 * Parse the attack line of a statblock
 * Group the attacks based on the "and" and "or" usage
 * @param {string} attacks
 */
function parseAttacks(attacks) {
  let groups = attacks.split(" or ");
  groups = groups.map((group) =>
    group.split(" and ").map((atk) => parseAttack(atk)),
  );
  return groups;
}

/**
 * Determine whether a line is the beginning of a new trait
 * @param {string} part
 */
function isTraitStart(part) {
  if (part.indexOf(".") === -1) return false;
  if (!/^[A-Z]$/.test(part[0])) return false;
  const lastWordBeforePeriod = part.match(/\w+\./)[0];
  if (!/^[A-Z]$/.test(lastWordBeforePeriod[0])) return false;
  return true;
}

/**
 * Parse the traits section of a statblock
 * @param {string[]} traits
 */
function parseTraits(traits) {
  const parsed = [];
  let current = "";
  for (let i = 0; i < traits.length; i++) {
    const line = traits[i];
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
      /** Trait name */
      name,
      /** Trait description */
      description,
    };
  });
}

/**
 * Parse a shadowdark statblock
 * @param {string} statblockText
 */
function parseStatblock(statblockText) {
  const lines = statblockText.split("\n").filter(Boolean);
  const name = lines.shift();
  let description = "";
  while (!lines[0].startsWith("AC ")) {
    description += ` ${lines.shift()}`;
  }
  description = description.trim();
  let stats = "";
  while (!/LV [0-9/*]+$/.test(lines[0])) {
    stats += ` ${lines.shift()}`;
  }
  stats += ` ${lines.shift()}`;
  stats = stats.trim();

  let result = splitBeforeSubstring(stats, ", ");
  stats = result[1];
  const ac = Number(result[0].split(" ")[1]);

  const armor = result[0].match(/\((.+)\)$/)?.[1];

  result = splitBeforeSubstring(stats, ", ATK ");
  stats = result[1];
  const hp = Number(result[0].split(" ")[1]) || result[0].split(" ")[1];

  result = splitBeforeSubstring(stats, ", MV");
  stats = result[1];
  const attacks = parseAttacks(result[0]);

  result = splitBeforeSubstring(stats, ", S ");
  stats = result[1];
  const movement = result[0].trim();

  const movementParts = movement.match(/(?<dist>\w+)( \((?<type>.+)\))?/);

  result = splitBeforeSubstring(stats, ", D ");
  stats = result[1];
  const strength = Number(result[0]);

  result = splitBeforeSubstring(stats, ", C ");
  stats = result[1];
  const dexterity = Number(result[0]);

  result = splitBeforeSubstring(stats, ", I ");
  stats = result[1];
  const constitution = Number(result[0]);

  result = splitBeforeSubstring(stats, ", W ");
  stats = result[1];
  const intelligence = Number(result[0]);

  result = splitBeforeSubstring(stats, ", Ch ");
  stats = result[1];
  const wisdom = Number(result[0]);

  result = splitBeforeSubstring(stats, ", AL ");
  stats = result[1];
  const charisma = Number(result[0]);

  result = splitBeforeSubstring(stats, ", LV ");
  stats = result[1];
  const alignment = result[0].trim();

  const level = Number(stats) || stats;

  const alignmentMap = new Map([
    ["L", "Lawful"],
    ["N", "Neutral"],
    ["C", "Chaotic"],
  ]);

  return {
    /** Name */
    name,
    /** Description */
    description,
    /**
     * Armor Class
     * Usually a number, but in some cases where the AC is variable, it will be a string
     */
    ac,
    /**
     * The type of armor & shields used
     * Will be undefined if not specified in the statblock
     */
    armor,
    /**
     * Hit Points
     * Usually a number, but in some cases where the HP is variable, it will be a string
     */
    hp,
    /**
     * An array of arrays of attacks.
     * Each top-level sub-array is a grouping of "and" attacks
     *
     * @example
     * "1 attackA and 1 attackB or 1 attackC" would come out as `[[attackA, attackB], [attackC]]`
     */
    attacks,
    /**
     * The distance that can be moved
     */
    movementDistance: movementParts.groups.dist,
    /**
     * The type of movement, e.g. "fly"
     */
    movementType: movementParts.groups.type,
    /** Strength */
    strength,
    /** Dexterity */
    dexterity,
    /** Constitution */
    constitution,
    /** Intelligence */
    intelligence,
    /** Wisdom */
    wisdom,
    /** Charisma */
    charisma,
    /**
     * @type {'Lawful'|'Neutral'|'Chaotic'}
     * Alignment
     * */
    alignment: alignmentMap.get(alignment),
    /**
     * Level
     * Usually a number, but in some cases where the level is variable, it can be a string
     */
    level,
    /**
     * An array of traits
     */
    traits: parseTraits(lines),
  };
}

/**
 * Parses an encounter table in the format of
 * 01 First Encounter
 * 02-03 Second Encounter
 * @param {string} tableText The rows of the table
 * @param {string} [tableName] The name of the table
 * @returns a JSON object usable in Foundry
 */
function parseRollTable(tableText, tableName = "Imported Table") {
  const rows = tableText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const matches = line.match(
        /^(?<range>[0-9]+|[0-9]+-[0-9]+) (?<detail>.+)/,
      );
      const range = matches?.groups.range;
      const detail = matches?.groups.detail;
      const rangeParts = range.split("-").map(Number);
      if (rangeParts.length === 1) {
        rangeParts.push(rangeParts[0]);
      }
      return {
        type: "text",
        text: detail,
        range: rangeParts,
      };
    });
  return {
    name: tableName,
    results: rows,
  };
}

module.exports = {
  splitBeforeSubstring,
  parseAttack,
  parseAttacks,
  isTraitStart,
  parseTraits,
  parseStatblock,
  parseRollTable,
};
