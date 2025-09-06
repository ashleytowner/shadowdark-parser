[**shadowdark-parser**](../README.md)

***

[shadowdark-parser](../globals.md) / bulkParse

# Function: bulkParse()

> **bulkParse**(`entities`, `strategy`): ([`Monster`](../type-aliases/Monster.md) \| [`Spell`](../type-aliases/Spell.md) \| [`MagicItem`](../type-aliases/MagicItem.md) \| [`Table`](../type-aliases/Table.md))[]

Defined in: [parser.ts:60](https://github.com/ashleytowner/shadowdark-parser/blob/1a2d078d1d27fe26e21d0272c202629e52b4f006/src/parser.ts#L60)

Parse a bulk list of entries, it will use a strategy to split them up, then will parse each of them individually and return tehm as an array

## Parameters

### entities

`string`

the bulk list of entities

### strategy

`EntryIdentifierStrategy`

the strategy to use to split up entities

## Returns

([`Monster`](../type-aliases/Monster.md) \| [`Spell`](../type-aliases/Spell.md) \| [`MagicItem`](../type-aliases/MagicItem.md) \| [`Table`](../type-aliases/Table.md))[]
