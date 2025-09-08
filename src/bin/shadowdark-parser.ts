#!/usr/bin/env node
import readline from "readline";
import fs from "fs";
import { program } from "commander";
import { bulkParse, parse } from "../parser";
import { allCapsStrategy } from "../splitbulk";
import type { Entity } from "../entity";
import getTemplateFromFile from "../templates";

program
  .name("shadowdark-parser")
  .description(
    "Take statblocks, spell descriptions, roll tables and more from shadowdark and converts them into other formats",
  )
  .version("3.1.0") // x-release-please-version
  .option("-t, --template <file>", "A handlebars template file")
  .option("-o, --output <file>", "The file to output to")
  .option(
    "-b, --bulk",
    "Mark the input as containing multiple entities, one after the other",
  )
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

  let data: Entity | Entity[] | string;

  if (options.bulk) {
    data = bulkParse(entry, allCapsStrategy)[0];
  } else {
    data = parse(entry);
  }

  if (options.template) {
    data = getTemplateFromFile(options.template)(data);
  } else {
    data = JSON.stringify(data);
  }

  if (!options.output) {
    console.log(data);
  } else {
    fs.writeFileSync(options.output, data, "utf8");
  }
})();
