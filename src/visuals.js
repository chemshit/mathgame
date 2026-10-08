import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const materials = new Map();
function material(color, roughness = .75, metalness = 0) {
  const key = `${color}:${roughness}:${metalness}`;
  if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
  return materials.get(key);
}
function add(parent, geometry, surface, position = [0,0,0], scale = [1,1,1]) {
  const mesh = new THREE.Mesh(geometry, typeof surface === 'string' ? material(surface) : surface);
  mesh.position.set(...position); mesh.scale.set(...scale);
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
const ballGeometry = new THREE.SphereGeometry(1, 24, 16);
function oval(parent, surface, position, scale) { return add(parent, ballGeometry, surface, position, scale); }
function rounded(parent, size, color, position, radius = .08) {
  return add(parent, new RoundedBoxGeometry(...size, 3, radius), color, position);
}
function tube(parent, points, radius, surface) {
  return add(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 18, radius, 8, false), surface);
}
function furTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#e9dfce'; ctx.fillRect(0,0,256,256);
  // A repeatable, small fur map, kept local so the game needs no remote assets.
  let seed = 29;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i=0;i<4500;i++) {
    const x=rand()*256,y=rand()*256;
    ctx.strokeStyle = i%3 ? 'rgba(112,84,53,.12)' : 'rgba(255,255,255,.4)';
    ctx.lineWidth = .5; ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+2,y+3,x+rand()*4-2,y+5+rand()*6);ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas); texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3,3); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}
