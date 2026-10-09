export const HILLS=[{x:-25,z:17,r:10,h:2.8},{x:27,z:22,r:9,h:2.3},{x:12,z:-29,r:11,h:3.2}];
export function groundHeight(x,z){return HILLS.reduce((height,hill)=>{const d=Math.hypot(x-hill.x,z-hill.z)/hill.r;return height+(d<1?hill.h*(1-d*d)**2:0);},0);}
export class ParkJump {
 constructor(){this.height=0;this.velocity=0;}
 start(){if(this.height>0||this.velocity!==0)return false;this.velocity=5;return true;}
 tick(dt){if(!this.velocity&&!this.height)return;this.velocity-=10*dt;this.height=Math.max(0,this.height+this.velocity*dt);if(!this.height)this.velocity=0;}
}
export function dogDestination(time){return {x:Math.sin(time*.22)*23+Math.sin(time*.63)*5,z:Math.cos(time*.19)*23+Math.sin(time*.47)*5};}
