import * as parser from './parser.js'


describe("parseStatblock", () => {
  it("Does not infinitely loop when it can't find the end of the statblock", () => {
    const parseHydra = () => parser.parseStatblock(`
HYDRA 
A towering, amphibious reptile 
with a bouquet of snake heads 
writhing on long necks. 
AC 15, HP *, ATK 1 bite (near) +6 
(1d8), MV near (swim), S +5, D +1, 
C +2, I -2, W +1, 
 Ch -2, AL N, LV
Heads. Choose how many heads 
the hydra has. Each is LV 2, AC 
15, HP 11, and can make 1 bite 
attack. A killed head sprouts into 
two new heads at the start of the 
hydra's turn unless cauterized 
beforehand. The hydra's LV is all 
the heads combined. 
	`);
    expect(parseHydra).toThrow();
  });
  it("handles trailing spaces in the statblock", () => {
    const hydra = parser.parseStatblock(`
HYDRA 
A towering, amphibious reptile 
with a bouquet of snake heads 
writhing on long necks. 
AC 15, HP *, ATK 1 bite (near) +6 
(1d8), MV near (swim), S +5, D +1, 
C +2, I -2, W +1, 
 Ch -2, AL N, LV * 
Heads. Choose how many heads 
the hydra has. Each is LV 2, AC 
15, HP 11, and can make 1 bite 
attack. A killed head sprouts into 
two new heads at the start of the 
hydra's turn unless cauterized 
beforehand. The hydra's LV is all 
the heads combined. 
	`);
    expect(hydra.charisma).toBe(-2);
  });
  it("parses an any-levelled statblock", () => {
    const hydra = parser.parseStatblock(`
HYDRA
A towering, amphibious reptile
with a bouquet of snake heads
writhing on long necks.
AC 15, HP *, ATK 1 bite (near) +6
(1d8), MV near (swim), S +5, D +1,
C +2, I -2, W +1, Ch -2, AL N, LV *
Heads. Choose how many heads
the hydra has. Each is LV 2, AC
15, HP 11, and can make 1 bite
attack. A killed head sprouts into
two new heads at the start of the
hydra's turn unless cauterized
beforehand. The hydra's LV is all
the heads combined.
	`);
    expect(hydra.hp).toBe("*");
    expect(hydra.level).toBe("*");
  });

  it("parses a multi-level statblock", () => {
    const airElemental = parser.parseStatblock(`
ELEMENTAL, AIR
A howling tornado of wind.
AC 16, HP 29/42, ATK 3 slam +7
(2d6/3d6) or 1 whirlwind, MV
double near (fly), S +3, D +5, C +2,
I -2, W +1, Ch -2, AL N, LV 6/9
Impervious. Only damaged by
magical sources.
Whirlwind. All within close DC
15 DEX or flung 2d20 feet in
random direction.
		`);
    expect(airElemental.hp).toEqual("29/42");
    expect(airElemental.level).toEqual("6/9");
  });

  it("parses a statblock with no traits", () => {
    const griffon = parser.parseStatblock(`
GRIFFON
Winged hunters with the head
of an eagle and body of a lion.
Their favored food is horses.
AC 12, HP 19, ATK 2 rend +4
(1d10), MV double near (fly), S +4,
D +2, C +1, I -3, W +1, Ch -1, AL N,
LV 4
		`);
    expect(griffon.traits).toEqual([]);
  });
  it("parses a statblock with no description", () => {
    const griffon = parser.parseStatblock(`
GRIFFON
AC 12, HP 19, ATK 2 rend +4
(1d10), MV double near (fly), S +4,
D +2, C +1, I -3, W +1, Ch -1, AL N,
LV 4
		`);
    expect(griffon.description).toEqual("");
  });

  it("Correctly identifies spell traits", () => {
    const drowPriestess = parser.parseStatblock(`Drow, Priestess

A statuesque female drow with a crown of metal spider webs and an
imperious gaze.

AC 16 (mithral chainmail), HP 28, ATK 3 snake whip (near) +4 (1d8 +
poison) or 1 spell +4, MV near, S +2, D +3, C +1, I +3, W +4, Ch +3, AL
C, LV 6

Poison. DC 15 CON or paralyzed 1d4 rounds.

Sunblind. Blinded in bright light.

Snuff (WIS Spell). DC 12. Extinguish all light sources (even magical)
within near.

Summon Spiders (WIS Spell). DC 14. Summon 2d4 loyal giant spiders that
appear within near. They stay for 5 rounds.

Web (WIS Spell). DC 13. A near- sized cube of webs within far
immobilizes all inside it for 5 rounds. DC 15 STR on turn to break free.
		`);

    expect(drowPriestess.traits).toContainEqual({
      name: "Web (WIS Spell)",
      description:
        "DC 13. A near- sized cube of webs within far immobilizes all inside it for 5 rounds. DC 15 STR on turn to break free.",
    });
  });

  it("Correctly identifies movement speed & types", () => {
    const stingbat = parser.parseStatblock(`
STINGBAT
Darting, orange insect-bat with
four wings and needlelike beak.
AC 12, HP 4, ATK 1 beak +2 (1d4 +
blood drain), MV near (fly), S -2,
D +2, C +0, I -2, W +0, Ch -2, AL N,
LV 1
Blood Drain. Attach to bitten
target; auto-hit the next round.
DC 9 STR on turn to remove.
		`);
    expect(stingbat.movementDistance).toBe("near");
    expect(stingbat.movementType).toBe("fly");
  });

  it("Handles two-word movement like 'double near'", () => {
    const hippogriff = parser.parseStatblock(`HIPPOGRIFF
Fierce, winged creatures with
the lower body of a horse and
upper body of a giant eagle.
AC 13, HP 14, ATK 2 rend +3 (1d8),
MV double near (fly), S +3, D +3, C
+1, I -3, W +1, Ch -2, AL N, LV 3`);
    expect(hippogriff.movementDistance).toBe("double near");
    expect(hippogriff.movementType).toBe("fly");
  });

  it("Excludes movement type when unspecified", () => {
    const basilisk = parser.parseStatblock(`
BASILISK
Massive, muscled lizards with six
legs and gray, tough hide.
AC 14, HP 25, ATK 2 bite +4 (2d6 +
petrify), MV near, S +3, D +1, C +3,
I -3, W +1, Ch -3, AL N, LV 5
Petrify. Any creature that
touches the basilisk or meets its
gaze, DC 15 CON or petrified.
		`);

    expect(basilisk.movementDistance).toBe("near");
    expect(basilisk.movementType).toBe(undefined);
  });

  it("Identifies armor types", () => {
    const bandit = parser.parseStatblock(`
BANDIT
Hard-bitten rogue in tattered
leathers and a hooded cloak.
AC 13 (leather + shield), HP 4,
ATK 1 club +1 (1d4) or 1 shortbow
(far) +0 (1d4), MV near, S +1, D +0,
C +0, I -1, W +0, Ch -1, AL C, LV 1
Ambush. Deal an extra die of
damage when undetected.
		`);
    expect(bandit.armor).toBe("leather + shield");
  });
  it("handles variable alignment", () => {
    const bandit = parser.parseStatblock(`
BANDIT
Hard-bitten rogue in tattered
leathers and a hooded cloak.
AC 13 (leather + shield), HP 4,
ATK 1 club +1 (1d4) or 1 shortbow
(far) +0 (1d4), MV near, S +1, D +0,
C +0, I -1, W +0, Ch -1, AL *, LV 1
Ambush. Deal an extra die of
damage when undetected.`);

    expect(bandit.alignment).toBe("*");
  });

  it("expands alignment to a full word", () => {
    const bandit = parser.parseStatblock(`
BANDIT
Hard-bitten rogue in tattered
leathers and a hooded cloak.
AC 13 (leather + shield), HP 4,
ATK 1 club +1 (1d4) or 1 shortbow
(far) +0 (1d4), MV near, S +1, D +0,
C +0, I -1, W +0, Ch -1, AL C, LV 1
Ambush. Deal an extra die of
damage when undetected.
		`);
    const caveCreeper = parser.parseStatblock(`
CAVE CREEPER
Chittering, green centipedes the
size of horses. Their grasping
tentacles are coated in a
paralytic venom.
AC 12, HP 18, ATK 1 bite +3 (1d6)
and 1 tentacles +3 (1d8 + toxin),
MV near (climb), S +2, D +2, C +0,
I -3, W +1, Ch -3, AL N, LV 4
Toxin. DC 12 CON or paralyzed
1d4 rounds.
		`);
    const azer = parser.parseStatblock(`
AZER
Dwarves with bronze, metallic
skin and flames in place of hair.
Gifted blacksmiths.
AC 15, HP 15, ATK 2 flaming
warhammer +3 (1d10, ignites
flammables) or 1 crossbow (far)
+0 (1d6), MV near, S +3, D +0, C
+2, I +0, W +0, Ch +0, AL L, LV 3
Impervious. Fire immune
		`);
    expect(bandit.alignment).toBe("Chaotic");
    expect(caveCreeper.alignment).toBe("Neutral");
    expect(azer.alignment).toBe("Lawful");
  });
  it("handles X in place of Ch", () => {
    const monster = parser.parseStatblock(`
MONSTER
Description
AC 15, HP 15, ATK 1 punch +2 (1d6),
MV near, S +3, D +0, C
+2, I +0, W +0, X +2, AL L, LV 3
`);
    expect(monster.charisma).toBe(2);
  });
  it("handles Z in place of Ch", () => {
    const monster = parser.parseStatblock(`
MONSTER
Description
AC 15, HP 15, ATK 1 punch +2 (1d6),
MV near, S +3, D +0, C
+2, I +0, W +0, Z +2, AL L, LV 3
`);
    expect(monster.charisma).toBe(2);
  });

  it("handles stats where the sign & number are split across lines", () => {
    const shadow = parser.parseStatblock(`
SHADOW
Flitting, sentient shadows in
the vague shape of a human.
AC 12, HP 15, ATK 2 touch +2
(1d4 + drain), MV near (fly), S -
4, D +2, C +2, I -2, W +0, Ch -1,
AL C, LV 3
Drain. Target takes 1 STR
damage. At 0 STR, target dies
and becomes a shadow.`);

    expect(shadow.strength).toBe(-4);
    expect(shadow.dexterity).toBe(2);

    const test = parser.parseStatblock(`
MONSTER
xxxxxx xxxxxx xxxx xxxxxxxxx
xxxx xxxx-xxxxx xxxxxx xxxx
xxxx. xxxxxx xxxxxxx xxxx
xxxxx xx xxxxxxxxx xxxxxxxxx.
AC 13, HP 57, ATK 2 bite +10
(2d8), MV double near (swim),
S +4, D +1, C +3, I -3, W +1, Ch -
2, AL N, LV 12
xxxxxxxx xxxxx. xxxxxxx-xxxxx
xxxxxxxx xxxxxxx xxxx xxxxxx
xx xxx xxxxx. xxxxxx xx xxxxxx
xx xxxx xxx xxx.
xxxxxxxxxxx. xx xxx xxxxx,
xxxxxxxxx xxxxxx xxxx xx xxxx.
xx xxxx, xxxxxxxxx xxxxxx xxxx
xx xxxx-xxxxx xxxxx xxxx.`);

    expect(test.charisma).toBe(-2);
  });
});

