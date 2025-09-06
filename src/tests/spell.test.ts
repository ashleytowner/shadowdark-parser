import { parseSpell } from "../spell";

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
    const spell = parseSpell(demoSpell);
    expect(spell.name).toBe("SPELL NAME");
  });
  it("should get the spell tier", () => {
    const spell = parseSpell(demoSpell);
    expect(spell.tier).toBe(1);
  });
  it("should get the spell classes", () => {
    const spell = parseSpell(demoSpell);
    expect(spell.classes).toEqual(["priest", "wizard"]);
  });
  it("should get the spell duration", () => {
    const spell = parseSpell(demoSpell);
    expect(spell.duration).toBe("1 round");
  });
  it("should get the spell range", () => {
    const spell = parseSpell(demoSpell);
    expect(spell.range).toBe("near");
  });
  it("should split up description lines", () => {
    const spell = parseSpell(demoSpell);
    expect(spell.description).toBe(
      "This is some spell description.\nThis is a bit more spell description stuff.\nVery good.",
    );
  });
});
