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
              <h2 className="about-card-title">Latar Belakang</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Pneumonia merupakan salah satu penyakit infeksi saluran pernapasan akut yang menjadi penyebab utama kematian balita di Indonesia. 
                Di Pulau Jawa sebagai pulau dengan kepadatan penduduk tertinggi, distribusi kasus pneumonia balita menunjukkan variasi spasial 
                yang signifikan antar kabupaten/kota. Faktor risiko pneumonia balita tidak hanya dipengaruhi oleh karakteristik individu tetapi 
                juga sangat dipengaruhi oleh faktor lingkungan, sanitasi, ketersediaan air bersih, dan kondisi geografis lokal.
              </p>
              <p className="about-text">
                Model Geographically Weighted Negative Binomial Regression (GWNBR) diperlukan untuk menganalisis heterogenitas spasial 
                dalam pola kejadian pneumonia balita, karena model global konvensional tidak dapat menangkap variasi lokal yang kompleks 
                di berbagai wilayah Pulau Jawa.
              </p>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Tujuan Penelitian</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Dashboard ini dikembangkan dengan tujuan utama:
              </p>
              <ul className="about-list">
                <li>Mengidentifikasi pola spasial kasus pneumonia balita di 119 kabupaten/kota Pulau Jawa tahun 2023</li>
                <li>Menganalisis pengaruh lokal variabel sanitasi, air bersih, kepadatan penduduk, dan jumlah balita terhadap kejadian pneumonia</li>
                <li>Menerapkan model GWNBR untuk menangani overdispersi dan heterogenitas spasial dalam data count</li>
                <li>Menyediakan visualisasi interaktif hasil koefisien GWNBR dan analisis Z-hitung untuk setiap lokasi</li>
                <li>Mendukung pengambilan keputusan berbasis evidens untuk program pencegahan pneumonia balita yang spesifik lokasi</li>
              </ul>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Ruang Lingkup Penelitian</h2>
            </div>
            <div className="about-card-content">
              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Cakupan Wilayah</h3>
                <p className="about-text">
                  Penelitian mencakup 119 kabupaten/kota di Pulau Jawa yang terdiri dari:
                </p>
                <ul className="about-list">
                  <li><strong>DKI Jakarta:</strong> 6 kabupaten/kota</li>
                  <li><strong>Jawa Barat:</strong> 27 kabupaten/kota</li>
                  <li><strong>Jawa Tengah:</strong> 35 kabupaten/kota</li>
                  <li><strong>DI Yogyakarta:</strong> 5 kabupaten/kota</li>
                  <li><strong>Jawa Timur:</strong> 38 kabupaten/kota</li>
                  <li><strong>Banten:</strong> 8 kabupaten/kota</li>
                </ul>
              </div>
              
              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Periode Data</h3>
                <p className="about-text">
                  Data yang dianalisis adalah data cross-sectional tahun 2023, mencakup kasus pneumonia balita 
                  dan variabel prediktor pada periode yang sama untuk memastikan konsistensi temporal.
                </p>
              </div>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Dataset dan Sumber Data</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Penelitian ini menggunakan empat dataset utama yang terintegrasi untuk analisis GWNBR:
              </p>
              
              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Data Hasil Pengolahan (Hasil_Pengolahan.csv)</h3>
                <p className="about-text">
                  Dataset utama yang berisi data kasus pneumonia balita dan variabel prediktor untuk 119 kabupaten/kota, 
                  mencakup variabel response dan kovariat yang telah melalui proses cleaning dan validasi.
                </p>
              </div>

              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Koefisien dan Z-hitung GWNBR (KoefGWNBR_ZHitung.csv)</h3>
                <p className="about-text">
                  Hasil analisis GWNBR yang berisi koefisien lokal dan nilai Z-hitung untuk setiap lokasi, 
                  memungkinkan identifikasi signifikansi statistik variabel prediktor di setiap kabupaten/kota.
                </p>
              </div>

              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Data Spasial Pulau Jawa (rbipulaujawa.geojson)</h3>
                <p className="about-text">
                  File GeoJSON yang berisi batas administrasi kabupaten/kota di Pulau Jawa, digunakan untuk 
                  visualisasi peta tematik dan perhitungan matriks pembobot spasial dalam model GWNBR.
                </p>
              </div>

              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Variabel yang Digunakan</h3>
                <table className="about-table">
                  <thead>
                    <tr>
                      <th>Variabel</th>
                      <th>Deskripsi</th>
                      <th>Tipe Data</th>
                      <th>Sumber</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium">Kasus Pneumonia (Y)</td>
                      <td>Jumlah kasus pneumonia balita per kabupaten/kota</td>
                      <td>Count Data</td>
                      <td>Kemenkes RI</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Sanitasi Layak (X₁)</td>
                      <td>Persentase rumah tangga dengan sanitasi layak</td>
                      <td>Kontinyu (%)</td>
                      <td>BPS (Susenas)</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Air Bersih (X₂)</td>
                      <td>Persentase rumah tangga dengan akses air bersih</td>
                      <td>Kontinyu (%)</td>
                      <td>BPS (Susenas)</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Kepadatan Penduduk (X₃)</td>
                      <td>Jumlah penduduk per km²</td>
                      <td>Kontinyu</td>
                      <td>BPS</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Jumlah Balita (X₄)</td>
                      <td>Jumlah balita per kabupaten/kota</td>
                      <td>Count Data</td>
                      <td>BPS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Keunggulan Model GWNBR</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Model GWNBR yang digunakan dalam penelitian ini memiliki keunggulan:
              </p>
              <ul className="about-list">
                <li><strong>Mengatasi Overdispersi:</strong> Cocok untuk data count dengan varians lebih besar dari mean</li>
                <li><strong>Heterogenitas Spasial:</strong> Parameter bervariasi setiap lokasi, tidak seperti model global</li>
                <li><strong>Interpretasi Lokal:</strong> Menghasilkan koefisien spesifik untuk setiap kabupaten/kota</li>
                <li><strong>Signifikansi Spasial:</strong> Menguji signifikansi statistik parameter di setiap lokasi</li>
                <li><strong>Visualisasi Interaktif:</strong> Memungkinkan eksplorasi pola spasial melalui peta dinamis</li>
              </ul>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Fitur Dashboard</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Dashboard ini menyediakan fitur-fitur interaktif untuk eksplorasi hasil analisis GWNBR:
              </p>
              <ul className="about-list">
                <li><strong>Peta Interaktif:</strong> Visualisasi distribusi kasus pneumonia dan koefisien GWNBR</li>
                <li><strong>Filter Dinamis:</strong> Eksplorasi data berdasarkan provinsi dan variabel tertentu</li>
                <li><strong>Analisis Statistik:</strong> Tampilan koefisien, Z-hitung, dan signifikansi per lokasi</li>
                <li><strong>Perbandingan Model:</strong> Evaluasi performa GWNBR vs model global</li>
                <li><strong>Export Data:</strong> Unduh hasil analisis untuk penggunaan lebih lanjut</li>
              </ul>
            </div>
          </div>

          <div className="about-team-section">
            <h2 className="about-team-title">Tim Peneliti</h2>
            <div className="about-team-grid">
              <div className="about-team-card">
                <div className="about-team-avatar">
                  <Image src="/Rap7.jpg" alt="Rafirs" width={96} height={96} className="object-cover" />
                </div>
                <h3 className="about-team-name">Rafirs</h3>
                <p className="about-team-role">Mahasiswa Program Studi Statistika</p>
                <p className="about-team-institution">Sekolah Tinggi Ilmu Statistik</p>
                <p className="about-team-description">Peneliti utama yang mengembangkan model GWNBR dan dashboard interaktif</p>
              </div>
              <div className="about-team-card">
                <div className="about-team-avatar">
                  <Image src="/War001.jpg" alt="Bapak Waris" width={96} height={96} className="object-cover" />
                </div>
                <h3 className="about-team-name">Bapak Waris</h3>
                <p className="about-team-role">Dosen Pembimbing</p>
                <p className="about-team-institution">Sekolah Tinggi Ilmu Statistik</p>
                <p className="about-team-description">Pembimbing penelitian dengan expertise dalam analisis spasial dan epidemiologi</p>
              </div>
            </div>
          </div>

          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Kontribusi Penelitian</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Penelitian ini berkontribusi dalam:
              </p>
              <ul className="about-list">
                <li><strong>Metodologi:</strong> Penerapan GWNBR untuk analisis epidemiologi spasial di Indonesia</li>
                <li><strong>Kebijakan Kesehatan:</strong> Evidens untuk program pencegahan pneumonia balita berbasis lokasi</li>
                <li><strong>Teknologi:</strong> Dashboard interaktif untuk visualisasi hasil analisis spasial kompleks</li>
                <li><strong>Akademis:</strong> Referensi untuk penelitian serupa dengan data count dan heterogenitas spasial</li>
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