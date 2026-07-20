import type { Spell } from "./entity";
import { alignmentMap } from "./statblock";
import { getLines, getName } from "./util";

/**
 * Parse a spell
 * @param spellText The text of the spell body
 */
export function parseSpell(spellText: string): Spell {
  const lines = getLines(spellText);
  if (lines.length === 0) {
    throw new Error(`Not enough lines in spell:\n\n${spellText}`);
  }
  const name = getName(lines);
  const tierAndClasses = lines.shift();
  const [tierPart, ...classes] = tierAndClasses!
    .split(",")
    .map((part) => part.trim());
  const tier = Number(tierPart?.match(/\d+$/)?.[0]);
  const duration = lines.shift()?.match(/^Duration: (.+)$/)?.[1];
  if (!duration) {
    throw new Error("Expected a duration!");
  }
  const range = lines
    ?.shift()
    ?.match(/^Range: (.+)$/)?.[1]
    ?.toLowerCase();
  if (!range) {
    throw new Error("Expected a range!");
  }
  let descriptionLines = [];
  let current = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (/^[A-Z]/.test(line) && (current === "" || /\.$/.test(current))) {
      descriptionLines.push(current);
      current = line;
    } else {
      current += ` ${line}`;
    }
  }
  descriptionLines.push(current);
  descriptionLines = descriptionLines
    .map((line) => line.trim())
    .filter(Boolean);
  const mappedClasses = classes.map((cls) => {
    const matches = cls.match(/^([^(]+)(\(([LNC])\))?$/);
    const al = alignmentMap.get(matches?.[3] ?? "*") ?? "*";
    return { class: matches![1]!.trim(), alignment: al };
  });
  return {
    type: "spell",
    name,
    tier,
    classes: mappedClasses,
    duration,
    range,
    description: descriptionLines.join("\n"),
  };
}
