// Care rules are independent of rendering so escape/retry behavior can be tested.
export const OUTFIT_CATEGORIES = ['bow', 'glasses', 'hat', 'clothes'];
export class CareSession {
  constructor(preference = 'mint') {
    this.preference = preference;
    this.phase = 'wash';
    this.resetCurrentPhase();
  }
  resetCurrentPhase() {
    this.comfort = 100;
    if (this.phase === 'wash') { this.clean = 0; this.washedZones=Array(8).fill(false); }
    if (this.phase === 'rinse') this.foam=Array(8).fill(100);
    if (this.phase === 'towel') this.towelProgress=Array(4).fill(0);
    if (this.phase === 'dry') {
      this.dryerRejected = false;
      this.wetness = Array(4).fill(this.towelDone ? 60 : 100);
      this.heat = [0, 0, 0, 0];
    }
    if (this.phase === 'dress') this.outfit = {};
  }
  washBubble(zone = this.washedZones?.findIndex(value=>!value)) {
    if(this.phase!=='wash'||!Number.isInteger(zone)||zone<0||zone>=8||this.washedZones[zone])return false;
    this.washedZones[zone]=true;
    this.clean=this.washedZones.filter(Boolean).length*12.5;
    this.comfort=Math.min(100,this.comfort+8);
    if(this.clean<100)return false;
    this.phase='rinse';this.resetCurrentPhase();return true;
  }
  rinse(dt,zone) {
    if(this.phase!=='rinse'||!Number.isInteger(zone)||zone<0||zone>=8)return false;
    this.foam[zone]=Math.max(0,this.foam[zone]-dt*65);
    if(this.foam.some(value=>value>0))return false;
    this.phase='towel';this.resetCurrentPhase();return true;
  }
  towel(zone,stroke) {
    if(this.phase!=='towel'||!Number.isInteger(zone)||zone<0||zone>=4||!(stroke>0))return false;
    this.towelProgress[zone]=Math.min(100,this.towelProgress[zone]+Math.min(stroke,25));
    if(this.towelProgress.some(value=>value<100))return false;
    this.towelDone=true;this.phase='dry';this.resetCurrentPhase();return true;
  }
  get rinsed(){return 100-this.foam.reduce((sum,value)=>sum+value,0)/8;}
  get towelDried(){return this.towelProgress.reduce((sum,value)=>sum+value,0)/4;}
  tickWash(dt) { this.comfort = Math.max(0, this.comfort - dt * 3); }
  dry(dt, activeZone) {
    if (this.phase !== 'dry' || this.dryerRejected) return false;
    const validZone = Number.isInteger(activeZone) && activeZone >= 0 && activeZone < 4;
    for (let i = 0; i < 4; i++) {
      if (validZone && i === activeZone) {
        this.wetness[i] = Math.max(0, this.wetness[i] - dt * 30);
        this.heat[i] = Math.min(100, this.heat[i] + dt * 32);
        if (this.heat[i] > 65) { this.dryerRejected = true; return false; }
      } else this.heat[i] = Math.max(0, this.heat[i] - dt * 40);
    }
    if (!validZone) this.comfort = Math.min(100, this.comfort + dt * 4);
    if (this.comfort <= 0 || this.wetness.some(w => w > 0)) return false;
    this.phase = 'dress';
    this.resetCurrentPhase();
    return true;
  }
  get dryness() { return 100 - this.wetness.reduce((sum, w) => sum + w, 0) / 4; }
  choose(category, color) {
    if (this.phase !== 'dress' || !OUTFIT_CATEGORIES.includes(category)) return 'ignored';
    if (color !== 'mint' && color !== 'coral') return 'ignored';
    if (color !== this.preference) {
      this.comfort = Math.max(0, this.comfort - 25);
      return this.comfort === 0 ? 'escape' : 'dislike';
    }
    this.outfit[category] = color;
    return 'like';
  }
  get dressed() { return OUTFIT_CATEGORIES.every(key => this.outfit?.[key]); }
}
