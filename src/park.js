export const HILLS=[{x:-25,z:17,r:10,h:2.8},{x:27,z:22,r:9,h:2.3},{x:12,z:-29,r:11,h:3.2}];
export function groundHeight(x,z){return HILLS.reduce((height,hill)=>{const d=Math.hypot(x-hill.x,z-hill.z)/hill.r;return height+(d<1?hill.h*(1-d*d)**2:0);},0);}
export class ParkJump {
 constructor(){this.height=0;this.velocity=0;}
 start(){if(this.height>0||this.velocity!==0)return false;this.velocity=5;return true;}
 tick(dt){if(!this.velocity&&!this.height)return;this.velocity-=10*dt;this.height=Math.max(0,this.height+this.velocity*dt);if(!this.height)this.velocity=0;}
}
export function dogDestination(time){return {x:Math.sin(time*.22)*23+Math.sin(time*.63)*5,z:Math.cos(time*.19)*23+Math.sin(time*.47)*5};}
export const PLAYGROUND={swing:{x:-38,z:-27},slide:{x:-34.8,z:-27},sand:{x:-42,z:-19},monkey:{x:-30,z:-27}};
export function nearbyRide(x,z){let result=null,distance=2.4;for(const [name,p]of Object.entries(PLAYGROUND)){const d=Math.hypot(x-p.x,z-p.z);if(d<distance){result=name;distance=d;}}return result;}
const SOLIDS=[{x:-31.2,z:-27,hx:.15,hz:.15,top:3.5},{x:-28.8,z:-27,hx:.15,hz:.15,top:3.5},{x:-31.2,z:-15,hx:.15,hz:.15,top:3.5},{x:-28.8,z:-15,hx:.15,hz:.15,top:3.5},{x:-40,z:-27,hx:.4,hz:1.3,top:3},{x:-36,z:-27,hx:.4,hz:1.3,top:3},{x:-38,z:-27,hx:.65,hz:.45,top:3},{x:-34.8,z:-25.6,hx:.8,hz:1.6,top:2.4}];
export function blocked(x,z,y=0,radius=.24){return SOLIDS.some(s=>y<s.top&&Math.abs(x-s.x)<s.hx+radius&&Math.abs(z-s.z)<s.hz+radius);}
export function moveAroundObjects(x,z,nextX,nextZ,y=0){return {x:blocked(nextX,z,y)?x:nextX,z:blocked(blocked(nextX,z,y)?x:nextX,nextZ,y)?z:nextZ};}

// Damped pendulum: alternate pushes in the direction of travel to gain height.
export class SwingMotion {
 constructor(){this.angle=0;this.velocity=0;}
 tick(dt,push=0){
  this.velocity+=(-3.8*Math.sin(this.angle)-.28*this.velocity+push*1.8)*dt;
  this.angle+=this.velocity*dt;
  if(Math.abs(this.angle)>.72){this.angle=Math.sign(this.angle)*.72;this.velocity*=.5;}
 }
}
export function slidePosition(time){
 const climb=Math.min(1,time/1.5),p=Math.max(0,Math.min(1,(time-1.5)/1.4));
 return {x:-34.8,y:time<1.5?climb*1.53:Math.max(0,1.53-1.53*p),z:time<1.5?-27.95+climb*.93:-27.02+p*2.84};
}

export const PARK_RADIUS=70;
export class MonkeyChallenge {
 constructor(random=Math.random){this.random=random;this.step=0;this.total=8;this.remaining=15;this.done=false;this.nextQuestion();}
 nextQuestion(){this.left=2+Math.floor(this.random()*9);this.right=2+Math.floor(this.random()*9);}
 tick(dt){if(!this.done){this.remaining=Math.max(0,this.remaining-dt);if(this.remaining===0)this.done=true;}}
 answer(value){if(this.done||!/^\d+$/.test(String(value))||Number(value)!==this.left*this.right)return false;this.step++;this.done=this.step===this.total;if(!this.done){this.remaining=15;this.nextQuestion();}return true;}
}
