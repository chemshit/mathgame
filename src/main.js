import * as THREE from 'three';
import './style.css';
import { PurchaseQuiz } from './math.js';
import { createCharacter, HAIR_COLORS, SKIN_COLORS, OUTFIT_COLORS } from './character.js';
import { Economy, DENOMINATIONS, formatMoney } from './economy.js';
import { createPuppy, createCareRoom } from './visuals.js';
import { CareSession, OUTFIT_CATEGORIES } from './care.js';
const texts={tr:{create:'Yeni arkadaşını bul',intro:'Karakterini seç, köpeği yakala ve köpüklerle temizle!',name:'Oyuncu adı',gender:'Karakter',girl:'Kız',boy:'Erkek',hair:'Saç',shirt:'Kıyafet',accessory:'Aksesuar',none:'Yok',hat:'Şapka',start:'Maceraya başla',chase:'Köpeği takip et!',chaseHelp:'WASD / ok tuşlarıyla koş. Yaklaşınca yakalama düğmesine bas.',catch:'Yakala',timing:'Doğru anda yakala!',timingHelp:'İşaret yeşil alandayken bas.',tap:'Şimdi!',wash:'Köpük zamanı',washHelp:'Baloncukları sürükleyip köpeğin üzerine bırak. Beklersen sabrı azalır!',patience:'Rahatlık',clean:'Temizlik',escaped:'Köpek parka kaçtı! Yeniden yakala; bu yıkamayı tekrar deneyeceğiz.',done:'Harika bir başlangıç!',doneHelp:'Yeni arkadaşın tertemiz! Fön, tüy kesimi ve giydirme sonraki sürümde.',again:'Yeniden oyna',near:'Biraz daha yaklaş',saved:'En iyi sonuç',move:'Hareket',pause:'Duraklat',resume:'Devam',paused:'Mola zamanı'},en:{create:'Find your new friend',intro:'Choose your character, catch the puppy and wash with bubbles!',name:'Player name',gender:'Character',girl:'Girl',boy:'Boy',hair:'Hair',shirt:'Outfit',accessory:'Accessory',none:'None',hat:'Hat',start:'Start adventure',chase:'Follow the puppy!',chaseHelp:'Run with WASD / arrow keys. Get close and press Catch.',catch:'Catch',timing:'Catch at the right moment!',timingHelp:'Press when the marker is in the green area.',tap:'Now!',wash:'Bubble time',washHelp:'Drag bubbles onto the puppy. Waiting reduces comfort!',patience:'Comfort',clean:'Cleanliness',escaped:'The puppy ran to the park! Catch again and retry this wash.',done:'A lovely beginning!',doneHelp:'Your new friend is clean! Drying, grooming and dressing come in a later version.',again:'Play again',near:'Get a little closer',saved:'Best result',move:'Move',pause:'Pause',resume:'Resume',paused:'Break time'},de:{create:'Finde deinen neuen Freund',intro:'Wähle deine Figur, fange den Hund und wasche ihn mit Seifenblasen!',name:'Spielername',gender:'Figur',girl:'Mädchen',boy:'Junge',hair:'Haare',shirt:'Kleidung',accessory:'Accessoire',none:'Keins',hat:'Hut',start:'Abenteuer starten',chase:'Folge dem Hund!',chaseHelp:'Laufe mit WASD / Pfeiltasten. Geh näher und drücke Fangen.',catch:'Fangen',timing:'Fange im richtigen Moment!',timingHelp:'Drücke, wenn die Markierung im grünen Bereich ist.',tap:'Jetzt!',wash:'Seifenblasenzeit',washHelp:'Ziehe die Seifenblasen auf den Hund. Beim Warten sinkt sein Wohlbefinden!',patience:'Wohlbefinden',clean:'Sauberkeit',escaped:'Der Hund ist in den Park gelaufen! Fange ihn erneut und wiederhole die Wäsche.',done:'Ein toller Anfang!',doneHelp:'Dein neuer Freund ist sauber! Föhnen, Fellpflege und Anziehen kommen später.',again:'Erneut spielen',near:'Geh etwas näher',saved:'Bestes Ergebnis',move:'Bewegen',pause:'Pause',resume:'Weiter',paused:'Zeit für eine Pause'}};
let lang='tr',stage='create',paused=false,misses=0,marker=0,angle=0,elapsed=0,bubbles=[],selectedBubble=null;
Object.assign(texts.tr, {
  dry: 'Fön zamanı', dryHelp: 'Islak bölgelerde basılı tut. Kırmızıya dönmeden başka bir bölgeye geç; bırakınca soğur.',
  dryProgress: 'Kuruluk', heat: 'Sıcaklık', head: 'Baş', back: 'Sırt', frontPaws: 'Ön patiler', backPaws: 'Arka patiler',
  dress: 'Kıyafet zamanı', dressHelp: 'Toka, gözlük, şapka ve kıyafet seç. Köpeğinin sevdiği renge dikkat et!',
  bow: 'Toka', glasses: 'Gözlük', clothes: 'Kıyafet', mint: 'Turkuaz', coral: 'Mercan',
  favorite: 'Sevdiği renk', liked: 'Bunu sevdi! ♥', disliked: 'Bunu sevmedi. Başka bir renk deneyelim.',
  finish: 'Bakımı tamamla', outfitProgress: 'Sevdiği seçimler', coolDown: 'Biraz sıcak! Başka bir bölgeye geç.',
  escaped: 'Köpek parka kaçtı! Yeniden yakala; yalnızca yarım kalan aşamayı tekrar edeceğiz.',
  doneHelp: 'Yeni arkadaşın temiz, kuru ve giyinmiş! Tüy kesimi ileride eklenecek.',
});
Object.assign(texts.en, {
  dry: 'Drying time', dryHelp: 'Hold on wet spots. Move before they turn red; release to cool down.',
  dryProgress: 'Dryness', heat: 'Heat', head: 'Head', back: 'Back', frontPaws: 'Front paws', backPaws: 'Back paws',
  dress: 'Dress-up time', dressHelp: 'Choose a bow, glasses, hat and outfit. Look for your puppy’s favorite color!',
  bow: 'Bow', glasses: 'Glasses', clothes: 'Outfit', mint: 'Turquoise', coral: 'Coral',
  favorite: 'Favorite color', liked: 'Your puppy likes it! ♥', disliked: 'Not a favorite. Try another color.',
  finish: 'Finish care', outfitProgress: 'Favorite choices', coolDown: 'Getting hot! Move to another spot.',
  escaped: 'The puppy ran to the park! Catch again; only the unfinished stage restarts.',
  doneHelp: 'Your friend is clean, dry and dressed! Grooming will come later.',
});
Object.assign(texts.de, {
  dry: 'Zeit zum Föhnen', dryHelp: 'Halte die nassen Stellen gedrückt. Wechsle, bevor sie rot werden; loslassen kühlt ab.',
  dryProgress: 'Trockenheit', heat: 'Wärme', head: 'Kopf', back: 'Rücken', frontPaws: 'Vorderpfoten', backPaws: 'Hinterpfoten',
  dress: 'Zeit zum Anziehen', dressHelp: 'Wähle Schleife, Brille, Hut und Kleidung. Achte auf die Lieblingsfarbe deines Hundes!',
  bow: 'Schleife', glasses: 'Brille', clothes: 'Kleidung', mint: 'Türkis', coral: 'Koralle',
  favorite: 'Lieblingsfarbe', liked: 'Dein Hund mag das! ♥', disliked: 'Das mag er nicht. Probiere eine andere Farbe.',
  finish: 'Pflege abschließen', outfitProgress: 'Lieblingsstücke', coolDown: 'Zu warm! Wechsle die Stelle.',
  escaped: 'Der Hund ist in den Park gelaufen! Fange ihn wieder; nur der aktuelle Schritt beginnt neu.',
  doneHelp: 'Dein Freund ist sauber, trocken und angezogen! Die Fellpflege kommt später.',
});
const economyTexts = {
 tr: { wallet:'Cüzdan', moneyRule:'100 Rappen = 1 Frank', bubblePrice:'Bir baloncuk', dryerPrice:'Fön (bu deneme)', prices:'Bakım fiyatları', collect:'Para toplama turu', collectHelp:'Parktaki paralara yaklaşarak topla. Hazır olunca bakıma dön.', returnCare:'Bakıma dön', moreCoins:'Parkta para topla', insufficient:'Para yetmiyor. Parkta biraz daha para toplayabilirsin.', unlock:'Fönü aç', paid:'Fön ödendi', coinFound:'Toplandı', chaseHelp:'WASD / oklarla koş, parkta Rappen ve Frank topla. Köpeğe yaklaşınca yakala.', spent:'Harcanan', outfitPrice:'Her kıyafet denemesi ücretlidir.' },
 en: { wallet:'Wallet', moneyRule:'100 Rappen = 1 franc', bubblePrice:'One bubble', dryerPrice:'Dryer (this attempt)', prices:'Care prices', collect:'Coin collecting', collectHelp:'Walk up to coins in the park. Return to care when ready.', returnCare:'Return to care', moreCoins:'Collect coins in the park', insufficient:'Not enough money. Collect more coins in the park.', unlock:'Unlock dryer', paid:'Dryer paid', coinFound:'Collected', chaseHelp:'Run with WASD/arrows and collect Rappen and francs. Get close to catch the puppy.', spent:'Spent', outfitPrice:'Each outfit trial costs money.' },
 de: { wallet:'Geldbeutel', moneyRule:'100 Rappen = 1 Franken', bubblePrice:'Eine Seifenblase', dryerPrice:'Föhn (dieser Versuch)', prices:'Pflegepreise', collect:'Münzen sammeln', collectHelp:'Laufe zu den Münzen im Park. Kehre zurück, wenn du bereit bist.', returnCare:'Zurück zur Pflege', moreCoins:'Münzen im Park sammeln', insufficient:'Nicht genug Geld. Sammle weitere Münzen im Park.', unlock:'Föhn bezahlen', paid:'Föhn bezahlt', coinFound:'Gesammelt', chaseHelp:'Laufe mit WASD/Pfeiltasten und sammle Rappen und Franken. Geh zum Hund und fange ihn.', spent:'Ausgegeben', outfitPrice:'Jeder Kleidungsversuch kostet Geld.' },
};
for (const language of Object.keys(economyTexts)) Object.assign(texts[language], economyTexts[language]);
let economy = new Economy();
const money = value => formatMoney(value,lang);
let coinBatch = 0;
const coinItems = [];
let care = new CareSession();
let activeZone = null;
const zoneNames = ['head', 'back', 'frontPaws', 'backPaws'];
Object.assign(texts.tr,{mathTitle:'Şapka alışverişi',conversionQuestion:'Şapkanın fiyatı kaç Rappen?',remainingQuestion:'Şapkayı alınca kaç Rappen kalır?',checkAnswer:'Kontrol et',nextQuestion:'Sonraki soru',buyHat:'Şapkayı satın al',cancelMath:'Vazgeç',mathCorrect:'Doğru! Harika hesapladın.',mathRetry:'Bir daha deneyelim. Para kesilmedi.',priceLabel:'Fiyat',balanceLabel:'Cüzdan',conversionHint:'Frank sayısını 100 ile çarp, Rappen miktarını ekle.',remainingHint:'Cüzdandaki Rappen miktarından şapkanın fiyatını çıkar.',answerLabel:'Cevabın (Rappen)'});
Object.assign(texts.en,{mathTitle:'Hat shopping',conversionQuestion:'How many Rappen does the hat cost?',remainingQuestion:'How many Rappen will you have left?',checkAnswer:'Check',nextQuestion:'Next question',buyHat:'Buy the hat',cancelMath:'Cancel',mathCorrect:'Correct! Great calculation.',mathRetry:'Try again. No money was spent.',priceLabel:'Price',balanceLabel:'Wallet',conversionHint:'Multiply the francs by 100, then add the Rappen.',remainingHint:'Subtract the hat price from the Rappen in your wallet.',answerLabel:'Your answer (Rappen)'});
Object.assign(texts.de,{mathTitle:'Einen Hut kaufen',conversionQuestion:'Wie viele Rappen kostet der Hut?',remainingQuestion:'Wie viele Rappen bleiben übrig?',checkAnswer:'Prüfen',nextQuestion:'Nächste Frage',buyHat:'Hut kaufen',cancelMath:'Abbrechen',mathCorrect:'Richtig! Toll gerechnet.',mathRetry:'Versuche es noch einmal. Kein Geld wurde ausgegeben.',priceLabel:'Preis',balanceLabel:'Geldbeutel',conversionHint:'Multipliziere die Franken mit 100 und addiere die Rappen.',remainingHint:'Ziehe den Hutpreis von den Rappen in deinem Geldbeutel ab.',answerLabel:'Deine Antwort (Rappen)'});
const t=k=>texts[lang][k];
const app=document.querySelector('#app');
app.innerHTML=`<canvas id="world"></canvas><header><strong>🐾 World Pet Wash <small>PROTOTYPE · 06</small></strong><div><div id="wallet"></div><select id="language" aria-label="Language"><option value="tr">Türkçe</option><option value="en">English</option><option value="de">Deutsch</option></select><button id="pause">Ⅱ</button></div></header><div id="panel"></div><div id="hud"></div><div id="controls"><div id="pad"><button data-dir="up">▲</button><div><button data-dir="left">◀</button><button data-dir="down">▼</button><button data-dir="right">▶</button></div></div><button id="action"></button></div><div id="toast" role="status"></div><div id="bubble-layer"></div><div id="dryer-layer"></div><div id="wardrobe"></div><div id="shop"></div><footer>World Pet Wash · browser prototype</footer>`;
const canvas=document.querySelector('#world'),panel=document.querySelector('#panel'),hud=document.querySelector('#hud'),action=document.querySelector('#action'),layer=document.querySelector('#bubble-layer');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.setClearColor('#b8e5ec');
const scene=new THREE.Scene();scene.fog=new THREE.Fog('#b8e5ec',35,75);const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,150);
scene.add(new THREE.HemisphereLight(0xffffff,0x7e9763,1.7));const sun=new THREE.DirectionalLight(0xfff3d9,3);sun.position.set(8,18,10);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.normalBias=.035;Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30});scene.add(sun);
const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.8});
function mesh(geo,color,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const sphere=(r,c,p,x,y,z)=>mesh(new THREE.SphereGeometry(r,16,12),c,p,x,y,z);
const box=(w,h,d,c,p,x,y,z)=>mesh(new THREE.BoxGeometry(w,h,d),c,p,x,y,z);
const park=new THREE.Group();scene.add(park);mesh(new THREE.CylinderGeometry(40,40,1,64),'#9ecb72',park,0,-.55,0);mesh(new THREE.CylinderGeometry(16,16,.03,64),'#e4d3ab',park,0,.01,0);
for(let i=0;i<30;i++){const a=i/30*Math.PI*2,r=34+(i%3);const tree=new THREE.Group();tree.position.set(Math.sin(a)*r,0,Math.cos(a)*r);park.add(tree);mesh(new THREE.CylinderGeometry(.18,.3,2.5,8),'#99775b',tree,0,1.25,0);sphere(1.8,i%2?'#5d9e68':'#73b57b',tree,0,3.3,0);}
for(let i=0;i<45;i++){const a=i*2.4,r=17+(i%15);sphere(.12,['#fff5ce','#f79caf','#b49de2'][i%3],park,Math.sin(a)*r,.12,Math.cos(a)*r);}
box(6,4,4,'#f5e6d2',park,-13,2,-10);mesh(new THREE.ConeGeometry(5,2,4),'#dd8971',park,-13,5,-10).rotation.y=Math.PI/4;box(1.4,2.3,.1,'#79b8c1',park,-13,1.15,-7.95);
const coinLayer = new THREE.Group();park.add(coinLayer);
const coinGeometry = new THREE.CylinderGeometry(.32,.32,.08,24);
function coinLabel(value) {
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,128,128);
  ctx.fillStyle='#553a16';ctx.textAlign='center';ctx.font='bold 40px sans-serif';ctx.fillText(value<100?value:value/100,64,60);
  ctx.font='bold 23px sans-serif';ctx.fillText(value<100?'Rp.':'Fr.',64,90);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});
}
const coinLabels=new Map(DENOMINATIONS.map(value=>[value,coinLabel(value)]));
function spawnCoins(reset=false) {
  for(const coin of coinItems){coin.group.children[0].material.dispose();coin.group.children[1].geometry.dispose();}
  coinLayer.clear();coinItems.length=0;
  if(reset)coinBatch=0;
  for(let i=0;i<42;i++) {
    const value=DENOMINATIONS[i%DENOMINATIONS.length];
    const group=new THREE.Group();coinLayer.add(group);
    const coin=new THREE.Mesh(coinGeometry,new THREE.MeshStandardMaterial({color:value<100?'#cf9550':'#f4ce63',metalness:.15,roughness:.45}));coin.rotation.x=Math.PI/2;group.add(coin);
    group.scale.setScalar(value<100?1:1.2);
    const label=new THREE.Mesh(new THREE.PlaneGeometry(.55,.55),coinLabels.get(value));label.position.z=.045;group.add(label);
    const backLabel=new THREE.Mesh(label.geometry,coinLabels.get(value));backLabel.rotation.y=Math.PI;backLabel.position.z=-.045;group.add(backLabel);
    if(i<12)group.position.set(i%2===0?0:2, .65, 1.5+i*1.6);
    else {const angle=i*2.4,radius=10+(i%6)*4;group.position.set(Math.sin(angle)*radius,.65,Math.cos(angle)*radius);}
    coinItems.push({id:`${coinBatch}:${i}`,value,group});
  }
  coinBatch++;
}
function updateCoins() {
  if(!coinItems.some(c=>c.group.visible))spawnCoins();
  for(const coin of coinItems){
    if(!coin.group.visible)continue;
    coin.group.rotation.y=elapsed;
    coin.group.position.y=.65+Math.sin(elapsed*3+coin.value)*.08;
    if(Math.hypot(player.position.x-coin.group.position.x,player.position.z-coin.group.position.z)<.85&&economy.collect(coin.id,coin.value)){
      coin.group.visible=false;renderWallet();toast(`${t('coinFound')}: +${money(coin.value)}`);
    }
  }
}
const careRoom=createCareRoom();const clinic=careRoom.root;scene.add(clinic);clinic.visible=false;
const owner=createCharacter();const player=owner.root;scene.add(player);
let appearance={gender:'girl',hairStyle:'ponytail',hairColor:'brown',skin:'light',outfit:'coral',hat:'none',name:'Alex'};
owner.configure(appearance);
const characterText={
 tr:{hairStyle:'Saç modeli',hairColor:'Saç rengi',skin:'Ten rengi',short:'Kısa',bob:'Omuz hizası',ponytail:'At kuyruğu',curls:'Kıvırcık',brown:'Kahverengi',black:'Siyah',blonde:'Sarı',ginger:'Kızıl',chestnut:'Kestane',light:'Açık',warm:'Buğday',tan:'Esmer',deep:'Koyu',cap:'Spor şapka',sunhat:'Güneş şapkası',beanie:'Bere',blue:'Mavi',lavender:'Lavanta',turn:'Karakteri döndür'},
 en:{hairStyle:'Hairstyle',hairColor:'Hair color',skin:'Skin tone',short:'Short',bob:'Bob',ponytail:'Ponytail',curls:'Curly',brown:'Brown',black:'Black',blonde:'Blonde',ginger:'Ginger',chestnut:'Chestnut',light:'Light',warm:'Warm',tan:'Tan',deep:'Deep',cap:'Cap',sunhat:'Sun hat',beanie:'Beanie',blue:'Blue',lavender:'Lavender',turn:'Turn character'},
 de:{hairStyle:'Frisur',hairColor:'Haarfarbe',skin:'Hautton',short:'Kurz',bob:'Bob',ponytail:'Pferdeschwanz',curls:'Locken',brown:'Braun',black:'Schwarz',blonde:'Blond',ginger:'Rot',chestnut:'Kastanienbraun',light:'Hell',warm:'Warm',tan:'Gebräunt',deep:'Dunkel',cap:'Kappe',sunhat:'Sonnenhut',beanie:'Mütze',blue:'Blau',lavender:'Lavendel',turn:'Figur drehen'},
};
for(const language of Object.keys(characterText))Object.assign(texts[language],characterText[language]);
let previewAngle=.25;
function renderCharacterEditor(){
  const choices=(id,label,values,key)=>`<label>${t(label)}<select id="${id}">${values.map(value=>`<option value="${value}" ${appearance[key]===value?'selected':''}>${t(value)}</option>`).join('')}</select></label>`;
  panel.innerHTML=`<div class="eyebrow">WORLD PET WASH</div><h1>${t('create')}</h1><p>${t('intro')}</p><label>${t('name')}<input id="name" maxlength="20"></label>`+
    choices('gender','gender',['girl','boy'],'gender')+choices('hair-style','hairStyle',['short','bob','ponytail','curls'],'hairStyle')+
    choices('hair','hairColor',Object.keys(HAIR_COLORS),'hairColor')+choices('skin','skin',Object.keys(SKIN_COLORS),'skin')+
    choices('shirt','shirt',Object.keys(OUTFIT_COLORS),'outfit')+choices('hat','hat',['none','cap','sunhat','beanie'],'hat')+
    `<button id="turn-character">↻ ${t('turn')}</button><button class="primary" id="start">${t('start')} →</button>`;
  panel.className='card creation';hud.innerHTML='';
  document.querySelector('#name').value=appearance.name;
  document.querySelector('#name').oninput=e=>appearance.name=e.target.value;
  for(const [id,key]of [['gender','gender'],['hair-style','hairStyle'],['hair','hairColor'],['skin','skin'],['shirt','outfit'],['hat','hat']]) {
    document.getElementById(id).onchange=e=>{
      appearance[key]=e.target.value;
      if(key==='gender'){appearance.hairStyle=appearance.gender==='girl'?'ponytail':'short';renderCharacterEditor();}
      owner.configure(appearance);
    };
  }
  document.querySelector('#turn-character').onclick=()=>previewAngle+=Math.PI/2;
  document.querySelector('#start').onclick=()=>{misses=0;elapsed=0;care=new CareSession(Math.random()<.5?'mint':'coral');economy=new Economy();spawnCoins(true);enterChase();};
}
const puppy=createPuppy();const dog=puppy.root;const dirt=puppy.dirt;scene.add(dog);
const dryerLayer = document.querySelector('#dryer-layer');
const wardrobe = document.querySelector('#wardrobe');
const outfits = {};
for (const category of OUTFIT_CATEGORIES) {
  const group = new THREE.Group();
  (category === 'bow' || category === 'glasses' || category === 'hat' ? puppy.head : dog).add(group);
  group.visible = false;
  outfits[category] = group;
}
// Original accessories, attached to the dog so they stay on in the final scene.
for (const x of [-.095, .095]) sphere(.095, '#70b8bd', outfits.bow, x, .37, .08);
sphere(.05, '#70b8bd', outfits.bow, 0, .37, .16);
outfits.bow.position.set(-.28,-.12,.18);
for (const x of [-.2, .2]) mesh(new THREE.TorusGeometry(.14,.035,8,20), '#70b8bd', outfits.glasses, x,.075,.37);
box(.12,.035,.035,'#70b8bd',outfits.glasses,0,.075,.37);
mesh(new THREE.CylinderGeometry(.55,.55,.08,24),'#70b8bd',outfits.hat,0,.34,-.06);
mesh(new THREE.CylinderGeometry(.3,.38,.28,24),'#70b8bd',outfits.hat,0,.51,-.06);
const sweater = sphere(.65,'#70b8bd',outfits.clothes,0,.8,-.08);
sweater.scale.set(.72,.77,1.29);
const shirtFront=sphere(.3,'#70b8bd',outfits.clothes,0,.83,.85);
shirtFront.scale.set(.9,.95,.14);
const zonePoints = [new THREE.Vector3(0,1.56,.8), new THREE.Vector3(0,1.26,-.45), new THREE.Vector3(-.3,.3,.6), new THREE.Vector3(.3,.3,-.55)];
const wetSpots = zonePoints.map(point => {
  const drop = sphere(.065, '#7bd2e8', dog, point.x, point.y, point.z);
  drop.scale.y = 1.4;
  drop.visible = false;
  return drop;
});
function showOutfit() {
  for (const category of OUTFIT_CATEGORIES) {
    const color = care.outfit?.[category];
    outfits[category].visible = !!color;
    if (color) outfits[category].traverse(m => {
      if (m.isMesh) m.material.color.set(color === 'mint' ? '#70b8bd' : '#ec987e');
    });
  }
}
const shop=document.querySelector('#shop');
function renderWallet(){const wallet=document.querySelector('#wallet');wallet.hidden=stage==='create';wallet.innerHTML=`<strong>🪙 ${t('wallet')}: ${money(economy.balance)}</strong><small>${t('moneyRule')}</small>`;}
function payFor(item){if(!economy.pay(item)){toast(t('insufficient'));return false;}renderWallet();renderShop();return true;}
function renderShop(){
  shop.hidden=paused||!['wash','dry','dress'].includes(stage);
  if(shop.hidden)return;
  const price=stage==='wash'?`${t('bubblePrice')}: ${money(economy.prices.bubble)}`:stage==='dry'?`${t('dryerPrice')}: ${money(economy.prices.dryer)}`:t('outfitPrice');
  shop.innerHTML=`<strong>${price}</strong>${stage==='dry'?`<button id="buy-dryer" ${economy.dryerPaid?'disabled':''}>${economy.dryerPaid?t('paid'):t('unlock')}</button>`:''}<button id="collect-more">${t('moreCoins')}</button>`;
  document.querySelector('#collect-more').onclick=()=>{
    stopDryer();clearBubbles();keys.clear();stage='collect';park.visible=true;clinic.visible=false;player.visible=true;player.position.set(0,0,0);dog.position.set(0,0,5);angle=0;player.rotation.y=0;setParkView();renderUI();
  };
  const buy=document.querySelector('#buy-dryer');if(buy)buy.onclick=()=>{if(!economy.unlockDryer()){toast(t('insufficient'));return;}renderWallet();renderShop();};
}
function stopDryer() { activeZone = null; }
function renderDryer() {
  dryerLayer.innerHTML = '';
  zoneNames.forEach((name, i) => {
    const button = document.createElement('button');
    button.className = 'dry-zone';
    button.dataset.zone = i;
    button.innerHTML = `<span>${t(name)}</span><strong></strong><progress max="100" value="0" aria-label="${t('heat')}"></progress>`;
    button.setAttribute('aria-label', `${t(name)} — ${t('dry')}`);
    button.onpointerdown = e => {
      if (paused || stage !== 'dry' || activeZone !== null) return;
      if(!economy.dryerPaid){toast(t('unlock')+' · '+money(economy.prices.dryer));return;}
      button.setPointerCapture(e.pointerId);
      activeZone = i;
    };
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(event, () => { if (activeZone === i) stopDryer(); });
    }
    button.onkeydown = e => {
      if ((e.code === 'Space' || e.code === 'Enter') && !paused && stage === 'dry') {
        e.preventDefault(); if(!economy.dryerPaid){toast(t('unlock')+' · '+money(economy.prices.dryer));return;} activeZone = i;
      }
    };
    button.onkeyup = e => { if (e.code === 'Space' || e.code === 'Enter') stopDryer(); };
    button.onblur = stopDryer;
    dryerLayer.append(button);
  });
}
function updateDryer() {
  dog.updateMatrixWorld(true);
  for (let i = 0; i < 4; i++) {
    const button = dryerLayer.children[i];
    const point = dog.localToWorld(new THREE.Vector3(0,.85,0)).project(camera);
    // Keep all four controls outside the pet and clear of the HUD, even on phones.
    const centerX = (point.x * .5 + .5) * innerWidth;
    const centerY = (-point.y * .5 + .5) * innerHeight;
    const compact = innerHeight < 600;
    const leftSide = i === 0 || i === 2;
    const topRow = i < 2;
    const spacing = compact ? 155 : 200;
    const firstRow = Math.max(compact ? 235 : 325, Math.min(innerHeight - 135, centerY - 40));
    button.style.left = Math.max(65, Math.min(innerWidth - 65, centerX + (leftSide ? -spacing : spacing))) + 'px';
    button.style.top = (firstRow + (topRow ? 0 : 80)) + 'px';
    button.querySelector('strong').textContent = care.wetness[i] === 0 ? '✓' : `💧 ${Math.ceil(care.wetness[i])}%`;
    button.querySelector('progress').value = care.heat[i];
    button.classList.toggle('hot', care.heat[i] > 65);
    button.classList.toggle('blowing', activeZone === i);
    wetSpots[i].visible = care.wetness[i] > 0;
    wetSpots[i].scale.setScalar(.4 + care.wetness[i] / 100);
    if (activeZone === i && care.heat[i] > 65 && !document.querySelector('#toast').textContent) toast(t('coolDown'));
  }
}
function renderWardrobe() {
  wardrobe.innerHTML = `<p class="favorite">♥ ${t('favorite')}: <strong>${t(care.preference)}</strong></p>` +
    OUTFIT_CATEGORIES.map(category => `<fieldset><legend>${t(category)} · ${money(economy.prices[category])}</legend>${['mint','coral'].map(color =>
      `<button data-category="${category}" data-color="${color}" aria-pressed="${care.outfit[category] === color}" class="outfit-choice ${care.outfit[category] === color ? 'selected' : ''}"><span class="swatch ${color}"></span>${t(color)}${care.outfit[category] === color ? ' ✓' : ''}</button>`
    ).join('')}</fieldset>`).join('') + `<button class="primary" id="finish-care" ${care.dressed ? '' : 'disabled'}>${t('finish')}</button>`;
  for (const button of wardrobe.querySelectorAll('[data-category]')) button.onclick = () => {
    if (paused || stage !== 'dress') return;
    const category=button.dataset.category,color=button.dataset.color;
    if(care.outfit[category]===color)return;
    if(category==='hat') {
      if(!economy.canPay('hat')){toast(t('insufficient'));return;}
      openHatQuiz(color);return;
    }
    purchaseOutfit(category,color);
  };
  document.querySelector('#finish-care').onclick = () => {
    if (!care.dressed || paused) return;
    stage = 'done'; dog.rotation.z = 0; toast(''); renderUI();
  };
}
function purchaseOutfit(category,color) {
  if(!payFor(category))return;
  const response=care.choose(category,color);
  if(response==='escape'){escapeCare();return;}
  if(response==='dislike'){misses++;toast(t('disliked'));dog.rotation.z=.12;}
  else{toast(t('liked'));dog.rotation.z=0;}
  showOutfit();renderWardrobe();updateCareHud();
}
const mathDialog=document.createElement('dialog');
mathDialog.id='math-dialog';mathDialog.setAttribute('aria-labelledby','math-title');
document.body.append(mathDialog);
let hatQuiz=null;
function closeHatQuiz(){mathDialog.close();hatQuiz=null;keys.clear();}
mathDialog.addEventListener('cancel',e=>{e.preventDefault();closeHatQuiz();});
function openHatQuiz(color){
  keys.clear();hatQuiz={quiz:new PurchaseQuiz(economy.balance,economy.prices.hat),color};
  renderHatQuiz();mathDialog.showModal();mathDialog.querySelector('input').focus();
}
function renderHatQuiz(){
  const q=hatQuiz.quiz,conversion=q.step===0;
  mathDialog.innerHTML=`<h2 id="math-title">${t('mathTitle')}</h2><p>${q.step+1} / 2 · ${t(conversion?'conversionQuestion':'remainingQuestion')}</p><p>${t('priceLabel')}: <strong>${money(q.price)}</strong><br>${t('balanceLabel')}: <strong>${money(q.balance)}</strong></p><form id="math-form"><label>${t('answerLabel')}<input id="math-answer" type="text" inputmode="numeric" pattern="[0-9]+" autocomplete="off" required></label><button class="primary">${t('checkAnswer')}</button></form><p id="math-feedback" role="status"></p><button id="math-next" class="primary" hidden>${t(conversion?'nextQuestion':'buyHat')}</button><button id="math-cancel">${t('cancelMath')}</button>`;
  mathDialog.querySelector('#math-cancel').onclick=closeHatQuiz;
  mathDialog.querySelector('form').onsubmit=e=>{
    e.preventDefault();const correct=q.check(mathDialog.querySelector('input').value);
    mathDialog.querySelector('#math-feedback').textContent=correct?t('mathCorrect'):`${t('mathRetry')} ${t(conversion?'conversionHint':'remainingHint')} ${conversion?`${Math.floor(q.price/100)} × 100 + ${q.price%100}`:`${q.balance} − ${q.price}`}`;
    if(correct){mathDialog.querySelector('#math-form').hidden=true;mathDialog.querySelector('#math-next').hidden=false;mathDialog.querySelector('#math-next').focus();}
    else mathDialog.querySelector('input').select();
  };
  mathDialog.querySelector('#math-next').onclick=()=>{
    if(!q.advance())return;
    if(!q.complete){renderHatQuiz();mathDialog.querySelector('input').focus();return;}
    const color=hatQuiz.color;closeHatQuiz();
    if(stage==='dress'&&!paused)purchaseOutfit('hat',color);
  };
}
function updateCareHud() {
  const comfortBar = document.querySelector('#comfort');
  if (comfortBar) comfortBar.value = care.comfort;
  const progressBar = document.querySelector('#care-progress');
  if (progressBar) progressBar.value = stage === 'wash' ? care.clean : stage === 'dry' ? care.dryness : Object.keys(care.outfit).length * 25;
}
function escapeCare() {
  misses++;
  if(care.phase==='dry')economy.dryerPaid=false;
  care.resetCurrentPhase();
  stopDryer();
  enterChase();
  toast(t('escaped'));
}
function enterCare() {
  stopDryer(); clearBubbles(); toast('');
  stage = care.phase;
  park.visible = false; clinic.visible = true; player.visible = false;
  dog.position.set(0,.83,0); dog.rotation.set(0,stage === 'dry' ? 1.1 : .3,0);
  for (let i=0;i<dirt.length;i++)dirt[i].visible=stage==='wash'&&i>=Math.round(care.clean/12.5);
  for (const drop of wetSpots) drop.visible = stage === 'dry';
  showOutfit();
  camera.position.set(0,3.6,7); camera.lookAt(0,1.6,0);
  renderUI();
  if (stage === 'wash') for (let i = 0; i < 5; i++) addBubble();
}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
const keys=new Set();addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(mathDialog.open||e.target.matches('input,select'))return;keys.add(e.key.toLowerCase());if(e.code==='Space'&&!e.repeat)act();});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{keys.clear();stopDryer();if(stage!=='create'&&stage!=='done'){if(hatQuiz)closeHatQuiz();paused=true;renderUI();}});
for(const btn of document.querySelectorAll('[data-dir]')){btn.addEventListener('pointerdown',e=>{btn.setPointerCapture(e.pointerId);keys.add(btn.dataset.dir);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])btn.addEventListener(ev,()=>keys.delete(btn.dataset.dir));}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.textContent='',4500);}
let best=0;try{best=Number(localStorage.getItem('wpw-best'))||0;}catch{}
function renderUI(){document.documentElement.lang=lang;dog.visible=stage!=='create';coinLayer.visible=['chase','timing','collect'].includes(stage);renderWallet();renderShop();document.querySelector('#pause').textContent=paused?t('resume'):t('pause');document.querySelector('#pause').hidden=stage==='create'||stage==='done';document.querySelector('#controls').style.display=(stage==='chase'||stage==='timing'||stage==='collect')&&!paused?'flex':'none';layer.hidden=stage!=='wash'||paused;dryerLayer.hidden=stage!=='dry'||paused;wardrobe.hidden=stage!=='dress'||paused;document.body.dataset.stage=stage;document.body.classList.toggle('is-paused',paused);if(paused)stopDryer();
if(stage==='create'){renderCharacterEditor();return;}
if(paused){panel.className='card centered';panel.innerHTML=`<h1>${t('paused')}</h1><button class="primary" id="resume">${t('resume')}</button>`;document.querySelector('#resume').onclick=()=>{paused=false;renderUI();};return;}
if(stage==='done'){const stars=Math.max(1,3-Math.min(2,misses));best=Math.max(best,stars);try{localStorage.setItem('wpw-best',String(best));}catch{}panel.className='card centered';panel.innerHTML=`<div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><h1>${t('done')}</h1><p>${t('doneHelp')}</p><p>${t('saved')}: ${'★'.repeat(best)}</p><p>${t('spent')}: ${money(economy.spent)}</p><button class="primary" id="again">${t('again')}</button>`;document.querySelector('#again').onclick=()=>{stage='create';park.visible=true;clinic.visible=false;player.visible=true;dog.position.set(2,0,0);dog.rotation.set(0,0,0);player.position.set(0,0,0);previewAngle=.25;care=new CareSession();showOutfit();for(const d of dirt)d.visible=true;for(const drop of wetSpots)drop.visible=false;renderUI();};hud.innerHTML='';return;}
panel.className='instructions';panel.innerHTML=`<h2>${t(stage)}</h2><p>${t(stage+'Help')}</p>${stage==='timing'?'<div class="timing-track"><div class="target"></div><i id="marker"></i></div>':''}`;action.textContent=t(stage==='collect'?'returnCare':stage==='timing'?'tap':'catch');if(stage==='collect')action.disabled=false;const isCare = ['wash','dry','dress'].includes(stage);
  const label = stage === 'wash' ? 'clean' : stage === 'dry' ? 'dryProgress' : 'outfitProgress';
  hud.innerHTML = isCare ? `<div>${t(label)} <progress id="care-progress" max="100" value="0" aria-label="${t(label)}"></progress></div><div>${t('patience')} <progress id="comfort" max="100" value="${care.comfort}" aria-label="${t('patience')}"></progress></div>` : '';
  if(stage==='dry') renderDryer();
  if(stage==='dress') renderWardrobe();
  updateCareHud();
}

