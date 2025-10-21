import type { Table } from "./entity";
import { getLines } from "./util";

const dicePattern = /^\d*d\d+/;

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
  const lines = getLines(tableText);
  let formula = lines[0]?.match(dicePattern)?.[0] ?? undefined;
  if (formula && formula.startsWith("d")) {
    formula = `1${formula}`;
  }
  const rows = lines
    .reduce((arr: string[], line) => {
      if (/^[0-9]/.test(line)) {
        return [...arr, line];
      } else if (dicePattern.test(line)) {
        return arr;
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
      const rangeParts = range?.split("-").map((part) => {
        // Treat "00" as 100
        if (part === "00") return 100;
        return Number(part);
      });
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
    type: "table",
    formula,
    name: tableName,
    results: rows,
  };
}
