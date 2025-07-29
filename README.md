# Shadowdark Statblock Parser

This tool takes the default shadowdark statblock format and converts the monster into JSON. It is pretty flexible in parsing, in that:

- It doesn't require blank lines between monster abilities
- It can handle monsters with no descriptions
- It can handle monsters with variable/multiple levels (like the hydra, or elementals)
- It can handle monsters complex monsters like the ten-eyed oracle & the tarrasque

## Usage

The actual core code here has no dependencies, just clone the repo and use the `parser.js` file. Call the `parseStatblock` function specifically.

For testing, you'll need to install dependencies. 

## Contributions

This repo is open to contributions, but given the complexity of the parser, please
ensure that you run all jest tests before making your PR, and write new tests for your features & fixes
