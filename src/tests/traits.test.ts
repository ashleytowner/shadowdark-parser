import { isTraitStart } from "../traits";

describe("isTraitStart", () => {
  it("rejects lines with no period", () => {
    expect(isTraitStart("this line lacks a period altogether")).toBe(false);
  });
  it("rejects lines which don't start with uppercase", () => {
    expect(isTraitStart("this. line Doesn't start with uppercase")).toBe(false);
  });
  it("rejects lines whose final word before the first period isn't uppercase", () => {
    expect(isTraitStart("This is almost. A trait")).toBe(false);
  });
  it("accepts valid starts", () => {
    expect(isTraitStart("Bound. A secret, mundane")).toBe(true);
    expect(isTraitStart("Heads. Choose how many heads")).toBe(true);
  });
});
