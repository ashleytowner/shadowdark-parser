# Shadowdark Parser

This tool takes statblocks, spell descriptions, rolltables and more copied from shadowdark PDFs and converts them into JSON.

It comes in two forms: 

- A library that you can use in your own code to convert plaintext into structured JSON
- A CLI that takes in plaintext from files or stdin, and outputs it to JSON, or another file controlled by a [Handlebars](https://handlebarsjs.com/) template file.

Currently, this tool supports:

- Monsters
- Spells
- Magic Items
- Roll Tables

This parser has several advantages over a lot of other parsers or pre-generated JSON from the core rulebooks:

- The JSON it outputs is very granular, allowing you to drill down into exactly the parts of the data you want
- It can take text from Cursed Scrolls and even some third-party products, so you aren't limited to things covered under SD's third-party license (although it goes without saying that the resulting JSON should only be used for personal use)
- The CLI can output into any format, as defined by a Handlebar template file (example below)
- The Library has a generic `parse` function which automatically works out what type of entity it is dealing with (monster, spell, table, etc) and will apply the correct parsing function. The CLI tool uses this too.
- It is very good at identifying where traits on monsters & items begin & end, even when there's no linebreak between them.


## Usage

### In your terminal (CLI)

You can use shadowdark-parser via npx to parse a file

```bash
npx shadowdark-parser [filename]
```

```
Usage: shadowdark-parser [options] [filename]

Arguments:
  filename               The filename to parse. If set to - or left blank, will
                         read from stdin (default: "-")

Options:
  -t, --template <file>  A handlebars template file
  -o, --output <file>    The file to output to
  -b, --bulk             Mark the input as containing multiple entities, one
                         after the other
  -n, --name-from-file   Use the name of the file as the name of the entity.
                         This option will do nothing if the file is stdin
  -h, --help             display help for command
```

#### Custom Handlebars Helpers

Some custom helpers have been implemented to help format statblocks:

- `signedNumber` which can take a number and ensure it always has a sign (`+` or `-`) in front of it
- `firstChar` which returns the first character of a string

#### Example Handlebars Template

Check out [the wiki](https://github.com/ashleytowner/shadowdark-parser/wiki/Example-Handlebars-Templates) for some example templates for common use-cases.

### In your code (Library)

1. Run `npm install shadowdark-parser`
2. Use it in your code:

```js
import { parse } from 'shadowdark-parser';
const stingbat = parse(`
STINGBAT
Darting, orange insect-bat with
four wings and needlelike beak.
AC 12, HP 4, ATK 1 beak +2 (1d4 +
blood drain), MV near (fly), S -2,
D +2, C +0, I -2, W +0, Ch -2, AL N,
LV 1
Blood Drain. Attach to bitten
target; auto-hit the next round.
DC 9 STR on turn to remove.
`);

// ...
```

## Contributions

This repo is open to contributions, but given the complexity of the parser, please
ensure that you run all jest tests before making your PR, and write new tests for your features & fixes

## Legal Info
Shadowdark Parser is an independent product published under the Shadowdark RPG Third-Party License and is not affiliated with The Arcane Library, LLC. Shadowdark RPG © 2023 The Arcane Library, LLC.
