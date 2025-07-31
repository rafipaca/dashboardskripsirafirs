"use client";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/utils/router";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navigation />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Metodologi</h1>
            <p className="text-muted-foreground">
              Metodologi yang digunakan dalam penelitian GWNBR untuk kasus pneumonia balita
            </p>
          </div>
          <Breadcrumbs />
        </div>
        
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-primary">
              Metodologi Penelitian
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Metodologi yang digunakan dalam penelitian ini berfokus pada penerapan model Geographically Weighted Negative Binomial Regression (GWNBR)
              untuk menganalisis pola spasial dari kasus pneumonia balita di Pulau Jawa.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="prose max-w-none pt-3">
            <h2 className="text-2xl font-bold mt-4 mb-3 text-foreground">Geographically Weighted Negative Binomial Regression (GWNBR)</h2>
            <p className="mb-3 text-foreground/90">
              GWNBR merupakan pengembangan dari model Negative Binomial Regression yang memperhitungkan heterogenitas spasial. 
              Model ini cocok digunakan untuk data cacah (count data) yang mengalami overdispersi, dimana varians data lebih besar dari mean.
            </p>
            
            <p className="mb-3 text-foreground/90">
              Pada model GWNBR, parameter regresi dapat bervariasi untuk setiap lokasi geografis, sehingga kita dapat melihat bagaimana 
              pengaruh variabel independen terhadap variabel dependen berbeda-beda di setiap lokasi.
            </p>

            <Card className="my-6 bg-accent border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-accent-foreground">Model Matematika GWNBR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-accent-foreground/90">
                  Model GWNBR dapat dinyatakan dalam bentuk:
                </p>
                <div className="py-2 px-4 bg-card rounded border font-mono text-sm text-foreground">
                  y<sub>i</sub> ~ NB(μ<sub>i</sub>, α)<br/>
                  ln(μ<sub>i</sub>) = β<sub>0</sub>(u<sub>i</sub>, v<sub>i</sub>) + Σ β<sub>k</sub>(u<sub>i</sub>, v<sub>i</sub>)x<sub>ik</sub>
                </div>
                <p className="mt-3 text-accent-foreground/90">
                  dimana:<br/>
                  y<sub>i</sub> = variabel dependen di lokasi ke-i<br/>
                  μ<sub>i</sub> = nilai ekspektasi dari y<sub>i</sub><br/>
                  α = parameter dispersi<br/>
                  (u<sub>i</sub>, v<sub>i</sub>) = koordinat lokasi ke-i<br/>
                  β<sub>0</sub>(u<sub>i</sub>, v<sub>i</sub>) = parameter intercept di lokasi ke-i<br/>
                  β<sub>k</sub>(u<sub>i</sub>, v<sub>i</sub>) = parameter regresi untuk variabel independen ke-k di lokasi ke-i<br/>
                  x<sub>ik</sub> = nilai variabel independen ke-k di lokasi ke-i
                </p>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">Tahapan Analisis</h2>
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/90">
              <li>
                <strong className="text-foreground">Eksplorasi Data:</strong> Melakukan eksplorasi data untuk memahami karakteristik variabel penelitian, termasuk pola spasial.
              </li>
              <li>
                <strong className="text-foreground">Pengujian Multikolinearitas:</strong> Menguji ada tidaknya korelasi yang tinggi antar variabel independen menggunakan VIF (Variance Inflation Factor).
              </li>
              <li>
                <strong className="text-foreground">Pemodelan Regresi Poisson:</strong> Melakukan pemodelan awal dengan regresi Poisson.
              </li>
              <li>
                <strong className="text-foreground">Pengujian Overdispersi:</strong> Menguji apakah terjadi overdispersi pada model Poisson.
              </li>
              <li>
                <strong className="text-foreground">Pemodelan Regresi Binomial Negatif:</strong> Jika terjadi overdispersi, dilakukan pemodelan dengan regresi Binomial Negatif.
              </li>
              <li>
                <strong className="text-foreground">Pengujian Dependensi Spasial:</strong> Menggunakan Indeks Moran's I untuk menguji dependensi spasial pada residual model.
              </li>
              <li>
                <strong className="text-foreground">Pemodelan GWNBR:</strong> Jika terdapat dependensi spasial, dilakukan pemodelan dengan GWNBR.
              </li>
              <li>
                <strong className="text-foreground">Pemilihan Fungsi Pembobot:</strong> Menggunakan fungsi kernel (Fixed, Adaptive) dengan pemilihan bandwidth optimal.
              </li>
              <li>
                <strong className="text-foreground">Pengujian Signifikansi Parameter:</strong> Menguji signifikansi parameter model GWNBR.
              </li>
              <li>
                <strong className="text-foreground">Interpretasi Model:</strong> Menginterpretasikan hasil model dan membuat visualisasi peta.
              </li>
            </ol>

            <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">Variabel Penelitian</h2>
            <p className="mb-3 text-foreground/90">
              Variabel yang digunakan dalam penelitian ini adalah:
            </p>
            
            <h3 className="text-xl font-bold mt-4 mb-2 text-foreground">Variabel Dependen</h3>
            <p className="mb-4 text-foreground/90">
              Jumlah kasus pneumonia balita di setiap kabupaten/kota di Pulau Jawa.
            </p>
            
            <h3 className="text-xl font-bold mt-4 mb-2 text-foreground">Variabel Independen</h3>
            <ul className="list-disc pl-6 mb-6 text-foreground/90">
              <li>Persentase rumah tangga dengan sanitasi layak (X1)</li>
              <li>Persentase rumah tangga dengan air bersih (X2)</li>
              <li>Kepadatan penduduk (X3)</li>
              <li>Jumlah balita (X4)</li>
            </ul>

            <Card className="mb-6 border bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">Sumber Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-foreground/90">
                  Data yang digunakan berasal dari:
                </p>
                <ul className="list-disc pl-6 mb-3 text-foreground/90">
                  <li>Kementerian Kesehatan Republik Indonesia (2022)</li>
                  <li>Badan Pusat Statistik (2022)</li>
                  <li>Data administratif kabupaten/kota di Pulau Jawa</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">Software</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-foreground/90">
                  Analisis statistik dilakukan menggunakan:
                </p>
                <ul className="list-disc pl-6 text-foreground/90">
                  <li>R Studio dengan paket spgwr, spdep, MASS, maptools</li>
                  <li>ArcGIS untuk pengolahan data spasial</li>
                  <li>QGIS untuk visualisasi peta</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href={AppRoutes.HOME}>Kembali ke Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
} 