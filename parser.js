var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * Break a single string into an array of lines
 * @param str
 */
function getLines(str) {
    return str
        .split("\n")
        .map(function (line) { return line.trim().replace(/  */g, " "); })
        .filter(Boolean);
}
/**
 * Get the name of an entity.
 * In most cases, this identifies the first line as the name,
 * but in cases where there are 2+ lines in all caps at the start,
 * it will assume they are all part of the name.
 * @param lines
 */
function getName(lines) {
    var allCapsPattern = /^[A-Z -']+$/;
    var nameLines = [];
    while (lines[0] && allCapsPattern.test(lines[0])) {
        nameLines.push(lines.shift());
    }
    if (nameLines.length === 0) {
        return lines.shift();
    }
    else {
        return nameLines.join(" ").trim();
    }
}
/**
 * Parse a single attack
 * @param attack a string describing a single attack
 */
function parseAttack(attack) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var matches = attack.match(/^(?<qty>\d+) (?<name>.+)( (?<bonus>(\+|-)(\d+)) \((?<damage>.+)\))$/);
    if (!matches) {
        matches = attack.match(/^(?<qty>\d+) (?<name>.*)( (?<bonus>(\+|-)(\d+)))$/);
    }
    if (!matches) {
        matches = attack.match(/^(?<qty>\d+) (?<name>.*)$/);
    }
    if (!matches) {
        matches = attack.match(/^(?<name>.*)$/);
    }
    var weaponName = (_c = (_b = (_a = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.match(/^[^(]+/)) === null || _c === void 0 ? void 0 : _c[0].trim();
    var weaponRange = (_g = (_f = (_e = (_d = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _d === void 0 ? void 0 : _d.name) === null || _e === void 0 ? void 0 : _e.match(/\((.+)\)/)) === null || _f === void 0 ? void 0 : _f[1]) === null || _g === void 0 ? void 0 : _g.trim();
    if (!weaponName) {
        throw new Error("Failed to parse attack: ".concat(attack));
    }
    return {
        quantity: (_h = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _h === void 0 ? void 0 : _h.qty,
        name: weaponName,
        range: weaponRange,
        bonus: (_j = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _j === void 0 ? void 0 : _j.bonus,
        damage: (_k = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _k === void 0 ? void 0 : _k.damage,
    };
}
/**
 * Parse the attack line of a statblock
 * Group the attacks based on the "and" and "or" usage
 * @param attacks A string of attacks
 * @returns a 2D array of attacks. Each sub-array is a set of attacks
 * that can all happen on the same turn
 */
function parseAttacks(attacks) {
    return attacks
        .split(" or ")
        .map(function (group) { return group.split(" and ").map(function (atk) { return parseAttack(atk); }); });
}
/**
 * Determine whether a line is the beginning of a new trait
 * @param line The line of the statblock
 */
function isTraitStart(line) {
    var _a;
    if (line.indexOf(".") === -1)
        return false;
    if (!/^[A-Z]$/.test(line.charAt(0)))
        return false;
    var lastWordBeforePeriod = (_a = line.match(/[a-zA-Z0-9_)-]+\./)) === null || _a === void 0 ? void 0 : _a[0];
    if (!lastWordBeforePeriod) {
        throw new Error("Failed to parse possible trait start, ".concat(line));
    }
    if (!/^[A-Z]$/.test(lastWordBeforePeriod.charAt(0)))
        return false;
    return true;
}
/**
 * Parse the traits section of a statblock
 * @param lines the statblock lines containing traits
 */
function parseTraits(lines) {
    var parsed = [];
    var current = "";
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (isTraitStart(line)) {
            parsed.push(current.trim());
            current = line;
        }
        else {
            current += " ".concat(line);
        }
    }
    parsed.push(current.trim());
    return parsed.filter(Boolean).map(function (trait) {
        var indexOfPeriod = trait.indexOf(". ");
        var name = trait.slice(0, indexOfPeriod).trim();
        var description = trait.slice(indexOfPeriod + 1, trait.length).trim();
        return {
            name: name,
            description: description,
        };
    });
}
/**
 * Parse a shadowdark statblock
 * @param statblockText The text which makes up the statblock
 */
function parseStatblock(statblockText) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
    var lines = getLines(statblockText);
    var name = getName(lines);
    var description = "";
    while (lines.length > 0 && !lines[0].startsWith("AC ")) {
        description += " ".concat(lines.shift());
    }
    description = description.trim();
    var stats = "";
    while (lines.length > 0 && !/LV [0-9/*]+\s?$/.test(lines[0])) {
        stats += " ".concat(lines.shift());
    }
    stats += " ".concat(lines.shift());
    stats = stats.trim().replace(/  */g, " ");
    var statPattern = /AC (?<ac>.+), HP (?<hp>[0-9/*]+), ATK (?<atks>.+), MV (?<mv>.+), S (?<str>(\+|-) *\d+), D (?<dex>(\+|-) *\d+), C (?<con>(\+|-) *\d+), I (?<int>(\+|-) *\d+), W (?<wis>(\+|-) *\d+), (Ch|X|Z) (?<cha>(\+|-) *\d+), AL (?<al>L|N|C|\*), LV (?<lv>[0-9/*]+)/;
    var matches = stats.match(statPattern);
    var armor = (_c = (_b = (_a = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _a === void 0 ? void 0 : _a.ac) === null || _b === void 0 ? void 0 : _b.match(/\((.+)\)$/)) === null || _c === void 0 ? void 0 : _c[1];
    if (!armor) {
        throw new Error("Failed to parse armor in statblock:\n\n".concat(statblockText));
    }
    var movementType = (_f = (_e = (_d = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _d === void 0 ? void 0 : _d.mv) === null || _e === void 0 ? void 0 : _e.match(/\((.+)\)$/)) === null || _f === void 0 ? void 0 : _f[1];
    var ac = Number((_h = (_g = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _g === void 0 ? void 0 : _g.ac) === null || _h === void 0 ? void 0 : _h.replace(armor, "")) ||
        ((_k = (_j = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _j === void 0 ? void 0 : _j.ac) === null || _k === void 0 ? void 0 : _k.replace(armor, "").trim());
    var hp = Number((_l = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _l === void 0 ? void 0 : _l.hp) || ((_m = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _m === void 0 ? void 0 : _m.hp);
    var attacks = ((_o = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _o === void 0 ? void 0 : _o.atks)
        ? parseAttacks(matches.groups.atks)
        : "";
    var movementDistance = (_q = (_p = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _p === void 0 ? void 0 : _p.mv) === null || _q === void 0 ? void 0 : _q.replace("(".concat(movementType, ")"), "").trim();
    var strength = Number((_s = (_r = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _r === void 0 ? void 0 : _r.str) === null || _s === void 0 ? void 0 : _s.replace(/ /g, ""));
    var dexterity = Number((_u = (_t = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _t === void 0 ? void 0 : _t.dex) === null || _u === void 0 ? void 0 : _u.replace(/ /g, ""));
    var constitution = Number((_w = (_v = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _v === void 0 ? void 0 : _v.con) === null || _w === void 0 ? void 0 : _w.replace(/ /g, ""));
    var intelligence = Number((_y = (_x = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _x === void 0 ? void 0 : _x.int) === null || _y === void 0 ? void 0 : _y.replace(/ /g, ""));
    var wisdom = Number((_0 = (_z = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _z === void 0 ? void 0 : _z.wis) === null || _0 === void 0 ? void 0 : _0.replace(/ /g, ""));
    var charisma = Number((_2 = (_1 = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _1 === void 0 ? void 0 : _1.cha) === null || _2 === void 0 ? void 0 : _2.replace(/ /g, ""));
    var alignment = (_3 = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _3 === void 0 ? void 0 : _3.al;
    var level = Number((_4 = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _4 === void 0 ? void 0 : _4.lv) || ((_5 = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _5 === void 0 ? void 0 : _5.lv);
    if (!ac ||
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
        !level) {
        throw new Error("Could not parse monster stats:\n\n".concat(statblockText));
    }
    var alignmentMap = new Map([
        ["L", "Lawful"],
        ["N", "Neutral"],
        ["C", "Chaotic"],
        ["*", "*"],
    ]);
    return {
        name: name,
        description: description,
        ac: ac,
        armor: armor,
        hp: hp,
        attacks: attacks,
        movementDistance: movementDistance,
        movementType: movementType,
        strength: strength,
        dexterity: dexterity,
        constitution: constitution,
        intelligence: intelligence,
        wisdom: wisdom,
        charisma: charisma,
        alignment: alignmentMap.get(alignment),
        level: level,
        traits: parseTraits(lines),
    };
}
/**
 * Parses an encounter table in the format of
 * 01 First Encounter
 * 02-03 Second Encounter
 * @param tableText The rows of the table
 * @param [tableName] The name of the table
 * @returns a JSON object usable in Foundry
 */
function parseRollTable(tableText, tableName) {
    if (tableName === void 0) { tableName = "Imported Table"; }
    var rows = getLines(tableText)
        .reduce(function (arr, line) {
        if (/^[0-9]/.test(line)) {
            return __spreadArray(__spreadArray([], arr, true), [line], false);
        }
        else {
            arr[arr.length - 1] += " ".concat(line);
            return arr;
        }
    }, [])
        .map(function (line) {
        var _a, _b;
        var matches = line.match(/^(?<range>[0-9]+|[0-9]+-[0-9]+) (?<detail>.+)/);
        var range = (_a = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _a === void 0 ? void 0 : _a.range;
        var detail = (_b = matches === null || matches === void 0 ? void 0 : matches.groups) === null || _b === void 0 ? void 0 : _b.detail;
        var rangeParts = range === null || range === void 0 ? void 0 : range.split("-").map(Number);
        if (rangeParts && rangeParts.length === 1) {
            rangeParts.push(rangeParts[0]);
        }
        if (!detail) {
            throw new Error("Could not parse row result:\n\n".concat(line));
        }
        if (!rangeParts) {
            throw new Error("Could not parse row range:\n\n".concat(line));
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
 * Parse a spell
 * @param spellText The text of the spell body
 */
function parseSpell(spellText) {
    var _a, _b, _c, _d, _e, _f;
    var lines = getLines(spellText);
    if (lines.length === 0) {
        throw new Error("Not enough lines in spell:\n\n".concat(spellText));
    }
    var name = getName(lines);
    var tierAndClasses = lines.shift();
    var _g = tierAndClasses
        .split(",")
        .map(function (part) { return part.trim(); }), tierPart = _g[0], classes = _g.slice(1);
    var tier = Number((_a = tierPart === null || tierPart === void 0 ? void 0 : tierPart.match(/\d+$/)) === null || _a === void 0 ? void 0 : _a[0]);
    var duration = (_c = (_b = lines.shift()) === null || _b === void 0 ? void 0 : _b.match(/^Duration: (.+)$/)) === null || _c === void 0 ? void 0 : _c[1];
    if (!duration) {
        throw new Error("Expected a duration!");
    }
    var range = (_f = (_e = (_d = lines === null || lines === void 0 ? void 0 : lines.shift()) === null || _d === void 0 ? void 0 : _d.match(/^Range: (.+)$/)) === null || _e === void 0 ? void 0 : _e[1]) === null || _f === void 0 ? void 0 : _f.toLowerCase();
    if (!range) {
        throw new Error("Expected a range!");
    }
    var descriptionLines = [];
    var current = "";
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (/^[A-Z]/.test(line) && (current === "" || /\.$/.test(current))) {
            descriptionLines.push(current);
            current = line;
        }
        else {
            current += " ".concat(line);
        }
    }
    descriptionLines.push(current);
    descriptionLines = descriptionLines
        .map(function (line) { return line.trim(); })
        .filter(Boolean);
    return {
        name: name,
        tier: tier,
        classes: classes,
        duration: duration,
        range: range,
        description: descriptionLines.join("\n"),
    };
}
/**
 * Parse a magic item
 * @param itemText The body text of the magic item
 */
function parseMagicItem(itemText) {
    var lines = getLines(itemText);
    if (lines.length === 0) {
        throw new Error("Not enough lines in spell:\n\n".concat(itemText));
    }
    var name = getName(lines);
    var description = [];
    while (lines.length > 0 && !isTraitStart(lines[0])) {
        description.push(lines.shift());
    }
    var traits = parseTraits(lines);
    return {
        name: name,
        description: description.join(" "),
        traits: traits,
    };
}
/**
 * Identify what type of entry is being processed
 * @param entity The entity to identify
 */
function identify(entity) {
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
function parse(entity) {
    var identity = identify(entity);
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
            throw new Error("Could not identify the type of entry. This parser only supports monsters, spells, magic items & roll tables currently");
    }
}
var shadowdarkParser = {
    identify: identify,
    isTraitStart: isTraitStart,
    parse: parse,
    parseAttack: parseAttack,
    parseAttacks: parseAttacks,
    parseMagicItem: parseMagicItem,
    parseRollTable: parseRollTable,
    parseSpell: parseSpell,
    parseStatblock: parseStatblock,
    parseTraits: parseTraits,
};
if (typeof module !== "undefined" && module.exports) {
    module.exports = shadowdarkParser;
}
else {
    window.shadowdarkParser = shadowdarkParser;
}
