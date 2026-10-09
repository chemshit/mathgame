# World Pet Wash

Yeni geliştirme sohbetleri için [çalışma rehberi](AGENTS.md) ve [güncel proje durumu](PROJECT_STATUS.md) dosyalarını inceleyin.

Türkçe, İngilizce ve Almanca destekli 3B tarayıcı oyunu prototipi. Node.js 22.12+ gerekir.

![Yeni köpek modeli ve bakım odası](docs/pet-spa.png)

```sh
npm ci
npm run dev
npm run build
npm test
```

Karakter seçimi → parkta köpeği yakalama → zamanlama oyunu → kirli noktalara baloncuk uygulama → suyla durulama → havluyla silme → kontrollü fön → kıyafet seçimi → yıldız değerlendirmesi.

WASD / ok tuşları: ileri, geri ve dönüş. J veya Zıpla düğmesi: serbest zıplama. Boşluk: yakalama/zamanlama. Telefonda ekran düğmeleri kullanılır; yatay ekran önerilir. Yıkamada köpeği döndürüp baloncukları görünen, işaretli kirli noktalara bırakın. Durulamada yandaki suyu açıp duş başlığını köpüklere sürükleyin; havluda dört bölgeyi ileri geri silin. Fön ekranında dört ıslak bölgenin düğmelerinde basılı tutun; sıcaklık göstergesi kırmızıya dönmeden başka bölgeye geçin. Bırakınca bölge soğur. Fare, dokunmatik veya odaklanmış düğmede boşluk/Enter kullanılabilir. Kıyafet ekranında köpeğin sevdiği rengi takip ederek toka, gözlük, şapka ve kıyafet seçin. Dört beğenilen seçimden sonra bakımı tamamlayın. Beğenmediği her seçim rahatlığı azaltır. Kaçışta köpeği yeniden yakalayıp yalnızca yarım kalan aşamayı baştan tamamlayın; biten yıkama ve fön korunur. En iyi yıldız sonucu tarayıcıda saklanır. Hesap veya sunucu gerekmez.

Tüy kesimi ve sahiplenme sonrası kişiselleştirme sonraki sürümlerdedir. Köpek ve bakım odası özgün, yumuşak hatlı 3B modellerden oluşur (`src/visuals.js`). Köpekte yerel olarak üretilen tüy dokusu, doğal patiler, göz kırpma, kuyruk ve koşma animasyonları; odada küvet, dolaplar, havlular, şişeler ve hareketli fön vardır. Harici model veya görsel servisi gerekmez. Odanın sabit detayları malzemeye göre birleştirilir; tüy demetleri tek instanced çizimde gösterilir. Üretim sürümü için mobil cihazlarda performans ve erişilebilirlik ayrıca doğrulanmalıdır.

## Rappen ve Frank

![Parkta Rappen ve Frank toplama](docs/coin-park.png)

Büyütülmüş parkta 5, 10, 20 ve 50 Rappen; 1, 2 ve 5 Frank değerinde oyun paraları toplanır. 100 Rappen = 1 Frank. Cüzdan her yeni oyunda sıfırlanır; fön ve kıyafet fiyatları yeni oyun başında değişir ve o oyun boyunca sabit kalır. Baloncuklar kendi üzerlerinde gösterilen farklı fiyatlara sahiptir. Baloncuk başına ödeme yapılır. Fön her denemede bir kez açılır; düğmeye basılı tutmak tekrar ücretlendirilmez. Her yeni kıyafet denemesi ücretlidir; zaten giyilen seçeneğe yeniden basmak ücretsizdir.

Para yetmezse işlemler gerçekleşmez ve cüzdan eksiye düşmez. “Parkta para topla” ile yarım kalan bakımın ilerlemesi korunarak para toplanabilir; “Bakıma dön” tekrar yakalamadan kaldığınız yerden devam eder. Gerçek kaçışta yalnızca yarım kalan aşama sıfırlanır; ödenen ücretler iade edilmez. Bütün paralar toplanırsa yeni bir parti oluşur. Parası olmayan oyuncunun yıkama bekleme süresi durur.

Bu sürümde oyun içi para ve hesap soruları vardır; gerçek para/ödeme yoktur.

