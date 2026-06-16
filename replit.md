# ZTRAX — Maskot Destekli Araç Takip Deneyimi

Araç takip ve filo yönetimi şirketi için Duolingo tarzı interaktif bir onboarding deneyimi. Sayfanın kalbi olan animasyonlu maskot, kullanıcıyı adım adım doğru pakete yönlendiriyor.

---

## Projeyi Çalıştır

```bash
# Tüm bağımlılıkları yükle
pnpm install

# Frontend'i geliştirme modunda başlat (localhost:24693)
pnpm --filter @workspace/mascot-app run dev

# API sunucusunu başlat (localhost:8080)
pnpm --filter @workspace/api-server run dev

# Tüm paketi typecheck et
pnpm run typecheck

# Production build al
pnpm --filter @workspace/mascot-app run build
```

---

## Klasör Yapısı

```
/
├── artifacts/
│   ├── mascot-app/              ← 🎯 ANA FRONTEND (buraya bak)
│   │   └── src/
│   │       ├── components/
│   │       │   ├── Mascot.tsx   ← Maskot karakteri (SVG + animasyon)
│   │       │   └── ui/          ← shadcn/ui bileşenleri
│   │       ├── pages/
│   │       │   └── home.tsx     ← Tüm onboarding akışı (hero → quiz → sonuç → form)
│   │       ├── App.tsx          ← Router
│   │       └── index.css        ← Tema renkleri + CSS animasyonları
│   │
│   ├── api-server/              ← Express 5 API (şu an sadece /api/healthz)
│   │   └── src/
│   │       ├── routes/          ← API endpoint'leri buraya eklenir
│   │       └── index.ts         ← Sunucu başlangıcı
│   │
│   └── mockup-sandbox/          ← Replit Canvas için (kullanıcıya görünmez, iç araç)
│
├── lib/                         ← Paylaşılan kütüphaneler
│   ├── api-spec/                ← OpenAPI spec (sözleşme)
│   ├── api-client-react/        ← Orval ile üretilen React Query hook'ları
│   ├── api-zod/                 ← Orval ile üretilen Zod şemaları
│   └── db/                      ← Drizzle ORM şemaları + Postgres bağlantısı
│
├── scripts/                     ← Yardımcı script'ler
├── pnpm-workspace.yaml          ← Workspace + bağımlılık kataloğu
└── tsconfig.json                ← TypeScript çözüm dosyası (sadece lib'ler için)
```

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Frontend framework | React 19 + Vite 7 |
| Animasyon | Framer Motion + CSS keyframes |
| Stil | Tailwind CSS v4 + shadcn/ui |
| Font | Outfit (Google Fonts) |
| Routing (frontend) | Wouter |
| API istemcisi | TanStack Query + Orval codegen |
| Backend | Express 5 (Node.js 24) |
| Veritabanı | PostgreSQL + Drizzle ORM |
| Validasyon | Zod v4 |
| Paket yöneticisi | pnpm workspaces |
| Dil | TypeScript 5.9 |

---

## GitHub'a Yükleme

Bu proje standart bir **pnpm monorepo**'su — herhangi bir özel konfigürasyon gerekmez.

```bash
git init
git add .
git commit -m "feat: ZTRAX maskot onboarding deneyimi"
git remote add origin https://github.com/kullanici/ztrax.git
git push -u origin main
```

**.gitignore'da zaten hariç tutulanlar:**
- `node_modules/`
- `dist/`
- `.env` dosyaları
- `*.tsbuildinfo`

**GitHub'dan klonlayıp çalıştırma:**
```bash
git clone https://github.com/kullanici/ztrax.git
cd ztrax
pnpm install
pnpm --filter @workspace/mascot-app run dev
```

---

## Ortam Değişkenleri

| Değişken | Açıklama | Gerekli mi? |
|----------|----------|-------------|
| `DATABASE_URL` | PostgreSQL bağlantı string'i | API kullanılacaksa evet |
| `SESSION_SECRET` | Express session şifreleme anahtarı | API kullanılacaksa evet |
| `PORT` | API sunucusu portu (otomatik atanır) | Hayır |

`.env.example` dosyası oluşturmak için:
```bash
cp .env.example .env
# Sonra kendi değerlerini gir
```

---

## Onboarding Akışı

```
Hero (giriş animasyonu)
    ↓
Tip Seçimi: Kurumsal / Bireysel     ← progress %10
    ↓
KURUMSAL:                           BIREYSEL:
  Araç sayısı (%20)                   Araç tipi (%20)
  Sektör (%40)                        Araç adedi (%40)
  Şehirler (%60)                      Mobil uygulama? (%60)
  Yakıt takibi? (%80)                 Motor blokaj? (%80)
  Sürücü raporu? (%100)               Anlık bildirim? (%100)
  Canlı konum? (%100)
    ↓
Analiz Ekranı (mascot düşünüyor, 3 saniye)
    ↓
Öneri Ekranı (glassmorphism kart + paket detayları)
    ↓
Lead Formu (Ad, Telefon, E-posta, [Firma])
    ↓
Başarı (maskot kutlama animasyonu)
```

---

## Maskot Sistemi

`Mascot.tsx` bileşeni şu özelliklere sahip:

```tsx
<Mascot
  mode="casual"      // "casual" | "corporate" (kıyafet değişimi)
  reaction="idle"    // Aşağıdaki tepkilerden biri
  speechText="..."   // Balonun içindeki metin
/>
```

**Tepkiler:**
| Tepki | Tetikleyen durum |
|-------|-----------------|
| `idle` | Varsayılan, nefes alan + gözleri kırpan |
| `running` | Sayfa yüklenişi girişi |
| `skidding` | Durma hareketi |
| `wave` | Merhaba, bireysel mod |
| `thumbsUp` | Küçük filo, olumlu cevap |
| `excited` | Orta filo, heyecan verici seçim |
| `celebrate` | Büyük filo, premium seçim |
| `thinking` | Analiz ekranı |

---

## Mimari Kararlar

- **Sözleşme önce (contract-first):** API değişiklikleri önce `lib/api-spec` OpenAPI dosyasında yapılır, ardından `pnpm --filter @workspace/api-spec run codegen` ile hook ve şemalar üretilir.
- **Tam istemci taraflı:** Şu anki onboarding akışı tamamen frontend'de çalışıyor; backend yalnızca lead kayıt endpoint'i eklendiğinde aktive olacak.
- **Paylaşılan lib'ler:** `artifacts/` paketleri birbirinden import etmez; paylaşılan kod `lib/` altında yaşar.
- **Tailwind v4 tema sistemi:** Renkler `index.css`'teki `:root` CSS değişkenlerinde tanımlanır, `tailwind.config.ts`'de değil.

---

## Sıradaki Adımlar (Yapılacaklar)

- [ ] Lead kayıt API endpoint'i (`POST /api/leads`)
- [ ] Admin paneli — gelen lead'leri görüntüleme
- [ ] WhatsApp entegrasyonu — sonuç ekranında direkt mesaj linki
- [ ] E-posta bildirimi — form gönderildiğinde ekibe e-posta
- [ ] Analytics — hangi adımda kullanıcı bırakıyor

---

## User Preferences

- Türkçe konuşmak tercih edilir
