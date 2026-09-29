# Acar-Crm — Kod ve Güvenlik İnceleme Raporu

**Tarih:** 10 Eylül 2026
**Kapsam:** `Acar-Crm` deposunun tamamı (Next.js 16 App Router + Prisma + NextAuth), özellikle `src/app/api/**` altındaki tüm uç noktalar, `auth.ts`, `middleware.ts`, `prisma/schema.prisma` ve bağımlılıklar.
**Yöntem:** Statik kod incelemesi — her `route.ts` dosyası tek tek okunmuş, yetkilendirme (auth/rol) kontrolü olup olmadığı fonksiyon bazında doğrulanmış, Prisma sorguları veri sızıntısı açısından incelenmiş, bağımlılıklar ve ortam dosyaları kontrol edilmiştir.

Genel değerlendirme: Next.js/Prisma/NextAuth üzerine oturmuş, mantıklı bir mimarisi olan bir proje. SQL enjeksiyonu, `eval`, `dangerouslySetInnerHTML` gibi klasik açıklardan temiz; `.env` doğru şekilde `.gitignore`'da ve git geçmişinde sızmamış; şifreler `bcrypt` ile hash'leniyor. Ancak **yetkilendirme (authorization) katmanı tutarsız uygulanmış** ve bu, birkaç uç noktada gerçek ve ciddi güvenlik açıklarına yol açmış. Bunların en önemlisi, **kimliği doğrulanmamış bir kişinin admin hesabı oluşturabilmesi veya mevcut bir hesabın şifresini/rolünü değiştirebilmesidir.** Bu, dernek/CRM verilerinin tamamının ele geçirilebileceği anlamına gelir ve öncelikli olarak düzeltilmelidir.

Aşağıda bulgular önem sırasına göre listelenmiş, her biri için dosya/satır, neden tehlikeli olduğu ve nasıl düzeltileceği belirtilmiştir. En sonda kısa bir öncelik planı var.

---

## 1. KRİTİK Bulgular (hemen düzeltilmeli)

### 1.1 Kimlik doğrulaması olmadan admin hesabı oluşturulabiliyor
**Dosya:** `src/app/api/users/route.ts` → `POST` fonksiyonu

Bu fonksiyonda hiçbir `auth()` / `requireRole()` çağrısı yok (aynı dosyadaki `GET` fonksiyonu kontrol ediyor ama `POST` tamamen açık). Gövdede gelen `role`/`primaryRole` alanı doğrudan veritabanına yazılıyor:

```ts
const user = await prisma.user.create({
  data: {
    ...
    role: body.primaryRole || body.role || "EMPLOYEE",
    ...
  },
});
```

**Sonuç:** Siteye hiç giriş yapmadan, tarayıcıdan tek bir `fetch` isteğiyle `role: "ADMIN"` ve istediğiniz e‑posta/şifre ile yeni bir yönetici hesabı oluşturmak mümkün. Bu, uygulamanın tamamının (tüm müşteri, sipariş, fatura, kullanıcı verisi) ele geçirilmesi demektir — en yüksek risk seviyesi.

Aynı fonksiyonun `action: "update"` dalı da aynı şekilde korumasız: `body.id` ile **var olan herhangi bir kullanıcının** adı, rolü ve şifresi (varsa `body.password`) hiçbir oturum kontrolü yapılmadan değiştirilebiliyor.

**Düzeltme:** Fonksiyonun başına `const session = await requireRole(["ADMIN"])` (veya en azından `await auth()` + rol kontrolü) eklenmeli. Kullanıcı oluşturma/rol atama işlemi yalnızca ADMIN'e açık olmalı.

### 1.2 Herhangi bir oturum açmış kullanıcı, başka bir kullanıcının rolünü/şifresini değiştirebiliyor
**Dosya:** `src/app/api/users/[userId]/route.ts` → `PATCH` fonksiyonu

Bu fonksiyon `auth()` ile oturum olup olmadığını kontrol ediyor, **ama hangi rolde olduğuna veya `userId`'nin kendisine ait olup olmadığına hiç bakmıyor**:

