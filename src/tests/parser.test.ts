import { identify } from "../parser.js";

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
});
