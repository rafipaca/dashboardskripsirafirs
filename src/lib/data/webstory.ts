import { WebStoryData } from "@/types/story";

export const webStoryData: WebStoryData = {
  metadata: {
    title: "Analisis Spasial Faktor Risiko Kejadian Pneumonia pada Balita di Pulau Jawa Tahun 2023",
    author: "Rafi Rizha Syakhari",
    nim: "222112299",
    institution: "Politeknik Statistika STIS",
    program: "Diploma IV Komputasi Statistik",
    specialization: "Sistem Informasi",
    academic_year: "2024/2025",
    supervisor: "Dr. Drs. Waris Marsisno, M.Stat.",
    short_bio:
      "Rafi Rizha Syakhari adalah peneliti dengan fokus komputasi statistik dan sistem informasi. Penelitian ini menerapkan analisis spasial untuk memahami variasi faktor risiko pneumonia balita di Pulau Jawa.",
  },
  abstract: {
    title: "Ancaman Senyap di Jawa",
    content:
      "Kenapa pneumonia balita sulit ditaklukkan dan apa jawaban yang ditemukan dari data? Sebuah studi dari Politeknik Statistika STIS mengungkap pola yang tersembunyi di balik persebaran kasus di Pulau Jawa.",
  },
  story_sections: [
    // 1. Masalah utama (menempatkan di idx 0 agar layout menonjol dengan metrik 55%)
    {
      type: "introduction",
      title: "Masalah yang Terlupakan",
      content:
        "Pneumonia adalah salah satu penyebab utama kematian balita di Indonesia. Progres penanggulangannya lebih lambat (54%) dibanding diare (63%) dan campak (82%).",
    },
    // 2. Hipotesis yang salah / kebijakan seragam
    {
      type: "introduction",
      title: "Satu Solusi Tak Cukup",
      content:
        "Kebijakan yang seragam secara nasional seringkali tidak efektif. Apa yang berhasil di satu daerah, bisa jadi gagal di daerah lain—karena pemicunya berbeda.",
    },
    // 3. Metodologi inti
    {
      type: "methodology",
      title: "Mencari Jejak di Tiap Wilayah",
      content:
        "Penelitian ini tidak bertanya 'apa' penyebab pneumonia secara umum, tapi **di mana** setiap faktor risiko menjadi yang paling dominan.\n\n**Metodologi:** GWNBR pada data 119 kabupaten/kota (2023).\n\n**Bukti spasial:** Moran's I = **0.374** → Kasus mengelompok, bukan acak.",
    },
    // 4. Peta interaktif (full-card seperti MapCard)
    {
      type: "map",
      title: "Peta Faktor Risiko Wilayah (Interaktif)",
      description: "Jelajahi signifikansi variabel dan nilai indikator per kabupaten/kota di Pulau Jawa.",
      defaultLayer: "significance",
    },
    // Slides per-kluster (dua kolom: penjelasan ringkas + gambar dummy)
    {
      type: "key_findings",
      title: "Kluster Oranye — Gizi Kurang",
      layout: "two_col",
      imageSrc: "/malnutrisi.webp",
      imageAlt: "Ilustrasi kluster Gizi Kurang (malnutrisi)",
      content:
        "**Variabel signifikan:** hanya Gizi Kurang.\n\n**Lokasi utama:** mayoritas Jawa Timur (termasuk Madura: Bangkalan, Sampang, Pamekasan, Sumenep) dan Jawa Tengah timur/tengah (mis. Banyuwangi, Jember, Probolinggo, Pasuruan, Malang, Kediri, Sidoarjo, Mojokerto, Jombang, Nganjuk, Sragen, Grobogan, Blora, Rembang, Pati, Kudus, Jepara).\n\n**Implikasi kebijakan:** perbaikan gizi ibu‑bayi (PMT), edukasi gizi, pemantauan tumbuh kembang di posyandu.",
    },
    {
      type: "key_findings",
      title: "Kluster Biru — Kepadatan Penduduk",
      layout: "two_col",
      imageSrc: "/padat.webp",
      imageAlt: "Ilustrasi kluster Kepadatan Penduduk",
      content:
        "**Variabel signifikan:** hanya Kepadatan Penduduk.\n\n**Lokasi utama:** Banten dan penyangga Jakarta di Jabar (mis. Pandeglang, Lebak, Serang, Kota Cilegon, Kota Tangerang Selatan, Kota Depok, Bogor, Sukabumi, Kota Sukabumi).\n\n**Implikasi kebijakan:** sanitasi lingkungan, kualitas udara dalam ruang, PHBS, sirkulasi udara di permukiman padat.",
    },
    {
      type: "key_findings",
      title: "Kluster Ungu — Gizi Kurang & Kepadatan",
      layout: "two_col",
      imageSrc: "/malnutrisi.webp",
      imageAlt: "Ilustrasi kluster Gizi Kurang & Kepadatan",
      content:
        "**Variabel signifikan:** Gizi Kurang dan Kepadatan.\n\n**Lokasi utama:** kawasan industri/perkotaan Jabar (mis. Bekasi, Karawang, Bandung Barat, Kota Bandung, Cianjur).\n\n**Implikasi kebijakan:** intervensi ganda—perbaikan gizi bersamaan dengan perbaikan kesehatan lingkungan.",
    },
    {
      type: "key_findings",
      title: "Kluster Hijau — Rokok/Kapita & Kepadatan",
      layout: "two_col",
      imageSrc: "/rokok.webp",
      imageAlt: "Ilustrasi kluster Rokok per Kapita & Kepadatan",
      content:
        "**Variabel signifikan:** Rokok per Kapita dan Kepadatan.\n\n**Lokasi utama:** jalur pantura dan selatan Jateng (mis. Brebes, Tegal, Kota Tegal, Pemalang, Kota Pekalongan, Batang, Cilacap, Banyumas).\n\n**Implikasi kebijakan:** KTR dan kampanye anti‑rokok (lindungi bayi dari asap) serta perbaikan lingkungan di kawasan padat.",
    },
    {
      type: "key_findings",
      title: "Kluster Merah Tua — Tiga Variabel",
      layout: "two_col",
      imageSrc: "/peta.png",
      imageAlt: "Ilustrasi peta kluster tiga variabel",
      content:
        "**Variabel signifikan:** Gizi Kurang, Rokok/Kapita, Kepadatan.\n\n**Lokasi utama:** hotspot di Jabar tengah–timur (mis. Subang, Purwakarta, Indramayu, Sumedang, Garut, Tasikmalaya, Ciamis, Kuningan, Cirebon, Kota Cirebon).\n\n**Implikasi kebijakan:** strategi terpadu lintas program dengan prioritas wilayah.",
    },
    {
      type: "key_findings",
      title: "Kluster Abu-abu — Tidak Signifikan",
      layout: "two_col",
      imageSrc: "/tidak ada.webp",
      imageAlt: "Ilustrasi kluster tidak signifikan",
      content:
        "**Variabel signifikan:** tidak ada dari ketiganya.\n\n**Lokasi utama:** DIY dan Solo Raya (mis. Kulon Progo, Bantul, Sleman, Kota Yogyakarta, Klaten, Boyolali, Kota Surakarta, Wonogiri; juga Semarang dan sekitarnya).\n\n**Implikasi kebijakan:** kemungkinan prevalensi lebih rendah/terkendali atau ada faktor lain (imunisasi, akses layanan, polusi) yang dominan—butuh kajian lanjutan.",
    },
    // 8. Anomali & peringatan
    {
      type: "introduction",
      title: "Temuan Mengejutkan — Anomali & Peringatan",
      content:
        "Akses air minum yang baik secara statistik justru berkorelasi positif dengan kasus pneumonia. Ini bukan berarti air bersih berbahaya; kemungkinan ada **faktor perancu** (polusi, pelaporan lebih baik di perkotaan) yang lebih dominan.\n\nPesan kunci: Analisis data agregat membutuhkan interpretasi yang hati-hati.",
      imageSrc: "/air.webp",
      imageAlt: "Ilustrasi anomali terkait air minum layak",
    },
    // 9. Kesimpulan
    {
      type: "conclusion",
      title: "Solusi Harus Lokal, Bukan Global",
      content:
        "Untuk memberantas pneumonia balita secara efektif, kebijakan harus **disesuaikan (tailor‑made)** dengan profil risiko spesifik di setiap daerah.",
    },
    // 10. Aplikasi praktis
    {
      type: "practical_application",
      title: "Dari Data Menjadi Aksi",
      content:
        "Hasil penelitian ini tidak berhenti di atas kertas. Sebuah **dashboard interaktif** dikembangkan untuk membantu pemerintah daerah merancang kebijakan yang lebih tepat sasaran.",
    },
  // (Optional) gambar statis dihapus karena sudah ada peta interaktif penuh
  ],
};