## Karakter oluşturma

Kız ve erkek farklı başlangıç saçları ve kıyafet detaylarıyla gelir. Dört saç modeli (kısa, omuz hizası, at kuyruğu, kıvırcık), beş saç rengi, dört ten rengi, dört kıyafet rengi ve spor şapka/güneş şapkası/bere seçenekleri her iki karakter için de kullanılabilir. “Karakteri döndür” ile görünümü inceleyebilirsiniz. Seçimler ve isim dil değiştirirken korunur; koşarken kol ve bacaklar hareket eder. Modeller `src/character.js` içinde özgün olarak üretilir.

![Karakter seçimi](docs/character.png)

Yıkamada her ikinci başarılı baloncuk için kalan para sorusu sorulur; diğer baloncuklar doğrudan satın alınır. Ekrandaki baloncuklar farklı fiyatlara sahiptir (30–80 Rappen); her birinin fiyatı üzerinde görünür. Fön başlatma ve kıyafet denemelerinde her alışverişte soru sorulur. Fiyatlar soruda da Frank/Rappen biçiminde görünür; cevaplar yan yana Frank ve Rappen kutularına yazılır. Rappen kısmı 0–99 olmalıdır; olmayan birime 0 yazılır. Yanlış cevap veya vazgeçme para kesmez. Soru açıkken oyun ve rahatlık sayacı durur. Doğru cevapta işlem hemen tamamlanır; ikinci bir satın alma veya parka geçiş onayı gerekmez.

Para toplamak için parka gitmeden önce rastgele Frank/Rappen toplama sorusu çözülür; örneğin 4 Frank 10 Rappen + 10 Frank 90 Rappen = 15 Frank 0 Rappen. Soru ödül para vermez, parka erişim sağlar. Dönüşte yarım kalan bakım korunur.

Fön ısısı kırmızı alana (>65) girer girmez köpek patisiyle fönü iter ve fön havada dönerek uzaklaşır. Fön aşaması sıfırlanır, tamamlanan yıkama korunur. Yeni soruyu çözüp fönü yeniden satın almak gerekir; önceki ödeme iade edilmez. Bu özellikler Türkçe, İngilizce ve Almanca desteklidir.

Soru ekranında cüzdan üstte, ürün fiyatı altta vurgulanır. Yanlış cevap kırmızı mesaj ve kısa titreme gösterir; doğru cevap yeşil mesaj ve yıldız efektiyle 550 ms sonra işlemi otomatik tamamlar. Hareket azaltma tercihi CSS efektlerini kapatır.

Park çapı 108 birimdir. Köpeğe yaklaşınca Yakala/Space zıplamayı başlatır. Çocuk havada dururken köpeğin üzerindeki hedef halkası yeşil olduğunda fareyle tıklayın veya telefonda dokunun (Space de desteklenir). Erken/geç tıklama, hedef dışına basma veya bekleme köpeğin kaçmasına neden olur. Başarılı yakalamada karakter köpeği kucağına alır ve bakım odasına geçer. Duraklatma yakalama süresini de durdurur.

Karakterin güncel sürümü daha doğal baş/gövde oranları, parmaklar, bükülen dirsek ve dizler, göz kapağı hareketi, kumaş/saç/yüz için yerel üretilmiş hafif bump dokuları kullanır. Koşma ve kucaklama pozları eklem gruplarıyla hareket eder. Bu hâlâ prosedürel Three.js modelidir; Blender/GLB varlığı eklenmemiştir. Saç, şapka, ten ve kıyafet seçenekleri korunmuştur.

Washing now takes place in a small shallow water tank with translucent sides and gentle ripples. Floating soap bubbles have reflective highlights and slowly drift in bounded paths; grabbing one holds it under the pointer, and questions/pause freeze movement. Bubble prices and every-second-bubble questions are unchanged. The washing patience countdown runs more slowly for a relaxed pace. Reduced-motion preferences stop bubble drift; select a visible dirty marker, then apply a focused bubble with Enter/Space. Dirt uses local mottled mud textures with soft transparent edges, and disappears as washing progresses. Water is hidden for drying and dressing.