describe("parseRollTable", () => {
  it("should parse a table with single keys & multiline rows", () => {
    const table = parser.parseRollTable(`
1 Blah blah blah some stuff
and some more stuff
2 Some extra stuff roll 1d4
and here's more text
3 Some extra text for you in
the 3rd result
4 and finally, the last line
with a bit of text
		`);

    expect(table).toEqual({
      name: "Imported Table",
      results: [
        {
          type: "text",
          text: "Blah blah blah some stuff and some more stuff",
          range: [1, 1],
        },
        {
          type: "text",
          text: "Some extra stuff roll 1d4 and here's more text",
          range: [2, 2],
        },
        {
          type: "text",
          text: "Some extra text for you in the 3rd result",
          range: [3, 3],
        },
        {
          type: "text",
          text: "and finally, the last line with a bit of text",
          range: [4, 4],
        },
      ],
    });
  });
  it("should parse a table with ranged keys", () => {
    const table = parser.parseRollTable(`
01-02 First Event
03-04 Second Event
    `);

    expect(table).toEqual({
      name: "Imported Table",
      results: [
        {
          type: "text",
          text: "First Event",
          range: [1, 2],
        },
        {
          type: "text",
          text: "Second Event",
          range: [3, 4],
        },
      ],
    });
  });
  it("should parse a table with both single and ranged keys", () => {
    const table = parser.parseRollTable(`
01 First Event
02-03 Second Event
    `);

    expect(table).toEqual({
      name: "Imported Table",
      results: [
        {
          type: "text",
          text: "First Event",
          range: [1, 1],
        },
        {
          type: "text",
          text: "Second Event",
          range: [2, 3],
        },
      ],
    });
  });
});

