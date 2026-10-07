# World Pet Wash

Türkçe, İngilizce ve Almanca destekli 3B tarayıcı oyunu prototipi. Node.js 22.12+ gerekir.

![Yeni köpek modeli ve bakım odası](docs/pet-spa.png)

```sh
npm ci
npm run dev
npm run build
npm test
```

Karakter seçimi → parkta köpeği yakalama → zamanlama oyunu → baloncukları sürükleyerek yıkama → kontrollü fön → kıyafet seçimi → yıldız değerlendirmesi.

WASD / ok tuşları: ileri, geri ve dönüş. Boşluk: yakalama/zamanlama. Telefonda ekran düğmeleri kullanılır; yatay ekran önerilir. Yıkamada baloncukları köpeğin üzerine bırakın. Fön ekranında dört ıslak bölgenin düğmelerinde basılı tutun; sıcaklık göstergesi kırmızıya dönmeden başka bölgeye geçin. Bırakınca bölge soğur. Fare, dokunmatik veya odaklanmış düğmede boşluk/Enter kullanılabilir. Kıyafet ekranında köpeğin sevdiği rengi takip ederek toka, gözlük, şapka ve kıyafet seçin. Dört beğenilen seçimden sonra bakımı tamamlayın. Beğenmediği her seçim rahatlığı azaltır. Kaçışta köpeği yeniden yakalayıp yalnızca yarım kalan aşamayı baştan tamamlayın; biten yıkama ve fön korunur. En iyi yıldız sonucu tarayıcıda saklanır. Hesap veya sunucu gerekmez.

Tüy kesimi, hesap soruları ve sahiplenme sonrası kişiselleştirme sonraki sürümlerdedir. Köpek ve bakım odası özgün, yumuşak hatlı 3B modellerden oluşur (`src/visuals.js`). Köpekte yerel olarak üretilen tüy dokusu, doğal patiler, göz kırpma, kuyruk ve koşma animasyonları; odada küvet, dolaplar, havlular, şişeler ve hareketli fön vardır. Harici model veya görsel servisi gerekmez. Odanın sabit detayları malzemeye göre birleştirilir; tüy demetleri tek instanced çizimde gösterilir. Üretim sürümü için mobil cihazlarda performans ve erişilebilirlik ayrıca doğrulanmalıdır.

## Rappen ve Frank

![Parkta Rappen ve Frank toplama](docs/coin-park.png)

Büyütülmüş parkta 5, 10, 20 ve 50 Rappen; 1, 2 ve 5 Frank değerinde oyun paraları toplanır. 100 Rappen = 1 Frank. Cüzdan her yeni oyunda sıfırlanır; fiyatlar yeni oyun başında değişir ve o oyun boyunca sabit kalır. Baloncuk başına ödeme yapılır. Fön her denemede bir kez açılır; düğmeye basılı tutmak tekrar ücretlendirilmez. Her yeni kıyafet denemesi ücretlidir; zaten giyilen seçeneğe yeniden basmak ücretsizdir.

Para yetmezse işlemler gerçekleşmez ve cüzdan eksiye düşmez. “Parkta para topla” ile yarım kalan bakımın ilerlemesi korunarak para toplanabilir; “Bakıma dön” tekrar yakalamadan kaldığınız yerden devam eder. Gerçek kaçışta yalnızca yarım kalan aşama sıfırlanır; ödenen ücretler iade edilmez. Bütün paralar toplanırsa yeni bir parti oluşur. Parası olmayan oyuncunun yıkama bekleme süresi durur.

Bu sürümde hesap sorusu ve gerçek para/ödeme yoktur; toplama, fiyatları görme ve oyun cüzdanından harcama altyapısı vardır.

## Karakter oluşturma

Kız ve erkek farklı başlangıç saçları ve kıyafet detaylarıyla gelir. Dört saç modeli (kısa, omuz hizası, at kuyruğu, kıvırcık), beş saç rengi, dört ten rengi, dört kıyafet rengi ve spor şapka/güneş şapkası/bere seçenekleri her iki karakter için de kullanılabilir. “Karakteri döndür” ile görünümü inceleyebilirsiniz. Seçimler ve isim dil değiştirirken korunur; koşarken kol ve bacaklar hareket eder. Modeller `src/character.js` içinde özgün olarak üretilir.

![Karakter seçimi](docs/character.png)

Şapka alışverişinde iki matematik sorusu vardır: fiyatı Frank/Rappen'den Rappen'e dönüştürme ve satın alma sonrası kalan Rappen'i hesaplama. İki doğru cevaptan sonra satın alma düğmesi açılır. Yanlış cevapta ipucu gösterilir; para kesilmez, köpeğin rahatlığı etkilenmez. Vazgeçme ve Escape ücretsizdir. Sorular Türkçe, İngilizce ve Almanca destekler. Diğer bakım alışverişleri mevcut şekilde devam eder.