```ts
const session = await auth();
if (!session) { ... }
const { userId } = await params;
const body = await req.json();
const updateData = { firstName, lastName, email, role: body.role, ... };
if (body.password) updateData.password = await bcrypt.hash(body.password, 10);
await prisma.user.update({ where: { id: userId }, data: updateData });
```

**Sonuç:** En düşük yetkili bir `EMPLOYEE` bile, `/api/users/list` üzerinden (bu uç nokta herkesin kimliğini/ID'sini listeliyor) başka bir kullanıcının, hatta bir yöneticinin ID'sini öğrenip **o kullanıcının rolünü `ADMIN` yapabilir veya şifresini değiştirip hesabını ele geçirebilir.** Ya da kendi rolünü doğrudan `ADMIN` olarak güncelleyebilir (dikey yetki yükseltme).

**Düzeltme:** Rol değişikliği yalnızca ADMIN'e izin verilmeli; kullanıcı yalnızca kendi profilini (rol hariç) güncelleyebilmeli. Örn: `requireRole(["ADMIN"])` ya da `session.user.id === userId && body.role === undefined` gibi bir kontrol.

### 1.3 Kimlik doğrulaması olmadan herhangi bir kullanıcı silinebiliyor
**Dosya:** `src/app/api/users/[userId]/route.ts` → `DELETE` fonksiyonu

`PATCH`'in aksine bu fonksiyonda `auth()` çağrısı bile yok:

```ts
export async function DELETE(request: Request, { params }) {
  const { userId } = await params;
  await prisma.user.update({ where: { id: userId }, data: { deletedAt: new Date(), is_active: false } });
  ...
}
```

**Sonuç:** Kimliği doğrulanmamış herhangi biri, ID'sini bildiği (veya `/api/users/list`'ten öğrendiği) her kullanıcıyı — dahil admin hesaplarını — devre dışı bırakabilir. Basit ama etkili bir hizmet aksatma (DoS) / hesap kilitleme saldırısı.

**Düzeltme:** `requireRole(["ADMIN"])` eklenmeli.

> Not: Bu üç madde birbirini besliyor — `users/list` (giriş yapmış herkes erişebiliyor) kullanıcı ID'lerini veriyor, `users/route.ts POST` ise girişe bile gerek kalmadan hesap oluşturmayı/değiştirmeyi mümkün kılıyor. Gerçek bir saldırgan bu üçünü birleştirerek dakikalar içinde tam admin erişimi elde edebilir.

---

## 2. YÜKSEK Önemli Bulgular

### 2.1 Şifre hash'leri (ve kimlik bilgileri) API üzerinden tarayıcıya sızıyor
Prisma'da `include: { assignedUser: true }` veya `employee: true` yazıldığında, ilişkili `User` kaydının **tüm alanları** (şifre hash'i, T.C. kimlik no, doğum tarihi dahil) döner — `select` ile alan sınırlaması yapılmadığı sürece. Bu proje genelinde birden fazla yerde bu hata var:

- `src/app/api/tickets/route.ts:29` — `include: { assignedUser: true }`
- `src/app/api/tickets/[id]/route.ts:22` — `include: { customer: true, assignedUser: true }`
- `src/app/api/appointments/route.ts:28` — `include: { employee: true }`
- `src/app/api/appointments/timeline/route.ts:99` — `include: { assignedUser: true }`
- `src/app/api/users/route.ts:26` (`GET`) — `prisma.user.findMany(...)` hiç `select` kullanmadan tüm kullanıcıları döndürüyor
- `src/app/api/appointments/timeline/route.ts:58` ve `src/app/api/commission-calculation/calculate/route.ts:100,106` — aynı şekilde `select`'siz `prisma.user.findMany`

