import { parseAttack, parseAttacks } from "../attacks.js";

describe("parseAttack", () => {
  it("handles a melee weapon attack", () => {
    expect(parseAttack("1 sword +5 (1d6)")).toEqual({
      quantity: "1",
      name: "sword",
      range: undefined,
      bonus: "+5",
      damage: "1d6",
    });
  });
  it("handles a ranged weapon attack", () => {
    expect(parseAttack("1 bow (far) +5 (1d6)")).toEqual({
      quantity: "1",
      name: "bow",
      range: "far",
      bonus: "+5",
      damage: "1d6",
    });
  });
  it("handles a thrown weapon attack", () => {
    expect(parseAttack("1 dagger (close/near) +5 (1d6)")).toEqual({
      quantity: "1",
      name: "dagger",
      range: "close/near",
      bonus: "+5",
      damage: "1d6",
    });
  });
  it("handles a spell or named trait with no bonus", () => {
    expect(parseAttack("1 spell")).toEqual({
      quantity: "1",
      name: "spell",
      bonus: undefined,
      damage: undefined,
      range: undefined,
    });
    expect(parseAttack("1 multi word spell")).toEqual({
      quantity: "1",
      name: "multi word spell",
      bonus: undefined,
      damage: undefined,
      range: undefined,
    });
  });
  it("handles a trait with no quantity or bonus", () => {
    expect(parseAttack("bone")).toEqual({
      quantity: undefined,
      name: "bone",
      bonus: undefined,
      damage: undefined,
      range: undefined,
    });

    expect(parseAttack("blood whip")).toEqual({
      quantity: undefined,
      name: "blood whip",
      bonus: undefined,
      damage: undefined,
      range: undefined,
    });
  });
  it("separates the bonus for spells with a bonus", () => {
    expect(parseAttack("1 spell +3")).toEqual({
      quantity: "1",
      name: "spell",
      bonus: "+3",
      damage: undefined,
      range: undefined,
    });
  });
});

describe("parseAttacks", () => {
  it("groups 'and' attacks together", () => {
    expect(parseAttacks("1 spell and 1 sword +2 (1d6)").length).toBe(1);
  });
  it("splits 'or' attacks up", () => {
    expect(
      parseAttacks(
        "1 spell or 1 sword +2 (1d6) or 1 dagger (close/near) +1 (1d4)",
      ).length,
    ).toBe(3);
  });
});
