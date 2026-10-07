import test from 'node:test';
import assert from 'node:assert/strict';
import { CareSession, OUTFIT_CATEGORIES } from '../src/care.js';
function washed() {
  const care = new CareSession();
  for (let i = 0; i < 8; i++) care.washBubble();
  return care;
}
test('washing advances to drying and a retry preserves completed washing', () => {
  const care = washed();
  assert.equal(care.phase, 'dry');
  assert.equal(care.clean, 100);
  care.dry(1, 0);
  care.resetCurrentPhase();
  assert.equal(care.clean, 100);
  assert.deepEqual(care.wetness, [100, 100, 100, 100]);
});
test('moving the dryer between zones finishes without overheating', () => {
  const care = washed();
  for (let pass = 0; pass < 4; pass++) {
    for (let zone = 0; zone < 4; zone++) {
      for (let frame = 0; frame < 20; frame++) care.dry(.05, zone);
    }
  }
  assert.equal(care.phase, 'dress');
  assert.equal(care.dryness, 100);
  assert.equal(care.comfort, 100);
});
test('dryer rejects immediately on entering red, before comfort runs out', () => {
  const care=washed();care.heat[0]=65;
  care.dry(.001,0);
  assert.equal(care.dryerRejected,true);assert.equal(care.comfort,100);
  assert.equal(care.phase,'dry');
  const wet=care.wetness[0];care.dry(1,0);assert.equal(care.wetness[0],wet);
  care.resetCurrentPhase();assert.equal(care.dryerRejected,false);
  assert.equal(care.clean,100);assert.equal(care.dryness,0);
});
test('release cools the dryer zone before the red threshold', () => {
  const care = washed();
  for (let frame = 0; frame < 40; frame++) care.dry(.05, 0);
  const comfort = care.comfort;
  const heat = care.heat[0];
  for (let frame = 0; frame < 20; frame++) care.dry(.05, null);
  assert.ok(care.heat[0] < heat);
  assert.equal(care.comfort,comfort);assert.equal(care.dryerRejected,false);
});
test('dress rejection escapes after four mistakes and retries only dressing', () => {
  const care = washed();
  for (let pass = 0; pass < 4; pass++) for (let zone = 0; zone < 4; zone++) care.dry(1, zone);
  assert.equal(care.choose('bow', 'mint'), 'like');
  for (let i = 0; i < 3; i++) assert.equal(care.choose('hat', 'coral'), 'dislike');
  assert.equal(care.choose('hat', 'coral'), 'escape');
  care.resetCurrentPhase();
  assert.equal(care.phase, 'dress');
  assert.equal(care.clean, 100);
  assert.equal(care.dryness, 100);
  assert.deepEqual(care.outfit, {});
  for (const category of OUTFIT_CATEGORIES) assert.equal(care.choose(category, 'mint'), 'like');
  assert.equal(care.dressed, true);
});
