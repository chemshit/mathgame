export class GameSound {
  constructor(){this.muted=false;try{this.muted=localStorage.getItem('wpw-muted')==='true';}catch{}this.context=null;}
  unlock(){if(!this.context){const Audio=window.AudioContext||window.webkitAudioContext;if(Audio)this.context=new Audio();}this.context?.resume().catch(()=>{});}
  toggle(){this.muted=!this.muted;try{localStorage.setItem('wpw-muted',String(this.muted));}catch{}return this.muted;}
  play(kind){if(this.muted||!this.context||this.context.state!=='running')return;
    const patterns={pop:[620,310],coin:[740,990],success:[523,659,784],retry:[330,294],water:[170,210],towel:[120,160],happy:[440,660]};
    const notes=patterns[kind]||patterns.pop;
    notes.forEach((frequency,i)=>{const start=this.context.currentTime+i*.07;const oscillator=this.context.createOscillator(),gain=this.context.createGain();oscillator.type=kind==='water'||kind==='towel'?'triangle':'sine';oscillator.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.045,start+.01);gain.gain.exponentialRampToValueAtTime(.0001,start+.12);oscillator.connect(gain);gain.connect(this.context.destination);oscillator.start(start);oscillator.stop(start+.13);});
  }
}
