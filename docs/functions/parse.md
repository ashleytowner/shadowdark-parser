[**shadowdark-parser**](../README.md)

***

[shadowdark-parser](../globals.md) / parse

# Function: parse()

> **parse**(`entity`): [`Monster`](../type-aliases/Monster.md) \| [`Spell`](../type-aliases/Spell.md) \| [`MagicItem`](../type-aliases/MagicItem.md) \| [`Table`](../type-aliases/Table.md)

Defined in: [parser.ts:38](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/parser.ts#L38)

Parse a generic entry, it will decide what kind of entry it is and return the appropriate JSON

## Parameters

### entity

`string`

The body text of the entity to parse

## Returns

[`Monster`](../type-aliases/Monster.md) \| [`Spell`](../type-aliases/Spell.md) \| [`MagicItem`](../type-aliases/MagicItem.md) \| [`Table`](../type-aliases/Table.md)
