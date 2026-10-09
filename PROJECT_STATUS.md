# World Pet Wash — güncel durum

Son güncelleme: 9 Ekim 2026. Bu belge yeni sohbetler için kısa proje hafızasıdır; uygulamanın güncel kodu esas alınır.

## Amaç ve mevcut sürüm

7–12 yaş için TR/EN/DE destekli, bilgisayar ve telefonda oynanabilir Three.js tarayıcı prototipi. Repo: `chemshit/mathgame`. Bu çalışma dizini `/workspace/mathgame`; başka ortamlarda yol değişebilir. Bugüne kadarki geliştirmeler GitHub `main` dalına gönderildi.

**Oyun sırası:** karakter oluştur → parkta kovala/coin topla → zıplama ve hedefe basarak yakala → kirli bölgeleri köpükle → suyla durula → havluyla sil → fön → kıyafet → 1–3 yıldız sonucu.

## Tamamlananlar

- Kız/erkek karakter; 4 saç modeli, 5 saç rengi, 4 ten/kıyafet rengi, şapkalar. Sürekli yüz geometrisi ve eklem hareketleri; modeller hâlâ prosedürel Three.js, Blender/GLB varlığı yok.
- 108 birim çaplı park, arkadan takip kamera, WASD/oklar ve ekran kontrolleri. Yakalamada zıplama, havada hedef halkası, başarıda köpeği kucağa alma ve odaya geçiş; kaçırmada köpek uzaklaşır.
- Küçük su haznesi, yavaş uçuşan fiyatlı baloncuklar, dokulu kir. Köpek düğmelerle/yatay sürüklemeyle döndürülür; 8 kirli bölge ayrı temizlenir ve köpük birikir.
- Köpüklü bölgeleri basılı tutarak durulama; 4 bölgeyi havluyla silme. Son düzeltme: her tıklama/dokunma veya Enter/Space %50 ilerletir; iki basış yeterlidir. Sürükleme de ilerletir, bırakma ayrıca sayılmaz.
- Havlu sonrası ıslaklık %60; fön fazla ısınınca köpek cihazı patisiyle iter, yalnızca fön yeniden başlatılır ve yeniden ücret alınır.
- Toka, gözlük, şapka, kıyafet; köpeğin sevdiği renk ipucu ve beğenmeme/kaçış.
- Rappen/Frank coinler (5/10/20/50 Rp., 1/2/5 Fr.). Farklı baloncuk fiyatları 30–80 Rp.; fön/kıyafet fiyatları oyun başına değişir. Bakiye/harcama ve yıldızlar gösterilir; en iyi yıldız ve ses tercihi localStorage'da saklanır.
- Kalan para soruları: her 2. baloncuk, her yeni fön/kıyafet alımı. Parka para toplamaya geçişte Frank/Rappen toplama sorusu. İki cevap kutusu, ipuçları, yanlışta kırmızı/titreme, doğruda yeşil/yıldız ve otomatik işlem.
- Durulama/havlu şu an ücretsiz. Para yetmeyince işlem durur; parka gönüllü gidiş/geliş kısmi bakımı korur.
- Yerel Web Audio efektleri ve ses kapatma; temizlendikçe daha neşeli kuyruk. Baloncuk hareketinde azaltılmış hareket tercihi desteklenir.

## Doğrulama ve sınırlar

Son uygulama düzeltmesinde **18 Node testi ve Vite derlemesi geçti**. Havlu fare tıklaması, dokunma, klavye, sürükleme ve otomatik fön geçişi Chromium'da doğrulandı. Önceki kapsamlı bakım kontrolünde 8 fiyatlı hedefli baloncuk, sorular, durulama ve havlu sırası doğrulandı; uzun durulama kontrolünün bazı bölgeleri yalnızca testte köpük miktarı azaltılarak hızlandırıldı.

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
