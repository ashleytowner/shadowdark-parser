import {
  getStatNameFromPrefix,
  parseStats,
  parseStatblock,
} from "../statblock";

const VALID_STATBLOCK = `
MONSTER
Description
AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, W +0, Ch +0, AL N, LV 1
Trait. Description.`;

function replaceStats(search: string, replacement: string) {
  return VALID_STATBLOCK.replace(search, replacement);
}

describe("parseStatblock", () => {
  describe("error states", () => {
    it.each([
      [
        "invalid AC value",
        replaceStats("AC 12", "AC leather"),
        'Invalid AC value: "leather"',
      ],
      [
        "invalid movement value",
        replaceStats("MV near", "MV (fly)"),
        'Invalid MV value: "(fly)"',
      ],
      [
        "invalid HP value",
        replaceStats("HP 4", "HP four"),
        'Invalid HP value: "four"',
      ],
      [
        "invalid strength value",
        replaceStats("S +0", "S nope"),
        'Invalid S value: "nope"',
      ],
      [
        "invalid dexterity value",
        replaceStats("D +0", "D nope"),
        'Invalid D value: "nope"',
      ],
      [
        "invalid constitution value",
        replaceStats("C +0", "C nope"),
        'Invalid C value: "nope"',
      ],
      [
        "invalid intelligence value",
        replaceStats("I +0", "I nope"),
        'Invalid I value: "nope"',
      ],
      [
        "invalid wisdom value",
        replaceStats("W +0", "W nope"),
        'Invalid W value: "nope"',
      ],
      [
        "invalid charisma value",
        replaceStats("Ch +0", "Ch nope"),
        'Invalid Ch value: "nope"',
      ],
      [
        "invalid X charisma value",
        replaceStats("Ch +0", "X nope"),
        'Invalid X value: "nope"',
      ],
      [
        "invalid Z charisma value",
        replaceStats("Ch +0", "Z nope"),
        'Invalid Z value: "nope"',
      ],
      [
        "invalid alignment value",
        replaceStats("AL N", "AL Q"),
        'Invalid AL value: "Q"',
      ],
      [
        "missing HP section",
        replaceStats("HP 4, ", ""),
        'HP missing from "AC 12, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, W +0, Ch +0, AL N, LV 1"',
      ],
      [
        "missing ATK section",
        replaceStats("ATK 1 bite +1 (1d4), ", ""),
        'ATK missing from "AC 12, HP 4, MV near, S +0, D +0, C +0, I +0, W +0, Ch +0, AL N, LV 1"',
      ],
      [
        "missing strength section",
        replaceStats("S +0, ", ""),
        'Missing Str stat from "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, D +0, C +0, I +0, W +0, Ch +0, AL N, LV 1"',
      ],
      [
        "missing dexterity section",
        replaceStats("D +0, ", ""),
        'Missing Dex stat from "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, C +0, I +0, W +0, Ch +0, AL N, LV 1"',
      ],
      [
        "missing constitution section",
        replaceStats("C +0, ", ""),
        'Missing Con stat from "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, I +0, W +0, Ch +0, AL N, LV 1"',
      ],
      [
        "missing intelligence section",
        replaceStats("I +0, ", ""),
        'Missing Int stat from "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, W +0, Ch +0, AL N, LV 1"',
      ],
      [
        "missing wisdom section",
        replaceStats("W +0, ", ""),
        'Missing Wis stat from "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, Ch +0, AL N, LV 1"',
      ],
      [
        "missing charisma section",
        replaceStats("Ch +0, ", ""),
        'Missing Cha stat from "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, W +0, AL N, LV 1"',
      ],
      [
        "missing movement section",
        replaceStats("MV near, ", ""),
        'MV missing from "AC 12, HP 4, ATK 1 bite +1 (1d4), S +0, D +0, C +0, I +0, W +0, Ch +0, AL N, LV 1"',
      ],
      [
        "missing alignment section",
        replaceStats("AL N, ", ""),
        'Missing AL from "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, W +0, Ch +0, LV 1"',
      ],
    ])("throws on %s", (_, statblock, error) => {
      expect(() => parseStatblock(statblock)).toThrow(error);
    });

    it("throws on an invalid level value", () => {
      expect(() =>
        parseStats(
          "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, W +0, Ch +0, AL N, LV one",
        ),
      ).toThrow('Invalid LV value: "one"');
    });

    it("throws on a missing AC section", () => {
      expect(() =>
        parseStats(
          "HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, W +0, Ch +0, AL N, LV 1",
        ),
      ).toThrow(
        'AC missing from "HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, W +0, Ch +0, AL N, LV 1"',
      );
    });

    it("throws on a missing level section", () => {
      expect(() =>
        parseStats(
          "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, W +0, Ch +0, AL N",
        ),
      ).toThrow(
        'Missing LV from "AC 12, HP 4, ATK 1 bite +1 (1d4), MV near, S +0, D +0, C +0, I +0, W +0, Ch +0, AL N"',
      );
    });

    it("throws on an invalid statline section", () => {
      const statblock = replaceStats("HP 4, ", "HP 4,, ");
      expect(() => parseStatblock(statblock)).toThrow(
        "Invalid statline section ",
      );
    });

    it("throws on an invalid stat key", () => {
      const statblock = replaceStats("HP 4", "QQ 4");
      expect(() => parseStatblock(statblock)).toThrow(
        '"QQ" is not a valid stat key',
      );
    });

    it("throws on an invalid internal core stat mapping", () => {
      expect(() => getStatNameFromPrefix("AL")).toThrow("Invalid core stat AL");
    });
  });

  it("Does not infinitely loop when it can't find the end of the statblock", () => {
    const parseHydra = () =>
      parseStatblock(`
HYDRA 
A towering, amphibious reptile 
with a bouquet of snake heads 
writhing on long necks. 
AC 15, HP *, ATK 1 bite (near) +6 
(1d8), MV near (swim), S +5, D +1, 
C +2, I -2, W +1, 
 Ch -2, AL N, LV
Heads. Choose how many heads 
the hydra has. Each is LV 2, AC 
15, HP 11, and can make 1 bite 
attack. A killed head sprouts into 
two new heads at the start of the 
hydra's turn unless cauterized 
beforehand. The hydra's LV is all 
the heads combined. 
	`);
    expect(parseHydra).toThrow();
  });
  it("handles trailing spaces in the statblock", () => {
    const hydra = parseStatblock(`
HYDRA 
A towering, amphibious reptile 
with a bouquet of snake heads 
writhing on long necks. 
AC 15, HP *, ATK 1 bite (near) +6 
(1d8), MV near (swim), S +5, D +1, 
C +2, I -2, W +1, 
 Ch -2, AL N, LV * 
Heads. Choose how many heads 
the hydra has. Each is LV 2, AC 
15, HP 11, and can make 1 bite 
attack. A killed head sprouts into 
two new heads at the start of the 
hydra's turn unless cauterized 
beforehand. The hydra's LV is all 
the heads combined. 
	`);
    expect(hydra.charisma).toBe(-2);
  });
  it("parses an any-levelled statblock", () => {
    const hydra = parseStatblock(`
HYDRA
A towering, amphibious reptile
with a bouquet of snake heads
writhing on long necks.
AC 15, HP *, ATK 1 bite (near) +6
(1d8), MV near (swim), S +5, D +1,
C +2, I -2, W +1, Ch -2, AL N, LV *
Heads. Choose how many heads
the hydra has. Each is LV 2, AC
15, HP 11, and can make 1 bite
attack. A killed head sprouts into
two new heads at the start of the
hydra's turn unless cauterized
beforehand. The hydra's LV is all
the heads combined.
	`);
    expect(hydra.hp).toBe("*");
    expect(hydra.level).toBe("*");
  });

  it("parses a multi-level statblock", () => {
    const airElemental = parseStatblock(`
ELEMENTAL, AIR
A howling tornado of wind.
AC 16, HP 29/42, ATK 3 slam +7
(2d6/3d6) or 1 whirlwind, MV
double near (fly), S +3, D +5, C +2,
I -2, W +1, Ch -2, AL N, LV 6/9
Impervious. Only damaged by
magical sources.
Whirlwind. All within close DC
15 DEX or flung 2d20 feet in
random direction.
		`);
    expect(airElemental.hp).toEqual("29/42");
    expect(airElemental.level).toEqual("6/9");
  });

  it("parses a statblock with no traits", () => {
    const griffon = parseStatblock(`
GRIFFON
Winged hunters with the head
of an eagle and body of a lion.
Their favored food is horses.
AC 12, HP 19, ATK 2 rend +4
(1d10), MV double near (fly), S +4,
D +2, C +1, I -3, W +1, Ch -1, AL N,
LV 4
		`);
    expect(griffon.traits).toEqual([]);
  });
  it("parses a statblock with no description", () => {
    const griffon = parseStatblock(`
GRIFFON
AC 12, HP 19, ATK 2 rend +4
(1d10), MV double near (fly), S +4,
D +2, C +1, I -3, W +1, Ch -1, AL N,
LV 4
		`);
    expect(griffon.description).toEqual("");
  });

  it("Correctly identifies spell traits", () => {
    const drowPriestess = parseStatblock(`Drow, Priestess

A statuesque female drow with a crown of metal spider webs and an
imperious gaze.

AC 16 (mithral chainmail), HP 28, ATK 3 snake whip (near) +4 (1d8 +
poison) or 1 spell +4, MV near, S +2, D +3, C +1, I +3, W +4, Ch +3, AL
C, LV 6

Poison. DC 15 CON or paralyzed 1d4 rounds.

Sunblind. Blinded in bright light.

Snuff (WIS Spell). DC 12. Extinguish all light sources (even magical)
within near.

Summon Spiders (WIS Spell). DC 14. Summon 2d4 loyal giant spiders that
appear within near. They stay for 5 rounds.

Web (WIS Spell). DC 13. A near- sized cube of webs within far
immobilizes all inside it for 5 rounds. DC 15 STR on turn to break free.
		`);

    expect(drowPriestess.traits).toContainEqual({
      type: "trait",
      name: "Web (WIS Spell)",
      description:
        "DC 13. A near- sized cube of webs within far immobilizes all inside it for 5 rounds. DC 15 STR on turn to break free.",
    });
  });

  it("Correctly identifies movement speed & types", () => {
    const stingbat = parseStatblock(`
STINGBAT
Darting, orange insect-bat with
four wings and needlelike beak.
AC 12, HP 4, ATK 1 beak +2 (1d4 +
blood drain), MV near (fly), S -2,
D +2, C +0, I -2, W +0, Ch -2, AL N,
LV 1
Blood Drain. Attach to bitten
target; auto-hit the next round.
DC 9 STR on turn to remove.
		`);
    expect(stingbat.movementDistance).toBe("near");
    expect(stingbat.movementType).toBe("fly");
  });

  it("Handles two-word movement like 'double near'", () => {
    const hippogriff = parseStatblock(`HIPPOGRIFF
Fierce, winged creatures with
the lower body of a horse and
upper body of a giant eagle.
AC 13, HP 14, ATK 2 rend +3 (1d8),
MV double near (fly), S +3, D +3, C
+1, I -3, W +1, Ch -2, AL N, LV 3`);
    expect(hippogriff.movementDistance).toBe("double near");
    expect(hippogriff.movementType).toBe("fly");
  });

  it("Excludes movement type when unspecified", () => {
    const basilisk = parseStatblock(`
BASILISK
Massive, muscled lizards with six
legs and gray, tough hide.
AC 14, HP 25, ATK 2 bite +4 (2d6 +
petrify), MV near, S +3, D +1, C +3,
I -3, W +1, Ch -3, AL N, LV 5
Petrify. Any creature that
touches the basilisk or meets its
gaze, DC 15 CON or petrified.
		`);

    expect(basilisk.movementDistance).toBe("near");
    expect(basilisk.movementType).toBe(undefined);
  });

  it("Identifies armor types", () => {
    const bandit = parseStatblock(`
BANDIT
Hard-bitten rogue in tattered
leathers and a hooded cloak.
AC 13 (leather + shield), HP 4,
ATK 1 club +1 (1d4) or 1 shortbow
(far) +0 (1d4), MV near, S +1, D +0,
C +0, I -1, W +0, Ch -1, AL C, LV 1
Ambush. Deal an extra die of
damage when undetected.
		`);
    expect(bandit.armor).toBe("leather + shield");
  });

  it("removes brackets from AC when armor type is present", () => {
    const assassin = parseStatblock(`
ASSASSIN
A black-cloaked, skulking killer.
AC 15 (leather), HP 38, ATK 2
poisoned dagger (close/near) +6
(2d4), MV near (climb), S +2, D +4,
C +2, I +2, W +3, Ch +3, AL C, LV 8
Execute. Deals x3 damage
against surprised targets.`);

    expect(assassin.ac).toBe(15);
    expect(assassin.armor).toBe("leather");
  });

  it("handles variable alignment", () => {
    const bandit = parseStatblock(`
BANDIT
Hard-bitten rogue in tattered
leathers and a hooded cloak.
AC 13 (leather + shield), HP 4,
ATK 1 club +1 (1d4) or 1 shortbow
(far) +0 (1d4), MV near, S +1, D +0,
C +0, I -1, W +0, Ch -1, AL *, LV 1
Ambush. Deal an extra die of
damage when undetected.`);

    expect(bandit.alignment).toBe("*");
  });

  it("handles creatures with multiple movement types", () => {
    const tarrasque = parseStatblock(`THE TARRASQUE
A colossal, four-legged reptile with crocodilian jaws, amber scales,
and a diamond-hard, spiked carapace. It towers overhead like a
mountain, able to swallow entire villages in one gulp. The tarrasque
hibernates deep in the earth or at the bottom of the sea for
centuries, only awakening long enough to fill its vast belly in an
indiscriminate rampage of terror and destruction. There is only one
tarrasque, and it is the most dreaded creature to walk the earth.
AC 22, HP 140, ATK 4 thrash (near) +13 (3d10 + sever) and 1 bite (near)
+13 (5d10 + sever + swallow), MV triple near (burrow, swim), S +7, D +2,
C +5, I -3, W +1, Ch -3, AL N, LV 30
Legendary. Only damaged by magical sources. Hostile spells
targeting the tarrasque are DC 18 to cast.
Deep Dweller. Immune to harm from fire and cold. Amphibious.
Permanent Death. Cannot be permanently killed unless a wish spell
is cast on it while it is at 0 HP.
Rampage. In place of attacks, move far in a straight line and make
one bite attack. On a hit, triple damage.
Reflective Carapace. Immune to rays, blasts, or bolts of energy. 1:6
chance these are reflected back at their originator.
Regeneration. Regains 4d10 lost HP at the beginning of its turn.
Sever. On a natural attack roll of 18+, the attack also severs a random
limb. 1d6: 1. Head, 2-4. Arm, 5-6. Leg.
Swallow. DC 18 STR or swallowed whole. Total darkness inside and
4d10 damage per round. Tarrasque regurgitates all swallowed if
dealt at least 30 damage in one round to the inside of its gullet.`);
    expect(tarrasque.movementType).toBe("burrow, swim");
  });

  it("expands alignment to a full word", () => {
    const bandit = parseStatblock(`
BANDIT
Hard-bitten rogue in tattered
leathers and a hooded cloak.
AC 13 (leather + shield), HP 4,
ATK 1 club +1 (1d4) or 1 shortbow
(far) +0 (1d4), MV near, S +1, D +0,
C +0, I -1, W +0, Ch -1, AL C, LV 1
Ambush. Deal an extra die of
damage when undetected.
		`);
    const caveCreeper = parseStatblock(`
CAVE CREEPER
Chittering, green centipedes the
size of horses. Their grasping
tentacles are coated in a
paralytic venom.
AC 12, HP 18, ATK 1 bite +3 (1d6)
and 1 tentacles +3 (1d8 + toxin),
MV near (climb), S +2, D +2, C +0,
I -3, W +1, Ch -3, AL N, LV 4
Toxin. DC 12 CON or paralyzed
1d4 rounds.
		`);
    const azer = parseStatblock(`
AZER
Dwarves with bronze, metallic
skin and flames in place of hair.
Gifted blacksmiths.
AC 15, HP 15, ATK 2 flaming
warhammer +3 (1d10, ignites
flammables) or 1 crossbow (far)
+0 (1d6), MV near, S +3, D +0, C
+2, I +0, W +0, Ch +0, AL L, LV 3
Impervious. Fire immune
		`);
    expect(bandit.alignment).toBe("Chaotic");
    expect(caveCreeper.alignment).toBe("Neutral");
    expect(azer.alignment).toBe("Lawful");
  });
  it("handles X in place of Ch", () => {
    const monster = parseStatblock(`
MONSTER
Description
AC 15, HP 15, ATK 1 punch +2 (1d6),
MV near, S +3, D +0, C
+2, I +0, W +0, X +2, AL L, LV 3
`);
    expect(monster.charisma).toBe(2);
  });
  it("handles Z in place of Ch", () => {
    const monster = parseStatblock(`
MONSTER
Description
AC 15, HP 15, ATK 1 punch +2 (1d6),
MV near, S +3, D +0, C
+2, I +0, W +0, Z +2, AL L, LV 3
`);
    expect(monster.charisma).toBe(2);
  });

  it("handles stats where the sign & number are split across lines", () => {
    const shadow = parseStatblock(`
SHADOW
Flitting, sentient shadows in
the vague shape of a human.
AC 12, HP 15, ATK 2 touch +2
(1d4 + drain), MV near (fly), S -
4, D +2, C +2, I -2, W +0, Ch -1,
AL C, LV 3
Drain. Target takes 1 STR
damage. At 0 STR, target dies
and becomes a shadow.`);

    expect(shadow.strength).toBe(-4);
    expect(shadow.dexterity).toBe(2);

    const test = parseStatblock(`
MONSTER
xxxxxx xxxxxx xxxx xxxxxxxxx
xxxx xxxx-xxxxx xxxxxx xxxx
xxxx. xxxxxx xxxxxxx xxxx
xxxxx xx xxxxxxxxx xxxxxxxxx.
AC 13, HP 57, ATK 2 bite +10
(2d8), MV double near (swim),
S +4, D +1, C +3, I -3, W +1, Ch -
2, AL N, LV 12
xxxxxxxx xxxxx. xxxxxxx-xxxxx
xxxxxxxx xxxxxxx xxxx xxxxxx
xx xxx xxxxx. xxxxxx xx xxxxxx
xx xxxx xxx xxx.
xxxxxxxxxxx. xx xxx xxxxx,
xxxxxxxxx xxxxxx xxxx xx xxxx.
xx xxxx, xxxxxxxxx xxxxxx xxxx
xx xxxx-xxxxx xxxxx xxxx.`);

    expect(test.charisma).toBe(-2);
  });

  it("parses unsigned stats as positive", () => {
    const monster = parseStatblock(`
Knight
A warrior in shining plate mail and the surcoat of a knightly order.
AC 17, HP 14, ATK 2 bastard sword +3 (1d8), MV near, S 3, D 0, C 1, I 0, W 0, Ch 1, AL L, LV 3
Oath. 3/day, ADV on a roll made in service of knight's order.`);
    expect(monster.strength).toBe(3);
    expect(monster.dexterity).toBe(0);
    expect(monster.constitution).toBe(1);
    expect(monster.intelligence).toBe(0);
    expect(monster.wisdom).toBe(0);
    expect(monster.charisma).toBe(1);
  });

  it("parses traits when level is on its own line", () => {
    const monster = parseStatblock(`TEST MONSTER
A large creature with
multiple arms. Territorial
and aggressive.
AC 12 (leather), HP 49, ATK 4
spear (close/far) +5 (2d6), MV
double near (climb), S +4, D +1,
C +4, I -1, W -1, Ch -1, AL C, LV
10
Power Attack. If monster hits the
same target with two or more
attacks, CON 15+ or stunned
for 1d4 rounds.`);

    expect(monster.level).toBe(10);
    expect(monster.traits).toHaveLength(1);
    expect(monster.traits[0]).toEqual({
      type: "trait",
      name: "Power Attack",
      description:
        "If monster hits the same target with two or more attacks, CON 15+ or stunned for 1d4 rounds.",
    });
  });

  it("parses traits who end in a word in all caps on its own line", () => {
    const monster = parseStatblock(`MONSTER
A monster that is indeed definitely a monster
AC 12 (leather), HP 49, ATK 4
spear (close/far) +5 (2d6), MV
double near (climb), S +4, D +1,
C +4, I -1, W -1, Ch -1, AL C, LV 10
Some Trait. Ranged
attacks against monster have
DISADV.
`);
    expect(monster.traits).toHaveLength(1);
    expect(monster.traits[0]).toEqual({
      type: "trait",
      name: "Some Trait",
      description: "Ranged attacks against monster have DISADV.",
    });
  });
});
