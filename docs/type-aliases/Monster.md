[**shadowdark-parser**](../README.md)

***

[shadowdark-parser](../globals.md) / Monster

# Type Alias: Monster

> **Monster** = `object`

Defined in: [entity.ts:33](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L33)

A monster

## Properties

### ac

> **ac**: `number` \| `string`

Defined in: [entity.ts:44](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L44)

Armor Class
Usually a number, but in some cases where the AC is variable, it will be a string

***

### alignment

> **alignment**: [`Alignment`](Alignment.md)

Defined in: [entity.ts:86](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L86)

Alignment

***

### armor?

> `optional` **armor**: `string`

Defined in: [entity.ts:49](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L49)

The type of armor & shields used
Will be undefined if not specified in the statblock

***

### attacks

> **attacks**: [`Attack`](Attack.md)[][]

Defined in: [entity.ts:62](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L62)

An array of arrays of attacks.
Each top-level sub-array is a grouping of "and" attacks

#### Example

```ts
"1 attackA and 1 attackB or 1 attackC" would come out as `[[attackA, attackB], [attackC]]`
```

***

### charisma

> **charisma**: `number`

Defined in: [entity.ts:82](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L82)

Charisma

***

### constitution

> **constitution**: `number`

Defined in: [entity.ts:76](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L76)

Constitution

***

### description

> **description**: `string`

Defined in: [entity.ts:39](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L39)

Description

***

### dexterity

> **dexterity**: `number`

Defined in: [entity.ts:74](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L74)

Dexterity

***

### hp

> **hp**: `number` \| `string`

Defined in: [entity.ts:54](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L54)

Hit Points
Usually a number, but in some cases where the HP is variable, it will be a string

***

### intelligence

> **intelligence**: `number`

Defined in: [entity.ts:78](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L78)

Intelligence

***

### level

> **level**: `number` \| `string`

Defined in: [entity.ts:91](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L91)

Level
Usually a number, but in some cases where the level is variable, it can be a string

***

### movementDistance

> **movementDistance**: `string`

Defined in: [entity.ts:66](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L66)

The distance that can be moved

***

### movementType?

> `optional` **movementType**: `string`

Defined in: [entity.ts:70](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L70)

The type of movement, e.g. "fly"

***

### name

> **name**: `string`

Defined in: [entity.ts:37](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L37)

Name

***

### strength

> **strength**: `number`

Defined in: [entity.ts:72](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L72)

Strength

***

### traits

> **traits**: [`Trait`](Trait.md)[]

Defined in: [entity.ts:95](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L95)

An array of traits

***

### type

> **type**: `"monster"`

Defined in: [entity.ts:35](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L35)

Discriminator field

***

### wisdom

> **wisdom**: `number`

Defined in: [entity.ts:80](https://github.com/ashleytowner/shadowdark-parser/blob/dabe9e4969052fd9b68d443cdc0e58a3975f21cc/src/entity.ts#L80)

Wisdom
