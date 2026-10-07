export class CaptureSequence {
  constructor() { this.phase='jump'; this.time=0; }
  get ready() { return this.phase==='aim' && this.time>=.3 && this.time<=1.3; }
  click(onTarget) {
    if(this.phase!=='aim')return false;
    this.phase=onTarget&&this.ready?'caught':'miss';this.time=0;return true;
  }
  tick(dt) {
    this.time+=dt;
    if(this.phase==='jump'&&this.time>=.45){this.phase='aim';this.time=0;}
    else if(this.phase==='aim'&&this.time>=1.8){this.phase='miss';this.time=0;}
    else if(this.phase==='miss'&&this.time>=.8)this.phase='retry';
    else if(this.phase==='caught'&&this.time>=1.1)this.phase='inside';
  }
}
