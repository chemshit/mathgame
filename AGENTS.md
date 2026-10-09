# World Pet Wash — çalışma rehberi

## Yeni görev başlangıcı

- Önce `PROJECT_STATUS.md`, `README.md`, `package.json` ve görevin ilgili kodunu incele.
- `git status --short` ile mevcut değişiklikleri kontrol et; kullanıcının değişikliklerini koru.
- Kullanıcıyla varsayılan olarak Türkçe ve sade bir dille iletişim kur.
- Sohbet geçmişini bilmen gerektiğini varsayma; kod gerçek davranışın kaynağıdır. Belgelerde çelişki varsa ilgili kodu kontrol et ve güncelle.

## Ürün

World Pet Wash, 7–12 yaş grubu (İsviçre üçüncü sınıf dahil) için tarayıcıda çalışan 3B hayvan bakım ve para hesabı oyunudur. Türkçe, İngilizce ve Almanca desteklenir. Bilgisayar ve telefon hedeflenir; yatay telefon ekranı önerilir. Çocuklara uygun, renkli ve yumuşak bir görünüm ve cesaretlendirici geri bildirim kullan. Gelecekte App Store'a taşıma düşünülüyor; şu an yayınlanmış bir mobil uygulama yok.

## Teknik yapı ve çalışma

- Vanilla JavaScript ES modules, Three.js, Vite; Node.js 22.12+.
- `npm ci`: kilit dosyasına göre kurulum. `npm run dev`: geliştirme sunucusu.
- `npm test`: Node testleri. `npm run build`: üretim derlemesi.
- `src/main.js`: oyun döngüsü, aşamalar, kontroller, UI ve TR/EN/DE metinleri.
- `src/care.js`: bakım kuralları; `src/economy.js`: para/fiyatlar; `src/math.js`: hesap soruları.
- `src/capture.js`: yakalama sırası; `src/sound.js`: Web Audio ve ses tercihi.
- `src/character.js`: oyuncu; `src/visuals.js`: köpek ve bakım odası; `src/style.css`: duyarlı UI.
- `tests/`: saf kural testleri; `docs/`: görünüm örnekleri. Görseller kodla birlikte yenilenmediyse eski olabilir.

## Korunacak davranışlar

- Bakım sırası: yıkama → durulama → havlu → fön → kıyafet. Parktan gönüllü dönüş yarım kalan ilerlemeyi korur; gerçek kaçışta yalnızca yarım kalan aşama sıfırlanır.
- Para tamsayı Rappen olarak tutulur; 100 Rappen = 1 Frank. Negatif cüzdan ve çift coin toplama olmaz.
- Fiyatlar Frank/Rappen biçiminde gösterilir; cevaplar ayrı Frank ve Rappen kutularıyla alınır (Rappen 0–99, olmayan birim 0).
- Yıkamada her ikinci başarılı baloncukta soru vardır; fön ve yeni kıyafet alımı her seferinde soru gerektirir. Yanlış cevap/vazgeçme para kesmez.
- Doğru cevap kısa yeşil başarı efekti sonrası işlemi otomatik tamamlar. Soruda oyun ve sabır sayacı durur.
- Para toplamaya parka geçişte toplama sorusu vardır; soru kendi başına para kazandırmaz.
- Baloncuklar görünür kirli bölgelere uygulanır. Yanlış/temiz noktaya uygulama ücretlendirilmez.
- Havlu her bölgeye iki basışta tamamlanır (%50 + %50); sürükleme de desteklenir. Fön %60 kalan ıslaklıktan başlar.
- Fön kırmızı eşiğe girince anında durur; tekrar ücretli başlatılır. Önceki bakım korunur.
- Yeni kullanıcı metinlerini üç dile ekle. Fare, dokunmatik ve mümkün olduğunda klavye kontrollerini koru; ses kapatma ve hareket azaltma tercihini gözet.
- Hesap, backend, gerçek ödeme veya harici model servisi eklemek mevcut mimarinin parçası değildir; ihtiyaç olduğunda görev kapsamında değerlendir.

## Doğrulama ve teslim

- Kod değişikliğinde ilgili anlamlı testleri ve derlemeyi çalıştır. Görsel/kontrol değişikliğinde tarayıcıda ilgili akışı ve telefon boyutunu kontrol et.
- Sadece doküman değişikliği için uygulama testlerini yeniden çalıştırmak gerekmez; içerik, dosya yolları ve `git diff --check` doğrulaması yeterlidir.
- Çalıştırılmayan kontrolleri çalıştırılmış gibi raporlama. Tarayıcı boyutu testi gerçek telefon testi değildir.
- Mevcut bulut ortamını kullan; geliştirme sunucusunun yeni sohbette hâlâ çalıştığını varsayma. Gerçek kurulu araçları keşfet; `/tmp` yardımcı betiklerine bağımlı olma.
- Değişen oyun davranışlarını `PROJECT_STATUS.md` ve ilgili README kısmına işle. Durum belgesini kısa tut; eski sohbet dökümü biriktirme.
- Commit/push/PR işlemlerini kullanıcının görevdeki yetkilendirmesi ve mevcut çalışma akışına göre yap. Teslimde ne değiştiğini, doğrulamayı ve varsa kalan sınırı belirt.
