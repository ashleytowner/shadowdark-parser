import { parseAttack } from "./attacks";
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
import { parseMagicItem } from "./magicitem";
import { parse, bulkParse, identify } from "./parser";
import { parseRollTable } from "./rolltable";
import { parseSpell } from "./spell";
import { parseStatblock } from "./statblock";
import getTemplateFromFile from "./templates";
import { parseTraits } from "./traits";

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

export {
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
