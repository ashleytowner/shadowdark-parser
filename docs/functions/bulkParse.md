[**shadowdark-parser**](../README.md)

***

[shadowdark-parser](../globals.md) / bulkParse

# Function: bulkParse()

> **bulkParse**(`entities`, `strategy`): readonly \[[`Entity`](../type-aliases/Entity.md)[], `string`[]\]

Defined in: [parser.ts:62](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/parser.ts#L62)

Parse a bulk list of entries, it will use a strategy to split them up, then will parse each of them individually and return tehm as an array

## Parameters

### entities

`string`

the bulk list of entities

### strategy

`EntryIdentifierStrategy`

the strategy to use to split up entities

## Returns

readonly \[[`Entity`](../type-aliases/Entity.md)[], `string`[]\]

a tuple where the first entry is the parsed statblocks, and the second is the statblocks that failed to be parsed
