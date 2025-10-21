import { parseRollTable } from "../rolltable";

describe("parseRollTable", () => {
	it("sets the roll formula", () => {
		const table = parseRollTable(`d6 Details
01 xxx
02 xxx
03 xxx
04 xxx
05 xxx
06 xxx`);
		expect(table.formula).toBe('1d6');
	});
  it("should parse a d100 table with a duplicate header", () => {
    const table = parseRollTable(`d100 Details
01 xxx
02-03 xxx
04-05 xxx
06-07 xxx
08-09 xxx
10-11 xxx
12-13 xxx
14-15 xxx
16-17 xxx
18-19 xxx
20-21 xxx
22-23 xxx
24-25 xxx
26-27 xxx
28-29 xxx
30-31 xxx
32-33 xxx
34-35 xxx
36-37 xxx
38-39 xxx
40-41 xxx
42-43 xxx
44-45 xxx
d100 Details
46-47 xxx
48-49 xxx
50-53 xxx
54-55 xxx
56-57 xxx
58-59 xxx
60-61 xxx
62-63 xxx
64-65 xxx
66-67 xxx
68-69 xxx
70-71 xxx
72-73 xxx
74-75 xxx
76-77 xxx
78-79 xxx
80-81 xxx
82-83 xxx
84-85 xxx
86-87 xxx
88-89 xxx
90-91 xxx
92-93 xxx
94-95 xxx
96-97 xxx
98-99 xxx
00 xxx
`);
    expect(table.results).toEqual([
      { range: [1, 1], text: "xxx", type: "text" },
      { range: [2, 3], text: "xxx", type: "text" },
      { range: [4, 5], text: "xxx", type: "text" },
      { range: [6, 7], text: "xxx", type: "text" },
      { range: [8, 9], text: "xxx", type: "text" },
      { range: [10, 11], text: "xxx", type: "text" },
      { range: [12, 13], text: "xxx", type: "text" },
      { range: [14, 15], text: "xxx", type: "text" },
      { range: [16, 17], text: "xxx", type: "text" },
      { range: [18, 19], text: "xxx", type: "text" },
      { range: [20, 21], text: "xxx", type: "text" },
      { range: [22, 23], text: "xxx", type: "text" },
      { range: [24, 25], text: "xxx", type: "text" },
      { range: [26, 27], text: "xxx", type: "text" },
      { range: [28, 29], text: "xxx", type: "text" },
      { range: [30, 31], text: "xxx", type: "text" },
      { range: [32, 33], text: "xxx", type: "text" },
      { range: [34, 35], text: "xxx", type: "text" },
      { range: [36, 37], text: "xxx", type: "text" },
      { range: [38, 39], text: "xxx", type: "text" },
      { range: [40, 41], text: "xxx", type: "text" },
      { range: [42, 43], text: "xxx", type: "text" },
      { range: [44, 45], text: "xxx", type: "text" },
      { range: [46, 47], text: "xxx", type: "text" },
      { range: [48, 49], text: "xxx", type: "text" },
      { range: [50, 53], text: "xxx", type: "text" },
      { range: [54, 55], text: "xxx", type: "text" },
      { range: [56, 57], text: "xxx", type: "text" },
      { range: [58, 59], text: "xxx", type: "text" },
      { range: [60, 61], text: "xxx", type: "text" },
      { range: [62, 63], text: "xxx", type: "text" },
      { range: [64, 65], text: "xxx", type: "text" },
      { range: [66, 67], text: "xxx", type: "text" },
      { range: [68, 69], text: "xxx", type: "text" },
      { range: [70, 71], text: "xxx", type: "text" },
      { range: [72, 73], text: "xxx", type: "text" },
      { range: [74, 75], text: "xxx", type: "text" },
      { range: [76, 77], text: "xxx", type: "text" },
      { range: [78, 79], text: "xxx", type: "text" },
      { range: [80, 81], text: "xxx", type: "text" },
      { range: [82, 83], text: "xxx", type: "text" },
      { range: [84, 85], text: "xxx", type: "text" },
      { range: [86, 87], text: "xxx", type: "text" },
      { range: [88, 89], text: "xxx", type: "text" },
      { range: [90, 91], text: "xxx", type: "text" },
      { range: [92, 93], text: "xxx", type: "text" },
      { range: [94, 95], text: "xxx", type: "text" },
      { range: [96, 97], text: "xxx", type: "text" },
      { range: [98, 99], text: "xxx", type: "text" },
      { range: [100, 100], text: "xxx", type: "text" },
    ]);
  });
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
