import assert from "node:assert/strict";
import test from "node:test";
import { dissolveValue, rollGear, rollLevelReward, totalsOf } from "./gear.ts";

const slots = ["arma", "casco", "armadura", "botas", "reliquia"] as const;

test("rollGear creates a valid item for every equipment slot", () => {
  for (const slot of slots) {
    const item = rollGear(slot, "raro", 2);
    assert.equal(item.slot, slot);
    assert.equal(item.rarity, "raro");
    assert.equal(item.level, 2);
    assert.equal(typeof item.uid, "string");
    assert.equal(item.affixes.length, 2);
    for (const affix of item.affixes) {
      assert.equal(Number.isFinite(affix.value), true);
    }
  }
});

test("totalsOf sums affix values and keeps every stat finite", () => {
  const item = rollGear("arma", "epico", 3);
  const totals = totalsOf([item]);
  for (const value of Object.values(totals)) {
    assert.equal(Number.isFinite(value), true);
  }
  for (const affix of item.affixes) {
    assert.equal(totals[affix.stat] >= affix.value, true);
  }
});

test("level rewards follow milestone and special-chest rules", () => {
  const common = rollLevelReward(3, false, 2);
  assert.equal(common.length, 1);
  assert.equal(common[0]?.rarity, "comun");
  const special = rollLevelReward(5, true, 2);
  assert.equal(special.length, 2);
  assert.equal(special.every((item) => item.rarity !== "comun"), true);
});

test("dismantling value is positive and scales with rarity", () => {
  const common = rollGear("reliquia", "comun", 1);
  const legendary = rollGear("reliquia", "legendario", 1);
  assert.equal(dissolveValue(common) > 0, true);
  assert.equal(dissolveValue(legendary) > dissolveValue(common), true);
});
