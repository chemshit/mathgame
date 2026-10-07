import test from 'node:test';
import assert from 'node:assert/strict';
import { MoneyQuestion, collectionQuestion } from '../src/math.js';
import { Economy } from '../src/economy.js';
test('every product can ask remaining-money question without spending on wrong answers',()=>{
 const e=new Economy(()=>.5);for(let i=0;i<6;i++)e.collect(i,500);
 for(const item of Object.keys(e.prices)){
  const before=e.balance,q=new MoneyQuestion(before,e.prices[item]);
  assert.equal(q.check('0','1'),false);assert.equal(e.balance,before);
  assert.equal(q.check(String(Math.floor(q.answer/100)),String(q.answer%100)),true);
  assert.equal(e.pay(item),true);assert.equal(e.balance,q.answer);
 }
});
test('addition carries 100 Rappen into francs, including the requested example',()=>{
 const q=new MoneyQuestion(410,1090,'add');assert.equal(q.check('15','0'),true);
 assert.equal(q.check('14','100'),false);assert.equal(q.check('0','1500'),false);
 for(const r of [0,.5,.99]){const question=collectionQuestion(()=>r);assert.equal(question.operation,'add');assert.ok(question.left>0);assert.equal(question.check(String(Math.floor(question.answer/100)),String(question.answer%100)),true);}
});
test('subtraction handles borrowing, exact funds, zero units and 10 francs 70 Rappen',()=>{
 for(const [a,b,f,r] of [[1410,340,'10','70'],[500,430,'0','70'],[340,340,'0','0'],[1005,240,'7','65']])assert.equal(new MoneyQuestion(a,b).check(f,r),true);
 const q=new MoneyQuestion(1000,340);
 for(const [f,r] of [['','60'],['6',''],['6.0','60'],['-6','60'],['5','160'],['6','60.0']])assert.equal(q.check(f,r),false);
});
