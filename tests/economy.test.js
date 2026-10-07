import test from 'node:test';
import assert from 'node:assert/strict';
import { Economy, formatMoney } from '../src/economy.js';
test('Swiss denominations add exactly and a coin cannot be collected twice', () => {
  const e = new Economy();
  for (const [i,value] of [5,10,20,50,100,200,500].entries()) assert.equal(e.collect(i,value),true);
  assert.equal(e.balance,885);
  assert.equal(e.collect(0,5),false);
  assert.equal(e.collect('bad',1),false);
  assert.equal(e.balance,885);
});
test('prices vary between runs, stay in whole rappen, and stay fixed within a run', () => {
  const a=new Economy(()=>0),b=new Economy(()=>.99);
  assert.notDeepEqual(a.prices,b.prices);
  for(const value of Object.values(b.prices))assert.equal(value%10,0);
  const before={...a.prices};a.collect('coin',500);a.pay('bubble');assert.deepEqual(a.prices,before);
});
test('insufficient funds block purchases without debt or spending', () => {
  const e=new Economy(()=>0);
  assert.equal(e.pay('hat'),false);assert.equal(e.balance,0);assert.equal(e.spent,0);
  e.collect('coin',500);assert.equal(e.pay('hat'),true);
  assert.equal(e.balance,260);assert.equal(e.spent,240);
});
test('dryer is charged once per attempt, not for every held frame', () => {
  const e=new Economy(()=>0);e.collect('coin',100);
  assert.equal(e.unlockDryer(),true);assert.equal(e.unlockDryer(),true);assert.equal(e.balance,50);
  e.dryerPaid=false;assert.equal(e.unlockDryer(),true);assert.equal(e.balance,0);
});
test('100 rappen is one franc with localized units', () => {
  assert.equal(formatMoney(50),'50 Rappen');assert.equal(formatMoney(100),'1 Frank');
  assert.equal(formatMoney(340),'3 Frank 40 Rappen');assert.equal(formatMoney(340,'de'),'3 Franken 40 Rappen');
  assert.equal(formatMoney(340,'en'),'3 francs 40 Rappen');
});
