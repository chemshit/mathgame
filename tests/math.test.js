import test from 'node:test';
import assert from 'node:assert/strict';
import { PurchaseQuiz } from '../src/math.js';
import { Economy } from '../src/economy.js';
test('conversion and remaining money must both pass before purchase',()=>{
 const economy=new Economy(()=>.5);economy.collect('a',500);economy.collect('b',500);
 const q=new PurchaseQuiz(economy.balance,economy.prices.hat);
 assert.equal(q.advance(),false);
 for(const answer of ['', '3.40', '-340','wrong','339'])assert.equal(q.check('3',answer),false);
 assert.equal(economy.balance,1000);assert.equal(economy.spent,0);
 assert.equal(q.check('3','40'),true);assert.equal(q.advance(),true);assert.equal(q.complete,false);
 assert.equal(q.check('3','40'),false);assert.equal(q.advance(),false);
 assert.equal(q.check('6','60'),true);assert.equal(q.advance(),true);assert.equal(q.complete,true);
 assert.equal(economy.pay('hat'),true);assert.equal(economy.balance,660);
 assert.equal(q.advance(),false);
});
test('remaining money handles exact funds and crossing franc boundaries',()=>{
 for(const [balance,price] of [[340,340],[500,430],[1005,240]]){
  const q=new PurchaseQuiz(balance,price);assert.equal(q.check(String(Math.floor(price/100)),String(price%100)),true);q.advance();
  assert.equal(q.check(String(Math.floor((balance-price)/100)),String((balance-price)%100)),true);q.advance();assert.equal(q.complete,true);
 }
});

test('answers use separate normalized units, including zero and 10 francs 70 rappen',()=>{
 const q=new PurchaseQuiz(1410,340);
 for(const [f,r] of [['','40'],['3',''],['0','340'],['2','140'],['3.0','40'],['-3','40'],['3','40.0']])assert.equal(q.check(f,r),false);
 assert.equal(q.check('3','40'),true);q.advance();
 assert.equal(q.check('0','1070'),false);assert.equal(q.check('10','70'),true);
 const exact=new PurchaseQuiz(300,300);assert.equal(exact.check('3','0'),true);exact.advance();assert.equal(exact.check('0','0'),true);
});