Yüzün güncel sürümü tek bir biçimlendirilmiş yüzey üzerinde burun, yanak ve çene geçişleri kullanır. Daha küçük gözler ve baş/gövde oranı doğal çocuk görünümünü destekler. Saçta uçlara doğru incelen tutamlar, kıyafette biçimlendirilmiş gövde kesimi, ince yaka, küçük cepler ve hafif kumaş kıvrımları vardır. Tüm görünüm seçimleri ve eklem animasyonları korunur.

![Erkek karakter görünümü](docs/character-boy.png)


Genişletilmiş bakım akışı: sekiz kirli bölge ayrı ayrı köpüklenir. Döndürme düğmeleri veya köpeğin üzerindeki yatay sürükleme ile diğer taraf açılır. Yanlış veya zaten temiz bir noktaya uygulama ücretlendirilmez. Köpük 3B olarak birikir; durulamada su akışıyla kademeli azalır. Durulama ve havlu bu sürümde ücretsizdir. Havlu bölgelerinde fare/dokunmatik ileri geri hareket veya Enter/Space kullanılır. Havlu sonrasında %60 ıslaklık kalır; fön yeniden başlatılırsa bu başlangıç korunur. Parktan dönüşte yarım kalan durulama/havlu ilerlemesi de korunur.

Yerel Web Audio sesleri: baloncuk, coin, cevap geri bildirimi, su, havlu ve başarılı bakım. Başlıktaki ses düğmesi tercihi tarayıcıda saklar; ses ilk oyuncu etkileşimiyle etkinleşir. Köpeğin kuyruk hareketi temizlendikçe daha neşeli olur.

![Köpüklü yıkama](docs/foam-wash.png)
![Durulama](docs/rinse.png)

Havlu aşamasında her tıklama/dokunma veya Enter/Space basışı bölgeyi %50 ilerletir: her bölge iki basışta tamamlanır. İleri geri sürükleme de daha kısa hareketlerle ilerler; sürüklemeyi bırakmak ayrıca bir tıklama olarak sayılmaz. Dört bölge tamamlanınca fön otomatik açılır.


Durulamada yandaki musluk suyu açar/kapatır. Başlık fare/dokunmatik ile köpüğün üzerine sürüklenirken su akar; bırakma veya duraklatma durulamayı durdurur. Klavyede başlığı odaklayıp oklarla taşıyabilirsiniz. Köpeği çevirmek diğer köpüklü tarafı açar. Aşama değişince musluk kapanır.

Parkta üç yürünebilir tepe vardır; oyuncu, köpek ve coinler aynı zemin yüksekliğini kullanır. J ve ekrandaki Zıpla düğmesi serbest zıplama sağlar; yakalama sırasındaki zıplama ayrıca devam eder. Köpek daha değişken bir rotada koşar. Salıncak ve kaydırak kullanılabilir; yakınına gelince düğme çıkar. Basamak alanı park dekorudur. Salıncak direkleri, oturak ve kaydırak yürüyüş çarpışmalarına sahiptir.

![Sürüklenebilir duş](docs/shower.png)
![Park oyun alanı](docs/playground.png)


Salıncağa/kaydırağa yaklaşınca kullanım düğmesi görünür; E veya düğme ile binilir. Salıncakta karakter oturup sallanır; E/İn ile güvenli tarafa iner. Kaydırakta otomatik merdiven çıkışı ve kayma sonrasında yürüyüşe dönülür; İn ile erken ayrılınabilir. Kullanırken normal yürüyüş/yakalama kapalıdır; duraklatma animasyonu da durdurur. Aynı etkileşimler para toplama park ziyaretinde kullanılabilir. Coinler bu nesnelerin içinde oluşturulmaz.

![Salıncakta oynama](docs/swing.png)

Saç modeli başın biçimini izleyen kesintisiz bir yüzey, hafif düzensiz saç çizgisi ve ince tutamlarla yenilendi. Omuz hizası saçta yan/ense hacmi, kıvırcıkta yüzeye oturan dalgalar, at kuyruğunda uca doğru daralan ve ayrı sallanan kuyruk vardır. Şapkayla üst detaylar gizlenir; tüm saç/renk seçenekleri korunur.

![Yenilenen saç modeli](docs/character-hair.png)
