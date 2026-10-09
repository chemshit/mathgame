import * as THREE from 'three';
import './style.css';
import { groundHeight, ParkJump, dogDestination } from './park.js';
import { GameSound } from './sound.js';
import { CaptureSequence } from './capture.js';
import { MoneyQuestion, collectionQuestion } from './math.js';
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
Object.assign(texts.tr,{mathTitle:'Şapka alışverişi',conversionQuestion:'Şapkanın fiyatı kaç Frank ve kaç Rappen?',remainingQuestion:'Şapkayı alınca kaç Frank ve kaç Rappen kalır?',checkAnswer:'Kontrol et',nextQuestion:'Sonraki soru',buyHat:'Şapkayı satın al',cancelMath:'Vazgeç',mathCorrect:'Doğru! Harika hesapladın.',mathRetry:'Bir daha deneyelim. Para kesilmedi.',priceLabel:'Fiyat',balanceLabel:'Cüzdan',conversionHint:'Her 100 Rappen’i 1 Frank olarak grupla. Artan Rappen’i ikinci kutuya yaz. Sıfırsa 0 yaz.',remainingHint:'Şapkanın fiyatını cüzdanından çıkar. Gerekirse 1 Frank’ı 100 Rappen’e ayır. Sıfırsa 0 yaz.',answerLabel:'Cevabın'});
Object.assign(texts.en,{mathTitle:'Hat shopping',conversionQuestion:'How many francs and Rappen does the hat cost?',remainingQuestion:'How many francs and Rappen will you have left?',checkAnswer:'Check',nextQuestion:'Next question',buyHat:'Buy the hat',cancelMath:'Cancel',mathCorrect:'Correct! Great calculation.',mathRetry:'Try again. No money was spent.',priceLabel:'Price',balanceLabel:'Wallet',conversionHint:'Group every 100 Rappen into 1 franc. Put the remaining Rappen in the second box. Write 0 if none remain.',remainingHint:'Subtract the hat price from your wallet. Exchange 1 franc for 100 Rappen if needed. Write 0 for an empty unit.',answerLabel:'Your answer'});
Object.assign(texts.de,{mathTitle:'Einen Hut kaufen',conversionQuestion:'Wie viele Franken und Rappen kostet der Hut?',remainingQuestion:'Wie viele Franken und Rappen bleiben übrig?',checkAnswer:'Prüfen',nextQuestion:'Nächste Frage',buyHat:'Hut kaufen',cancelMath:'Abbrechen',mathCorrect:'Richtig! Toll gerechnet.',mathRetry:'Versuche es noch einmal. Kein Geld wurde ausgegeben.',priceLabel:'Preis',balanceLabel:'Geldbeutel',conversionHint:'Je 100 Rappen ergeben 1 Franken. Schreibe die übrigen Rappen ins zweite Feld. Schreibe 0, wenn keine übrig bleiben.',remainingHint:'Ziehe den Hutpreis vom Geldbeutel ab. Tausche bei Bedarf 1 Franken gegen 100 Rappen. Schreibe 0 für eine leere Einheit.',answerLabel:'Deine Antwort'});
Object.assign(texts.tr,{mathTitle:'Alışveriş hesabı',remainingQuestion:'Bu ürünü alınca kaç Frank ve kaç Rappen kalır?',buyProduct:'Satın al',parkMath:'Parka gitmeden hesaplayalım',additionQuestion:'Bu iki miktarın toplamı kaç Frank ve kaç Rappen?',additionHint:'Frankları ve Rappenleri ayrı ayrı topla. Her 100 Rappen’i 1 Frank’a çevir.',goPark:'Parka git',dryerThrown:'Çok sıcak! Köpek fönü patisiyle itti. Fönü yeniden satın alıp baştan başla.',dryHelp:'Fönü satın al, ıslak bölgelere kısa kısa tut. Kırmızıya girer girmez fön biter ve yeniden satın alman gerekir.'});
Object.assign(texts.en,{mathTitle:'Shopping calculation',remainingQuestion:'How many francs and Rappen remain after buying this item?',buyProduct:'Buy',parkMath:'Calculate before visiting the park',additionQuestion:'How many francs and Rappen do these amounts add up to?',additionHint:'Add francs and Rappen separately. Exchange every 100 Rappen for 1 franc.',goPark:'Go to the park',dryerThrown:'Too hot! The puppy pushed the dryer away. Buy it again and restart drying.',dryHelp:'Buy the dryer and use short bursts on wet areas. Entering red immediately ends drying; buy it again to restart.'});
Object.assign(texts.de,{mathTitle:'Einkauf berechnen',remainingQuestion:'Wie viele Franken und Rappen bleiben nach dem Kauf übrig?',buyProduct:'Kaufen',parkMath:'Vor dem Parkbesuch rechnen',additionQuestion:'Wie viele Franken und Rappen ergeben diese Beträge zusammen?',additionHint:'Addiere Franken und Rappen getrennt. Tausche je 100 Rappen gegen 1 Franken.',goPark:'Zum Park',dryerThrown:'Zu heiss! Der Hund hat den Föhn weggestossen. Kaufe ihn erneut und beginne das Föhnen von vorne.',dryHelp:'Kaufe den Föhn und föhne nasse Stellen kurz. Sobald es rot wird, endet das Föhnen; kaufe den Föhn erneut.'});
Object.assign(texts.tr,{bubblePrice:'Baloncuk fiyatı',bubbleRange:'Baloncuklar: 30–80 Rappen · Her 2. baloncukta soru'});
Object.assign(texts.en,{bubblePrice:'Bubble price',bubbleRange:'Bubbles: 30–80 Rappen · A question every 2nd bubble'});
Object.assign(texts.de,{bubblePrice:'Seifenblasenpreis',bubbleRange:'Seifenblasen: 30–80 Rappen · Eine Frage bei jeder 2. Blase'});
Object.assign(texts.tr,{timing:'Zıpla ve yakala!',timingHelp:'Havada hedef yeşilken köpeğin üzerindeki halkaya tıkla veya dokun.',caughtPet:'Yakaladın! Bakım odasına gidiyoruz.',missedPet:'Köpek kaçtı! Yeniden yaklaş.',tap:'Yakala'});
Object.assign(texts.en,{timing:'Jump and catch!',timingHelp:'While in the air, click or tap the ring on the puppy when it turns green.',caughtPet:'Caught! Heading to the care room.',missedPet:'The puppy got away! Get close again.',tap:'Catch'});
Object.assign(texts.de,{timing:'Spring und fang!',timingHelp:'Klicke oder tippe in der Luft auf den Ring am Hund, wenn er grün wird.',caughtPet:'Gefangen! Auf zum Pflegeraum.',missedPet:'Der Hund ist entwischt! Geh wieder näher.',tap:'Fangen'});
Object.assign(texts.tr,{washHelp:'Köpeği çevir, baloncukları işaretli kirli noktalara bırak.',rinse:'Durulama zamanı',rinseHelp:'Köpeği çevir. Köpüklü noktaları basılı tutarak suyla durula.',towel:'Havlu zamanı',towelHelp:'Her havluya iki kez bas veya ileri geri sil. Klavyede Enter kullan.',rinseProgress:'Durulama',towelProgress:'Havluyla kurulama',turnLeft:'Sola çevir',turnRight:'Sağa çevir',dirtySpot:'Kirli nokta',foamSpot:'Köpüklü nokta',targetDirt:'Baloncuğu işaretli kirli noktaya bırak.',soundOn:'Ses açık',soundOff:'Ses kapalı'});
Object.assign(texts.en,{washHelp:'Turn the puppy and drop bubbles onto marked dirty spots.',rinse:'Rinse time',rinseHelp:'Turn the puppy. Hold each foamy spot to rinse it with water.',towel:'Towel time',towelHelp:'Tap each towel twice or rub back and forth. Use Enter with a keyboard.',rinseProgress:'Rinsing',towelProgress:'Towel drying',turnLeft:'Turn left',turnRight:'Turn right',dirtySpot:'Dirty spot',foamSpot:'Foamy spot',targetDirt:'Drop the bubble on a marked dirty spot.',soundOn:'Sound on',soundOff:'Sound off'});
Object.assign(texts.de,{washHelp:'Drehe den Hund und ziehe Blasen auf markierte schmutzige Stellen.',rinse:'Zeit zum Abspülen',rinseHelp:'Drehe den Hund. Halte jede schaumige Stelle gedrückt, um sie abzuspülen.',towel:'Handtuchzeit',towelHelp:'Tippe jedes Handtuch zweimal an oder reibe hin und her. Mit der Tastatur: Enter.',rinseProgress:'Abspülen',towelProgress:'Abtrocknen',turnLeft:'Nach links drehen',turnRight:'Nach rechts drehen',dirtySpot:'Schmutzige Stelle',foamSpot:'Schaumige Stelle',targetDirt:'Ziehe die Blase auf eine markierte schmutzige Stelle.',soundOn:'Ton an',soundOff:'Ton aus'});
Object.assign(texts.tr,{jump:'Zıpla',waterOn:'Suyu aç',waterOff:'Suyu kapat',showerHead:'Duş başlığı',rinseHelp:'Yandaki suyu aç. Duş başlığını tutup köpüklere sürükle; köpeği çevirebilirsin. Klavyede başlığı seç, oklarla taşı.',chaseHelp:'WASD / oklarla koş, J ile zıpla. Yaklaşınca Yakala. Tepeleri ve oyun alanını keşfet!'});
Object.assign(texts.en,{jump:'Jump',waterOn:'Turn water on',waterOff:'Turn water off',showerHead:'Shower head',rinseHelp:'Turn on the water at the side. Drag the shower head onto foam; turn the puppy as needed. Select the head and use arrow keys with a keyboard.',chaseHelp:'Run with WASD / arrows, jump with J. Get close and Catch. Explore hills and the playground!'});
Object.assign(texts.de,{jump:'Springen',waterOn:'Wasser öffnen',waterOff:'Wasser schliessen',showerHead:'Duschkopf',rinseHelp:'Öffne das Wasser an der Seite. Ziehe den Duschkopf auf den Schaum und drehe den Hund. Mit der Tastatur: Duschkopf auswählen und Pfeile verwenden.',chaseHelp:'Laufe mit WASD / Pfeilen, springe mit J. Geh näher und fange den Hund. Erkunde Hügel und Spielplatz!'});
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
const park=new THREE.Group();scene.add(park);mesh(new THREE.CylinderGeometry(54,54,1,64),'#9ecb72',park,0,-.55,0);mesh(new THREE.CylinderGeometry(16,16,.03,64),'#e4d3ab',park,0,.01,0);
// Radial terrain shares the same height function as player, dog and coins.
const terrainPositions=[],terrainIndices=[];
for(let ring=0;ring<=48;ring++)for(let i=0;i<=96;i++){const a=i/96*Math.PI*2,r=ring/48*54,x=Math.sin(a)*r,z=Math.cos(a)*r;terrainPositions.push(x,groundHeight(x,z),z);}
for(let ring=0;ring<48;ring++)for(let i=0;i<96;i++){const a=ring*97+i,b=a+97;terrainIndices.push(a,b,a+1,a+1,b,b+1);}
const terrainGeometry=new THREE.BufferGeometry();terrainGeometry.setAttribute('position',new THREE.Float32BufferAttribute(terrainPositions,3));terrainGeometry.setIndex(terrainIndices);terrainGeometry.computeVertexNormals();mesh(terrainGeometry,'#9ecb72',park);
// A small colourful playground with a swing, slide and stepping pads.
const playground=new THREE.Group();playground.position.set(-18,0,-17);park.add(playground);
mesh(new THREE.CylinderGeometry(6,6,.04,40),'#e4cba5',playground,0,.04,0);
for(const x of [-2,2])for(const z of [-.8,.8]){const post=box(.12,2.8,.12,'#79a9b2',playground,x,1.4,z);post.rotation.z=x<0?-.13:.13;}
box(4.6,.15,.15,'#79a9b2',playground,0,2.8,0);
for(const x of [-.4,.4])box(.03,1.9,.03,'#a5aaa6',playground,x,1.8,0);
box(1,.12,.5,'#efb16c',playground,0,.83,0);
const slide=box(1.2,.1,3.2,'#dba391',playground,3.2,.85,1.4);slide.rotation.x=-.48;
for(const x of [2.75,3.65])box(.08,1.6,.08,'#719b94',playground,x,.8,0);
for(let i=0;i<4;i++)mesh(new THREE.CylinderGeometry(.55,.55,.1,20),i%2?'#7abbb0':'#edbd75',playground,-3+i*1.5,.12,3);
for(let i=0;i<30;i++){const a=i/30*Math.PI*2,r=48+(i%3);const tree=new THREE.Group();tree.position.set(Math.sin(a)*r,0,Math.cos(a)*r);park.add(tree);mesh(new THREE.CylinderGeometry(.18,.3,2.5,8),'#99775b',tree,0,1.25,0);sphere(1.8,i%2?'#5d9e68':'#73b57b',tree,0,3.3,0);}
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
    else {const angle=i*2.4,radius=12+(i%6)*6;group.position.set(Math.sin(angle)*radius,.65,Math.cos(angle)*radius);}
    group.position.y=groundHeight(group.position.x,group.position.z)+.65;
    coinItems.push({id:`${coinBatch}:${i}`,value,group});
  }
  coinBatch++;
}
function updateCoins() {
  if(!coinItems.some(c=>c.group.visible))spawnCoins();
  for(const coin of coinItems){
    if(!coin.group.visible)continue;
    coin.group.rotation.y=elapsed;
    coin.group.position.y=groundHeight(coin.group.position.x,coin.group.position.z)+.65+Math.sin(elapsed*3+coin.value)*.08;
    if(Math.hypot(player.position.x-coin.group.position.x,player.position.z-coin.group.position.z)<.85&&economy.collect(coin.id,coin.value)){
      sound.play('coin');coin.group.visible=false;renderWallet();toast(`${t('coinFound')}: +${money(coin.value)}`);
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
const sound=new GameSound();
addEventListener('pointerdown',()=>sound.unlock(),{once:true});addEventListener('keydown',()=>sound.unlock(),{once:true});
const soundButton=document.createElement('button');soundButton.id='sound-toggle';document.querySelector('header>div').append(soundButton);
soundButton.onclick=()=>{sound.toggle();renderSound();};
function renderSound(){soundButton.textContent=sound.muted?'🔇':'🔊';soundButton.setAttribute('aria-label',t(sound.muted?'soundOff':'soundOn'));soundButton.setAttribute('aria-pressed',String(!sound.muted));}
const parkJump=new ParkJump();
const jumpButton=document.createElement('button');jumpButton.id='jump-button';document.querySelector('#controls').append(jumpButton);
jumpButton.onclick=()=>{if(!paused&&['chase','collect'].includes(stage))parkJump.start();};
jumpButton.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();if(!e.repeat)jumpButton.click();}};
const rinseControl=document.createElement('div');rinseControl.id='rinse-control';document.body.append(rinseControl);
let waterOn=false,showerDragging=false,showerPoint={x:100,y:220};
function renderRinseControl(){
 rinseControl.hidden=paused||stage!=='rinse';showerDragging=false;
 rinseControl.innerHTML=`<button id="water-tap" aria-pressed="${waterOn}">🚰 ${t(waterOn?'waterOff':'waterOn')}</button><button id="shower-handle" aria-label="${t('showerHead')}" title="${t('showerHead')}"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M31 37L23 22" fill="none" stroke="#77939e" stroke-width="8" stroke-linecap="round"/><ellipse cx="21" cy="17" rx="13" ry="7" transform="rotate(-30 21 17)" fill="#d6e2e5" stroke="#77939e" stroke-width="3"/><path d="M13 17l2 3m5-7l2 3m5-7l2 3" stroke="#58b4d2" stroke-width="2"/></svg></button>`;
 const handle=rinseControl.querySelector('#shower-handle');
 const position=()=>{handle.style.left=showerPoint.x+'px';handle.style.top=showerPoint.y+'px';};position();
 rinseControl.querySelector('#water-tap').onclick=()=>{waterOn=!waterOn;rinseControl.querySelector('#water-tap').textContent='🚰 '+t(waterOn?'waterOff':'waterOn');rinseControl.querySelector('#water-tap').setAttribute('aria-pressed',String(waterOn));};
 handle.onpointerdown=e=>{if(paused||mathTask)return;handle.setPointerCapture(e.pointerId);showerDragging=true;showerPoint={x:e.clientX,y:e.clientY};position();};
 handle.onpointermove=e=>{if(!showerDragging)return;showerPoint={x:e.clientX,y:e.clientY};position();};
 for(const event of ['pointerup','pointercancel','lostpointercapture'])handle.addEventListener(event,()=>{showerDragging=false;rinseZone=null;});
 handle.onkeydown=e=>{const moves={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,-15],ArrowDown:[0,15]};if(moves[e.key]){e.preventDefault();e.stopPropagation();const [x,y]=moves[e.key];showerPoint.x=Math.max(30,Math.min(innerWidth-30,showerPoint.x+x));showerPoint.y=Math.max(70,Math.min(innerHeight-30,showerPoint.y+y));showerDragging=true;position();}};
 handle.onblur=()=>{showerDragging=false;rinseZone=null;};
}
function updateShower(){
 rinseControl.classList.toggle('flowing',waterOn&&showerDragging&&!paused&&!mathTask);
 rinseZone=null;if(!waterOn||!showerDragging||paused||mathTask||stage!=='rinse')return;
 let best=48;
 for(let i=0;i<8;i++)if(care.foam[i]>0&&spotVisible(i)){const p=spotPosition(i),distance=Math.hypot(p.x-showerPoint.x,p.y-showerPoint.y);if(distance<best){best=distance;rinseZone=i;}}
}
const careTools=document.createElement('div');careTools.id='care-tools';document.body.append(careTools);
const spotLayer=document.createElement('div');spotLayer.id='spot-layer';document.body.append(spotLayer);
let rinseZone=null,selectedDirt=null,lastWaterSound=0,towelVisualZone=0,towelVisualUntil=0,lastTowelSound=0;
function syncSoap(){
  for(let i=0;i<8;i++)dirt[i].visible=stage==='wash'&&!care.washedZones[i];
  const levels=stage==='wash'?care.washedZones.map(value=>value?1:0):stage==='rinse'?care.foam.map(value=>value/100):Array(8).fill(0);
  puppy.setFoam(levels);
}
function spotVisible(index){
  const normal=new THREE.Vector3(index%2?1:-1,0,0).applyQuaternion(dog.quaternion);
  const location=dog.localToWorld(dirt[index].position.clone());
  return normal.dot(camera.position.clone().sub(location).normalize())>.15;
}
function spotPosition(index){const v=dog.localToWorld(dirt[index].position.clone()).project(camera);return {x:(v.x*.5+.5)*innerWidth,y:(-v.y*.5+.5)*innerHeight};}
function renderCareTools(){
  renderRinseControl();
  careTools.hidden=paused||!['wash','rinse','towel'].includes(stage);
  spotLayer.hidden=paused||!['wash','rinse'].includes(stage);spotLayer.innerHTML='';rinseZone=null;
  careTools.innerHTML=`<div class="pet-turn"><button id="pet-left">↶ ${t('turnLeft')}</button><button id="pet-right">${t('turnRight')} ↷</button></div>${stage==='towel'?`<div class="towel-zones">${zoneNames.map((name,i)=>`<button data-towel="${i}">▧ ${t(name)} <progress max="100" value="${care.towelProgress[i]}"></progress></button>`).join('')}</div>`:''}`;
  for(const [id,sign]of [['pet-left',-1],['pet-right',1]])careTools.querySelector('#'+id).onclick=()=>{if(!paused&&!mathTask)dog.rotation.y+=sign*Math.PI/4;};
  if(['wash','rinse'].includes(stage))for(let i=0;i<8;i++){
    const button=document.createElement('button');button.className='care-spot';button.dataset.spot=i;button.textContent=stage==='wash'?'✦':'🚿';if(stage==='rinse')button.tabIndex=-1;button.setAttribute('aria-label',`${t(stage==='wash'?'dirtySpot':'foamSpot')} ${i+1}`);
    button.onclick=()=>{if(stage==='wash'){selectedDirt=i;spotLayer.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',Number(b.dataset.spot)===i));}};
    spotLayer.append(button);
  }
  for(const button of careTools.querySelectorAll('[data-towel]')){
    let last=null,rubbed=false;
    const rub=amount=>{if(paused||mathTask||stage!=='towel')return;const index=Number(button.dataset.towel);const done=care.towel(index,amount);towelVisualZone=index;towelVisualUntil=elapsed+.6;if(elapsed-lastTowelSound>.25){sound.play('towel');lastTowelSound=elapsed;}button.querySelector('progress').value=care.towelProgress[index];updateCareHud();if(done){sound.play('happy');enterCare();}};
    button.onpointerdown=e=>{button.setPointerCapture(e.pointerId);last={x:e.clientX,y:e.clientY};rubbed=false;};
    button.onpointermove=e=>{if(!last)return;const distance=Math.hypot(e.clientX-last.x,e.clientY-last.y);if(distance>=8){last={x:e.clientX,y:e.clientY};rubbed=true;rub(35);}};
    for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,()=>last=null);
    button.onclick=e=>{if(!rubbed||e.detail===0)rub(50);rubbed=false;};
    button.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();if(!e.repeat)rub(50);}};
  }
}
function updateSpots(){
  if(stage==='towel'){
    const center=dog.localToWorld(new THREE.Vector3(0,1,0)).project(camera),cx=(center.x*.5+.5)*innerWidth,cy=(-center.y*.5+.5)*innerHeight;
    for(const button of careTools.querySelectorAll('[data-towel]')){
      const i=Number(button.dataset.towel),compact=innerHeight<600;
      const x=cx+(i%2?1:-1)*(compact?115:140),y=cy+(i<2?-65:70);
      button.style.left=Math.max(70,Math.min(innerWidth-70,x))+'px';
      button.style.top=Math.max(compact?205:310,Math.min(innerHeight-110,y))+'px';
    }
  }
  if(!['wash','rinse'].includes(stage))return;
  for(const button of spotLayer.children){const i=Number(button.dataset.spot),p=spotPosition(i);button.hidden=paused||!spotVisible(i)||(stage==='wash'?care.washedZones[i]:care.foam[i]<=0);button.style.left=p.x+'px';button.style.top=p.y+'px';button.classList.toggle('spraying',rinseZone===i);}
}
function renderWallet(){const wallet=document.querySelector('#wallet');wallet.hidden=stage==='create';wallet.innerHTML=`<strong>🪙 ${t('wallet')}: ${money(economy.balance)}</strong><small>${t('moneyRule')}</small>`;}
function payFor(item){if(!economy.pay(item)){toast(t('insufficient'));return false;}renderWallet();renderShop();return true;}
function renderShop(){
  shop.hidden=paused||!['wash','rinse','towel','dry','dress'].includes(stage);
  if(shop.hidden)return;
  const price=stage==='wash'?t('bubbleRange'):stage==='dry'?`${t('dryerPrice')}: ${money(economy.prices.dryer)}`:stage==='dress'?t('outfitPrice'):t(stage);
  shop.innerHTML=`<strong>${price}</strong>${stage==='dry'?`<button id="buy-dryer" ${economy.dryerPaid?'disabled':''}>${economy.dryerPaid?t('paid'):t('unlock')}</button>`:''}<button id="collect-more">${t('moreCoins')}</button>`;
  document.querySelector('#collect-more').onclick=()=>openMath(collectionQuestion(), 'park', enterCollection);
  const buy=document.querySelector('#buy-dryer');if(buy)buy.onclick=()=>{
    if(economy.dryerPaid)return;
    askPurchase('dryer',()=>{if(!economy.unlockDryer()){toast(t('insufficient'));return;}renderWallet();renderShop();});
  };
}
function enterCollection(){
  parkJump.height=0;parkJump.velocity=0;stopDryer();clearBubbles();keys.clear();stage='collect';park.visible=true;clinic.visible=false;player.visible=true;player.position.set(0,0,0);dog.position.set(0,0,5);angle=0;player.rotation.y=0;setParkView();renderUI();
}
let dryerKnockTime=0;
function knockDryer(){
  stopDryer();economy.dryerPaid=false;care.resetCurrentPhase();misses++;
  dryerKnockTime=1.2;renderShop();updateCareHud();toast(t('dryerThrown'));
}
function stopDryer() { activeZone = null; rinseZone=null; waterOn=false; showerDragging=false; turningPointer=null; }
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
    askPurchase(category,()=>purchaseOutfit(category,color));
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
let mathTask=null;
function closeMath(){mathDialog.classList.remove('answer-success','answer-error');mathDialog.close();mathTask=null;keys.clear();}
mathDialog.addEventListener('cancel',e=>{e.preventDefault();closeMath();});
function askPurchase(item,finish){
  if(!economy.canPay(item)){toast(t('insufficient'));return;}
  openMath(new MoneyQuestion(economy.balance,economy.prices[item]),item,finish);
}
function openMath(question,item,finish){
  keys.clear();stopDryer();mathTask={question,item,finish,stage};
  renderMath();mathDialog.showModal();mathDialog.querySelector('input').focus();
}
function renderMath(){
  const {question:q,item}=mathTask,isPark=item==='park';
  const francUnit=lang==='de'?'Franken':lang==='en'?'Francs':'Frank';
  mathDialog.innerHTML=`<h2 id="math-title">${t(isPark?'parkMath':'mathTitle')}</h2><p>${t(isPark?'additionQuestion':'remainingQuestion')}</p><div>${isPark?`${money(q.left)} + ${money(q.right)}`:`<div class="math-money wallet-row"><span>${t('balanceLabel')}</span><strong>${money(q.left)}</strong></div><div class="math-money price-row"><span>${t(item==='bubble'?'bubblePrice':item==='dryer'?'dryerPrice':item)}</span><strong>${money(q.right)}</strong></div>`}</div><form id="math-form"><fieldset class="money-answer"><legend>${t('answerLabel')}</legend><label>${francUnit}<input id="math-francs" type="text" inputmode="numeric" pattern="[0-9]+" autocomplete="off" required></label><label>Rappen<input id="math-rappen" type="text" inputmode="numeric" pattern="[0-9]+" autocomplete="off" required></label></fieldset><button class="primary">${t('checkAnswer')}</button></form><p id="math-feedback" role="status"></p><button id="math-cancel">${t('cancelMath')}</button>`;
  mathDialog.querySelector('#math-cancel').onclick=closeMath;
  mathDialog.querySelector('form').onsubmit=e=>{
    e.preventDefault();if(mathTask?.settling)return;const correct=q.check(mathDialog.querySelector('#math-francs').value,mathDialog.querySelector('#math-rappen').value);
    if(correct){
      sound.play('success');
      mathDialog.classList.remove('answer-error');
      const task=mathTask;
      if(task.settling)return;task.settling=true;
      mathDialog.classList.add('answer-success');
      mathDialog.querySelector('#math-feedback').textContent='✓ '+t('mathCorrect');
      mathDialog.querySelector('button.primary').disabled=true;
      for(const input of mathDialog.querySelectorAll('input'))input.disabled=true;
      setTimeout(()=>{if(mathTask!==task)return;closeMath();if(stage===task.stage&&!paused){toast(t('mathCorrect'));task.finish();}},550);
    }else{
      sound.play('retry');
      mathDialog.classList.remove('answer-error');void mathDialog.offsetWidth;mathDialog.classList.add('answer-error');
      mathDialog.querySelector('#math-feedback').textContent=`${t('mathRetry')} ${t(isPark?'additionHint':'remainingHint')} ${money(q.left)} ${isPark?'+':'−'} ${money(q.right)}`;
      mathDialog.querySelector('input').select();
    }
  };
}
function updateCareHud() {
  const comfortBar = document.querySelector('#comfort');
  if (comfortBar) comfortBar.value = care.comfort;
  const progressBar = document.querySelector('#care-progress');
  if (progressBar) progressBar.value = stage==='wash'?care.clean:stage==='rinse'?care.rinsed:stage==='towel'?care.towelDried:stage==='dry'?care.dryness:Object.keys(care.outfit).length*25;
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
  syncSoap();
  for (const drop of wetSpots) drop.visible = stage === 'dry';
  showOutfit();
  camera.position.set(0,3.6,7); camera.lookAt(0,1.6,0);
  renderUI();
  if (stage === 'wash') for (let i = 0; i < 5; i++) addBubble();
}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
const keys=new Set();addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(mathDialog.open||e.target.matches('input,select'))return;keys.add(e.key.toLowerCase());if(e.code==='KeyJ'&&!e.repeat&&['chase','collect'].includes(stage))parkJump.start();if(e.code==='Space'&&!e.repeat)act();});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{keys.clear();stopDryer();if(stage!=='create'&&stage!=='done'){if(mathTask)closeMath();paused=true;renderUI();}});
for(const btn of document.querySelectorAll('[data-dir]')){btn.addEventListener('pointerdown',e=>{btn.setPointerCapture(e.pointerId);keys.add(btn.dataset.dir);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])btn.addEventListener(ev,()=>keys.delete(btn.dataset.dir));}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.textContent='',4500);}
let best=0;try{best=Number(localStorage.getItem('wpw-best'))||0;}catch{}
function renderUI(){document.documentElement.lang=lang;dog.visible=stage!=='create';coinLayer.visible=['chase','timing','collect'].includes(stage);renderWallet();renderShop();renderSound();renderCareTools();jumpButton.textContent=t('jump');document.querySelector('#pause').textContent=paused?t('resume'):t('pause');document.querySelector('#pause').hidden=stage==='create'||stage==='done';document.querySelector('#controls').style.display=(stage==='chase'||stage==='collect')&&!paused?'flex':'none';layer.hidden=stage!=='wash'||paused;dryerLayer.hidden=stage!=='dry'||paused;wardrobe.hidden=stage!=='dress'||paused;document.body.dataset.stage=stage;document.body.classList.toggle('is-paused',paused);if(paused)stopDryer();
if(stage==='create'){puppy.setFoam(Array(8).fill(0));renderCharacterEditor();return;}
if(paused){panel.className='card centered';panel.innerHTML=`<h1>${t('paused')}</h1><button class="primary" id="resume">${t('resume')}</button>`;document.querySelector('#resume').onclick=()=>{paused=false;renderUI();};return;}
if(stage==='done'){const stars=Math.max(1,3-Math.min(2,misses));best=Math.max(best,stars);try{localStorage.setItem('wpw-best',String(best));}catch{}panel.className='card centered';panel.innerHTML=`<div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><h1>${t('done')}</h1><p>${t('doneHelp')}</p><p>${t('saved')}: ${'★'.repeat(best)}</p><p>${t('spent')}: ${money(economy.spent)}</p><button class="primary" id="again">${t('again')}</button>`;document.querySelector('#again').onclick=()=>{stage='create';park.visible=true;clinic.visible=false;player.visible=true;dog.position.set(2,0,0);dog.rotation.set(0,0,0);player.position.set(0,0,0);previewAngle=.25;care=new CareSession();showOutfit();for(const d of dirt)d.visible=true;for(const drop of wetSpots)drop.visible=false;renderUI();};hud.innerHTML='';return;}
panel.className='instructions';panel.innerHTML=`<h2>${t(stage)}</h2><p>${t(stage+'Help')}</p>`;action.textContent=t(stage==='collect'?'returnCare':stage==='timing'?'tap':'catch');if(stage==='collect')action.disabled=false;const isCare = ['wash','rinse','towel','dry','dress'].includes(stage);
  const label=stage==='wash'?'clean':stage==='rinse'?'rinseProgress':stage==='towel'?'towelProgress':stage==='dry'?'dryProgress':'outfitProgress';
  hud.innerHTML = isCare ? `<div>${t(label)} <progress id="care-progress" max="100" value="0" aria-label="${t(label)}"></progress></div><div>${t('patience')} <progress id="comfort" max="100" value="${care.comfort}" aria-label="${t('patience')}"></progress></div>` : '';
  if(stage==='dry') renderDryer();
  if(stage==='dress') renderWardrobe();
  updateCareHud();
}