function mudTexture(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const ctx=canvas.getContext('2d');
  for(let i=0;i<90;i++){
    const a=i*2.39996,r=8+(i%11)*3,x=64+Math.cos(a)*r,y=64+Math.sin(a)*r;
    const gradient=ctx.createRadialGradient(x,y,0,x,y,8+(i%5));
    gradient.addColorStop(0,i%2?'rgba(83,53,29,.8)':'rgba(137,93,48,.7)');gradient.addColorStop(1,'rgba(107,75,42,0)');
    ctx.fillStyle=gradient;ctx.fillRect(x-14,y-14,28,28);
  }
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function createPuppy() {
  const root = new THREE.Group(); root.name = 'Golden puppy';
  const fur = furTexture();
  const coat = new THREE.MeshStandardMaterial({color:'#d7a463', map:fur, bumpMap:fur, bumpScale:.025, roughness:.92});
  const cream = new THREE.MeshStandardMaterial({color:'#fff0cf',map:fur,bumpMap:fur,bumpScale:.015,roughness:.95});
  const earMaterial = new THREE.MeshStandardMaterial({color:'#ac713a',map:fur,bumpMap:fur,bumpScale:.025,roughness:.95});
  const body = oval(root,coat,[0,.8,-.05],[.42,.46,.87]);
  oval(root,coat,[0,.89,.45],[.36,.43,.4]);
  oval(root,cream,[0,.78,.62],[.28,.36,.22]);
  const legPivots=[];
  for (const z of [.52,-.57]) for (const side of [-1,1]) {
    const leg=new THREE.Group();leg.position.set(side*.28,.67,z);root.add(leg);legPivots.push(leg);
    oval(leg,coat,[0,-.12,0],[.15,.26,.18]);
    add(leg,new THREE.CapsuleGeometry(.105,.26,6,12),coat,[0,-.38,.02]);
    oval(leg,cream,[0,-.56,.1],[.17,.105,.22]);
    for(let i=-1;i<=1;i++) oval(leg,cream,[i*.072,-.565,.25],[.051,.065,.068]);
  }
  const head=new THREE.Group();head.position.set(0,1.25,.76);root.add(head);
  oval(head,coat,[0,0,0],[.35,.35,.37]);
  oval(head,cream,[0,-.15,.3],[.235,.16,.27]);
  for(const side of [-1,1])oval(head,cream,[side*.11,-.13,.4],[.13,.12,.145]);
  oval(head,material('#332925',.28),[0,-.075,.55],[.12,.084,.075]);
  oval(head,material('#a67b63',.3),[-.025,-.045,.605],[.032,.014,.009]);
  tube(head,[[0,-.15,.54],[0,-.21,.53],[-.11,-.235,.49]],.008,'#5e4234');
  tube(head,[[0,-.21,.53],[.11,-.235,.49]],.008,'#5e4234');
  const tongue=oval(head,material('#e3a0a0',.55),[0,-.24,.46],[.062,.062,.035]);
  const eyes=[],ears=[];
  for(const side of [-1,1]) {
    const eye=new THREE.Group(); eye.position.set(side*.195,.075,.29); eye.rotation.y=side*.22; head.add(eye);eyes.push(eye);
    oval(eye,'#6e4a2d',[0,0,0],[.082,.092,.04]);
    oval(eye,material('#382d22',.18),[0,0,.033],[.06,.073,.025]);
    oval(eye,material('#171b1c',.1),[0,0,.055],[.035,.047,.009]);
    oval(eye,material('#ffffff',.15),[-.019,.026,.064],[.014,.018,.007]);
    oval(eye,'#f8ecd7',[.018,-.025,.063],[.007,.008,.005]);
    oval(head,coat,[side*.2,.183,.26],[.095,.035,.06]).rotation.z=side*.13;
    const ear=new THREE.Group();ear.position.set(side*.29,.095,-.03);ear.rotation.z=side*.16;head.add(ear);ears.push(ear);
    oval(ear,earMaterial,[side*.07,-.17,-.015],[.16,.3,.115]);
    oval(ear,coat,[side*.075,-.32,.025],[.135,.2,.09]);
    for(let j=0;j<3;j++)oval(ear,earMaterial,[side*.075+(j-1)*.045,-.43,.03],[.035,.1,.055]);
    for(let j=0;j<3;j++)oval(head,'#a98761',[side*(.085+j*.034),-.115-(j%2)*.035,.52-j*.014],[.008,.008,.004]);
  }
  const tail=new THREE.Group();tail.position.set(0,.94,-.78);root.add(tail);
  tube(tail,[[0,0,0],[0,.1,-.22],[0,.29,-.48],[0,.4,-.65]],.105,coat);
  oval(tail,coat,[0,.38,-.64],[.075,.08,.105]);
  const collar=add(root,new THREE.TorusGeometry(.28,.045,8,32),material('#559ea2',.6),[0,1.02,.57]);
  collar.scale.x=1.06;
  oval(root,material('#e6bd66',.35,.45),[0,.77,.82],[.065,.075,.024]);
  // Instancing keeps the soft silhouette inexpensive on phone GPUs.
  const tufts = new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),coat,64);
  const transform = new THREE.Object3D();
  for(let i=0;i<64;i++) {
    const a=i*2.399963,z=-.7+(i/63)*1.2;
    const radius=Math.sqrt(1-Math.pow((z+.05)/.87,2));
    transform.position.set(Math.cos(a)*.41*radius,.8+Math.sin(a)*.45*radius,z);
    transform.scale.set(.005,.01,.035);transform.rotation.z=a;transform.updateMatrix();tufts.setMatrixAt(i,transform.matrix);
  }
  tufts.castShadow=true;root.add(tufts);
  const mud=mudTexture();
  const mudMaterial=new THREE.MeshStandardMaterial({map:mud,transparent:true,depthWrite:false,roughness:1,alphaTest:.02,bumpMap:mud,bumpScale:.006});
  const dirt=[];
  for(let i=0;i<8;i++) {
    const y=.88+(i%3)*.04,z=-.55+i*.15;
    const x=.42*Math.sqrt(Math.max(.1,1-((z+.05)/.87)**2-((y-.8)/.46)**2))+.006;
    const patch=oval(root,mudMaterial,[(i%2?1:-1)*x,y,z],[.013,.13,.18]);
    patch.rotation.z=(i%2?1:-1)*.2;dirt.push(patch);
  }
  const dryColor=new THREE.Color('#d7a463'),wetColor=new THREE.Color('#a78151');
  function animate(time, { running=false, wet=0, comfort=100, blowing=false, knocking=false }={}) {
    for(let i=0;i<legPivots.length;i++)legPivots[i].rotation.x=running?Math.sin(time*13+(i===0||i===3?0:Math.PI))*.45:0;
    if(knocking)legPivots[0].rotation.x=-1.1;
    body.scale.y=.46*(1+Math.sin(time*2.5)*.012);
    head.rotation.x=running?Math.sin(time*13)*.025:Math.sin(time*1.7)*.025;
    head.rotation.z=comfort<40?Math.sin(time*9)*.045:Math.sin(time*1.2)*.035;
    ears.forEach((ear,i)=>ear.rotation.x=running?Math.sin(time*13+i)*.16:blowing?Math.sin(time*18+i)*.07:0);
    const blink=(time%4.6)>4.42;
    eyes.forEach(eye=>eye.scale.y=blink?.12:comfort<40?.7:1);
    tongue.visible=comfort>35;
    tail.rotation.y=Math.sin(time*(comfort>50?7:3))*(comfort>50?.38:.12);
    coat.roughness=.92-wet*.24;coat.color.copy(dryColor).lerp(wetColor,wet);
    tufts.scale.set(1,wet>.5?.97:1,1);
  }
  return {root,head,tail,dirt,animate};
}