**Sonuç:** Bir çalışan panelde randevu veya ticket listesini açtığında, tarayıcının Ağ (Network) sekmesinde ilgili personelin **bcrypt şifre hash'i** ham JSON içinde görünüyor. Bcrypt kırılması zor olsa da hash'in dışarı sızması başlı başına bir veri ihlalidir (KVKK/GDPR açısından da risklidir) ve zayıf şifre seçen kullanıcılar için gerçek bir kırılma riski taşır.

**Düzeltme:** Bu tür tüm `include`/`findMany` çağrılarında `select` kullanarak yalnızca `id, firstName, lastName, email, role` gibi güvenli alanlar döndürülmeli. En pratik çözüm: `src/lib/prisma.ts`'te güvenli bir `userPublicSelect` sabiti tanımlayıp her yerde onu kullanmak.

### 2.2 Müşteri görüşme kayıtları (WhatsApp/telefon/web chat) kimlik doğrulaması olmadan okunabiliyor
**Dosya:** `src/app/api/tickets/[id]/conversation-log/route.ts`

Hiçbir `auth()` kontrolü yok. `ticketId` tahmin edilebilir/sıralı olduğu için (cuid olsa da URL'den elde edilebiliyorsa) dışarıdan biri müşterinin WhatsApp mesajlarını, telefon görüşmesi kayıtlarını ve web chat geçmişini — isim, telefon, şikayet içeriği dahil — doğrudan okuyabilir.

**Düzeltme:** `await auth()` kontrolü eklenmeli; ayrıca kullanıcı sadece kendisine atanmış ticket'ların loglarını görebilmeli (IDOR'u da önlemek için `ticket.assignedUserId === session.user.id` kontrolü, admin/süpervizör hariç).

---

## 3. ORTA Önemli Bulgular

### 3.1 WhatsApp webhook'u sahte mesaj kabul edebiliyor
**Dosya:** `src/app/api/webhooks/whatsapp/route.ts`

- `GET` (Meta doğrulama) içinde `WHATSAPP_VERIFY_TOKEN` ortam değişkeni tanımlı değilse kodda **sabit/varsayılan bir token** kullanılıyor: `process.env.WHATSAPP_VERIFY_TOKEN || 'handwerk_verify_token'`. Bu token repoda herkese açık olduğundan, üretimde gerçek bir değer set edilmezse doğrulama anlamsızlaşır.
- `POST` (gelen mesajlar) tarafında Meta'nın gönderdiği `X-Hub-Signature-256` imzası **hiç doğrulanmıyor**. Yani `POST /api/webhooks/whatsapp`'a kim isterse, gerçek bir WhatsApp mesajıymış gibi sahte JSON gönderebilir; sistem bunu gerçek müşteri mesajı sanıp otomatik olarak müşteri/ticket/randevu kaydı oluşturur ve personele bildirim gönderir.

