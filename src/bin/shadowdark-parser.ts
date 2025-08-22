#!/usr/bin/env node
import * as parser from '../parser.js';
import readline from 'readline';
import fs from 'fs';
import { program } from 'commander';
import * as Handlebars from 'handlebars';

Handlebars.registerHelper("signedNumber", function (value) {
  if (typeof value === "string") {
    value = Number(value);
  }

  if (value < 0) {
    return String(value);
  } else {
    return `+${value}`;
  }
});

Handlebars.registerHelper("firstChar", function (value) {
  if (typeof value === "string" && value.length > 0) {
    return value.charAt(0);
  } else {
    return "";
  }
});

program
  .name("shadowdark-parser")
  .option("-t, --template <file>", "A handlebars template file")
  .option("-o, --output <file>", "The file to output to")
  .option(
    "-n, --name-from-file",
    "Use the name of the file as the name of the entity. This option will do nothing if the file is stdin",
  )
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
      if (options.nameFromFile) {
        const title = filename.match(/([^\/]+)\.[a-zA-Z]+$/);
        if (!title || !title[1]) {
          console.error(`Failed to get name from filename ${filename}`);
          process.exit(1);
        }
        entry = `${title[1]}\n${entry}`;
      }
    } catch (e) {
      console.error("Failed to read file", e);
    }
  }

  let data: any = parser.parse(entry);

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
