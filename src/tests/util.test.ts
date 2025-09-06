import { getLines, getName } from "../util";

describe("getLines", () => {
  it("splits multiline text into an array", () => {
    expect(getLines("foo\nbar\nbaz qux")).toEqual(["foo", "bar", "baz qux"]);
  });
  it("trims the lines", () => {
    expect(getLines("  foo   \n  bar ")).toEqual(["foo", "bar"]);
  });
});

describe("getName", () => {
  it("gets the first line when the name is not all caps", () => {
    expect(getName(["hello", "world"])).toBe("hello");
  });
  it("gets all of the initial lines that are in all caps", () => {
    expect(getName(["HELLO", "WORLD", "not caps"])).toBe("HELLO WORLD");
  });
  it("includes names with commas", () => {
    expect(getName(["HELLO,", "WORLD", "not caps"])).toBe("HELLO, WORLD");
  });
  it("includes names with apostrophes", () => {
    expect(getName(["HELLO'S", "WORLD", "not caps"])).toBe("HELLO'S WORLD");
  });
  it("does not add spaces after hyphens", () => {
    expect(getName(["DEMON SCARY-", "MAN", "some demon stuff"])).toBe(
      "DEMON SCARY-MAN",
    );
  });
});
