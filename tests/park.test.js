import test from 'node:test';import assert from 'node:assert/strict';import {HILLS,groundHeight,ParkJump,dogDestination} from '../src/park.js';
test('hill height is shared, smooth and zero outside hills',()=>{assert.equal(groundHeight(0,0),0);for(const h of HILLS){assert.equal(groundHeight(h.x,h.z),h.h);assert.equal(groundHeight(h.x+h.r,h.z),0);assert.ok(groundHeight(h.x+h.r/2,h.z)>0);}});
test('jump leaves ground, blocks repeated jumps and lands',()=>{const jump=new ParkJump();assert.equal(jump.start(),true);assert.equal(jump.start(),false);jump.tick(.1);assert.ok(jump.height>0);for(let i=0;i<30;i++)jump.tick(.05);assert.equal(jump.height,0);assert.equal(jump.velocity,0);assert.equal(jump.start(),true);});
test('puppy route stays in the park and varies',()=>{for(let t=0;t<500;t+=.5){const p=dogDestination(t);assert.ok(Math.hypot(p.x,p.z)<51);}assert.notDeepEqual(dogDestination(0),dogDestination(5));});
test('playground proximity and solid objects block walking but allow clear routes',async()=>{const {nearbyRide,blocked,moveAroundObjects}=await import('../src/park.js');assert.equal(nearbyRide(-38,-29),'swing');assert.equal(nearbyRide(-34.8,-28),'slide');assert.equal(nearbyRide(0,0),null);assert.equal(blocked(-38,-27),true);assert.equal(blocked(-34.8,-25.6),true);assert.deepEqual(moveAroundObjects(-38,-29,-38,-27),{x:-38,z:-29});assert.equal(blocked(-38,-27,4),false);});
test('swing needs input, gains momentum with alternating pushes and settles without input',async()=>{
 const {SwingMotion}=await import('../src/park.js');const swing=new SwingMotion();for(let i=0;i<120;i++)swing.tick(1/60);assert.equal(swing.angle,0);
 for(let i=0;i<240;i++)swing.tick(1/60,swing.velocity>=0?1:-1);assert.ok(Math.abs(swing.angle)>.1||Math.abs(swing.velocity)>.3);assert.ok(Math.abs(swing.angle)<=.72);
 const energy=()=>swing.velocity**2/2+3.8*(1-Math.cos(swing.angle));const before=energy();for(let i=0;i<1200;i++)swing.tick(1/60);assert.ok(energy()<before*.01);
});
test('slide climbs at the high ladder end and descends toward the low exit',async()=>{
 const {slidePosition}=await import('../src/park.js');const bottom=slidePosition(0),top=slidePosition(1.5),exit=slidePosition(2.9);
 assert.ok(top.y>bottom.y);assert.ok(top.z>bottom.z);assert.ok(exit.z>top.z);assert.equal(exit.y,0);
 for(let time=1.5;time<2.9;time+=.05){const a=slidePosition(time),b=slidePosition(time+.05);assert.ok(b.y<=a.y);assert.ok(b.z>=a.z);}
});

test('monkey bars require correct answers on all eight steps and expire without advancing',async()=>{
 const {MonkeyChallenge}=await import('../src/park.js');const q=new MonkeyChallenge(()=>0);
 q.tick(5);assert.equal(q.remaining,10);assert.equal(q.answer('5'),false);assert.equal(q.step,0);assert.equal(q.remaining,10);
 assert.equal(q.answer('4'),true);assert.equal(q.step,1);assert.equal(q.remaining,15);
 for(let i=1;i<8;i++)assert.equal(q.answer('4'),true);assert.equal(q.done,true);assert.equal(q.answer('4'),false);
 const expired=new MonkeyChallenge(()=>.999);assert.equal(expired.left,10);expired.tick(16);assert.equal(expired.remaining,0);assert.equal(expired.answer('100'),false);assert.equal(expired.step,0);
});
