# Shadowdark Parser

This tool takes the default shadowdark statblock format and converts the monster into JSON. It is pretty flexible in parsing, in that:

- It doesn't require blank lines between monster traits
- It can handle monsters with no descriptions
- It can handle monsters with variable/multiple levels (like the hydra, or elementals)
- It can handle monsters complex monsters like the ten-eyed oracle & the tarrasque

## Example

### Input
```
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
```

### Output

```json
{
  "name": "STINGBAT",
  "description": "Darting, orange insect-bat with four wings and needlelike beak.",
  "ac": 12,
  "hp": 4,
  "attacks": [
    [
      {
        "quantity": "1",
        "name": "beak",
        "bonus": "+2",
        "damage": "1d4 + blood drain"
      }
    ]
  ],
  "movementDistance": "near",
  "movementType": "fly",
  "strength": -2,
  "dexterity": 2,
  "constitution": 0,
  "intelligence": -2,
  "wisdom": 0,
  "charisma": -2,
  "alignment": "N",
  "level": 1,
  "traits": [
    {
      "name": "Blood Drain",
      "description": "Attach to bitten target; auto-hit the next round. DC 9 STR on turn to remove."
    }
  ]
}
```

## Usage

The actual core code here has no dependencies, just clone the repo and use the `parser.js` file. Call the `parseStatblock` function specifically.

For testing, you'll need to install dependencies. 

## Contributions

This repo is open to contributions, but given the complexity of the parser, please
ensure that you run all jest tests before making your PR, and write new tests for your features & fixes
