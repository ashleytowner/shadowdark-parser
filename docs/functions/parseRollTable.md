[**shadowdark-parser**](../README.md)

***

[shadowdark-parser](../globals.md) / parseRollTable

# Function: parseRollTable()

> **parseRollTable**(`tableText`, `tableName?`): [`Table`](../type-aliases/Table.md)

Defined in: [rolltable.ts:12](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/rolltable.ts#L12)

Parses an encounter table in the format of
01 First Encounter
02-03 Second Encounter

## Parameters

### tableText

`string`

The rows of the table

### tableName?

`string` = `"Imported Table"`

The name of the table

## Returns

[`Table`](../type-aliases/Table.md)

a JSON object usable in Foundry
