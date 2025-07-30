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
    expect(
      parser.isTraitStart("this. line Doesn't start with uppercase"),
    ).toBe(false);
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
  it("parses a generic statblock", () => {
    expect(
      parser.parseStatblock(`
HOBGOBLIN
A sturdy, tall goblin with russet
skin. Militant and strategic.
AC 15 (chainmail + shield), HP
10, ATK 1 longsword +3 (1d8) or 1
longbow (far) +0 (1d8), MV near,
S +3, D +0, C +1, I +2, W +1, Ch +1,
AL C, LV 2
Phalanx. +1 to attacks and AC
when in close range of an allied
hobgoblin.
		`),
    ).toEqual({
      name: "HOBGOBLIN",
      description:
        "A sturdy, tall goblin with russet skin. Militant and strategic.",
      ac: 15,
      armor: "chainmail + shield",
      hp: 10,
      attacks: [
        [{ quantity: "1", name: "longsword", bonus: "+3", damage: "1d8" }],
        [{ quantity: "1", name: "longbow (far)", bonus: "+0", damage: "1d8" }],
      ],
      strength: 3,
      dexterity: 0,
      constitution: 1,
      intelligence: 2,
      wisdom: 1,
      charisma: 1,
      alignment: "C",
      level: 2,
      movement: "near",
      traits: [
        {
          name: "Phalanx",
          description:
            "+1 to attacks and AC when in close range of an allied hobgoblin.",
        },
      ],
    });
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
		expect(griffon.description).toEqual('');
  });
});