describe("parseSpell", () => {
  const demoSpell = `
SPELL NAME
Tier 1, priest, wizard
Duration: 1 round
Range: Near
This is some spell description.
This is a bit more spell
description stuff.
Very good.
`;
  it("should get the spell name", () => {
    const spell = parser.parseSpell(demoSpell);
    expect(spell.name).toBe("SPELL NAME");
  });
  it("should get the spell tier", () => {
    const spell = parser.parseSpell(demoSpell);
    expect(spell.tier).toBe(1);
  });
  it("should get the spell classes", () => {
    const spell = parser.parseSpell(demoSpell);
    expect(spell.classes).toEqual(["priest", "wizard"]);
  });
  it("should get the spell duration", () => {
    const spell = parser.parseSpell(demoSpell);
    expect(spell.duration).toBe("1 round");
  });
  it("should get the spell range", () => {
    const spell = parser.parseSpell(demoSpell);
    expect(spell.range).toBe("near");
  });
  it("should split up description lines", () => {
    const spell = parser.parseSpell(demoSpell);
    expect(spell.description).toBe(
      "This is some spell description.\nThis is a bit more spell description stuff.\nVery good.",
    );
  });
});

describe("parseMagicItem", () => {
  it("should parse a magic item with a benefit & curse", () => {
    const item = parser.parseMagicItem(`
SPYGLASS OF TRUE SIGHT
A brass, telescoping lens with
magical runes carved on it.
Benefit. When you look through
the spyglass, you can see
invisible creatures and objects.
Curse. The wielder feels a
compulsion to look at everything
through the spyglass.`);

    expect(item.name).toBe("SPYGLASS OF TRUE SIGHT");
    expect(item.description).toBe(
      "A brass, telescoping lens with magical runes carved on it.",
    );
    expect(item.traits).toEqual([
      {
        name: "Benefit",
        description:
          "When you look through the spyglass, you can see invisible creatures and objects.",
      },
      {
        name: "Curse",
        description:
          "The wielder feels a compulsion to look at everything through the spyglass.",
      },
    ]);
  });

  it("should parse the name of a multi-line name magic item", () => {
    const item = parser.parseMagicItem(`
		POTION OF
GIANT STRENGTH
A clay jar holding a stew of
green, leafy sludge.
Benefit. Your Strength becomes
18 (+4) and you deal x2 damage
on melee attacks for 10 rounds.`);

    expect(item.name).toBe("POTION OF GIANT STRENGTH");
  });
});

