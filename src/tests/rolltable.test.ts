import { parseRollTable } from "../rolltable.js";

describe("parseRollTable", () => {
  it("should parse a table with single keys & multiline rows", () => {
    const table = parseRollTable(`
1 Blah blah blah some stuff
and some more stuff
2 Some extra stuff roll 1d4
and here's more text
3 Some extra text for you in
the 3rd result
4 and finally, the last line
with a bit of text
		`);

    expect(table).toEqual({
      type: "table",
      name: "Imported Table",
      results: [
        {
          type: "text",
          text: "Blah blah blah some stuff and some more stuff",
          range: [1, 1],
        },
        {
          type: "text",
          text: "Some extra stuff roll 1d4 and here's more text",
          range: [2, 2],
        },
        {
          type: "text",
          text: "Some extra text for you in the 3rd result",
          range: [3, 3],
        },
        {
          type: "text",
          text: "and finally, the last line with a bit of text",
          range: [4, 4],
        },
      ],
    });
  });
  it("should parse a table with ranged keys", () => {
    const table = parseRollTable(`
01-02 First Event
03-04 Second Event
    `);

    expect(table).toEqual({
      type: "table",
      name: "Imported Table",
      results: [
        {
          type: "text",
          text: "First Event",
          range: [1, 2],
        },
        {
          type: "text",
          text: "Second Event",
          range: [3, 4],
        },
      ],
    });
  });
  it("should parse a table with both single and ranged keys", () => {
    const table = parseRollTable(`
01 First Event
02-03 Second Event
    `);

    expect(table).toEqual({
      type: "table",
      name: "Imported Table",
      results: [
        {
          type: "text",
          text: "First Event",
          range: [1, 1],
        },
        {
          type: "text",
          text: "Second Event",
          range: [2, 3],
        },
      ],
    });
  });
});
