/**
 * Break a single string into an array of lines
 * @param {string} str
 */
function getLines(str) {
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
 * @param {string[]} lines
 */
function getName(lines) {
  const allCapsPattern = /^[A-Z -']+$/;
  const nameLines = [];

  while (allCapsPattern.test(lines[0]) && lines.length > 0) {
    nameLines.push(lines.shift());
  }

  if (nameLines.length === 0) {
    return lines.shift();
  } else {
    return nameLines.join(" ").trim();
  }
}

/**
 * Parse a single attack
 * @param {string} attack
 */
function parseAttack(attack) {
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

  const weaponName = matches.groups.name.match(/^[^(]+/)[0].trim();
  const weaponRange = matches.groups.name.match(/\((.+)\)/)?.[1].trim();

  return {
    /** The number of this attack that can be made per turn */
    quantity: matches?.groups.qty,
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
  const lastWordBeforePeriod = part.match(/[a-zA-Z0-9_)-]+\./)[0];
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
  const lines = getLines(statblockText);
  const name = getName(lines);
  let description = "";
  while (!lines[0].startsWith("AC ") && lines.length > 0) {
    description += ` ${lines.shift()}`;
  }
  description = description.trim();
  let stats = "";
  while (!/LV [0-9/*]+\s?$/.test(lines[0]) && lines.length > 0) {
    stats += ` ${lines.shift()}`;
  }
  stats += ` ${lines.shift()}`;
  stats = stats.trim().replace(/  */g, " ");

  const statPattern =
    /AC (?<ac>.+), HP (?<hp>[0-9/*]+), ATK (?<atks>.+), MV (?<mv>.+), S (?<str>(\+|-) *\d+), D (?<dex>(\+|-) *\d+), C (?<con>(\+|-) *\d+), I (?<int>(\+|-) *\d+), W (?<wis>(\+|-) *\d+), (Ch|X|Z) (?<cha>(\+|-)\d+), AL (?<al>L|N|C), LV (?<lv>[0-9/*]+)/;

  const matches = stats.match(statPattern);

  const armor = matches?.groups?.ac?.match(/\((.+)\)$/)?.[1];
	const movementType = matches?.groups?.mv?.match(/\((.+)\)$/)?.[1];

	const ac = Number(matches?.groups?.ac?.replace(armor, '')) || matches?.groups?.ac?.replace(armor, '').trim();
	const hp = Number(matches?.groups?.hp) || matches?.groups?.hp;
	const attacks = matches?.groups?.atks ? parseAttacks(matches.groups.atks) : '';
	const movementDistance = matches?.groups?.mv?.replace(`(${movementType})`, '').trim();
  const strength = Number(matches?.groups?.str.replace(/ /g, ''));
  const dexterity = Number(matches?.groups?.dex.replace(/ /g, ''));
  const constitution = Number(matches?.groups?.con.replace(/ /g, ''));
  const intelligence = Number(matches?.groups?.int.replace(/ /g, ''));
  const wisdom = Number(matches?.groups?.wis.replace(/ /g, ''));
  const charisma = Number(matches?.groups?.cha.replace(/ /g, ''));
  const alignment = matches?.groups?.al;
  const level = Number(matches?.groups?.lv) || matches?.groups?.lv;

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
    movementDistance,
    /**
     * The type of movement, e.g. "fly"
     */
    movementType,
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
  const rows = getLines(tableText)
    .reduce((arr, line) => {
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

/**
 * @param {string} spellText
 */
function parseSpell(spellText) {
  const lines = getLines(spellText);
  const name = getName(lines);
  const tierAndClasses = lines.shift();
  const [tierPart, ...classes] = tierAndClasses
    .split(",")
    .map((part) => part.trim());
  const tier = Number(tierPart.match(/\d+$/)[0]);
  const duration = lines.shift().match(/^Duration: (.+)$/)?.[1];
  if (!duration) {
    throw new Error("Expected a duration!");
  }
  const range = lines
    .shift()
    .match(/^Range: (.+)$/)?.[1]
    .toLowerCase();
  if (!range) {
    throw new Error("Expected a range!");
  }
  let descriptionLines = [];
  let current = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
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
 * @param {string} itemText
 */
function parseMagicItem(itemText) {
  const lines = getLines(itemText);
  const name = getName(lines);
  const description = [];
  while (!isTraitStart(lines[0]) && lines.length > 0) {
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
 * @param {string} entry
 * @returns {'MONSTER' | 'TABLE' | 'SPELL' | undefined}
 */
function identify(entry) {
  if (/AC \d+/.test(entry) && /ATK/.test(entry)) {
    return "MONSTER";
  }
  if (/Duration:/.test(entry) && /Range:/.test(entry)) {
    return "SPELL";
  }
  if (/\n(Benefit|Bonus|Personality|Curse)\./.test(entry)) {
    return "MAGICITEM";
  }
  if (/^\d+/.test(entry.trim())) {
    return "TABLE";
  }
  return undefined;
}

/**
 * Parse a generic entry, it will decide what kind of entry it is and return the appropriate JSON
 * @param {string} entry
 */
function parse(entry) {
  const identity = identify(entry);
  switch (identity) {
    case "MONSTER":
      return parseStatblock(entry);
    case "SPELL":
      return parseSpell(entry);
    case "TABLE":
      return parseRollTable(entry);
    case "MAGICITEM":
      return parseMagicItem(entry);
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
  window.shadowdarkParser = shadowdarkParser;
}
