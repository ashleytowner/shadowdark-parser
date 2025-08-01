const parser = require("./parser.js");

describe("splitBeforeSubstring", () => {
  it("returns the part before the substring first", () => {
    expect(parser.splitBeforeSubstring("foo, bar.baz", ", ")[0]).toBe("foo");
  });

  it("returns the remainder of the string second", () => {
    expect(parser.splitBeforeSubstring("foo, bar.baz", ", ")[1]).toBe(
      "bar.baz",
    );
  });
});

describe("parseAttack", () => {
  it("handles a melee weapon attack", () => {
    expect(parser.parseAttack("1 sword +5 (1d6)")).toEqual({
      quantity: "1",
      name: "sword",
      range: undefined,
      bonus: "+5",
      damage: "1d6",
    });
  });
  it("handles a ranged weapon attack", () => {
    expect(parser.parseAttack("1 bow (far) +5 (1d6)")).toEqual({
      quantity: "1",
      name: "bow",
      range: "far",
      bonus: "+5",
      damage: "1d6",
    });
  });
  it("handles a thrown weapon attack", () => {
    expect(parser.parseAttack("1 dagger (close/near) +5 (1d6)")).toEqual({
      quantity: "1",
      name: "dagger",
      range: "close/near",
      bonus: "+5",
      damage: "1d6",
    });
  });
  it("handles a spell or named trait with no bonus", () => {
    expect(parser.parseAttack("1 spell")).toEqual({
      quantity: "1",
      name: "spell",
      bonus: undefined,
      damage: undefined,
      range: undefined,
    });
    expect(parser.parseAttack("1 multi word spell")).toEqual({
      quantity: "1",
      name: "multi word spell",
      bonus: undefined,
      damage: undefined,
      range: undefined,
    });
  });
});

describe("parseAttacks", () => {
  it("groups 'and' attacks together", () => {
    expect(parser.parseAttacks("1 spell and 1 sword +2 (1d6)").length).toBe(1);
  });
  it("splits 'or' attacks up", () => {
    expect(
      parser.parseAttacks(
        "1 spell or 1 sword +2 (1d6) or 1 dagger (close/near) +1 (1d4)",
      ).length,
    ).toBe(3);
  });
});

describe("isTraitStart", () => {
  it("rejects lines with no period", () => {
    expect(parser.isTraitStart("this line lacks a period altogether")).toBe(
      false,
    );
  });
  it("rejects lines which don't start with uppercase", () => {
    expect(parser.isTraitStart("this. line Doesn't start with uppercase")).toBe(
      false,
    );
  });
  it("rejects lines whose final word before the first period isn't uppercase", () => {
    expect(parser.isTraitStart("This is almost. A trait")).toBe(false);
  });
  it("accepts valid starts", () => {
    expect(parser.isTraitStart("Bound. A secret, mundane")).toBe(true);
    expect(parser.isTraitStart("Heads. Choose how many heads")).toBe(true);
  });
});

describe("parseStatblock", () => {
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
});

describe("parseRollTable", () => {
  it("should parse a table with single keys", () => {
    const table = parser.parseRollTable(`
01 First Event
02 Second Event
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
          range: [2, 2],
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
