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

/**
 * Get the name of an entity.
 * In most cases, this identifies the first line as the name,
 * but in cases where there are 2+ lines in all caps at the start,
 * it will assume they are all part of the name.
 * @param lines
 */
export function getName(lines: string[]) {
  const allCapsPattern = /^[A-Z -']+$/;
  const nameLines = [];

  while (lines[0] && allCapsPattern.test(lines[0])) {
    nameLines.push(lines.shift());
  }

  if (nameLines.length === 0) {
    return lines.shift();
  } else {
    return nameLines.join(" ").trim();
  }
}
