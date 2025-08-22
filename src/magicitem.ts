import { isTraitStart, parseTraits } from "./traits.js";
import { getLines, getName } from "./util.js";

/**
 * Parse a magic item
 * @param itemText The body text of the magic item
 */
export function parseMagicItem(itemText: string) {
  const lines = getLines(itemText);
  if (lines.length === 0) {
    throw new Error(`Not enough lines in spell:\n\n${itemText}`);
  }
  const name = getName(lines);
  const description = [];
  while (lines.length > 0 && !isTraitStart(lines[0]!)) {
    description.push(lines.shift());
  }
  const traits = parseTraits(lines);
  return {
    name,
    description: description.join(" "),
    traits,
  };
}
