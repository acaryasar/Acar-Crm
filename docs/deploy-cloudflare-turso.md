# iyiCRM — Cloudflare + Turso Canlıya Alma Rehberi

**Kurulum:** Cloudflare Workers (uygulama) + Turso (veritabanı) + özel alan adı `iyicrm.acaryasar.com` (domain Natro'da kayıtlı, DNS zaten Cloudflare'de yönetiliyor).

**Natro** bu kurulumda kullanılmıyor — Natro paylaşımlı hosting'i Node.js çalıştıramadığı için uygulamayı orada barındıramayız; sadece alan adının kayıtlı olduğu yer.
**Render** bu kurulumda kullanılmıyor — subdomain limitiniz dolu olduğu için atlandı. Bunun tek pratik sonucu: e-posta senkronizasyonu (IMAP) özelliği bu demo'da devre dışı kalacak (aşağıda 4. bölüm).

CLI araçlarınız (`wrangler`, `turso`) zaten kurulu ve giriş yapılmış olduğu için login adımları yok — doğrudan veritabanı + deploy adımlarına geçiyoruz.

## 1. Turso veritabanını oluşturun

```bash
turso db create iyicrm
turso db show iyicrm --url
turso db tokens create iyicrm
```

İkinci ve üçüncü komutun çıktısı olan URL (`libsql://iyicrm-<org>.turso.io` gibi) ve token'ı bir kenara not edin — aşağıda `wrangler secret put` ile gireceksiniz.

## 2. Şemayı Turso'ya uygulayın

Migration'larınızı sırayla (tarih sırasına göre) uygulayın:

```bash
turso db shell iyicrm < prisma/migrations/20260719001631_remove_multi_tenant/migration.sql
turso db shell iyicrm < prisma/migrations/20260719113358_add_user_extended_fields/migration.sql
turso db shell iyicrm < prisma/migrations/20260928195404_add_is_demo_flag/migration.sql
```

## 3. Demo verilerini Turso'ya yükleyin

`.env` dosyanıza *geçici olarak* 1. adımdaki Turso bilgilerini ekleyin:

```bash
TURSO_DATABASE_URL="libsql://iyicrm-<org>.turso.io"
TURSO_AUTH_TOKEN="<token>"
```

Sonra bir kez seed'i çalıştırın (kod, bu iki değişken varsa otomatik olarak Turso'ya bağlanıyor):

```bash
npm run prisma:seed
```

İşiniz bitince `.env`'den bu iki satırı silin — yerel geliştirme yine `prisma/dev.db`'ye dönecektir. (Turso'daki veri kalıcı olarak orada durur.)

## 4. Cloudflare secret'larını girin

Demo için gereken minimum secret seti bu üçü (AI_PROVIDER zaten `mock` olarak `wrangler.jsonc`'da tanımlı, OpenAI anahtarına gerek yok):

```bash
npx wrangler secret put AUTH_SECRET
```
(Değer için önce şunu çalıştırıp çıktısını yapıştırabilirsiniz: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)

```bash
npx wrangler secret put TURSO_DATABASE_URL
npx wrangler secret put TURSO_AUTH_TOKEN
```

(1. adımdaki aynı URL ve token'ı girin.)

**E-posta senkronizasyonu (IMAP):** `IMAP_*` secret'larını hiç girmeyin — bu demo'da bu özellik devre dışı kalacak, uygulamanın geri kalanını etkilemez. WhatsApp webhook'u için de `WHATSAPP_VERIFY_TOKEN`/`WHATSAPP_APP_SECRET` girmezseniz o uç nokta sadece kullanılmaz durumda kalır, hata vermez.

## 5. Deploy edin

```bash
npm run cf:deploy
```

Bu, `wrangler.jsonc`'da tanımlı `iyicrm.acaryasar.com` custom domain'ini otomatik olarak oluşturup Worker'a bağlayacak (domain zaten aynı Cloudflare hesabındaki bir zone olduğu için manuel DNS kaydı eklemenize gerek yok). İlk deploy birkaç dakika sürebilir; bittiğinde `https://iyicrm.acaryasar.com` adresinden erişebilmeniz gerekir.

## 6. Test edin

- `https://iyicrm.acaryasar.com/login` adresini açın.
- Giriş sayfasındaki 4 demo butonunu (Yönetici / Süpervizör / Müdür / Çalışan) deneyin.
- Bir demo hesapla oturum açıp bir kayıt eklemeyi/silmeyi deneyin — 403 ile engellenmesi gerekiyor (salt-okunur demo modu).

## 7. Test etmediğim / doğrulayamadığım noktalar

Bu oturumdaki köprü ortamının interneti kapalı olduğu için `wrangler`/`turso` komutlarını gerçekten çalıştıramadım, sadece doğru olduğuna güvendiğim şekilde hazırladım:

- `custom_domain: true` ile otomatik DNS oluşturmanın, `acaryasar.com` zone'unuzdaki mevcut kayıtlarla (örn. başka bir subdomain'i zaten farklı bir yere yönlendiren bir kayıt) çakışmayacağı.
- `opennextjs-cloudflare build`'in bu proje için ilk denemede hatasız geçeceği.
- Auth.js'in `trustHost: true` ile bu domainde sorunsuz çalışacağı (yaygın ve dokümante edilmiş bir ayar, ama sizin ortamınızda test edemedim).

Bir adımda hata alırsanız tam mesajı paylaşın, birlikte bakalım.
