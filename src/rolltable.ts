import { getLines } from "./util.js";

export type Table = {
  /** The name of the table */
  name: string;
  /** The table rows */
  results: {
    type: "text";
    /** The text of the row result */
    text: string;
    /** The number range within which this result is rolled */
    range: [number, number];
  }[];
};

/**
 * Parses an encounter table in the format of
 * 01 First Encounter
 * 02-03 Second Encounter
 * @param tableText The rows of the table
 * @param [tableName] The name of the table
 * @returns a JSON object usable in Foundry
 */
export function parseRollTable(
  tableText: string,
  tableName = "Imported Table",
): Table {
  const rows = getLines(tableText)
    .reduce((arr: string[], line) => {
      if (/^[0-9]/.test(line)) {
        return [...arr, line];
      } else {
        arr[arr.length - 1] += ` ${line}`;
        return arr;
      }
    }, [])
    .map((line) => {
      const matches = line.match(
        /^(?<range>[0-9]+|[0-9]+-[0-9]+) (?<detail>.+)/,
      );
      const range = matches?.groups?.range;
      const detail = matches?.groups?.detail;
      const rangeParts = range?.split("-").map(Number);
      if (rangeParts && rangeParts.length === 1) {
        rangeParts.push(rangeParts[0]!);
      }
      if (!detail) {
        throw new Error(`Could not parse row result:\n\n${line}`);
      }
      if (!rangeParts) {
        throw new Error(`Could not parse row range:\n\n${line}`);
      }
      return {
        type: "text" as const,
        text: detail,
        range: rangeParts as [number, number],
      };
    });
  return {
    name: tableName,
    results: rows,
  };
}
