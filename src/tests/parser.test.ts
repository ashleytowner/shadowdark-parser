import { bulkParse, identify } from "../parser.js";
import { allCapsStrategy } from "../splitbulk.js";

describe("identify", () => {
  it("should correctly identify a monster statblock", () => {
    const identity = identify(`
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
    const identity = identify(`
01 First Event
02 Second Event`);
    expect(identity).toBe("TABLE");
  });

  it("should correctly identify a spell", () => {
    const identity = identify(`
INVISIBILITY
Tier 2, wizard

Duration: 10 rounds
Range: Close

A creature you touch becomes invisible for the spell’s duration.

The spell ends if the target attacks or casts a spell.`);
    expect(identity).toBe("SPELL");
  });

  it("should correctly identify a magic item with a benefit & curse", () => {
    const identity = identify(`
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
    const identity = identify(`
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
    const identity = identify("foobar");
    expect(identity).toBe(undefined);
  });

  it("identifies a spell with a statblock in it as a spell", () => {
    const identity = identify(`
SPELL NAME
Tier 1, wizard

Duration: Instant
Range: Close

Some spell description

AC 12, HP 4, ATK 1 beak +2 (1d4 + blood drain), MV near (fly), S -2, D +2, C +0, I -2, W +0, Ch -2, AL N, LV 1
`);
    expect(identity).toBe("SPELL");
  });
});

describe("bulkParse", () => {
  it("parses multiple monsters", () => {
    expect(
      bulkParse(
        "SPIDER, SWARM\nA scurrying carpet of spiders.\nAC 13, HP 9, ATK 1 bite +3 (1d4 +\npoison), MV near (climb), S -1, D\n+3, C +0, I -3, W +1, Ch -3, AL N,\nLV 2\nPoison. DC 12 CON or paralyzed\n1d4 rounds.\nSTINGBAT\nDarting, orange insect-bat with\nfour wings and needlelike beak.\nAC 12, HP 4, ATK 1 beak +2 (1d4 +\nblood drain), MV near (fly), S -2,\nD +2, C +0, I -2, W +0, Ch -2, AL N,\nLV 1\nBlood Drain. Attach to bitten\ntarget; auto-hit the next round.\nDC 9 STR on turn to remove.\nSTRANGLER\nA gray-skinned, gaunt creature\nwith four ropy limbs tipped in\nsucker-lined claws.\nAC 12, HP 14, ATK 2 claws +2\n(1d6), MV near (climb), S -2, D +2,\nC +1, I -2, W +0, Ch -2, AL C, LV 3\nStealthy. ADV on DEX checks to\nsneak and hide.\nStrangle. Deals x2 damage\nagainst surprised creatures.",
        allCapsStrategy,
      ).map(({ type, name }) => ({ type, name })),
    ).toEqual([
      {
        type: "monster",
        name: "SPIDER, SWARM",
      },
      {
        type: "monster",
        name: "STINGBAT",
      },
      {
        type: "monster",
        name: "STRANGLER",
      },
    ]);
  });
  it("parses a monster & magic item next to each other", () => {
    expect(
      bulkParse(
        "STRANGLER\nA gray-skinned, gaunt creature\nwith four ropy limbs tipped in\nsucker-lined claws.\nAC 12, HP 14, ATK 2 claws +2\n(1d6), MV near (climb), S -2, D +2,\nC +1, I -2, W +0, Ch -2, AL C, LV 3\nStealthy. ADV on DEX checks to\nsneak and hide.\nStrangle. Deals x2 damage\nagainst surprised creatures.\nBOOTS OF\nTHE CAT\nGray, doeskin boots as thin and\nsoft as slippers.\nBenefit. You can jump up to a\nnear distance from a standstill.\nYour checks to move silently are\nalways easy (DC 9).",
        allCapsStrategy,
      ).map((entity) => entity.name),
    ).toEqual(["STRANGLER", "BOOTS OF THE CAT"]);
  });
});
