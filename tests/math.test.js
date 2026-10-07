import test from 'node:test';
import assert from 'node:assert/strict';
import { PurchaseQuiz } from '../src/math.js';
import { Economy } from '../src/economy.js';
test('conversion and remaining money must both pass before purchase',()=>{
 const economy=new Economy(()=>.5);economy.collect('a',500);economy.collect('b',500);
 const q=new PurchaseQuiz(economy.balance,economy.prices.hat);
 assert.equal(q.advance(),false);
 for(const answer of ['', '3.40', '-340','wrong','339'])assert.equal(q.check(answer),false);
 assert.equal(economy.balance,1000);assert.equal(economy.spent,0);
 assert.equal(q.check('340'),true);assert.equal(q.advance(),true);assert.equal(q.complete,false);
 assert.equal(q.check('340'),false);assert.equal(q.advance(),false);
 assert.equal(q.check('660'),true);assert.equal(q.advance(),true);assert.equal(q.complete,true);
 assert.equal(economy.pay('hat'),true);assert.equal(economy.balance,660);
 assert.equal(q.advance(),false);
});
test('remaining money handles exact funds and crossing franc boundaries',()=>{
 for(const [balance,price] of [[340,340],[500,430],[1005,240]]){
  const q=new PurchaseQuiz(balance,price);assert.equal(q.check(String(price)),true);q.advance();
  assert.equal(q.check(String(balance-price)),true);q.advance();assert.equal(q.complete,true);
 }
});
