/** An alignment, '*' represents a variable alignment */
export type Alignment = "Lawful" | "Neutral" | "Chaotic" | "*";

/** An attack that a monster can do */
export type Attack = {
  /** Discriminator field */
  type: "attack";
  /** The number of this attack that can be made per turn */
  quantity?: string;
  /** The name of this attack */
  name: string;
  /** The range of this attack */
  range?: string;
  /** The to-hit bonus for this attack */
  bonus?: string;
  /** The damage this attack does */
  damage?: string;
};

/**
 * A trait is an aspect of some kind on items, monsters, etc
 */
export type Trait = {
  /** Discriminator field */
  type: "trait";
  /** The name of the trait */
  name: string;
  /** The description of the trait */
  description: string;
};

/** A monster */
export type Monster = {
  /** Discriminator field */
  type: "monster";
  /** Name */
  name: string;
  /** Description */
  description: string;
  /**
   * Armor Class
   * Usually a number, but in some cases where the AC is variable, it will be a string
   */
  ac: number | string;
  /**
   * The type of armor & shields used
   * Will be undefined if not specified in the statblock
   */
  armor?: string;
  /**
   * Hit Points
   * Usually a number, but in some cases where the HP is variable, it will be a string
   */
  hp: number | string;
  /**
   * An array of arrays of attacks.
   * Each top-level sub-array is a grouping of "and" attacks
   *
   * @example
   * "1 attackA and 1 attackB or 1 attackC" would come out as `[[attackA, attackB], [attackC]]`
   */
  attacks: Attack[][];
  /**
   * The distance that can be moved
   */
  movementDistance: string;
  /**
   * The type of movement, e.g. "fly"
   */
  movementType?: string;
  /** Strength */
  strength: number;
  /** Dexterity */
  dexterity: number;
  /** Constitution */
  constitution: number;
  /** Intelligence */
  intelligence: number;
  /** Wisdom */
  wisdom: number;
  /** Charisma */
  charisma: number;
  /**
   * Alignment
   * */
  alignment: Alignment;
  /**
   * Level
   * Usually a number, but in some cases where the level is variable, it can be a string
   */
  level: number | string;
  /**
   * An array of traits
   */
  traits: Trait[];
};

/** A spell */
export type Spell = {
  /** Discriminator field */
  type: "spell";
  name: string;
  tier: number;
  classes: string[];
  duration: string;
  range: string;
  description: string;
};

/** A magic item */
export type MagicItem = {
  /** Discriminator field */
  type: "magicItem";
  name: string;
  description: string;
  traits: Trait[];
};

/** A rollable table */
export type Table = {
  /** Discriminator field */
  type: "table";
  /** The name of the table */
  name: string;
  /** The dice formula of the table */
  formula?: string;
  /** The table rows */
  results: {
    type: "text";
    /** The text of the row result */
    text: string;
    /** The number range within which this result is rolled */
    range: [number, number];
  }[];
};

/** A parsable entity */
export type Entity = Monster | MagicItem | Spell | Table;