export function createCareRoom() {
  const root=new THREE.Group();root.name='Sunny pet spa';
  const mint='#91c8c1', cream='#fff2dc',wood='#cda17c',coral='#e3a095';
  rounded(root,[14,.2,14],'#d9d8c8',[0,-.2,0]);
  // Large floor tiles and a two-tone wall give the room a clear scale.
  for(let x=-6;x<=6;x+=2)for(let z=-6;z<=4;z+=2)rounded(root,[1.96,.025,1.96],((x+z)%4)?'#e4e4d9':'#f1eee1',[x,-.085,z],.02);
  rounded(root,[14,7,.2],cream,[0,3.35,-4.7]);
  rounded(root,[14,1.7,.08],mint,[0,.8,-4.53]);
  rounded(root,[14,.08,.12],'#f4fcf4',[0,1.68,-4.48],.03);
  rounded(root,[.18,7,9],cream,[-6.7,3.35,-.3]);
  // Glowing window is a light surface rather than a costly reflection pass.
  rounded(root,[3,2.6,.16],'#f7ffff',[-3.6,3.15,-4.48]);
  const glass=new THREE.MeshStandardMaterial({color:'#bee1df',roughness:.3,emissive:'#9fcfd2',emissiveIntensity:.3});
  rounded(root,[2.75,2.35,.07],glass,[-3.6,3.15,-4.37]);
  for(const x of [-5,-2.2])rounded(root,[.1,2.6,.12],wood,[x,3.15,-4.3],.025);
  rounded(root,[.08,2.5,.13],cream,[-3.6,3.15,-4.25],.02);
  rounded(root,[2.9,.08,.12],cream,[-3.6,3.15,-4.25],.02);
  rounded(root,[3.25,.12,.38],wood,[-3.6,1.85,-4.24]);
  // Rounded grooming bath. Low front edge keeps the puppy's paws visible.
  const tub=new THREE.Group();root.add(tub);
  rounded(tub,[3.65,.34,2.4],mint,[0,.49,0],.16);
  rounded(tub,[3.35,.12,2.12],'#fcfff8',[0,.72,0],.06);
  rounded(tub,[3.65,.38,.2],mint,[0,.88,-1.12],.08);
  for(const x of [-1.73,1.73])rounded(tub,[.2,.34,2.4],mint,[x,.84,0],.08);
  rounded(tub,[3.65,.16,.18],cream,[0,.79,1.12],.07);
  for(const x of [-1.35,1.35])for(const z of [-.8,.8])rounded(tub,[.16,.45,.16],wood,[x,.2,z],.05);
  rounded(tub,[2.65,.025,1.65],'#e0d5bc',[0,.8,0],.02);
  for(let i=0;i<9;i++)rounded(tub,[2.5,.008,.02],'#bdb6a2',[0,.818,-.65+i*.15],.004);
  const chrome=material('#c4d6d5',.25,.72);
  tube(root,[[1.35,.85,-.9],[1.35,1.5,-.9],[1.35,1.7,-.8],[1.35,1.7,-.5]],.035,chrome);
  oval(root,chrome,[1.35,1.7,-.48],[.07,.055,.06]);
  for(const x of [1.1,1.6])oval(root,chrome,[x,.93,-.9],[.06,.06,.06]);
  // Back counter, paneled cabinet fronts and warm metal handles.
  rounded(root,[3.4,1.5,.85],mint,[3.75,.75,-3.9]);
  rounded(root,[3.65,.16,1.05],cream,[3.75,1.58,-3.9]);
  for(const x of [2.65,3.75,4.85]){
    rounded(root,[1.02,1.2,.05],'#add7cc',[x,.79,-3.45],.045);
    rounded(root,[.32,.06,.065],'#d8b47e',[x,1.05,-3.38],.025);
  }
  for(let i=0;i<3;i++)rounded(root,[.75,.16,.5],[coral,cream,'#a8c7df'][i],[4.6,1.76+i*.15,-3.85],.06);
  // Bottles and folded towels on shelves.
  for(let row=0;row<2;row++) {
    rounded(root,[2.4,.1,.48],wood,[3.9,2.45+row*1.12,-4.18]);
    for(let i=0;i<3;i++) {
      const x=3.1+i*.72,y=2.76+row*1.12;
      rounded(root,[.33,.48,.26],['#e8b99f','#adcadb','#b8d6ba'][(i+row)%3],[x,y,-4.13],.07);
      rounded(root,[.35,.12,.27],cream,[x,y-.02,-3.985],.025);
      rounded(root,[.13,.08,.14],cream,[x,y+.29,-4.13],.02);
    }
  }
  // Wall paw motif, kept language-neutral.
  oval(root,coral,[0,3.25,-4.48],[.45,.36,.04]);
  for(const [x,y]of [[-.45,3.66],[-.17,3.89],[.17,3.89],[.45,3.66]])oval(root,coral,[x,y,-4.48],[.14,.19,.04]);
  // A basket, rolled towels, plant and wall hooks make the space feel lived in.
  rounded(root,[1.25,.8,.85],wood,[-3.5,.42,-2.8],.12);
  for(let i=0;i<4;i++)rounded(root,[1.3,.04,.88],'#b78b69',[-3.5,.17+i*.17,-2.8],.015);
  for(let i=0;i<3;i++)add(root,new THREE.CylinderGeometry(.16,.16,.65,16),[cream,coral,mint][i],[-3.85+i*.35,.86,-2.8]).rotation.x=Math.PI/2;
  add(root,new THREE.CylinderGeometry(.35,.26,.55,20),material('#d6a182'),[-5.4,.25,-3.3]);
  for(let i=0;i<7;i++){
    const a=i*2.4;const leaf=oval(root,'#799d74',[-5.4+Math.cos(a)*.25,.9+(i%3)*.17,-3.3+Math.sin(a)*.25],[.12,.38,.055]);
    leaf.rotation.z=Math.cos(a)*.6;
  }
  // Batch static furniture by material: detailing adds no per-object draw calls.
  root.updateMatrixWorld(true);
  const batches=new Map();
  const staticMeshes=[];
  root.traverse(object=>{
    if(!object.isMesh)return;
    staticMeshes.push(object);
    if(!batches.has(object.material))batches.set(object.material,[]);
    const geometry=object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
    batches.get(object.material).push(geometry.applyMatrix4(object.matrixWorld));
  });
  for(const object of staticMeshes)object.removeFromParent();
  for(const [surface,geometries] of batches){
    const geometry=mergeGeometries(geometries,false);
    add(root,geometry,surface);
    for(const source of geometries)source.dispose();
  }
  // Dynamic water is added after static batching and only shown during washing.
  const waterTank=new THREE.Group();waterTank.name='Wash water tank';root.add(waterTank);
  const tankGlass=new THREE.MeshPhysicalMaterial({color:'#b8e8e6',transparent:true,opacity:.22,roughness:.15,metalness:0,depthWrite:false,side:THREE.DoubleSide});
  rounded(waterTank,[3.3,.48,.045],tankGlass,[0,1.02,1.05],.02);
  for(const x of [-1.63,1.63])rounded(waterTank,[.045,.48,2.1],tankGlass,[x,1.02,0],.02);
  const waterMaterial=new THREE.MeshPhysicalMaterial({color:'#76c8d9',transparent:true,opacity:.42,roughness:.18,metalness:.08,depthWrite:false,side:THREE.DoubleSide});
  const water=add(waterTank,new THREE.PlaneGeometry(3.22,2.05),waterMaterial,[0,.97,0]);water.rotation.x=-Math.PI/2;water.castShadow=false;
  const ripples=[];
  for(let i=0;i<4;i++){
    const ripple=add(waterTank,new THREE.RingGeometry(.18,.19,40),new THREE.MeshBasicMaterial({color:'#e2fbff',transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide}),[(i%2?1:-1)*.9,.98,(i<2?1:-1)*.55]);
    ripple.rotation.x=-Math.PI/2;ripple.castShadow=false;ripples.push(ripple);
  }
  const dryer=new THREE.Group();root.add(dryer);
  rounded(dryer,[.42,.38,.68],coral,[0,0,0],.12);
  add(dryer,new THREE.CylinderGeometry(.12,.18,.34,16),material('#56666b'),[0,0,.43]).rotation.x=Math.PI/2;
  rounded(dryer,[.14,.4,.18],coral,[0,-.27,-.12],.05);
  rounded(dryer,[.06,.06,.06],mint,[.09,-.18,-.12],.02);
  const air=new THREE.Group();dryer.add(air);
  const airMaterial=new THREE.MeshBasicMaterial({color:'#dbf8fc',transparent:true,opacity:.4,depthWrite:false});
  for(let i=0;i<3;i++)tube(air,[[(i-1)*.065,0,.65],[(i-1)*.1,.04,.88],[(i-1)*.12,0,1.12]],.008,airMaterial);
  air.visible=false;
  // This light only runs with the room; no additional shadow map is allocated.
  const warmLight=new THREE.PointLight('#ffe2bd',10,14,2);warmLight.position.set(-3,4,1);root.add(warmLight);
  function animate(time, {blowing=false,target=null,knock=0,washing=false}={}) {
    waterTank.visible=washing;water.position.y=.97+Math.sin(time*.8)*.008;
    ripples.forEach((r,i)=>{const p=(time*.16+i*.25)%1;r.scale.setScalar(.7+p*2);r.material.opacity=(1-p)*.25;});
    if(knock>0) {
      const progress=1-knock/1.2;
      dryer.position.set(.8+progress*2.2,1.5+Math.sin(progress*Math.PI)*1.2,.9-progress*2);
      dryer.rotation.set(progress*8,progress*5,progress*4);air.visible=false;
    }else if(blowing&&target) {
      dryer.position.copy(target).add(new THREE.Vector3(.8,.25,.65));
      dryer.lookAt(target);
      air.visible=true;air.scale.z=.95+Math.sin(time*25)*.1;
    }else {
      dryer.position.set(2.5,1.86,-3.5);dryer.rotation.set(0,.8,-.5);air.visible=false;
    }
  }
  animate(0);
  return {root,animate};
}
