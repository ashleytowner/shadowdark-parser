[**shadowdark-parser**](../README.md)

***

[shadowdark-parser](../globals.md) / parseRollTable

# Function: parseRollTable()

> **parseRollTable**(`tableText`, `tableName?`): [`Table`](../type-aliases/Table.md)

Defined in: [rolltable.ts:14](https://github.com/ashleytowner/shadowdark-parser/blob/2d0b7eb2093d1c323d22fa4f991edc1ad77811ba/src/rolltable.ts#L14)

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
