"use client";

import Link from "next/link";

import { AppRoutes } from "@/utils/router";
import MathTex from "@/components/ui/MathTex";

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
          {/* Approach Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Pendekatan Metodologi</h2>
            </div>
            <div className="about-card-content">
              <p className="about-text">
                Analisis dalam dashboard ini menggunakan pendekatan statistik spasial yang sistematis untuk memastikan hasil yang valid dan dapat
                diandalkan. Metodologi ini dirancang untuk mengidentifikasi pola geografis dan faktor risiko pneumonia balita secara akurat di
                119 kabupaten/kota di Pulau Jawa.
              </p>
            </div>
          </div>

          {/* GWNBR Model Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Model Analisis Utama: Geographically Weighted Negative Binomial Regression (GWNBR)</h2>
            </div>
            <div className="about-card-content">
              <ol className="about-list list-decimal pl-6">
                <li><strong>Overdispersi:</strong> Data jumlah kasus sering memiliki varians lebih besar dari rata-rata. GWNBR dirancang untuk kondisi ini, berbeda dengan Poisson standar.</li>
                <li><strong>Heterogenitas Spasial:</strong> Pengaruh faktor risiko dapat berbeda antarlokasi. GWNBR menghasilkan koefisien lokal untuk tiap kabupaten/kota.</li>
              </ol>
            </div>
          </div>

          {/* Mathematical Model Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Model Matematika GWNBR</h2>
            </div>
            <div className="about-card-content">
              <div className="about-dataset-card">
                <div className="methodology-formula-content" style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  margin: '12px 0'
                }}>
                  <MathTex tex={"Y_i \\sim \\text{NB}(\\mu_i, \\alpha(u_i, v_i))"} />
                  <MathTex tex={"\\ln(\\mu_i) = \\beta_0(u_i, v_i) + \\beta_1(u_i, v_i) X_{1i} + \\beta_2(u_i, v_i) X_{2i} + \\beta_3(u_i, v_i) X_{3i} + \\beta_4(u_i, v_i) X_{4i} + \\beta_5(u_i, v_i) X_{5i} + \\beta_6(u_i, v_i) X_{6i}"} />
                </div>
                <div className="about-dataset-card">
                  <table className="about-table">
                    <thead>
                      <tr>
                        <th>Simbol</th>
                        <th>Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-medium">Y<sub>i</sub></td>
                        <td>Jumlah kasus pneumonia balita di lokasi ke-i.</td>
                      </tr>
                      <tr>
                        <td className="font-medium">μ<sub>i</sub></td>
                        <td>Perkiraan rata-rata kasus pneumonia di lokasi ke-i.</td>
                      </tr>
                      <tr>
                        <td className="font-medium">α(u<sub>i</sub>, v<sub>i</sub>)</td>
                        <td>Parameter dispersi yang bervariasi secara lokal.</td>
                      </tr>
                      <tr>
                        <td className="font-medium">(u<sub>i</sub>, v<sub>i</sub>)</td>
                        <td>Koordinat geografis (lintang, bujur) dari lokasi ke-i.</td>
                      </tr>
                      <tr>
                        <td className="font-medium">β<sub>0</sub>(u<sub>i</sub>, v<sub>i</sub>)</td>
                        <td>Intersep yang spesifik lokasi.</td>
                      </tr>
                      <tr>
                        <td className="font-medium">β<sub>k</sub>(u<sub>i</sub>, v<sub>i</sub>)</td>
                        <td>Koefisien variabel prediktor ke-k yang spesifik lokasi.</td>
                      </tr>
                      <tr>
                        <td className="font-medium">X<sub>1i</sub>..X<sub>6i</sub></td>
                        <td>Nilai variabel-variabel prediktor di lokasi ke-i.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Steps Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Alur Analisis Data</h2>
            </div>
            <div className="about-card-content">
              <ol className="about-list list-decimal pl-6">
                <li><strong>Uji Dependensi Spasial:</strong> Indeks Moran&rsquo;s I untuk membuktikan adanya pola geografis (klaster) pada kasus pneumonia.</li>
                <li><strong>Pemeriksaan Multikolinearitas:</strong> Variance Inflation Factor (VIF) dengan batas VIF &lt; 10.</li>
                <li><strong>Pemodelan Global (Baseline):</strong> Regresi Binomial Negatif (NBR) sebagai model dasar dan uji signifikansi variabel secara umum.</li>
                <li><strong>Uji Heterogenitas Spasial:</strong> Uji Breusch-Pagan untuk mengonfirmasi ketidakseragaman pengaruh faktor antar lokasi.</li>
                <li><strong>Pemodelan Lokal (GWNBR):</strong> Menggunakan kernel <em>Adaptive Bisquare</em> dengan <em>bandwidth</em> optimum via Cross-Validation (CV).</li>
                <li><strong>Evaluasi & Interpretasi:</strong> Bandingkan kinerja menggunakan AIC dan interpretasikan koefisien lokal yang signifikan (uji-t).</li>
              </ol>
            </div>
          </div>

          {/* Variables Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Variabel Penelitian</h2>
            </div>
            <div className="about-card-content">
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
                    <td>[Variabel Independen] Proksi kondisi higienitas lingkungan.</td>
                    <td>Persentase</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Akses Sanitasi Layak (X6)</td>
                    <td>[Variabel Independen] Proksi kondisi higienitas lingkungan.</td>
                    <td>Persentase</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Software Tools Card */}
          <div className="about-main-card">
            <div className="about-card-header">
              <h2 className="about-card-title">Perangkat Lunak Analisis</h2>
            </div>
            <div className="about-card-content">
              <ul className="about-list">
                <li><strong>R Studio:</strong> Paket utama: GWmodel, spgwr, spdep, AER.</li>
                <li><strong>QGIS:</strong> Pengolahan data spasial.</li>
                <li><strong>Next.js & React:</strong> Pengembangan dashboard.</li>
                <li><strong>Leaflet:</strong> Peta interaktif.</li>
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