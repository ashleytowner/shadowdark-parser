import { allCapsNamePattern, getLines } from "./util";

/**
 * @param prevLine the previous line, undefined if we are on the first line
 * @param currentLine the current line
 * @param nextLine the next line, undefined if we are on the last line
 * @returns true if this marks the beginning of a new entry
 */
export type EntryIdentifierStrategy = (
  prevLine: string | undefined,
  currentLine: string,
  nextLine: string | undefined,
) => boolean;

export const allCapsStrategy: EntryIdentifierStrategy = (
  prevLine,
  currentLine,
  nextLine,
) => {
  if (
    !allCapsNamePattern.test(prevLine || "") &&
    allCapsNamePattern.test(currentLine)
  ) {
    return true;
  }
  return false;
};

export function splitBulkEntries(
  bulkInput: string,
  strategy: EntryIdentifierStrategy,
) {
  const lines = getLines(bulkInput);
  const entries: string[][] = [];
  let currentEntry: string[] | undefined = undefined;

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i]!;
    if (strategy(lines[i - 1], currentLine, lines[i + 1])) {
      if (currentEntry !== undefined) {
        entries.push(currentEntry);
      }
      currentEntry = [currentLine];
    } else {
      if (currentEntry === undefined) {
        currentEntry = [];
      }
      currentEntry.push(currentLine);
    }
  }
  if (currentEntry !== undefined) entries.push(currentEntry);
  return entries.map(entry => entry.join('\n'));
}
