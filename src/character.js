import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export const HAIR_COLORS = { brown:'#61402b', black:'#25232b', blonde:'#cda354', ginger:'#a55232', chestnut:'#8b593b' };
export const SKIN_COLORS = { light:'#f0c4a5', warm:'#d9a178', tan:'#ae7957', deep:'#744d39' };
export const OUTFIT_COLORS = { coral:'#dd8e78', blue:'#6e9abd', lavender:'#9c8cb9', mint:'#70a99c' };
export function createCharacter() {
  const root = new THREE.Group(); root.name='Pet owner';
  const surfaces={skin:new THREE.MeshStandardMaterial({color:SKIN_COLORS.light,roughness:.85}),hair:new THREE.MeshStandardMaterial({color:HAIR_COLORS.brown,roughness:.85}),shirt:new THREE.MeshStandardMaterial({color:OUTFIT_COLORS.coral,roughness:.9})};
  const sphere=new THREE.SphereGeometry(1,20,14);
  const materials=new Map();
  const mat=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.7}));return materials.get(color);};
  function part(parent,geo,surface,pos,scale=[1,1,1]) {const m=new THREE.Mesh(geo,typeof surface==='string'?mat(surface):surface);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  const oval=(parent,surface,pos,scale)=>part(parent,sphere,surface,pos,scale);
  const soft=(parent,size,surface,pos,r=.06)=>part(parent,new RoundedBoxGeometry(...size,3,r),surface,pos);
  const rig=new THREE.Group();root.add(rig);
  oval(rig,surfaces.shirt,[0,1.14,0],[.31,.39,.2]);
  oval(rig,'#40566e',[0,.83,0],[.28,.15,.18]);
  part(rig,new THREE.CylinderGeometry(.09,.11,.18,14),surfaces.skin,[0,1.52,0]);
  const head=new THREE.Group();head.position.y=1.85;rig.add(head);
  oval(head,surfaces.skin,[0,0,0],[.265,.335,.245]);
  oval(head,surfaces.skin,[0,-.2,.055],[.2,.14,.18]);
  for(const side of [-1,1]) {
    oval(head,surfaces.skin,[side*.266,-.035,0],[.047,.088,.052]);
    oval(head,'#f5eee5',[side*.102,.025,.216],[.054,.042,.02]);
    oval(head,'#6d5741',[side*.102,.025,.232],[.029,.032,.012]);
    oval(head,'#252a2b',[side*.102,.025,.242],[.017,.023,.008]);
    oval(head,'#ffffff',[side*.094,.037,.25],[.008,.009,.004]);
    const brow=oval(head,surfaces.hair,[side*.102,.11,.208],[.064,.014,.014]);brow.rotation.z=side*.1;
    oval(head,'#da9b87',[side*.158,-.08,.193],[.038,.017,.008]);
  }
  oval(head,surfaces.skin,[0,-.045,.242],[.035,.045,.045]);
  const smileCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.062,-.144,.212),new THREE.Vector3(0,-.163,.224),new THREE.Vector3(.062,-.144,.212)]);
  part(head,new THREE.TubeGeometry(smileCurve,12,.007,6,false),'#925b4f',[0,0,0]);
  const arms=[],legs=[];
  for(const side of [-1,1]) {
    const arm=new THREE.Group();arm.position.set(side*.32,1.36,0);arm.rotation.z=-side*.06;rig.add(arm);arms.push(arm);
    oval(arm,surfaces.shirt,[side*.025,-.1,0],[.095,.135,.115]);
    part(arm,new THREE.CapsuleGeometry(.067,.24,5,12),surfaces.skin,[side*.035,-.29,0]);
    oval(arm,surfaces.skin,[side*.035,-.48,.015],[.065,.09,.055]);
    oval(arm,surfaces.skin,[side*.078,-.455,.048],[.025,.048,.025]);
    const leg=new THREE.Group();leg.position.set(side*.14,.83,0);rig.add(leg);legs.push(leg);
    part(leg,new THREE.CapsuleGeometry(.105,.39,5,12),'#40566e',[0,-.29,0]);
    soft(leg,[.2,.2,.21],'#40566e',[0,-.55,.005],.05);
    soft(leg,[.235,.17,.36],'#f5f2e7',[0,-.73,.06],.07);
    soft(leg,[.23,.04,.35],'#d8bca2',[0,-.803,.065],.018);
    for(let i=0;i<3;i++)soft(leg,[.14,.012,.014],'#93aab4',[0,-.65,.13+i*.035],.004);
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
    for(let i=0;i<2;i++){const stride=running?Math.sin(time*11+i*Math.PI):0;legs[i].rotation.x=stride*.5;arms[i].rotation.x=-stride*.5;}
    if(pose)for(const arm of arms)arm.rotation.x=pose==='hold'?-1.35:-2;
    rig.position.y=running?Math.abs(Math.sin(time*11))*.04:Math.sin(time*2)*.008;
    head.rotation.z=running?0:Math.sin(time*.9)*.018;
    hairGroups.ponytail.rotation.x=running?Math.sin(time*11)*.04:0;
  }
  return {root,configure,animate};
}
