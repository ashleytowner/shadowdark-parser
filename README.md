# Shadowdark Parser

This tool takes the default shadowdark statblock format and converts the monster into JSON. It is pretty flexible in parsing, in that:

- It doesn't require blank lines between monster traits
- It can handle monsters with no descriptions
- It can handle monsters with variable/multiple levels (like the hydra, or elementals)
- It can handle monsters complex monsters like the ten-eyed oracle & the tarrasque

## Usage

### In your terminal

You can use shadowdark-parser via npx to parse a file

```bash
npx shadowdark-parser [filename]
```

```
Usage: shadowdark-parser [options] [filename]

Arguments:
  filename               The filename to parse. If set to - or left blank, will read from stdin (default: "-")

Options:
  -t, --template <file>  A handlebars template file
  -o, --output <file>    The file to output to
  -h, --help             display help for command
```

#### Custom Handlebars Helpers

Some custom helpers have been implemented to help format statblocks:

- `signedNumber` which can take a number and ensure it always has a sign (`+` or `-`) in front of it
- `firstChar` which returns the first character of a string

#### Example Handlebars Template

```hbs
# {{ name }}

*{{ description }}*

**AC** {{ ac }}{{#if armor}} ({{ armor }}){{/if}}, **HP** {{hp}}, **ATK** {{#each attacks}}{{#each this}}{{quantity}} {{name}} {{bonus}}{{#if damage}} ({{damage}}){{/if}}{{#unless @last}} and {{/unless}}{{/each}}{{#unless @last}} or {{/unless}}{{/each}}, **MV** {{ movementDistance }}{{#if movementType}} ({{movementType}}){{/if}}, **S** {{signedNumber strength}}, **D** {{signedNumber dexterity}}, **C** {{signedNumber constitution}}, **I** {{signedNumber intelligence}}, **W** {{signedNumber wisdom}}, **Ch** {{signedNumber charisma}}, **AL** {{firstChar alignment}}, **LV** {{level}}

{{#each traits}}
**{{name}}.** {{description}}

{{/each}}
```

### In your code

1. Run `npm install shadowdark-parser`
2. Use it in your code:

```js
const shadowdarkParser = require('shadowdark-parser');
const stingbat = shadowdarkParser.parse(`
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

## Functions

- `parse` - Identifies the "type" of the entry, and runs the correct parse function for that type
- `parseStatblock` - Parses monster statblocks & outputs JSON
- `parseRollTable` - Parses a rolltable into a JSON format readable by Foundry
- `parseSpell` - Parses spells & outputs in JSON


## Contributions

This repo is open to contributions, but given the complexity of the parser, please
ensure that you run all jest tests before making your PR, and write new tests for your features & fixes

## Legal Info
Shadowdark Parser is an independent product published under the Shadowdark RPG Third-Party License and is not affiliated with The Arcane Library, LLC. Shadowdark RPG © 2023 The Arcane Library, LLC.
