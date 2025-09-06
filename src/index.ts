import { parseAttack } from "./attacks.js";
import type {
  Alignment,
  Attack,
  Entity,
  MagicItem,
  Monster,
  Spell,
  Table,
  Trait,
} from "./entity.js";
import { parseMagicItem } from "./magicitem.js";
import { parse, bulkParse, identify } from "./parser.js";
import { parseRollTable } from "./rolltable.js";
import { parseSpell } from "./spell.js";
import { parseStatblock } from "./statblock.js";
import getTemplateFromFile from "./templates.js";
import { parseTraits } from "./traits.js";

export type {
  Alignment,
  Attack,
  Entity,
  MagicItem,
  Monster,
  Spell,
  Table,
  Trait,
};

export default {
  bulkParse,
  getTemplateFromFile,
  identify,
  parse,
  parseAttack,
  parseMagicItem,
  parseRollTable,
  parseSpell,
  parseStatblock,
  parseTraits,
};
