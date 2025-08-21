#!/usr/bin/env node
const parser = require("../parser.js");
const readline = require("readline");
const fs = require("fs");
const { program } = require("commander");
const Handlebars = require("handlebars");

program
  .name("shadowdark-parser")
  .option("-t, --template <file>", "A handlebars template file")
  .option("-o, --output <file>", "The file to output to")
  .argument(
    "[filename]",
    "The filename to parse. If set to - or left blank, will read from stdin",
    "-",
  )
  .parse();

const options = program.opts();
const filename = program.args[0];

(async () => {
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

  let data = parser.parse(entry);

  if (options.template) {
    const templateSource = fs.readFileSync(options.template, "utf8");
    const template = Handlebars.compile(templateSource);

    const rendered = template(data);

    data = rendered;
  } else {
    data = JSON.stringify(data);
  }

  if (!options.output) {
    console.log(data);
  } else {
    fs.writeFileSync(options.output, data, "utf8");
  }
})();
