[**shadowdark-parser**](../README.md)

***

[shadowdark-parser](../globals.md) / parse

# Function: parse()

> **parse**(`entity`): [`Monster`](../type-aliases/Monster.md) \| [`Spell`](../type-aliases/Spell.md) \| [`MagicItem`](../type-aliases/MagicItem.md) \| [`Table`](../type-aliases/Table.md)

Defined in: [parser.ts:38](https://github.com/ashleytowner/shadowdark-parser/blob/2d0b7eb2093d1c323d22fa4f991edc1ad77811ba/src/parser.ts#L38)

Parse a generic entry, it will decide what kind of entry it is and return the appropriate JSON

## Parameters

### entity

`string`

The body text of the entity to parse

## Returns

[`Monster`](../type-aliases/Monster.md) \| [`Spell`](../type-aliases/Spell.md) \| [`MagicItem`](../type-aliases/MagicItem.md) \| [`Table`](../type-aliases/Table.md)