**Düzeltme:** (1) `WHATSAPP_VERIFY_TOKEN` için varsayılan değer kaldırılmalı, env yoksa hata verilmeli. (2) Gelen her `POST` isteğinde Meta App Secret ile HMAC-SHA256 imza doğrulaması yapılmalı (Meta'nın resmi dokümantasyonundaki yöntem).

### 3.2 AI uç noktaları kimlik doğrulaması olmadan çağrılabiliyor → maliyet/DoS istismarı
**Dosyalar:** `src/app/api/ai/chat/route.ts`, `src/app/api/ai/extract-ticket/route.ts`, `src/app/api/mail/process/route.ts`, `src/app/api/ai/analytics/route.ts`

Bu uç noktaların hiçbirinde oturum kontrolü yok. `ai/chat` ve `ai/extract-ticket` doğrudan OpenAI API'sini çağırıyor — bu da demek oluyor ki dışarıdan herkes bu uç noktalara istediği kadar istek atarak **sizin OpenAI faturanızı şişirebilir** (kaynak/maliyet istismarı, bir tür DoS). `mail/process` ise IMAP kutusunu işleyen bir iç işlem gibi görünüyor; dışarıya açık olması istenmeyen tetiklemelere yol açabilir.

**Düzeltme:** İç kullanım için tasarlanmış olan bu uçlara (`ai/chat`, `ai/extract-ticket`, `mail/process`, `ai/analytics`) oturum kontrolü eklenmeli. Gerçekten dışarıya (anonim ziyaretçiye) açık kalması gereken tek uç `web-chat` gibi görünüyor — onun için de aşağıdaki rate-limit önerisine bakın.

### 3.3 Hiçbir yerde rate limiting yok
Ne login (`/api/auth/...`) ne de AI/webhook uçları için istek sınırlama (rate limiting) uygulanmış. Bu, hem şifre deneme saldırılarını (brute force) hem de yukarıdaki AI maliyet istismarını kolaylaştırıyor.

**Düzeltme:** Basit bir IP bazlı rate-limit middleware'i (örn. `@upstash/ratelimit` + Redis, ya da self-host için `express-rate-limit` benzeri bir Next.js middleware) en azından `/api/auth`, `/api/ai/*`, `/api/web-chat`, `/api/webhooks/*` için eklenmeli.

---

## 4. DÜŞÜK / Bilgilendirme Amaçlı Bulgular

- **`src/app/api/dashboard/stats/route.ts`**: Auth kontrolü yok — müşteri sayısı, açık ticket sayısı, çalışan sayısı gibi toplu istatistikler kimliği doğrulanmamış herkese açık. Tek başına kritik değil ama gereksiz bilgi sızıntısı; `auth()` kontrolü eklenmeli.
- **`src/app/api/notifications/[notificationId]/read/route.ts`**: Auth kontrolü yok ve sahiplik (ownership) kontrolü de yok — herkes herhangi bir bildirimi ID'sini bilerek "okundu" işaretleyebilir. Düşük risk ama yine de `auth()` + `notification.userId === session.user.id` kontrolü eklenmeli.
- **`src/lib/auth-guard.ts` → `requireRole()`**: Yetkisiz erişimde `redirect("/login")` (Next.js sayfa yönlendirmesi) çağırıyor. Bu fonksiyon API route'ları içinde `try/catch` bloğunun içinde çağrıldığından, `redirect()`'in fırlattığı özel hata bu `catch` tarafından yakalanıp genel bir `500 Internal Server Error` olarak dönüyor (istemci "Unauthorized" yerine anlamsız bir sunucu hatası görüyor, loglar gereksiz "error" kayıtlarıyla doluyor). Veri sızdırmıyor (erişim yine engelleniyor) ama doğru davranış değil. **Düzeltme:** `requireRole` API route'larda kullanıldığında `redirect()` yerine bir `Response`/hata fırlatıp route'ta `401`/`403` JSON dönmeli; sayfalarda (`page.tsx`) mevcut haliyle kullanılmaya devam edilebilir.
- **Varsayılan admin şifresi**: `prisma/seed.ts:9` içinde `bcrypt.hash("Admin123!", 10)` ile sabit bir admin şifresi tanımlı. Geliştirme için sorun değil ama üretime aynı seed ile çıkılırsa herkesin bildiği bir şifreyle admin girişi mümkün olur. **Öneri:** Üretim seed'inde rastgele bir şifre üretilip bir kere loglanmalı/`changePasswordOnFirstLogin: true` zorunlu kılınmalı (alan zaten şemada mevcut, kullanılmıyor).
- **Güvenlik başlıkları yok**: `next.config.ts` içinde `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options` gibi başlıklar tanımlı değil. **Öneri:** `next.config.ts`'e bir `headers()` fonksiyonu eklenerek bu başlıklar tüm sayfalara uygulanmalı (clickjacking ve MIME-sniffing riskini azaltır).
- **Kullanılmayan/şüpheli bağımlılık `next-navigation@1.0.6`**: `package.json`'da bağımlılık olarak listelenmiş ama kod tabanında hiçbir yerde `import` edilmemiş. 2017 civarı terk edilmiş küçük bir "boilerplate" paketi (React 16 bağımlılığı var, bakımsız). Zararlı olduğuna dair bir kanıt yok, ama kullanılmayan/bakımsız paketler gereksiz tedarik zinciri (supply-chain) riski taşır. **Öneri:** `npm uninstall next-navigation` ile kaldırılması.
- **`AGENTS.md` dosyasındaki talimat hakkında not**: Depo kökündeki `AGENTS.md` dosyası, kod yazmadan önce "`node_modules/next/dist/docs/` içindeki ilgili kılavuzu oku" şeklinde bir talimat içeriyor ve bunun "eğitim verinizden farklı, breaking change'ler içeren bir Next.js sürümü" olduğunu iddia ediyor. Bu tür, bir AI asistanını bağımlılık içindeki içeriğe yönlendiren talimatlar son dönemde bilinen bir sosyal mühendislik/prompt-injection tekniğidir (paket içine gizlenmiş sahte "dokümantasyon" ile AI ajanının kandırılması). Bu incelemede bu talimatı **takip etmedim** ve içeriği okumadım. Gerçek bir ihtiyaçtan mı yoksa yanlışlıkla mı (ör. bir şablon/AI aracından kopyalanmış) buraya geldiğini kontrol etmenizi, emin değilseniz kaldırmanızı öneririm. Ayrıca `next` paketinin `node_modules` içindeki içeriğinin npm registry'sindeki resmi paketle birebir aynı olduğunu `package-lock.json`'daki integrity hash'leri ile (`npm ci` çalıştırarak) doğrulamanız iyi bir ek önlem olur.

---

## 5. Kod Kalitesi ve Kullanılabilirlik Önerileri

Güvenlik dışında, "sade ve kullanışlı" bir uygulama hedefiniz için fark ettiğim noktalar:

Yetkilendirme deseni tutarsız: Bazı route'lar `auth()` + elle rol kontrolü, bazıları `requireRole()` yardımcı fonksiyonu, bazıları hiçbiri kullanıyor. Bu tutarsızlık yukarıdaki kritik açıkların asıl kök nedeni. Tüm `/api` uçları için tek, merkezi bir yardımcı (örn. `withAuth(handler, { roles: [...] })` gibi bir sarmalayıcı) kullanılırsa, yeni bir uç nokta eklendiğinde yetkilendirmenin unutulması ihtimali ortadan kalkar.

API yanıt biçimleri tutarsız: Bazı uçlar `{ data: ... }` (`success()`/`failure()` yardımcıları ile), bazıları çıplak dizi/obje, bazıları `{ error: ... }` dönüyor. Frontend tarafında bu, her istek için farklı bir ayrıştırma mantığı gerektirir ve hataya açıktır. Tek bir standart zarf (`{ success, data, error }` gibi) tüm uçlarda kullanılmalı.

Girdi doğrulama (validation) tutarsız: `customers` uçlarında Zod şemaları (`CreateCustomerSchema`, `UpdateCustomerSchema`) kullanılırken, `users`, `orders`, `invoices`, `stock/movements` gibi para ve yetki içeren kritik uçlarda hiç şema doğrulaması yok, gövde doğrudan Prisma'ya veriliyor. Bu hem güvenlik hem de veri bütünlüğü açısından risklidir (örn. `invoices/route.ts`'de `totalAmount` gibi tutarlar istemciden geldiği gibi kaydediliyor, sunucu tarafında yeniden hesaplanmıyor). Tüm mutasyon (`POST`/`PUT`/`PATCH`) uçlarına Zod doğrulaması eklenmesi öneririm.