function setParkView(){camera.position.set(0,4,-6);camera.lookAt(0,1,3);}
function enterChase(){stage='chase';paused=false;park.visible=true;clinic.visible=false;player.visible=true;player.position.set(0,0,0);dog.position.set(0,0,5);angle=0;player.rotation.y=0;setParkView();for(const d of dirt)d.visible=care.phase==='wash';for(const drop of wetSpots)drop.visible=false;dog.rotation.z=0;showOutfit();stopDryer();clearBubbles();renderUI();}
function act(){if(paused)return;if(stage==='collect'){keys.clear();enterCare();return;}if(stage==='chase'){if(player.position.distanceTo(dog.position)<3){stage='timing';marker=0;renderUI();}else toast(t('near'));}else if(stage==='timing'){if(marker>=.38&&marker<=.62)enterCare();else{misses++;stage='chase';dog.position.add(new THREE.Vector3(2,0,2));toast(t('near'));renderUI();}}}
action.onclick=act;document.querySelector('#pause').onclick=()=>{paused=!paused;keys.clear();stopDryer();renderUI();};document.querySelector('#language').onchange=e=>{lang=e.target.value;stopDryer();renderUI();for(const b of bubbles)b.el.setAttribute('aria-label',t('wash'));};
function clearBubbles(){for(const b of bubbles)b.el.remove();bubbles=[];selectedBubble=null;}
function addBubble(){const el=document.createElement('button');el.className='bubble';el.setAttribute('aria-label',t('wash'));el.innerHTML=`◌<small>${money(economy.prices.bubble)}</small>`;const slots=[[15,42],[85,42],[20,65],[80,65],[50,78]];const slot=slots.findIndex((_,i)=>!bubbles.some(b=>b.slot===i));const b={el,slot,x:slots[slot][0],y:slots[slot][1]};el.style.left=b.x+'%';el.style.top=b.y+'%';layer.append(el);bubbles.push(b);el.addEventListener('pointerdown',e=>{if(paused)return;el.setPointerCapture(e.pointerId);selectedBubble=b;});el.addEventListener('pointermove',e=>{if(selectedBubble!==b||paused||stage!=='wash')return;el.style.left=e.clientX+'px';el.style.top=e.clientY+'px';});el.addEventListener('pointerup',e=>{if(selectedBubble!==b||paused||stage!=='wash')return;selectedBubble=null;const projected=dog.position.clone().add(new THREE.Vector3(0,1,0)).project(camera);const x=(projected.x*.5+.5)*innerWidth,y=(-projected.y*.5+.5)*innerHeight;if(Math.hypot(e.clientX-x,e.clientY-y)<Math.min(innerWidth,innerHeight)*.22){if(!payFor('bubble')){el.style.left=b.x+'%';el.style.top=b.y+'%';return;}const done = care.washBubble();
  const cleanedCount = Math.round(care.clean / 12.5);
  for (let i = 0; i < cleanedCount; i++) dirt[i].visible = false;
  el.remove();bubbles=bubbles.filter(v=>v!==b);
  if(done)enterCare();else{addBubble();updateCareHud();}}else{el.style.left=b.x+'%';el.style.top=b.y+'%';}});el.addEventListener('pointercancel',()=>{selectedBubble=null;el.style.left=b.x+'%';el.style.top=b.y+'%';});}
