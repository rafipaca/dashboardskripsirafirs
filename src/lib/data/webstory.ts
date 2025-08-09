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
      "Kenapa pneumonia balita sulit ditaklukkan dan apa jawaban yang ditemukan dari data?\n\nSebuah studi dari Politeknik Statistika STIS mengungkap pola yang tersembunyi di balik persebaran kasus di Pulau Jawa.",
  },
  story_sections: [
    // 1. Masalah utama (menempatkan di idx 0 agar layout menonjol dengan metrik 55%)
    {
      type: "introduction",
      title: "Masalah yang Terlupakan",
      content:
        "Pneumonia adalah salah satu penyebab utama kematian balita di Indonesia. Progres penanggulangannya lebih lambat (54%) dibanding diare (63%) dan campak (82%).\n\n**55%** dari seluruh kasus pneumonia balita nasional terjadi di Pulau Jawa.",
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
    // 4. Peta risiko (diganti menjadi gambar)
    {
      type: "key_findings",
      title: "Peta Faktor Risiko Wilayah",
      content:
        '<img src="/peta.png" alt="Peta Klaster Risiko Pulau Jawa" />',
    },
    // 5. Fokus klaster gizi kurang
    {
      type: "key_findings",
      title: "Jawa Timur & Tengah — Klaster Gizi Kurang",
      content:
        "Di 58 kabupaten/kota ini, **Gizi Kurang** adalah faktor pendorong utama. Intervensi nutrisi menjadi prioritas tertinggi.",
    },
    // 6. Fokus klaster kepadatan
    {
      type: "key_findings",
      title: "Banten & Sekitarnya — Klaster Kepadatan",
      content:
        "Di 26 wilayah ini, **Kepadatan Penduduk** yang tinggi menjadi pemicu utama. Kunci: peningkatan sanitasi komunal dan pengendalian penularan.",
    },
    // 7. Fokus klaster kompleks
    {
      type: "key_findings",
      title: "Jawa Barat & Pesisir Utara — Klaster Kompleks",
      content:
        "Wilayah ini menghadapi **beban ganda**. Tiga faktor risiko—**Gizi Kurang, Paparan Asap Rokok, dan Kepadatan Penduduk**—secara bersamaan signifikan. Butuh strategi intervensi terintegrasi.",
    },
    // 8. Anomali & peringatan
    {
      type: "introduction",
      title: "Temuan Mengejutkan — Anomali & Peringatan",
      content:
        "Akses air minum yang baik secara statistik justru berkorelasi positif dengan kasus pneumonia. Ini bukan berarti air bersih berbahaya; kemungkinan ada **faktor perancu** (polusi, pelaporan lebih baik di perkotaan) yang lebih dominan.\n\nPesan kunci: Analisis data agregat membutuhkan interpretasi yang hati-hati.",
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
        "Hasil penelitian ini tidak berhenti di atas kertas. Sebuah **dashboard interaktif** dikembangkan untuk membantu pemerintah daerah merancang kebijakan yang lebih tepat sasaran.\n\n**Akses dashboard:** /dashboard",
    },
  ],
};