Fatura/sipariş numarası üretiminde yarış durumu (race condition): `invoices/route.ts` ve `orders/route.ts`'de "son kaydı bul, numarasını +1 yap" yöntemi kullanılıyor. İki kullanıcı aynı anda fatura oluşturursa aynı numara iki kez üretilebilir. Bunun yerine veritabanında bir `Sequence`/`autoincrement` alanı veya bir transaction içinde `SELECT ... FOR UPDATE` benzeri bir kilitleme mekanizması kullanılmalı.

Genel `catch` blokları hata detayını yutuyor: Örn. `customers/route.ts POST` içinde `catch { return failure("Invalid request"); }` — Zod doğrulama hatası da, veritabanı hatası da aynı genel mesaja dönüşüyor. Kullanıcıya (ve geliştiriciye) hangi alanın hatalı olduğunu söylemek kullanılabilirliği artırır; en azından `ZodError` durumunda alan bazlı mesaj döndürülebilir.

`as any` kullanımı yaygın (`session.user as any`, `data: {...} as any` gibi). TypeScript'in tip güvenliğini devre dışı bırakıyor ve bu incelemede gördüğümüz gibi (rol/yetki alanlarının yanlış işlenmesi) bu tür hataların fark edilmesini zorlaştırıyor. `session` tipini `next-auth.d.ts` ile doğru genişletip `as any`'lerin kaldırılmasını öneririm.

