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
  // A continuous shirt silhouette with a narrower neckline and relaxed hem.
  const shirtGeometry=new THREE.LatheGeometry([
    new THREE.Vector2(.255,0),new THREE.Vector2(.27,.04),new THREE.Vector2(.258,.2),
    new THREE.Vector2(.275,.43),new THREE.Vector2(.22,.55),new THREE.Vector2(.105,.62)
  ],40);
  const shirtVertices=shirtGeometry.attributes.position;
  for(let i=0;i<shirtVertices.count;i++){
    const y=shirtVertices.getY(i),x=shirtVertices.getX(i),z=shirtVertices.getZ(i);
    shirtVertices.setZ(i,z*.65+Math.sin(x*35+y*18)*.003*(1-y/.65));
  }
  shirtGeometry.computeVertexNormals();part(rig,shirtGeometry,surfaces.shirt,[0,.87,0]);
  const collar=part(rig,new THREE.TorusGeometry(.105,.014,8,32),surfaces.shirt,[0,1.49,0]);collar.rotation.x=Math.PI/2;
  for(const side of [-1,1]){const seam=soft(rig,[.006,.3,.006],surfaces.shirt,[side*.251,1.07,.035],.002);seam.rotation.z=side*.035;}
  oval(rig,'#40566e',[0,.83,0],[.25,.13,.17]);
  part(rig,new THREE.CylinderGeometry(.075,.085,.18,18),surfaces.skin,[0,1.52,0]);
  const head=new THREE.Group();head.position.y=1.76;rig.add(head);
  // Cheeks, jaw and nose are sculpted into one surface, avoiding stacked spheres.
  const faceGeometry=new THREE.SphereGeometry(1,64,48);
  const positions=faceGeometry.attributes.position;
  const gaussian=(x,y,cx,cy,sx,sy)=>Math.exp(-(((x-cx)/sx)**2+((y-cy)/sy)**2));
  for(let i=0;i<positions.count;i++){
    const nx=positions.getX(i),ny=positions.getY(i),nz=positions.getZ(i);
    const y=ny*.31,x=nx*.235*(ny<-.2?1+(ny+.2)*.16:1);
    let z=nz*.218;
    if(nz>0){
      const front=Math.min(1,nz*3);
      z+=front*(.042*gaussian(x,y,0,-.055,.027,.056)+.012*gaussian(x,y,0,-.077,.04,.023));
      z+=front*.009*(gaussian(x,y,.12,-.055,.075,.065)+gaussian(x,y,-.12,-.055,.075,.065));
      z-=front*.006*(gaussian(x,y,.094,.035,.047,.029)+gaussian(x,y,-.094,.035,.047,.029));
      z+=front*.004*gaussian(x,y,0,-.15,.06,.018);
    }
    positions.setXYZ(i,x,y,z);
  }
  faceGeometry.computeVertexNormals();part(head,faceGeometry,surfaces.skin,[0,0,0]);
  const eyeLids=[];
  for(const side of [-1,1]){
    oval(head,surfaces.skin,[side*.232,-.025,-.006],[.035,.065,.041]);
    const eye=new THREE.Group();eye.position.set(side*.092,.035,.195);head.add(eye);eyeLids.push(eye);
    oval(eye,'#eae6dc',[0,0,0],[.043,.024,.012]);
    oval(eye,'#6d5741',[0,0,.011],[.018,.019,.005]);
    oval(eye,'#252a2b',[0,0,.015],[.009,.013,.003]);
    oval(eye,'#ffffff',[-.006,.007,.019],[.004,.004,.002]);
    const lidCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.043,0,0),new THREE.Vector3(0,.025,.003),new THREE.Vector3(.043,0,0)]);
    part(eye,new THREE.TubeGeometry(lidCurve,18,.003,5,false),surfaces.skin,[0,0,0]);
    const browCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.05,.078,.202),new THREE.Vector3(side*.09,.089,.205),new THREE.Vector3(side*.132,.079,.193)]);
    part(head,new THREE.TubeGeometry(browCurve,16,.005,5,false),surfaces.hair,[0,0,0]);
  }
  const lipSurface=(x,y)=>{
    const taper=1+(y/.31+.2)*.16;
    return .218*Math.sqrt(1-(x/(.235*taper))**2-(y/.31)**2)+
      .042*gaussian(x,y,0,-.055,.027,.056)+.012*gaussian(x,y,0,-.077,.04,.023)+
      .009*(gaussian(x,y,.12,-.055,.075,.065)+gaussian(x,y,-.12,-.055,.075,.065))+
      .004*gaussian(x,y,0,-.15,.06,.018)+.002;
  };
  const smilePoints=[];
  for(let i=0;i<7;i++){const x=(i-3)*.016,y=-.144-.008*(1-(x/.048)**2);smilePoints.push(new THREE.Vector3(x,y,lipSurface(x,y)));}
  const smileCurve=new THREE.CatmullRomCurve3(smilePoints);
  part(head,new THREE.TubeGeometry(smileCurve,24,.0035,6,false),'#9f6b60',[0,0,0]);
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
    const cap=part(group,new THREE.SphereGeometry(1,24,16,0,Math.PI*2,0,Math.PI*.42),surfaces.hair,[0,.02,-.02],[.252,.332,.24]);
    cap.userData.crown=true;
    for(let i=0;i<7;i++){
      const x=(i-3)*.047;
      const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x*.65,.30,.10),new THREE.Vector3(x-.02,.245,.19),new THREE.Vector3(x+.035,.16+Math.abs(i-3)*.012,.222)]);
      const fringeGeometry=new THREE.TubeGeometry(curve,16,.018,6,false);
      const vertices=fringeGeometry.attributes.position;
      for(let segment=0;segment<=16;segment++){
        const t=segment/16,center=curve.getPointAt(t),taper=1-t*.8;
        for(let j=0;j<=6;j++){
          const index=segment*7+j;
          vertices.setXYZ(index,center.x+(vertices.getX(index)-center.x)*taper,center.y+(vertices.getY(index)-center.y)*taper,center.z+(vertices.getZ(index)-center.z)*taper*.35);
        }
      }
      fringeGeometry.computeVertexNormals();
      const fringe=part(group,fringeGeometry,surfaces.hair,[0,0,0]);fringe.userData.crown=true;
    }
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI*2;
      const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(Math.sin(a)*.045,.348,Math.cos(a)*.045-.02),new THREE.Vector3(Math.sin(a)*.17,.26,Math.cos(a)*.17-.02),new THREE.Vector3(Math.sin(a)*.247,.115,Math.cos(a)*.237-.02)]);
      const strand=part(group,new THREE.TubeGeometry(curve,16,.003,4,false),surfaces.hair,[0,0,0]);strand.userData.crown=true;
    }
    oval(group,surfaces.hair,[0,.05,-.185],[.235,.26,.075]);
    if(style==='bob'||style==='ponytail') {
      for(const side of [-1,1])oval(group,surfaces.hair,[side*.235,-.055,-.07],[.058,.235,.155]);
      oval(group,surfaces.hair,[0,-.08,-.195],[.23,.255,.07]);
      for(const side of [-1,1])for(let i=0;i<5;i++){
        const z=-.12+i*.04;
        const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.218,.15,z),new THREE.Vector3(side*.28,-.055,z-.01),new THREE.Vector3(side*.235,-.275,z-.03)]);
        part(group,new THREE.TubeGeometry(curve,18,.003,4,false),surfaces.hair,[0,0,0]);
      }
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
  for(const side of [-1,1])soft(girlDetails,[.105,.09,.007],surfaces.shirt,[side*.13,1.03,.151],.008);
  const boyDetails=new THREE.Group();rig.add(boyDetails);
  soft(boyDetails,[.09,.09,.008],surfaces.shirt,[-.12,1.26,.154],.008);
  let appearance;
  function configure(next){
    appearance={...next};
    surfaces.skin.color.set(SKIN_COLORS[next.skin]);surfaces.hair.color.set(HAIR_COLORS[next.hairColor]);surfaces.shirt.color.set(OUTFIT_COLORS[next.outfit]);
    for(const [name,group]of Object.entries(hairGroups)){group.visible=name===next.hairStyle;group.traverse(mesh=>{if(mesh.userData.crown)mesh.visible=next.hat==='none';});}
    for(const [name,group]of Object.entries(hats))group.visible=name===next.hat;
    girlDetails.visible=next.gender==='girl';boyDetails.visible=next.gender==='boy';
    head.scale.set(next.gender==='girl'?.705:.72,.72,.72);
  }
  function animate(time,running=false,pose=null){
    const blink=(time%4.8)>4.65;
    for(let i=0;i<2;i++){
      const stride=running?Math.sin(time*10+i*Math.PI):0;
      legs[i].rotation.x=stride*.48;knees[i].rotation.x=running?Math.max(0,-stride)*.85:.04;
      arms[i].rotation.x=-stride*.4;elbows[i].rotation.x=running?-.45-Math.max(0,stride)*.2:-.08;
      arms[i].rotation.z=(i===0?1:-1)*.08;
      if(pose){arms[i].rotation.x=pose==='hold'?-1.05:-2;elbows[i].rotation.x=pose==='hold'?-.9:-.25;arms[i].rotation.z=(i===0?1:-1)*(pose==='hold'?-.18:.12);}
      eyeLids[i].scale.y=blink?.15:1;
    }
    rig.position.y=running?Math.abs(Math.sin(time*10))*.035:Math.sin(time*2)*.006;
    rig.rotation.y=running?Math.sin(time*10)*.045:0;
    rig.rotation.x=running?.055:0;
    head.rotation.z=running?Math.sin(time*10)*.012:Math.sin(time*.9)*.015;
    hairGroups.ponytail.rotation.x=running?Math.sin(time*10)*.07:Math.sin(time*2)*.012;
  }
  return {root,configure,animate};
}
