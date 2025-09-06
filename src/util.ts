/**
 * Break a single string into an array of lines
 * @param str
 */
export function getLines(str: string) {
  return str
    .split("\n")
    .map((line) => line.trim().replace(/  */g, " "))
    .filter(Boolean);
}

export const allCapsNamePattern = /^[A-Z \-',]+$/;

/**
 * Get the name of an entity.
 * In most cases, this identifies the first line as the name,
 * but in cases where there are 2+ lines in all caps at the start,
 * it will assume they are all part of the name.
 * @param lines
 */
export function getName(lines: string[]) {
  const nameLines = [];

  while (lines[0] && allCapsNamePattern.test(lines[0])) {
    nameLines.push(lines.shift());
  }

  let name: string;

  if (nameLines.length === 0) {
    name = lines.shift()!;
  } else {
    name = nameLines.join(" ").trim();
  }

  return name.replace(/- /g, "-").replace(/ -/g, "-");
}
