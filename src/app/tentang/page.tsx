"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Navigation from "@/components/Navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppRoutes } from "@/utils/router";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navigation />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tentang</h1>
            <p className="text-muted-foreground">
              Informasi mengenai latar belakang dan tujuan penelitian
            </p>
          </div>
          <Breadcrumbs />
        </div>
        
        {/* About Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Latar Belakang</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pneumonia merupakan salah satu penyakit infeksi saluran pernapasan akut yang menjadi penyebab utama kematian balita di Indonesia. 
                Faktor risiko pneumonia balita tidak hanya dipengaruhi oleh karakteristik individu tetapi juga dipengaruhi oleh faktor lingkungan 
                dan geografis. Oleh karena itu, diperlukan analisis spasial untuk mengidentifikasi pola penyebaran pneumonia balita dan 
                faktor-faktor yang mempengaruhinya di Pulau Jawa.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tujuan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Dashboard ini dikembangkan dengan tujuan:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Mengidentifikasi pola spasial kasus pneumonia balita di Pulau Jawa</li>
                <li>Mengetahui faktor-faktor yang mempengaruhi kejadian pneumonia balita secara spasial</li>
                <li>Menyediakan visualisasi interaktif untuk memudahkan pemahaman terhadap hasil analisis</li>
                <li>Membantu pengambilan keputusan dalam upaya pencegahan dan pengendalian pneumonia balita</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dataset</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Data yang digunakan dalam analisis ini mencakup jumlah kasus pneumonia balita di seluruh kabupaten/kota di Pulau Jawa 
                periode tahun 2022-2023. Data diperoleh dari berbagai sumber resmi seperti Kementerian Kesehatan Republik Indonesia, 
                Dinas Kesehatan Provinsi, dan Badan Pusat Statistik.
              </p>
              <Card className="bg-muted/50 border">
                <CardHeader>
                  <CardTitle className="text-base">Variabel yang Digunakan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variabel</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Sumber</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Kasus Pneumonia</TableCell>
                        <TableCell>Jumlah kasus pneumonia balita per kabupaten/kota</TableCell>
                        <TableCell>Kemenkes RI</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Kepadatan Penduduk</TableCell>
                        <TableCell>Jumlah penduduk per km²</TableCell>
                        <TableCell>BPS</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Persentase Rumah Sehat</TableCell>
                        <TableCell>Persentase rumah yang memenuhi syarat kesehatan</TableCell>
                        <TableCell>Kemenkes RI</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Persentase BBLR</TableCell>
                        <TableCell>Persentase bayi dengan berat lahir rendah</TableCell>
                        <TableCell>Kemenkes RI</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-center mb-6">Tim Peneliti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="flex flex-col items-center p-6 text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/Rap7.jpg" alt="Rafirs" className="object-cover" />
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <h3 className="font-medium">Rafirs</h3>
                <p className="text-muted-foreground text-sm">Mahasiswa Program Studi Statistika</p>
                <p className="text-muted-foreground text-sm">Sekolah Tinggi Ilmu Statistik</p>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/War001.jpg" alt="Bapak Waris" className="object-cover" />
                  <AvatarFallback>BW</AvatarFallback>
                </Avatar>
                <h3 className="font-medium">Bapak Waris</h3>
                <p className="text-muted-foreground text-sm">Dosen Pembimbing</p>
                <p className="text-muted-foreground text-sm">Sekolah Tinggi Ilmu Statistik</p>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-center pt-6">
            <Button asChild>
              <Link href={AppRoutes.HOME}>Kembali ke Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 