# World Pet Wash — güncel durum

Son güncelleme: 10 Ekim 2026. Bu belge yeni sohbetler için kısa proje hafızasıdır; uygulamanın güncel kodu esas alınır.

## Amaç ve mevcut sürüm

7–12 yaş için TR/EN/DE destekli, bilgisayar ve telefonda oynanabilir Three.js tarayıcı prototipi. Repo: `chemshit/mathgame`. Bu çalışma dizini `/workspace/mathgame`; başka ortamlarda yol değişebilir. Bugüne kadarki geliştirmeler GitHub `main` dalına gönderildi.

**Oyun sırası:** karakter oluştur → parkta kovala/coin topla → zıplama ve hedefe basarak yakala → kirli bölgeleri köpükle → suyla durula → havluyla sil → fön → kıyafet → 1–3 yıldız sonucu.

## Tamamlananlar

- Kız/erkek karakter; 4 saç modeli, 5 saç rengi, 4 ten/kıyafet rengi, şapkalar. Sürekli yüz geometrisi ve eklem hareketleri; modeller hâlâ prosedürel Three.js, Blender/GLB varlığı yok.
- Saçlar başı izleyen kesintisiz yüzey ve ince tutamlarla yenilendi; doğal saç çizgisi, dalgalı kıvırcık, daralan/ayrı sallanan at kuyruğu ve şapka uyumu. Dört model/beş renk korunur.
- 140 birim çaplı park, üç yürünebilir tepe, kullanılabilir salıncak/kaydırak ve küçük basamak dekorları, arkadan takip kamera, WASD/oklar ve ekran kontrolleri. J/düğmeyle serbest zıplama; oyuncu, köpek ve coinlerde ortak zemin yüksekliği. Köpek değişken bir rotada koşar. Yakalamada zıplama, havada hedef halkası, başarıda köpeği kucağa alma ve odaya geçiş; kaçırmada köpek uzaklaşır.
- Salıncağa/kaydırağa yaklaşınca düğme veya E ile kullanım; W/S, oklar veya ekranın ileri/geri düğmeleriyle itiş vererek sallanma ve bırakınca sönme; merdivenli yüksek uçtan alçak uca doğru kayma, güvenli iniş. Nesnelerin içinden yürüyerek geçiş engellenir; aynı park ziyaretinde yakalama/coin akışı korunur.
- Kenara taşınmış geniş oyun alanında kum havuzu/kumdan kale ve 12 birimlik tutunma parkuru. Sekiz geçişin her birinde 2–10 çarpım tablosundan soru; soru başına 15 saniye, yanlışta süre yenilenmez. Duraklatma süreyi durdurur; süre dolunca güvenli iniş, doğru cevapta sonraki tutamak, bitirince karşı uçta iniş. Ücretsiz; para ve bakım ilerlemesi korunur. TR/EN/DE, fare/dokunmatik/klavye.
- Küçük su haznesi, yavaş uçuşan fiyatlı baloncuklar, dokulu kir. Köpek düğmelerle/yatay sürüklemeyle döndürülür; 8 kirli bölge ayrı temizlenir ve köpük birikir.
- 3B musluğun yanındaki düğmeyle açıldığı anda görünür su akışı; hortumlu 3B başlığın kendisini köpüklere sürükleyerek durulama (klavyede oklar). Bırakınca başlık püskürtmesi durur, musluk açık kalır; duraklatma suyu kapatır. 4 bölgeyi havluyla silme. Son düzeltme: her tıklama/dokunma veya Enter/Space %50 ilerletir; iki basış yeterlidir. Sürükleme de ilerletir, bırakma ayrıca sayılmaz.
- Havlu sonrası ıslaklık %60; fön fazla ısınınca köpek cihazı patisiyle iter, yalnızca fön yeniden başlatılır ve yeniden ücret alınır.
- Toka, gözlük, şapka, kıyafet; köpeğin sevdiği renk ipucu ve beğenmeme/kaçış.
- Rappen/Frank coinler (5/10/20/50 Rp., 1/2/5 Fr.). Farklı baloncuk fiyatları 30–80 Rp.; fön/kıyafet fiyatları oyun başına değişir. Bakiye/harcama ve yıldızlar gösterilir; en iyi yıldız ve ses tercihi localStorage'da saklanır.
- Kalan para soruları: her 2. baloncuk, her yeni fön/kıyafet alımı. Parka para toplamaya geçişte Frank/Rappen toplama sorusu. İki cevap kutusu, ipuçları, yanlışta kırmızı/titreme, doğruda yeşil/yıldız ve otomatik işlem.
- Durulama/havlu şu an ücretsiz. Para yetmeyince işlem durur; parka gönüllü gidiş/geliş kısmi bakımı korur.
- Yerel Web Audio efektleri ve ses kapatma; temizlendikçe daha neşeli kuyruk. Baloncuk hareketinde azaltılmış hareket tercihi desteklenir.

