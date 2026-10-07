import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export const HAIR_COLORS = { brown:'#61402b', black:'#25232b', blonde:'#cda354', ginger:'#a55232', chestnut:'#8b593b' };
export const SKIN_COLORS = { light:'#f0c4a5', warm:'#d9a178', tan:'#ae7957', deep:'#744d39' };
export const OUTFIT_COLORS = { coral:'#dd8e78', blue:'#6e9abd', lavender:'#9c8cb9', mint:'#70a99c' };
function surfaceTexture(kind) {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#808080';ctx.fillRect(0,0,128,128);
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){
    const grain=kind==='hair'?Math.sin(x*.9+y*.06)*26:kind==='fabric'?((x%4===0||y%4===0)?22:-8):Math.sin(x*17+y*31)*7;
    const value=Math.round(128+grain);ctx.fillStyle=`rgb(${value},${value},${value})`;ctx.fillRect(x,y,1,1);
  }
  const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(kind==='fabric'?3:1,kind==='fabric'?3:1);return texture;
}
export function createCharacter() {
  const root = new THREE.Group(); root.name='Pet owner';
  const surfaces={skin:new THREE.MeshStandardMaterial({color:SKIN_COLORS.light,roughness:.65,bumpMap:surfaceTexture('skin'),bumpScale:.008}),hair:new THREE.MeshStandardMaterial({color:HAIR_COLORS.brown,roughness:.65,bumpMap:surfaceTexture('hair'),bumpScale:.012}),shirt:new THREE.MeshStandardMaterial({color:OUTFIT_COLORS.coral,roughness:.9,bumpMap:surfaceTexture('fabric'),bumpScale:.012})};
  const sphere=new THREE.SphereGeometry(1,28,20);
  const materials=new Map();
  const mat=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.7}));return materials.get(color);};
  function part(parent,geo,surface,pos,scale=[1,1,1]) {const m=new THREE.Mesh(geo,typeof surface==='string'?mat(surface):surface);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  const oval=(parent,surface,pos,scale)=>part(parent,sphere,surface,pos,scale);
  const soft=(parent,size,surface,pos,r=.06)=>part(parent,new RoundedBoxGeometry(...size,3,r),surface,pos);
  const rig=new THREE.Group();root.add(rig);
  oval(rig,surfaces.shirt,[0,1.17,0],[.285,.35,.18]);
  const collar=part(rig,new THREE.TorusGeometry(.11,.025,8,24),surfaces.shirt,[0,1.48,.012]);collar.rotation.x=Math.PI/2;
  for(const side of [-1,1]){const seam=soft(rig,[.012,.32,.012],surfaces.shirt,[side*.26,1.08,.08],.003);seam.rotation.z=side*.12;}
  oval(rig,'#40566e',[0,.83,0],[.28,.15,.18]);
  part(rig,new THREE.CylinderGeometry(.09,.11,.18,14),surfaces.skin,[0,1.52,0]);
  const head=new THREE.Group();head.position.y=1.85;rig.add(head);
  oval(head,surfaces.skin,[0,0,0],[.245,.31,.225]);
  oval(head,surfaces.skin,[0,-.2,.055],[.175,.12,.165]);
  const eyeLids=[];
  for(const side of [-1,1]) {
    oval(head,surfaces.skin,[side*.245,-.035,0],[.045,.075,.05]);
    oval(head,surfaces.skin,[side*.105,-.045,.17],[.084,.062,.046]);
    oval(head,surfaces.skin,[side*.252,-.035,.017],[.018,.046,.017]);
    oval(head,'#f5eee5',[side*.102,.025,.216],[.054,.042,.02]);
    oval(head,'#6d5741',[side*.102,.025,.232],[.029,.032,.012]);
    oval(head,'#252a2b',[side*.102,.025,.242],[.017,.023,.008]);
    oval(head,'#ffffff',[side*.094,.037,.25],[.008,.009,.004]);
    const lid=oval(head,surfaces.skin,[side*.102,.059,.216],[.058,.015,.018]);eyeLids.push(lid);
    const brow=oval(head,surfaces.hair,[side*.102,.11,.208],[.064,.014,.014]);brow.rotation.z=side*.1;
    oval(head,'#da9b87',[side*.158,-.08,.193],[.038,.017,.008]);
  }
  oval(head,surfaces.skin,[0,-.019,.219],[.023,.066,.033]);
  oval(head,surfaces.skin,[0,-.063,.248],[.033,.028,.036]);
  for(const side of [-1,1])oval(head,'#a67460',[side*.023,-.079,.246],[.007,.004,.005]);
  oval(head,surfaces.skin,[0,-.12,.208],[.022,.027,.017]);
  const smileCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.062,-.144,.212),new THREE.Vector3(0,-.163,.224),new THREE.Vector3(.062,-.144,.212)]);
  part(head,new THREE.TubeGeometry(smileCurve,12,.007,6,false),'#925b4f',[0,0,0]);
  const arms=[],legs=[],elbows=[],knees=[];
  for(const side of [-1,1]) {
    const arm=new THREE.Group();arm.position.set(side*.29,1.4,0);arm.rotation.z=-side*.08;rig.add(arm);arms.push(arm);
    oval(arm,surfaces.shirt,[side*.02,-.08,0],[.083,.12,.098]);
    part(arm,new THREE.CapsuleGeometry(.059,.13,5,12),surfaces.skin,[side*.025,-.23,0]);
    const elbow=new THREE.Group();elbow.position.set(side*.025,-.34,0);arm.add(elbow);elbows.push(elbow);
    oval(elbow,surfaces.skin,[0,0,0],[.061,.065,.061]);
    part(elbow,new THREE.CapsuleGeometry(.047,.14,5,12),surfaces.skin,[0,-.11,0]);
    oval(elbow,surfaces.skin,[0,-.24,.008],[.052,.06,.037]);
    for(let finger=0;finger<4;finger++){
      const digit=part(elbow,new THREE.CapsuleGeometry(.009,.033-Math.abs(finger-1.5)*.006,3,6),surfaces.skin,[(finger-1.5)*.021,-.297,.015]);digit.rotation.x=-.12;
    }
    const thumb=part(elbow,new THREE.CapsuleGeometry(.015,.033,3,8),surfaces.skin,[side*.055,-.25,.018]);thumb.rotation.z=side*.4;
    const leg=new THREE.Group();leg.position.set(side*.13,.83,0);rig.add(leg);legs.push(leg);
    part(leg,new THREE.CapsuleGeometry(.096,.19,5,12),'#40566e',[0,-.17,0]);
    const knee=new THREE.Group();knee.position.y=-.35;leg.add(knee);knees.push(knee);
    part(knee,new THREE.CapsuleGeometry(.078,.23,5,12),'#40566e',[0,-.14,0]);
    soft(knee,[.15,.07,.17],'#33475d',[0,-.29,.005],.02);
    soft(knee,[.19,.14,.3],'#f5f2e7',[0,-.38,.07],.05);
    soft(knee,[.19,.035,.3],'#d8bca2',[0,-.447,.07],.012);
    soft(knee,[.13,.025,.12],'#93aab4',[0,-.303,.09],.008);
    for(let i=0;i<3;i++)soft(knee,[.11,.012,.012],'#f5eee5',[0,-.3,.13+i*.027],.003);
  }
  // Build all variants once; selection changes visibility and material colors only.
  const hairGroups={};
  for(const style of ['short','bob','ponytail','curls']) {
    const group=new THREE.Group();head.add(group);hairGroups[style]=group;
    const cap=part(group,new THREE.SphereGeometry(1,24,16,0,Math.PI*2,0,Math.PI*.42),surfaces.hair,[0,.02,-.02],[.28,.35,.265]);
    cap.userData.crown=true;
    for(let i=0;i<5;i++) {
      const fringe=oval(group,surfaces.hair,[(i-2)*.065,.21-Math.abs(i-2)*.018,.185],[.065,.12,.057]);fringe.rotation.z=-.18;fringe.userData.crown=true;
    }
    oval(group,surfaces.hair,[0,.05,-.185],[.26,.27,.09]);
    if(style==='bob'||style==='ponytail') {
      for(const side of [-1,1])oval(group,surfaces.hair,[side*.235,-.055,-.07],[.078,.26,.18]);
      oval(group,surfaces.hair,[0,-.08,-.195],[.245,.27,.083]);
    }
    if(style==='ponytail') {
      const tail=oval(group,surfaces.hair,[0,-.12,-.35],[.105,.3,.13]);tail.rotation.x=.3;
      oval(group,'#db8d86',[0,.095,-.28],[.12,.06,.06]);
    }
    if(style==='curls')for(let i=0;i<20;i++) {
      const a=i*2.4;const curl=oval(group,surfaces.hair,[Math.cos(a)*.235,.1+(i%3)*.095,Math.sin(a)*.22],[.075,.065,.075]);curl.userData.crown=true;
    }
  }
  const hats={};
  for(const name of ['cap','sunhat','beanie']){const group=new THREE.Group();head.add(group);hats[name]=group;}
  part(hats.cap,new THREE.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2),'#577f9b',[0,.14,-.01],[.31,.345,.29]);
  const visor=oval(hats.cap,'#577f9b',[0,.14,.31],[.29,.032,.22]);visor.rotation.x=-.1;
  soft(hats.cap,[.095,.06,.015],'#fff0d1',[0,.235,.255],.01);
  part(hats.sunhat,new THREE.CylinderGeometry(.42,.42,.045,32),'#d8bd81',[0,.13,0]);
  part(hats.sunhat,new THREE.CylinderGeometry(.22,.28,.24,24),'#e7cc92',[0,.27,0]);
  part(hats.sunhat,new THREE.CylinderGeometry(.26,.28,.04,24),'#b67464',[0,.18,0]);
  part(hats.beanie,new THREE.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2),'#ac8ba3',[0,.13,-.01],[.3,.29,.29]);
  part(hats.beanie,new THREE.CylinderGeometry(.305,.305,.09,24),'#98768e',[0,.14,0]);
  oval(hats.beanie,'#e6c4d7',[0,.44,-.01],[.075,.075,.075]);
  const girlDetails=new THREE.Group();rig.add(girlDetails);
  for(const side of [-1,1])soft(girlDetails,[.115,.13,.015],surfaces.shirt,[side*.13,1.01,.19],.018);
  const boyDetails=new THREE.Group();rig.add(boyDetails);
  soft(boyDetails,[.11,.12,.025],'#ecd1a1',[-.12,1.26,.19],.025);
  let appearance;
  function configure(next){
    appearance={...next};
    surfaces.skin.color.set(SKIN_COLORS[next.skin]);surfaces.hair.color.set(HAIR_COLORS[next.hairColor]);surfaces.shirt.color.set(OUTFIT_COLORS[next.outfit]);
    for(const [name,group]of Object.entries(hairGroups)){group.visible=name===next.hairStyle;group.traverse(mesh=>{if(mesh.userData.crown)mesh.visible=next.hat==='none';});}
    for(const [name,group]of Object.entries(hats))group.visible=name===next.hat;
    girlDetails.visible=next.gender==='girl';boyDetails.visible=next.gender==='boy';
    head.scale.set(next.gender==='girl'?.97:1,1,1);
  }
  function animate(time,running=false,pose=null){
    const blink=(time%4.8)>4.65;
    for(let i=0;i<2;i++){
      const stride=running?Math.sin(time*10+i*Math.PI):0;
      legs[i].rotation.x=stride*.48;knees[i].rotation.x=running?Math.max(0,-stride)*.85:.04;
      arms[i].rotation.x=-stride*.4;elbows[i].rotation.x=running?-.45-Math.max(0,stride)*.2:-.08;
      arms[i].rotation.z=(i===0?1:-1)*.08;
      if(pose){arms[i].rotation.x=pose==='hold'?-1.05:-2;elbows[i].rotation.x=pose==='hold'?-.9:-.25;arms[i].rotation.z=(i===0?1:-1)*(pose==='hold'?-.18:.12);}
      eyeLids[i].scale.y=blink?.045:.015;
    }
    rig.position.y=running?Math.abs(Math.sin(time*10))*.035:Math.sin(time*2)*.006;
    rig.rotation.y=running?Math.sin(time*10)*.045:0;
    rig.rotation.x=running?.055:0;
    head.rotation.z=running?Math.sin(time*10)*.012:Math.sin(time*.9)*.015;
    hairGroups.ponytail.rotation.x=running?Math.sin(time*10)*.07:Math.sin(time*2)*.012;
  }
  return {root,configure,animate};
}
