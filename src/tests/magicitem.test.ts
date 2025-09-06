import { parseMagicItem } from "../magicitem";

describe("parseMagicItem", () => {
  it("should parse a magic item with a benefit & curse", () => {
    const item = parseMagicItem(`
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
    expect(item.type).toBe("magicItem");
    expect(item.description).toBe(
      "A brass, telescoping lens with magical runes carved on it.",
    );
    expect(item.traits).toEqual([
      {
        type: "trait",
        name: "Benefit",
        description:
          "When you look through the spyglass, you can see invisible creatures and objects.",
      },
      {
        type: "trait",
        name: "Curse",
        description:
          "The wielder feels a compulsion to look at everything through the spyglass.",
      },
    ]);
  });

  it("should parse the name of a multi-line name magic item", () => {
    const item = parseMagicItem(`
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
