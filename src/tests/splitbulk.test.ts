import { allCapsStrategy, splitBulkEntries } from "../splitbulk.js";

describe("allCapsStrategy", () => {
  it("identifies a 1-line all-caps name at the beginning", () => {
    expect(
      allCapsStrategy(undefined, "STINGBAT", "Darting, orange insect-bat with"),
    ).toBe(true);
  });

  it("identifies a 1-line all-caps name after another monster", () => {
    expect(
      allCapsStrategy(
        "1d4 rounds.",
        "STINGBAT",
        "Darting, orange insect-bat with",
      ),
    ).toBe(true);
  });

  it("identifies a 2-line all-caps name after another magic item", () => {
    expect(
      allCapsStrategy("check to remove the boots.", "BOOTS OF", "HOVERING"),
    ).toBe(true);
  });

  it("rejects a description which isn't in all caps", () => {
    expect(
      allCapsStrategy(
        "Brown, sturdy boots polished",
        "to a sheen. Small, silver wings",
        "adorn the heels.",
      ),
    ).toBe(false);
  });
});

describe("splitBulkEntries", () => {
  it("splits when the strategy says to do so", () => {
    expect(
      splitBulkEntries("hello\nworld\nhow\nare\nyou?", (_p, c, _n) => {
        return c === "how";
      }),
    ).toEqual(["hello\nworld", "how\nare\nyou?"]);
  });

  it("splits two monsters based on the all caps strategy", () => {
    expect(
      splitBulkEntries(
        "BOOTS OF\nDANCING\nFine, supple boots of sheepskin.\nCurse. As soon as you don these\nboots, you begin cavorting and\ndancing uncontrollably. You\nmove randomly each turn and\nmust pass a DC 15 Dexterity\ncheck to remove the boots.\nBOOTS OF\nHOVERING\nBrown, sturdy boots polished\nto a sheen. Small, silver wings\nadorn the heels.\nBenefit. You can walk on an\ninsubstantial surface for 1 turn\nat a time. You fall through the\nsurface if you end your turn on it.",
        allCapsStrategy,
      ),
    ).toEqual([
      "BOOTS OF\nDANCING\nFine, supple boots of sheepskin.\nCurse. As soon as you don these\nboots, you begin cavorting and\ndancing uncontrollably. You\nmove randomly each turn and\nmust pass a DC 15 Dexterity\ncheck to remove the boots.",
      "BOOTS OF\nHOVERING\nBrown, sturdy boots polished\nto a sheen. Small, silver wings\nadorn the heels.\nBenefit. You can walk on an\ninsubstantial surface for 1 turn\nat a time. You fall through the\nsurface if you end your turn on it.",
    ]);
  });
});
