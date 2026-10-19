# Kuşatma Parkur

Türkçe arayüzlü, tarayıcıda çalışan ilk Kuşatma Parkur prototipi. Next.js 14 ve React ile hazırlanmıştır.

## Özellikler
- 15 dakikalık görev sayacı ve gece/şafak geçişi
- 40 katlık kule ilerlemesi ve 10/20/30/40. kat boss karşılaşmaları
- 1, 2 veya 3 kişilik ekip seçimi (bu prototipte seçim arayüzü; gerçek ağ tabanlı çok oyunculu senkronizasyon henüz yoktur)
- Zıplama, yukarı tırmanma, su jeti/enerji mekaniği
- Bomba katları, gizli dolap ve 41. kata ışınlanma akışı
- Klavye ve mobil uyumlu kontrol arayüzü

## Çalıştırma

Node.js 18+ gerekir.

```bash
npm install
npm run dev
```

Ardından `http://localhost:3000` adresini aç.

## Kontroller
- `SPACE` / `↑`: zıpla
- `W` / `→`: yukarı çık
- `E`: su jeti

## Geliştirme notu
Bu depo ilk oynanabilir web arayüzü prototipidir; gerçek 3D oyun, sunucu taraflı oda sistemi, eş zamanlı 1–3 oyuncu, gerçek zombiler ve çarpışma/fizik sonraki geliştirme adımlarıdır.
