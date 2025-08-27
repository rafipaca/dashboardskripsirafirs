# Analisis Spasial Faktor Risiko Kejadian Pneumonia Balita di Pulau Jawa 2023

**Dashboard Interaktif untuk Visualisasi Model GWNBR**

---

-   **Nama**: Rafi Rizha Syakhari
-   **NIM**: 222112299
-   **Judul Skripsi**: Analisis Spasial Faktor Risiko Kejadian Pneumonia Balita di Pulau Jawa 2023
-   **Dosen Pembimbing**: Dr. Drs. Waris Marsisno, M.Stat

---

## Deskripsi Singkat Skripsi

Proyek ini merupakan implementasi dari skripsi yang bertujuan untuk menganalisis faktor-faktor risiko yang memengaruhi kejadian pneumonia pada balita di Pulau Jawa pada tahun 2023. Dengan menggunakan metode **Geographically Weighted Negative Binomial Regression (GWNBR)**, penelitian ini memodelkan hubungan antara variabel prediktor dengan kasus pneumonia secara spasial, yang memungkinkan adanya variasi koefisien regresi di setiap lokasi.

Dashboard ini berfungsi sebagai alat visualisasi interaktif untuk hasil pemodelan tersebut. Dibangun dengan teknologi modern seperti **Next.js**, **React**, dan **Leaflet**, dashboard ini menyajikan:
-   Peta tematik yang menampilkan distribusi spasial kasus pneumonia dan signifikansi variabel.
-   Grafik dan bagan dinamis untuk analisis data yang lebih mendalam.
-   Tabel data yang informatif dan mudah diakses.
-   Fitur filter untuk mempermudah eksplorasi data berdasarkan wilayah atau variabel tertentu.

Tujuan utama dari dashboard ini adalah untuk mempermudah pemahaman hasil analisis spasial yang kompleks bagi para pemangku kepentingan, seperti akademisi, praktisi kesehatan, dan pemerintah daerah.

## Struktur Proyek

Berikut adalah struktur direktori utama dari proyek ini:

```
src/
├── app/                # Konfigurasi routing utama (App Router)
│   ├── dashboard/      # Halaman utama dashboard
│   └── webstory/       # Halaman untuk web story
├── components/         # Komponen React yang dapat digunakan kembali
│   ├── analytics/      # Komponen untuk analitik
│   ├── cards/          # Komponen kartu untuk menampilkan data
│   ├── charts/         # Komponen grafik (Recharts)
│   └── map/            # Komponen peta (Leaflet)
├── hooks/              # Custom hooks untuk logika state
│   ├── useGeojsonData.ts # Hook untuk mengambil data GeoJSON
│   └── useMapData.ts   # Hook untuk mengelola data peta
├── lib/                # Fungsi-fungsi utilitas dan konstanta
│   ├── api/            # Fungsi untuk fetch data
│   ├── constants/      # Konstanta yang digunakan di aplikasi
│   └── data/           # Pengolahan data mentah
└── public/             # Aset statis
    ├── data/           # File data (CSV, GeoJSON)
    └── images/         # Gambar dan ikon
```

## Teknologi yang Digunakan

-   **Next.js 15.3.4** - Framework React untuk Server-Side Rendering (SSR) dan Static Site Generation (SSG).
-   **TypeScript** - Menambahkan type-safety pada JavaScript untuk pengembangan yang lebih robust.
-   **TailwindCSS 4** - Framework CSS utility-first untuk desain antarmuka yang cepat dan modern.
-   **Radix UI** - Pustaka komponen UI headless untuk aksesibilitas yang lebih baik.
-   **Leaflet** - Pustaka JavaScript untuk peta interaktif.
-   **Recharts** - Pustaka grafik untuk visualisasi data.
-   **React 19** - Pustaka JavaScript untuk membangun antarmuka pengguna.

## Instalasi dan Penggunaan

### Prasyarat
-   Node.js versi 18 atau lebih baru
-   npm, yarn, atau pnpm

### Instalasi
1.  Clone repository ini:
    ```bash
    git clone <URL_REPOSITORY>
    ```
2.  Masuk ke direktori proyek dan install dependencies:
    ```bash
    cd dashboardskripsirafirs
    npm install
    ```

### Menjalankan Server Development
Untuk menjalankan aplikasi di mode development:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Build untuk Produksi
Untuk membuat build produksi:
```bash
npm run build
npm start
```

---

Proyek ini dibuat untuk memenuhi persyaratan akademik dalam menyelesaikan skripsi.