let turningPointer=null;
renderer.domElement.addEventListener('pointerdown',e=>{if(['wash','rinse','towel'].includes(stage)&&!paused&&!mathTask){renderer.domElement.setPointerCapture(e.pointerId);turningPointer=e.clientX;}});
renderer.domElement.addEventListener('pointermove',e=>{if(turningPointer===null||paused||mathTask)return;dog.rotation.y+=(e.clientX-turningPointer)*.008;turningPointer=e.clientX;});
for(const event of ['pointerup','pointercancel','lostpointercapture'])renderer.domElement.addEventListener(event,()=>turningPointer=null);
function setParkView(){camera.position.set(0,4,-6);camera.lookAt(0,1,3);}
function enterChase(){parkJump.height=0;parkJump.velocity=0;stage='chase';paused=false;park.visible=true;clinic.visible=false;player.visible=true;player.position.set(0,0,0);dog.position.set(0,0,5);angle=0;player.rotation.y=0;setParkView();for(let i=0;i<dirt.length;i++)dirt[i].visible=care.phase==='wash'&&!care.washedZones[i];puppy.setFoam(Array(8).fill(0));for(const drop of wetSpots)drop.visible=false;dog.rotation.z=0;showOutfit();stopDryer();clearBubbles();renderUI();}
let capture=null,jumpStart=new THREE.Vector3(),jumpEnd=new THREE.Vector3();
const catchTarget=document.createElement('button');catchTarget.id='catch-target';catchTarget.hidden=true;catchTarget.textContent='◎';catchTarget.setAttribute('aria-label',t('catch'));document.body.append(catchTarget);
catchTarget.onclick=()=>{if(paused||!capture)return;capture.click(true);};
renderer.domElement.addEventListener('pointerdown',()=>{if(!paused&&capture)capture.click(false);});
function startCapture(){
  parkJump.height=0;parkJump.velocity=0;keys.clear();capture=new CaptureSequence();jumpStart.copy(player.position);jumpEnd.copy(dog.position);
  const direction=dog.position.clone().sub(player.position);angle=Math.atan2(direction.x,direction.z);player.rotation.y=angle;
  stage='timing';renderUI();
}
function updateCapture(dt){
  capture.tick(dt);const phase=capture.phase;
  owner.animate(elapsed,false,phase==='caught'?'hold':'jump');
  if(phase==='jump'){const p=Math.min(1,capture.time/.45);player.position.lerpVectors(jumpStart,jumpEnd,p*.65);player.position.y=groundHeight(player.position.x,player.position.z)+Math.sin(p*Math.PI/2)*1.1;}
  if(phase==='aim')player.position.y=groundHeight(player.position.x,player.position.z)+1.1;
  if(phase==='miss'){
    player.position.y=groundHeight(player.position.x,player.position.z)+1.1*Math.max(0,1-capture.time/.4);
    const flee=dog.position.clone().sub(jumpStart);flee.y=0;if(flee.length()<.1)flee.set(1,0,1);
    dog.position.addScaledVector(flee.normalize(),dt*9);if(dog.position.length()>48)dog.position.setLength(48);dog.rotation.y=Math.atan2(flee.x,flee.z);
  }
  if(phase==='caught'){
    player.position.y=groundHeight(player.position.x,player.position.z)+Math.max(0,1.1-capture.time*3);
    dog.scale.setScalar(.55);dog.position.copy(player.position).add(new THREE.Vector3(Math.sin(angle)*.5,.8,Math.cos(angle)*.5));dog.rotation.y=angle+Math.PI/2;
    if(!document.body.classList.contains('catch-success')){document.body.classList.add('catch-success');toast(t('caughtPet'));}
  }
  if(phase==='retry'){misses++;player.position.y=groundHeight(player.position.x,player.position.z);capture=null;stage='chase';toast(t('missedPet'));renderUI();}
  if(phase==='inside'){capture=null;player.position.y=0;dog.scale.setScalar(1);document.body.classList.remove('catch-success');enterCare();document.body.classList.add('enter-room');setTimeout(()=>document.body.classList.remove('enter-room'),600);}
}
function positionCatchTarget(){
  catchTarget.hidden=paused||stage!=='timing'||capture?.phase!=='aim';if(catchTarget.hidden)return;
  const v=dog.position.clone().add(new THREE.Vector3(0,1,0)).project(camera);
  catchTarget.style.left=Math.max(48,Math.min(innerWidth-48,(v.x*.5+.5)*innerWidth))+'px';
  catchTarget.style.top=Math.max(70,Math.min(innerHeight-55,(-v.y*.5+.5)*innerHeight))+'px';
  catchTarget.classList.toggle('ready',capture.ready);catchTarget.setAttribute('aria-label',t('catch'));
  catchTarget.style.setProperty('--ring-scale',String(1.6-capture.time/1.8*.6));
}
function act(){if(paused)return;if(stage==='collect'){keys.clear();enterCare();return;}if(stage==='chase'){if(player.position.distanceTo(dog.position)<3)startCapture();else toast(t('near'));}else if(stage==='timing'&&capture?.phase==='aim'){capture.click(true);}}