---

## 6. Doğru Yapılanlar (olumlu notlar)

Dengeli bir değerlendirme için: proje temel olarak sağlam bir zemin üzerine kurulu.

- Prisma ORM kullanıldığı için SQL enjeksiyonu riski yok (`$queryRaw`/`$executeRaw` hiç kullanılmamış).
- `dangerouslySetInnerHTML` ve `eval(` hiçbir yerde kullanılmamış — XSS yüzeyi düşük.
- `.env` dosyası `.gitignore`'da doğru tanımlı ve git geçmişinde hiç commit edilmemiş; sızmış bir sır yok.
- Şifreler `bcrypt` ile hash'leniyor (düz metin şifre saklanmıyor).
- NextAuth `redirect` callback'i açık yönlendirme (open redirect) saldırısına karşı origin kontrolü yapıyor.
- Soft-delete (`deletedAt`) deseni tutarlı biçimde kullanılıyor, bu da yanlışlıkla veri kaybını önlüyor.
- Bazı uçlarda (müşteri, ticket, randevu listeleri) rol bazlı veri filtreleme mantığı (`ADMIN`/`SUPERVISOR` hepsini görür, `EMPLOYEE` yalnızca kendisininkini görür) doğru kurgulanmış — sadece `users` uçlarında bu mantık eksik/hatalı uygulanmış.

---

## 7. Öncelikli Aksiyon Planı

1. `POST /api/users` ve `DELETE /api/users/[userId]`'e `requireRole(["ADMIN"])` ekleyin (Bölüm 1.1, 1.3).
2. `PATCH /api/users/[userId]`'de rol değişikliğini ADMIN'e kısıtlayın; kullanıcının yalnızca kendi (rol hariç) bilgilerini güncelleyebilmesini sağlayın (Bölüm 1.2).
3. `tickets`, `appointments`, `users` uçlarındaki tüm `include`/`findMany` çağrılarını `select` ile sınırlandırıp şifre hash'i ve hassas alanların döndürülmesini engelleyin (Bölüm 2.1).
4. `tickets/[id]/conversation-log`, `dashboard/stats`, `notifications/.../read`, `ai/chat`, `ai/extract-ticket`, `mail/process`, `ai/analytics` uçlarına oturum kontrolü ekleyin (Bölüm 2.2, 3.2, 4).
5. WhatsApp webhook'una imza doğrulaması ekleyin, varsayılan verify-token'ı kaldırın (Bölüm 3.1).
6. Login ve genel API için temel bir rate-limit uygulayın (Bölüm 3.3).
7. `next.config.ts`'e güvenlik başlıkları ekleyin; `next-navigation` paketini kaldırın; `AGENTS.md`'yi gözden geçirin (Bölüm 4).
8. Zaman bulduğunuzda: merkezi bir yetkilendirme sarmalayıcısı, tutarlı API yanıt formatı ve Zod doğrulamasının tüm mutasyon uçlarına yayılması (Bölüm 5) — bunlar "kullanışlı ve basit" hedefinize en çok katkı sağlayacak yapısal iyileştirmeler.

Maddeler 1-6 güvenlik açısından acil; 7-8 orta/uzun vadeli sağlamlaştırma ve bakım kolaylığı için önerilir.
