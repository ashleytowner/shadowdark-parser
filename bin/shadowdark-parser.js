#!/usr/bin/env node
const parser = require("../parser.js");
const readline = require("readline");
const fs = require("fs");

(async () => {
  const filename = process.argv[2];
  let entry = "";
  if (!filename || filename === "-") {
    const lines = [];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    for await (const line of rl) {
      lines.push(line);
    }

    entry = lines.join("\n");
  } else {
    try {
      entry = fs.readFileSync(filename).toString();
    } catch (e) {
      console.error("Failed to read file", e);
    }
  }

  console.log(JSON.stringify(parser.parse(entry)));
})();
