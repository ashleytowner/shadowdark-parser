/**
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
 * @param {string} attack
 */
function parseAttack(attack) {
  let matches = attack.match(
    /^(?<qty>\w+) (?<name>.+)( (?<bonus>(\+|-)(\d+)) \((?<damage>.+)\))$/,
  );
  if (!matches) {
    matches = attack.match(/^(?<qty>\w+) (?<name>.*)$/);
  }

  const weaponName = matches?.groups.name.match(/^[^(]+/)[0].trim();
  const weaponRange = matches?.groups.name.match(/\((.+)\)/)?.[1].trim();

  return {
    quantity: matches?.groups.qty,
    name: weaponName,
    range: weaponRange,
    bonus: matches?.groups.bonus,
    damage: matches?.groups.damage,
  };
}

/**
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
 * @param {string} part
 */
function isTraitStart(part) {
  if (part.indexOf(".") === -1) return false;
	if (!/^[A-Z]$/.test(part[0])) return false
  const lastWordBeforePeriod = part.match(/\w+\./)[0];
	if (!/^[A-Z]$/.test(lastWordBeforePeriod[0])) return false;
  return true;
}

/**
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
      name,
      description,
    };
  });
}

/**
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

  return {
    name,
    description,
    ac,
    armor,
    hp,
    attacks,
    movement,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    alignment,
    level,
    traits: parseTraits(lines),
  };
}

module.exports = {
	splitBeforeSubstring,
	parseAttack,
	parseAttacks,
	isTraitStart,
	parseTraits,
	parseStatblock
}
