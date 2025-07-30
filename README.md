# Shadowdark Parser

This tool takes the default shadowdark statblock format and converts the monster into JSON. It is pretty flexible in parsing, in that:

- It doesn't require blank lines between monster traits
- It can handle monsters with no descriptions
- It can handle monsters with variable/multiple levels (like the hydra, or elementals)
- It can handle monsters complex monsters like the ten-eyed oracle & the tarrasque

## Usage

1. Run `npm install shadowdark-parser`
2. Use it in your code:

```js
const shadowdarkParser = require('shadowdark-parser');
const stingbat = shadowdarkParser.parseStatblock(`
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

- `parseStatblock` - Parses monster statblocks & outputs JSON
- `parseRollTable` - Parses a rolltable into a JSON format readable by Foundry


## Contributions

This repo is open to contributions, but given the complexity of the parser, please
ensure that you run all jest tests before making your PR, and write new tests for your features & fixes

## Legal Info
Shadowdark Parser is an independent product published under the Shadowdark RPG Third-Party License and is not affiliated with The Arcane Library, LLC. Shadowdark RPG © 2023 The Arcane Library, LLC.