## Doğrulama ve sınırlar

Son uygulama düzeltmesinde **25 Node testi ve Vite derlemesi geçti**. Bu park genişletmesinde masaüstü (1280×800) ve yatay telefon boyutunda (844×390) Chromium ile doğru/yanlış çarpma cevabı, sekiz adımda bitiriş, duraklatma, süre dolması, kumdan kale, salıncak, üç dil ve soru kartının ekrana sığması kontrol edildi. Para ve bakımın temizleme ilerlemesi değişmedi; tarayıcı hatası görülmedi. Yazılımsal çizimin yavaşlığı nedeniyle davranış testinde 3B çizim kapatıldı ve kaydırak animasyonu hızlandırıldı; ayrıca 3B görünüm telefon boyutunda incelendi. Önceki kontrolde salıncakta W/S itişi ve duraklatma, düzeltilmiş kaydıraktan çıkıp kayma, başlık tutulmadan musluk akışı, musluğun yanında düğme, 3B başlık hareketi/köpük azaltma/bırakma ve telefon ekran boyutunda yerleşim/klavye kontrolü Chromium’da doğrulandı. Tarayıcı hatası görülmedi. Önceki kontrollerde saç seçenekleri, yıkama soruları, duş, havlu tıklama/dokunma/sürükleme ve serbest zıplama doğrulandı; kapsamlı bakım testinin bazı durulama bölgeleri yalnızca testte köpük azaltılarak hızlandırılmıştı.

Tarayıcı kontrolleri masaüstü Chromium ve telefon ekran boyutuyla yapıldı; gerçek cihaz performansı ve çocuklarla kullanım denemesi yapılmadı. Derlemede >500 kB JS paket uyarısı var; derleme başarısızlığı değil. Oyun için herkese açık kalıcı bir site veya App Store yayını bu çalışmada kurulmadı. `docs/` görselleri örnektir; her son değişikliği göstermeyebilir.

## Henüz yapılmayanlar / olası sonraki işler

- Tüy kesimi; başka hayvanlar; sahiplenme sonrası göz/kaş/kulak düzenleme.
- Hesaplar, kayıt senkronizasyonu ve backend.
- Lisanslı, iskeletli GLB karaktere geçiş; mevcut karakter iyileştirildi, fotogerçekçi model hedefi tamamlandı sayılmamalı.
- Gerçek telefonda performans ve kontroller; 7–12 yaş çocuklarla yakalama ve soru sıklığı denemesi.
- Mobil uygulama paketleme ve yayın; kalıcı web yayını.

Bu liste otomatik yapılacak işler veya kullanıcı tarafından onaylanmış bir sonraki görev değildir. Yeni sohbetin hedefini kullanıcı belirler.

## Yeni sohbete başlangıç örneği

> World Pet Wash'a devam ediyoruz. AGENTS.md ve PROJECT_STATUS.md dosyalarını, ardından ilgili kodu incele. Bu görevin hedefi: [tek özellik/hata]. Mevcut para, matematik ve bakım ilerlemesi kurallarını koru.

Bulut ortamı kod düzenleme/test içindir. GitHub'daki dosyalar kalıcı proje kaynağıdır. Yeni görevde bağımlılıklar ve geliştirme sunucusu yeniden hazırlanabilir; eski sohbet veya çalışan süreçlerin aktarılacağını varsayma. Yerelde güncelleme: `git pull`; ilk kurulum `npm ci`, çalıştırma `npm run dev`.
