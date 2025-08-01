# Dashboard GWNBR Pneumonia

Dashboard interaktif untuk visualisasi model Geographically Weighted Negative Binomial Regression (GWNBR) pada kasus pneumonia balita di Pulau Jawa.

## Deskripsi Proyek

Proyek ini merupakan bagian dari skripsi yang mengimplementasikan model GWNBR untuk analisis spasial kasus pneumonia balita. Dashboard ini menyediakan:

- Visualisasi peta interaktif dengan Leaflet
- Grafik dan chart dengan Recharts
- Analisis statistik spasial
- Tabel data interaktif
- Filter dan kontrol interaktif

## Teknologi yang Digunakan

- **Next.js 15.3.4** - Framework React untuk SSR dan SSG
- **TypeScript** - Type safety untuk JavaScript
- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Komponen UI yang dapat diakses
- **Leaflet** - Library untuk peta interaktif
- **Recharts** - Library untuk grafik dan chart
- **React 19** - Library UI modern

## Struktur Proyek

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   └── *.tsx             # Other components
├── lib/                  # Utilities and helpers
├── utils/                # Shared utilities
└── types/               # TypeScript type definitions
```

## Instalasi dan Penggunaan

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm atau package manager lainnya

### Instalasi
1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Menjalankan server development:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build untuk Production
```bash
npm run build
npm start
```

### Lint dan Format
```bash
npm run lint
```

## Fitur Utama

- **Peta Interaktif**: Visualisasi spasial data pneumonia
- **Dashboard Analytics**: Ringkasan statistik dan visualisasi
- **Responsive Design**: Kompatibel dengan berbagai ukuran layar
- **Dark Mode**: Toggle antara light dan dark theme
- **Filter Interaktif**: Filter data berdasarkan wilayah dan periode

## Data

- Data kasus pneumonia balita di Pulau Jawa
- Data spasial dalam format GeoJSON
- Statistik demografi dan faktor risiko

## Lisensi

Proyek ini dibuat untuk keperluan akademik (skripsi).

## Kontak

Untuk pertanyaan atau kontribusi, silakan buat issue di repository.
