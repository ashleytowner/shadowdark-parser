/**
 * Determine whether a line is the beginning of a new trait
 * @param line The line of the statblock
 */
export function isTraitStart(line: string): boolean {
  if (line.indexOf(".") === -1) return false;
  if (!/^[A-Z]$/.test(line.charAt(0))) return false;
  const lastWordBeforePeriod = line.match(/[a-zA-Z0-9_)-]+\./)?.[0];
  if (!lastWordBeforePeriod) {
    throw new Error(`Failed to parse possible trait start, ${line}`);
  }
  if (!/^[A-Z]$/.test(lastWordBeforePeriod.charAt(0))) return false;
  return true;
}

/**
 * A trait is an aspect of some kind on items, monsters, etc
 */
export type Trait = {
  /** The name of the trait */
  name: string;
  /** The description of the trait */
  description: string;
};

/**
 * Parse the traits section of a statblock
 * @param lines the statblock lines containing traits
 */
export function parseTraits(lines: string[]): Trait[] {
  const parsed = [];
  let current = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (isTraitStart(line)) {
      parsed.push(current.trim());
      current = line;
    } else {
      current += ` ${line}`;
    }
  }
  parsed.push(current.trim());
  return parsed.filter(Boolean).map((trait) => {
    const indexOfPeriod = trait.indexOf(". ");
    const name = trait.slice(0, indexOfPeriod).trim();
    const description = trait.slice(indexOfPeriod + 1, trait.length).trim();
    return {
      name,
      description,
    };
  });
}