action.onclick=act;document.querySelector('#pause').onclick=()=>{paused=!paused;keys.clear();stopDryer();renderUI();};document.querySelector('#language').onchange=e=>{lang=e.target.value;stopDryer();renderUI();for(const b of bubbles)b.el.setAttribute('aria-label',`${t('wash')} · ${money(b.price)}`);};
function clearBubbles(){for(const b of bubbles)b.el.remove();bubbles=[];selectedBubble=null;}
function buyBubble(b,zone=selectedDirt){
  if(!Number.isInteger(zone)||care.washedZones[zone]||!spotVisible(zone)){toast(t('targetDirt'));return;}
  if(!economy.canPayAmount(b.price)){toast(t('insufficient'));return;}
  const finish=()=>{
    if(!economy.payAmount(b.price)){toast(t('insufficient'));return;}
    renderWallet();
    const done=care.washBubble(zone);sound.play(done?'happy':'pop');
    syncSoap();
    b.el.remove();bubbles=bubbles.filter(v=>v!==b);
    if(done)enterCare();else{addBubble();updateCareHud();}
  };
  if(Math.round(care.clean/12.5)%2===1)openMath(new MoneyQuestion(economy.balance,b.price),'bubble',finish);
  else finish();
}
const gentleMotion=matchMedia('(prefers-reduced-motion: reduce)');
function positionBubble(b){
  const drift=gentleMotion.matches?0:1;
  b.el.style.left=(b.x+Math.sin(elapsed*.38+b.slot*1.7)*3*drift)+'%';
  b.el.style.top=(b.y+Math.sin(elapsed*.3+b.slot*2.1)*3.5*drift)+'%';
}
function addBubble(){
  const slots=[[15,42],[85,42],[20,65],[80,65],[50,innerHeight<600?58:72]];
  const slot=slots.findIndex((_,i)=>!bubbles.some(b=>b.slot===i));
  const prices=[30,40,50,60,70,80].filter(price=>!bubbles.some(b=>b.price===price));
  const price=prices[Math.floor(Math.random()*prices.length)];
  const el=document.createElement('button');el.className='bubble';
  el.setAttribute('aria-label',`${t('wash')} · ${money(price)}`);
  el.innerHTML=`<span class="soap-glint" aria-hidden="true"></span><small>${money(price)}</small>`;
  const b={el,slot,price,x:slots[slot][0],y:slots[slot][1]};
  const resetPosition=()=>positionBubble(b);
  resetPosition();layer.append(el);bubbles.push(b);
  el.addEventListener('pointerdown',e=>{if(paused||mathTask)return;el.setPointerCapture(e.pointerId);selectedBubble=b;});
  el.addEventListener('pointermove',e=>{if(selectedBubble!==b||paused||stage!=='wash')return;el.style.left=e.clientX+'px';el.style.top=e.clientY+'px';});
  el.addEventListener('pointerup',e=>{
    if(selectedBubble!==b||paused||stage!=='wash')return;
    selectedBubble=null;resetPosition();
    let nearest=null,best=48;
    for(let i=0;i<8;i++)if(!care.washedZones[i]&&spotVisible(i)){const p=spotPosition(i),distance=Math.hypot(e.clientX-p.x,e.clientY-p.y);if(distance<best){nearest=i;best=distance;}}
    if(nearest!==null)buyBubble(b,nearest);else toast(t('targetDirt'));
  });
  el.addEventListener('pointercancel',()=>{selectedBubble=null;resetPosition();});
  el.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();if(!paused&&!mathTask&&stage==='wash')buyBubble(b);}});
}
const clock=new THREE.Clock();function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);if(!paused&&!mathTask){elapsed+=dt;dryerKnockTime=Math.max(0,dryerKnockTime-dt);if(stage==='chase'||stage==='collect'){updateCoins();const forward=(keys.has('w')||keys.has('arrowup')||keys.has('up')?1:0)-(keys.has('s')||keys.has('arrowdown')||keys.has('down')?1:0);const turn=(keys.has('a')||keys.has('arrowleft')||keys.has('left')?1:0)-(keys.has('d')||keys.has('arrowright')||keys.has('right')?1:0);angle+=turn*dt*2.2;player.rotation.y=angle;player.position.x+=Math.sin(angle)*forward*dt*5;player.position.z+=Math.cos(angle)*forward*dt*5;if(player.position.length()>51)player.position.setLength(51);parkJump.tick(dt);player.position.y=groundHeight(player.position.x,player.position.z)+parkJump.height;owner.animate(elapsed,forward!==0,parkJump.height>0?'jump':null);const route=dogDestination(elapsed);const dest=new THREE.Vector3(route.x,0,route.z);const dir=dest.sub(dog.position);dir.y=0;if(dir.length()>.2){dog.position.addScaledVector(dir.normalize(),dt*2);dog.rotation.y=Math.atan2(dir.x,dir.z);}dog.position.y=groundHeight(dog.position.x,dog.position.z)+Math.sin(elapsed*14)*.035;action.disabled=stage==='collect'?false:player.position.distanceTo(dog.position)>=3;}if(stage==='timing'&&capture)updateCapture(dt);if(stage==='wash'){if(bubbles.some(b=>economy.canPayAmount(b.price)))care.tickWash(dt*.45);updateCareHud();if(care.comfort<=0)escapeCare();}
if(stage==='rinse')updateShower();
if(stage==='rinse'&&rinseZone!==null){const done=care.rinse(dt,rinseZone);syncSoap();updateCareHud();if(elapsed-lastWaterSound>.5){sound.play('water');lastWaterSound=elapsed;}if(done){sound.play('happy');enterCare();}}
if(stage==='dry'){
  const finished = care.dry(dt,activeZone);
  if(care.dryerRejected)knockDryer();
  else if(care.comfort<=0)escapeCare();
  else if(finished)enterCare();
  else updateCareHud();
}
}
let target,look;if(stage==='chase'||stage==='timing'||stage==='collect'){target=player.position.clone().add(new THREE.Vector3(-Math.sin(angle)*6,4,-Math.cos(angle)*6));look=player.position.clone().add(new THREE.Vector3(Math.sin(angle)*3,1,Math.cos(angle)*3));}else if(['wash','rinse','towel','dry','dress','done'].includes(stage)){const compact=innerHeight<600;const dressing=stage==='dress';target=new THREE.Vector3(dressing&&innerWidth>500?2:0,3.6,compact?5.8:7);look=new THREE.Vector3(dressing&&innerWidth>500?2:0,compact?2.5:1.6,0);}else{const portrait=innerWidth<600;target=new THREE.Vector3(portrait?-.8:-1.25,2.05,portrait?5.4:4.4);look=new THREE.Vector3(portrait?-.8:-1.25,1.13,0);dog.position.set(2,0,-.5);player.rotation.y=previewAngle;owner.animate(elapsed,false);}camera.position.lerp(target,1-Math.exp(-dt*6));camera.lookAt(look);positionCatchTarget();updateSpots();if(stage==='dry')updateDryer();const wet=['wash','rinse','towel'].includes(stage)?1:stage==='dry'?1-care.dryness/100:0;if(!paused){puppy.animate(elapsed,{running:stage==='chase'||stage==='collect'||capture?.phase==='miss',wet,comfort:care.comfort,blowing:stage==='dry'&&activeZone!==null,knocking:dryerKnockTime>0,happiness:care.clean/100});const airTarget=stage==='dry'&&activeZone!==null?dog.localToWorld(zonePoints[activeZone].clone()):null;const rinseTarget=stage==='rinse'&&rinseZone!==null?dog.localToWorld(dirt[rinseZone].position.clone()):null;const towelTarget=stage==='towel'&&elapsed<towelVisualUntil?dog.localToWorld(zonePoints[towelVisualZone].clone()):null;careRoom.animate(elapsed,{blowing:!!airTarget,target:airTarget,knock:dryerKnockTime,washing:stage==='wash'||stage==='rinse',rinseTarget,towelTarget});}if(stage==='wash'&&!paused&&!mathTask)for(const b of bubbles)if(b!==selectedBubble)positionBubble(b);renderer.render(scene,camera);}
camera.position.set(innerWidth<600?-.8:-1.25,2.05,innerWidth<600?5.4:4.4);renderUI();loop();
