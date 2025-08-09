"use client";

import Link from "next/link";

import { AppRoutes } from "@/utils/router";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background methodology-page">
      {/* Navbar */}

      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Metodologi</h1>
            <p className="subtitle">
              Metodologi yang digunakan dalam penelitian GWNBR untuk kasus pneumonia balita di Pulau Jawa
            </p>
          </div>
        </div>
        
        {/* Methodology Content */}
        <div className="space-y-6">
          {/* Overview Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Metodologi Penelitian</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Penelitian ini menggunakan model Geographically Weighted Negative Binomial Regression (GWNBR)
                untuk menganalisis pola spasial dari kasus pneumonia balita di Pulau Jawa tahun 2022. 
                Analisis dilakukan pada tingkat kabupaten/kota dengan mempertimbangkan heterogenitas spasial.
              </p>
            </div>
          </div>

          {/* GWNBR Model Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Geographically Weighted Negative Binomial Regression (GWNBR)</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                GWNBR merupakan pengembangan dari model Negative Binomial Regression yang memperhitungkan heterogenitas spasial. 
                Model ini cocok digunakan untuk data cacah (count data) yang mengalami overdispersi, dimana varians data lebih besar dari mean.
              </p>
              
              <p className="about-text">
                Pada model GWNBR, parameter regresi dapat bervariasi untuk setiap lokasi geografis, sehingga kita dapat melihat bagaimana 
                pengaruh variabel independen terhadap variabel dependen berbeda-beda di setiap lokasi geografis di Pulau Jawa.
              </p>
            </div>
          </div>

          {/* Mathematical Model Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Model Matematika GWNBR</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Model GWNBR untuk kasus pneumonia balita dapat dinyatakan dalam bentuk:
              </p>
              <div className="about-dataset-card">
                <div className="methodology-formula-content" style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '16px', 
                  lineHeight: '1.6',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  margin: '12px 0'
                }}>
                  Y<sub>i</sub> ~ NB(μ<sub>i</sub>, α)<br/>
                  ln(μ<sub>i</sub>) = β<sub>0</sub>(u<sub>i</sub>, v<sub>i</sub>) + β<sub>1</sub>(u<sub>i</sub>, v<sub>i</sub>)X<sub>1i</sub> + β<sub>2</sub>(u<sub>i</sub>, v<sub>i</sub>)X<sub>2i</sub> + β<sub>3</sub>(u<sub>i</sub>, v<sub>i</sub>)X<sub>3i</sub> + β<sub>4</sub>(u<sub>i</sub>, v<sub>i</sub>)X<sub>4i</sub>
                </div>
                <p className="about-text">
                  <strong>Dimana:</strong><br/>
                  Y<sub>i</sub> = jumlah kasus pneumonia balita di kabupaten/kota ke-i<br/>
                  μ<sub>i</sub> = nilai ekspektasi dari Y<sub>i</sub><br/>
                  α = parameter dispersi<br/>
                  (u<sub>i</sub>, v<sub>i</sub>) = koordinat geografis kabupaten/kota ke-i<br/>
                  β<sub>0</sub>(u<sub>i</sub>, v<sub>i</sub>) = parameter intercept di lokasi ke-i<br/>
                  X<sub>1i</sub> = persentase rumah tangga dengan sanitasi layak di lokasi ke-i<br/>
                  X<sub>2i</sub> = persentase rumah tangga dengan air bersih di lokasi ke-i<br/>
                  X<sub>3i</sub> = kepadatan penduduk di lokasi ke-i<br/>
                  X<sub>4i</sub> = jumlah balita di lokasi ke-i
                </p>
              </div>
            </div>
          </div>

          {/* Analysis Steps Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Tahapan Analisis</h2>
            </div>
            <div className="about-card-content">
              <ol className="about-list" style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
                <li>
                  <strong>Eksplorasi Data Awal:</strong> Melakukan eksplorasi karakteristik data pneumonia balita dan variabel prediktor di 119 kabupaten/kota Pulau Jawa.
                </li>
                <li>
                  <strong>Pengujian Multikolinearitas:</strong> Menguji korelasi antar variabel independen menggunakan VIF (Variance Inflation Factor) dengan batas VIF &lt; 10.
                </li>
                <li>
                  <strong>Pemodelan Regresi Poisson Global:</strong> Melakukan pemodelan awal dengan regresi Poisson untuk seluruh wilayah Pulau Jawa.
                </li>
                <li>
                  <strong>Pengujian Overdispersi:</strong> Menguji overdispersi menggunakan uji dispersi untuk menentukan kesesuaian model Poisson.
                </li>
                <li>
                  <strong>Pemodelan Regresi Binomial Negatif Global:</strong> Mengatasi overdispersi dengan model Binomial Negatif global.
                </li>
                <li>
                  <strong>Pengujian Dependensi Spasial:</strong> Menggunakan Indeks Moran&apos;s I untuk menguji autokorelasi spasial pada residual model.
                </li>
                <li>
                  <strong>Pemodelan GWNBR:</strong> Menerapkan model GWNBR untuk menangani heterogenitas spasial di wilayah Pulau Jawa.
                </li>
                <li>
                  <strong>Pemilihan Fungsi Pembobot dan Bandwidth:</strong> Menggunakan fungsi kernel Gaussian dengan pemilihan bandwidth optimal melalui metode Cross Validation (CV).
                </li>
                <li>
                  <strong>Evaluasi Model:</strong> Membandingkan model menggunakan AIC, log-likelihood, dan koefisien determinasi.
                </li>
                <li>
                  <strong>Interpretasi dan Visualisasi:</strong> Menginterpretasikan koefisien lokal dan membuat peta distribusi spasial parameter.
                </li>
              </ol>
            </div>
          </div>

          {/* Variables Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Variabel Penelitian</h2>
            </div>
            <div className="about-card-content">
              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Variabel Dependen (Y)</h3>
                <p className="about-text">
                  <strong>Jumlah kasus pneumonia balita</strong> di 119 kabupaten/kota di Pulau Jawa tahun 2022.
                  Data berupa variabel cacah (count data) yang menunjukkan frekuensi kejadian pneumonia pada balita.
                </p>
              </div>
              
              <div className="about-dataset-card">
                <h3 className="about-dataset-title">Variabel Independen</h3>
                <ul className="about-list">
                  <li><strong>X₁:</strong> Persentase rumah tangga dengan sanitasi layak (%)</li>
                  <li><strong>X₂:</strong> Persentase rumah tangga dengan akses air bersih (%)</li>
                  <li><strong>X₃:</strong> Kepadatan penduduk (jiwa/km²)</li>
                  <li><strong>X₄:</strong> Jumlah balita (jiwa)</li>
                </ul>
                <p className="about-text">
                  Semua variabel independen telah diuji asumsi normalitas dan linearitas sebelum digunakan dalam model.
                </p>
              </div>
            </div>
          </div>

          {/* Spatial Data Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Data Spasial</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Penelitian menggunakan data spasial berformat GeoJSON yang mencakup batas administrasi 119 kabupaten/kota di Pulau Jawa.
                Data spasial digunakan untuk:
              </p>
              <ul className="about-list">
                <li>Menentukan matriks pembobot spasial berdasarkan kedekatan geografis</li>
                <li>Menghitung jarak antar lokasi untuk fungsi kernel</li>
                <li>Visualisasi hasil analisis dalam bentuk peta tematik</li>
                <li>Mengidentifikasi pola klaster spasial kasus pneumonia balita</li>
              </ul>
            </div>
          </div>

          {/* Data Sources Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Sumber Data</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Data yang digunakan dalam penelitian ini berasal dari:
              </p>
              <ul className="about-list">
                <li><strong>Data Kesehatan:</strong> Profil Kesehatan Indonesia, Kementerian Kesehatan RI (2022)</li>
                <li><strong>Data Demografi dan Sosial:</strong> Survei Sosial Ekonomi Nasional (Susenas), BPS (2022)</li>
                <li><strong>Data Sanitasi dan Air Bersih:</strong> Statistik Kesejahteraan Rakyat, BPS (2022)</li>
                <li><strong>Data Spasial:</strong> Batas administrasi kabupaten/kota, Geoportal Indonesia</li>
              </ul>
            </div>
          </div>

          {/* Analysis Results Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Hasil Analisis</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Hasil analisis GWNBR menghasilkan koefisien regresi yang bervariasi untuk setiap lokasi, menunjukkan:
              </p>
              <ul className="about-list">
                <li>Heterogenitas spasial dalam faktor risiko pneumonia balita</li>
                <li>Pola geografis pengaruh variabel sanitasi, air bersih, kepadatan penduduk, dan jumlah balita</li>
                <li>Identifikasi wilayah dengan risiko tinggi yang memerlukan intervensi khusus</li>
                <li>Evaluasi efektivitas model melalui perbandingan dengan model global</li>
              </ul>
            </div>
          </div>

          {/* Software Tools Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Perangkat Lunak dan Analisis</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Analisis statistik dan spasial dilakukan menggunakan:
              </p>
              <ul className="about-list">
                <li><strong>R Studio:</strong> Analisis statistik dengan paket spgwr, GWmodel, spdep, MASS</li>
                <li><strong>QGIS:</strong> Pengolahan data spasial dan visualisasi peta</li>
                <li><strong>Next.js & React:</strong> Pengembangan dashboard interaktif untuk visualisasi hasil</li>
                <li><strong>Leaflet:</strong> Implementasi peta interaktif pada dashboard</li>
              </ul>
            </div>
          </div>
          
          {/* Back Button */}
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