describe("identify", () => {
  it("should correctly identify a monster statblock", () => {
    const identity = parser.identify(`
       ELEMENTAL, AIR
       A howling tornado of wind.
       AC 16, HP 29/42, ATK 3 slam +7
       (2d6/3d6) or 1 whirlwind, MV
       double near (fly), S +3, D +5, C +2,
       I -2, W +1, Ch -2, AL N, LV 6/9
       Impervious. Only damaged by
       magical sources.
       Whirlwind. All within close DC
       15 DEX or flung 2d20 feet in
       random direction.
   `);
    expect(identity).toBe("MONSTER");
  });

  it("should correctly identify a roll table", () => {
    const identity = parser.identify(`
01 First Event
02 Second Event`);
    expect(identity).toBe("TABLE");
  });

  it("should correctly identify a spell", () => {
    const identity = parser.identify(`
INVISIBILITY
Tier 2, wizard

Duration: 10 rounds
Range: Close

A creature you touch becomes invisible for the spell’s duration.

The spell ends if the target attacks or casts a spell.`);
    expect(identity).toBe("SPELL");
  });

  it("should correctly identify a magic item with a benefit & curse", () => {
    const identity = parser.identify(`
SPYGLASS OF TRUE SIGHT
A brass, telescoping lens with
magical runes carved on it.
Benefit. When you look through
the spyglass, you can see
invisible creatures and objects.
Curse. The wielder feels a
compulsion to look at everything
through the spyglass.`);

    expect(identity).toBe("MAGICITEM");
  });

  it("should correctly identify a magic item with a personality & bonus", () => {
    const identity = parser.identify(`
SHIELD OF THE WITCH-KING
A jagged triangle of black steel
with spiny, armored plates.
Bonus. +2 shield. Can only be
wielded by a chaotic being.
Benefit. You take half damage
from undead creatures.
Curse. If you go to 0 HP, the
spirit of Ix-Natheer tries to steal
your body. He blocks healing
magic from affecting you. If you
die, Ix-Natheer possesses you.
Personality. Chaotic. The spirit
of the witch-king Ix-Natheer
animates this shield. He pounces
on opportunities to betray his
wielder so he can try to take over
their body and return to unlife.`);

    expect(identity).toBe("MAGICITEM");
  });

  it("should return undefined when it cannot identify something", () => {
    const identity = parser.identify("foobar");
    expect(identity).toBe(undefined);
  });
});