const clock=new THREE.Clock();function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);if(!paused){elapsed+=dt;if(stage==='chase'||stage==='collect'){updateCoins();const forward=(keys.has('w')||keys.has('arrowup')||keys.has('up')?1:0)-(keys.has('s')||keys.has('arrowdown')||keys.has('down')?1:0);const turn=(keys.has('a')||keys.has('arrowleft')||keys.has('left')?1:0)-(keys.has('d')||keys.has('arrowright')||keys.has('right')?1:0);angle+=turn*dt*2.2;player.rotation.y=angle;player.position.x+=Math.sin(angle)*forward*dt*5;player.position.z+=Math.cos(angle)*forward*dt*5;if(player.position.length()>37)player.position.setLength(37);owner.animate(elapsed,forward!==0);const dest=new THREE.Vector3(Math.sin(elapsed*.25)*13,0,Math.cos(elapsed*.25)*13);const dir=dest.sub(dog.position);if(dir.length()>.2){dog.position.addScaledVector(dir.normalize(),dt*2);dog.rotation.y=Math.atan2(dir.x,dir.z);}dog.position.y=Math.sin(elapsed*14)*.035;action.disabled=stage==='collect'?false:player.position.distanceTo(dog.position)>=3;}if(stage==='timing'){marker=(Math.sin(elapsed*3.5)+1)/2;document.querySelector('#marker').style.left=marker*100+'%';action.disabled=false;}if(stage==='wash'){if(economy.canPay('bubble'))care.tickWash(dt);updateCareHud();if(care.comfort<=0)escapeCare();}
if(stage==='dry'){
  const finished = care.dry(dt,activeZone);
  if(care.comfort<=0)escapeCare();
  else if(finished)enterCare();
  else updateCareHud();
}
}
let target,look;if(stage==='chase'||stage==='timing'||stage==='collect'){target=player.position.clone().add(new THREE.Vector3(-Math.sin(angle)*6,4,-Math.cos(angle)*6));look=player.position.clone().add(new THREE.Vector3(Math.sin(angle)*3,1,Math.cos(angle)*3));}else if(['wash','dry','dress','done'].includes(stage)){const compact=innerHeight<600;const dressing=stage==='dress';target=new THREE.Vector3(dressing&&innerWidth>500?2:0,3.6,compact?5.8:7);look=new THREE.Vector3(dressing&&innerWidth>500?2:0,compact?2.5:1.6,0);}else{const portrait=innerWidth<600;target=new THREE.Vector3(portrait?-.8:-1.25,2.05,portrait?5.4:4.4);look=new THREE.Vector3(portrait?-.8:-1.25,1.13,0);dog.position.set(2,0,-.5);player.rotation.y=previewAngle;owner.animate(elapsed,false);}camera.position.lerp(target,1-Math.exp(-dt*6));camera.lookAt(look);if(stage==='dry')updateDryer();const wet=stage==='wash'?care.clean/100:stage==='dry'?1-care.dryness/100:0;if(!paused){puppy.animate(elapsed,{running:stage==='chase'||stage==='collect',wet,comfort:care.comfort,blowing:stage==='dry'&&activeZone!==null});const airTarget=stage==='dry'&&activeZone!==null?dog.localToWorld(zonePoints[activeZone].clone()):null;careRoom.animate(elapsed,{blowing:!!airTarget,target:airTarget});}renderer.render(scene,camera);}
camera.position.set(innerWidth<600?-.8:-1.25,2.05,innerWidth<600?5.4:4.4);renderUI();loop();
