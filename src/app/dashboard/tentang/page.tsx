"use client";

import Link from "next/link";
import Image from "next/image";
import { AppRoutes } from "@/utils/router";

export default function About() {
  return (
    <div className="min-h-screen bg-background about-page">
      {/* Navbar */}

      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tentang</h1>
            <p className="about-subtitle">
              Informasi mengenai latar belakang dan tujuan penelitian GWNBR untuk pneumonia balita
            </p>
          </div>
        </div>
        
        {/* About Content */}
        <div className="space-y-6">
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Tentang Dashboard: Analisis Spasial Faktor Risiko Pneumonia Balita</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Dashboard ini menyajikan hasil analisis spasial dari penelitian skripsi mengenai faktor-faktor risiko yang
                memengaruhi kejadian pneumonia pada balita di Pulau Jawa.
              </p>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Latar Belakang</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Pneumonia masih menjadi salah satu penyebab utama kematian balita di Indonesia, dengan beban kasus tertinggi
                terkonsentrasi di Pulau Jawa. Namun, pendekatan penanganan yang seragam seringkali kurang efektif karena faktor
                risiko pendorongnya—seperti status gizi, perilaku rumah tangga, dan kondisi lingkungan—bervariasi secara signifikan
                di setiap wilayah.
              </p>
              <p className="about-text">
                Memahami perbedaan lokal ini sangat krusial untuk merancang intervensi yang tepat sasaran dan efisien. Oleh karena itu,
                penelitian ini dikembangkan untuk memetakan dan menganalisis bagaimana pengaruh faktor risiko pneumonia berbeda di 119
                kabupaten/kota di Pulau Jawa.
              </p>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Tujuan Utama Dashboard</h2>
            </div>
            <div className="about-card-content">
                <ul className="about-list">
                <li><strong>Memetakan</strong> sebaran kasus pneumonia dan faktor risikonya di seluruh Pulau Jawa.</li>
                <li><strong>Mengidentifikasi</strong> faktor-faktor risiko dominan yang secara signifikan memengaruhi kasus pneumonia di setiap kabupaten/kota.</li>
                <li><strong>Menyediakan</strong> bukti (evidens) bagi pemerintah dan dinas kesehatan untuk merumuskan kebijakan pencegahan yang lebih spesifik dan berbasis lokasi.</li>
                </ul>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Metodologi dan Sumber Data</h2>
            </div>
            <div className="about-card-content space-y-4">
              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Model Analisis: Geographically Weighted Negative Binomial Regression (GWNBR)</h3>
                <ol className="about-list list-decimal pl-6">
                  <li>Menganalisis data cacah (jumlah kasus) yang memiliki <strong>overdispersi</strong> (varians lebih besar dari rata-rata).</li>
                  <li>Menangkap <strong>heterogenitas spasial</strong>, yaitu pengaruh setiap faktor risiko yang dapat berbeda-beda di setiap lokasi.</li>
                </ol>
              </div>

              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Sumber Data</h3>
                <p className="about-text">Data sekunder <strong>tahun 2023</strong> yang berasal dari:</p>
                <ul className="about-list">
                  <li>Kementerian Kesehatan RI (Kemenkes)</li>
                  <li>Badan Pusat Statistik (BPS)</li>
                </ul>
              </div>

              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Variabel yang Digunakan</h3>
                <table className="about-table">
                  <thead>
                    <tr>
                      <th>Variabel</th>
                      <th>Deskripsi</th>
                      <th>Tipe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium">Jumlah Kasus Pneumonia (Y)</td>
                      <td>[Variabel Dependen] Jumlah kasus pneumonia pada balita.</td>
                      <td>Cacah</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Jumlah Balita Gizi Kurang (X1)</td>
                      <td>[Variabel Independen] Proksi status gizi anak.</td>
                      <td>Cacah</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Persentase Inisiasi Menyusui Dini (X2)</td>
                      <td>[Variabel Independen] Proksi perilaku kesehatan ibu dan bayi.</td>
                      <td>Persentase</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Rata-rata Konsumsi Rokok (X3)</td>
                      <td>[Variabel Independen] Proksi paparan polusi udara dalam rumah.</td>
                      <td>Kontinyu</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Kepadatan Penduduk (X4)</td>
                      <td>[Variabel Independen] Proksi risiko penularan di tingkat komunitas.</td>
                      <td>Kontinyu</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Akses Air Minum Layak (X5)</td>
                      <td>[Variabel Independen] Proksi kondisi sanitasi dan higienitas lingkungan.</td>
                      <td>Persentase</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Akses Sanitasi Layak (X6)</td>
                      <td>[Variabel Independen] Proksi kondisi sanitasi dan higienitas lingkungan.</td>
                      <td>Persentase</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="about-team-section">
            <h2 className="about-team-title">Tim Peneliti</h2>
            <div className="about-team-grid">
              <div className="about-team-card">
                <div className="about-team-avatar">
                  <Image src="/Rap7.jpg" alt="Rafi Rizha Syakhari" width={96} height={96} className="object-cover" />
                </div>
                <h3 className="about-team-name">Rafi Rizha Syakhari</h3>
                <p className="about-team-role">Peneliti Utama — Mahasiswa Program Studi Diploma IV Komputasi Statistik</p>
                <p className="about-team-institution">Politeknik Statistika STIS</p>
                <p className="about-team-description">Mengembangkan model GWNBR dan dashboard interaktif.</p>
              </div>
              <div className="about-team-card">
                <div className="about-team-avatar">
                  <Image src="/War001.jpg" alt="Dr. Drs. Waris Marsisno, M.Stat." width={96} height={96} className="object-cover" />
                </div>
                <h3 className="about-team-name">Dr. Drs. Waris Marsisno, M.Stat.</h3>
                <p className="about-team-role">Dosen Pembimbing</p>
                <p className="about-team-institution">Politeknik Statistika STIS</p>
                <p className="about-team-description">Keahlian dalam analisis spasial dan epidemiologi.</p>
              </div>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Kontribusi Penelitian</h2>
            </div>
            <div className="about-card-content">
              <ul className="about-list">
                <li><strong>Kebijakan Kesehatan:</strong> Landasan data untuk alokasi sumber daya yang lebih efisien dan intervensi yang tajam sesuai konteks lokal.</li>
                <li><strong>Akademis:</strong> Referensi penerapan GWNBR untuk analisis epidemiologi spasial penyakit pernapasan di Indonesia.</li>
                <li><strong>Diseminasi Informasi:</strong> Menerjemahkan hasil analisis statistik yang kompleks menjadi platform visual yang mudah diakses dan dipahami.</li>
              </ul>
            </div>
          </div>
          
          <div className="about-button-container">
            <Link href={AppRoutes.HOME} className="about-button">
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}