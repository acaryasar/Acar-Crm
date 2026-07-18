---
description: Proje çalıştırma ve development environment kurulumu
alwaysApply: true
---

# Development Environment - Acar CRM

## Proje Yapısı

- **Framework**: Next.js 16.2.9 (Turbopack)
- **Database**: SQLite (development için)
- **ORM**: Prisma 6.16.2
- **Auth**: NextAuth v5
- **Package Manager**: npm
- **Port**: 4200

## Projeyi Çalıştırma

### Development Server

```bash
npm run dev
```

Server başladığında:
- Local: http://localhost:4200
- Network: http://192.168.1.23:4200

### Database Kurulumu

Proje **SQLite** kullanıyor (`prisma/schema.prisma` içinde `provider = "sqlite"`).

#### İlk Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Prisma client oluştur
npx prisma generate

# Database oluştur ve şemayı uygula
npx prisma db push

# Seed verilerini yükle
npm run prisma:seed
```

#### Database Sıfırlama (Gerekirse)

```bash
# Database dosyasını sil
Remove-Item prisma/dev.db -ErrorAction SilentlyContinue

# Yeniden oluştur
npx prisma db push

# Seed verilerini yükle
npm run prisma:seed
```

## Giriş Bilgileri

Seed verilerini yükledikten sonra:

**Şifre (hepsi için):** `Admin123!`

**Kullanıcılar:**
- **Company 1 Admin:** `admin@acar-crm.local`
- **Company 1 Manager:** `manager@acar-crm.local`
- **Company 2 Manager:** `manager@acartech.local`
- **Company 3 Manager:** `manager@acarglobal.local`

## Önemli Notlar

### PostgreSQL vs SQLite

- Development ortamında **SQLite** kullanılıyor (`prisma/dev.db`)
- Production için PostgreSQL'e geçiş yapılabilir
- Docker veya yerel PostgreSQL kurulumu virtualization gerektirir
- SQLite kurulumu sadece `npx prisma db push` ile tamamlanır

### Prisma Schema Değişiklikleri

SQLite için `@db.Text` annotation'ları **kaldırılmıştır**. SQLite bu native type'ı desteklemiyor.

❌ **YANLIŞ**:
```prisma
content String @db.Text
body String @db.Text
```

✅ **DOĞRU**:
```prisma
content String
body String
```

### Server'ı Yeniden Başlatma

Prisma schema değişikliklerinde:

```bash
# Mevcut node process'lerini durdur
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Prisma'yı güncelle
npx prisma generate
npx prisma db push

# Server'ı başlat
npm run dev
```

## Yaygın Sorunlar

### "EPERM: operation not permitted" - Prisma Generate

**Sebep**: Next.js dev server Prisma dosyalarını kullanıyor.

**Çözüm**: Server'ı durdurup tekrar prisma generate çalıştır.

```bash
# Server'ı durdur
Get-Process -Name node | Stop-Process -Force

# Prisma'yı güncelle
npx prisma generate
```

### Docker/PostgreSQL Çalışmıyor

**Sebep**: Virtualization devre dışı veya Docker kurulu değil.

**Çözüm**: SQLite kullan (zaten yapılandırılmış). `prisma/schema.prisma` içinde:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Database Bağlantı Hatası

**Kontrol Et**:
1. `prisma/schema.prisma` içinde `provider = "sqlite"` olmalı
2. `npx prisma generate` çalıştırıldı mı?
3. `npx prisma db push` çalıştırıldı mı?
4. `prisma/dev.db` dosyası oluştu mu?

### Auth Secret Hatası

**Sebep**: `.env` dosyasında `AUTH_SECRET` tanımlı değil.

**Çözüm**: `.env` dosyasında şu satır olmalı:
```env
AUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars-long"
NEXTAUTH_URL="http://localhost:4200"
```

## Build ve Production

### Production Build

```bash
npm run build
```

### Production Başlatma

```bash
npm run start
```

Production için PostgreSQL'e geçmek isterseniz:

1. `prisma/schema.prisma` içinde provider'ı değiştirin:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. `.env` dosyasına ekleyin:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/acar_crm?schema=public"
```

3. Migration oluşturun:
```bash
npx prisma migrate dev --name init
```

## AI Features (Optional)

Proje AI-powered WhatsApp agent içeriyor. Kullanmak için `.env` dosyasına ekleyin:

```env
# Mock mode (API gerektirmez)
AI_PROVIDER=mock

# Veya OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY="your-key-here"

# Veya Ollama (local)
AI_PROVIDER=ollama
OLLAMA_BASE_URL="http://localhost:11434/v1"
OLLAMA_MODEL="llama3"
```

## Seed Verileri

Seed komutunu çalıştırdıktan sonra:
- 3 şirket
- 10 banka
- 19 kullanıcı (ADMIN, SUPERVISOR, MANAGER, EMPLOYEE rolleri)
- 13 müşteri
- 13 ticket (farklı kategoriler ve durumlar)
- 7 randevu
- 95 bildirim
- 3 email inbox kaydı
- Aktivite logları

Tüm kullanıcılar için şifre: `Admin123!`
