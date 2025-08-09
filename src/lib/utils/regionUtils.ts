/**
 * Utility functions untuk mapping dan manipulasi data wilayah
 * Mengurangi duplikasi logika mapping provinsi
 */

/**
 * Daftar provinsi Pulau Jawa (whitelist) untuk perhitungan yang konsisten
 */
export const JAVA_PROVINCES_WHITELIST = [
  'Banten',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
] as const;

/**
 * Fungsi untuk menentukan provinsi berdasarkan nama wilayah
 * Catatan: Heuristik diperluas agar lebih robust dan case-insensitive.
 * @param name - Nama wilayah/kabupaten/kota
 * @returns Nama provinsi yang sesuai atau 'Lainnya' bila tidak dikenali
 */
export const getProvinceFromName = (name: string): string => {
  if (!name) return 'Lainnya';
  const n = name.toLowerCase();

  // DKI Jakarta (termasuk Kepulauan Seribu dan format Adm.)
  if (n.includes('jakarta') || n.includes('adm.') || n.includes('kep. seribu') || n.includes('kepulauan seribu') || n.includes('seribu')) {
    return 'DKI Jakarta';
  }

  // Banten
  if (n.includes('tangerang') || n.includes('serang') || n.includes('lebak') || n.includes('pandeglang')) {
    return 'Banten';
  }

  // Jawa Barat (cakupan kota/kab umum)
  if (
    n.includes('bandung') || n.includes('bekasi') || n.includes('bogor') || n.includes('ciamis') ||
    n.includes('cirebon') || n.includes('sumedang') || n.includes('kuningan') || n.includes('majalengka') ||
    n.includes('subang') || n.includes('purwakarta') || n.includes('karawang') || n.includes('indramayu') ||
    n.includes('tasikmalaya') || n.includes('garut') || n.includes('sukabumi') || n.includes('cianjur') ||
    n.includes('cimahi') || n.includes('banjar') || n.includes('depok')
  ) {
    return 'Jawa Barat';
  }

  // Jawa Tengah (cakupan lebih luas)
  if (
    n.includes('semarang') || n.includes('surakarta') || n.includes('solo') || n.includes('salatiga') ||
    n.includes('magelang') || n.includes('kudus') || n.includes('jepara') || n.includes('demak') ||
    n.includes('kendal') || n.includes('batang') || n.includes('pekalongan') || n.includes('pemalang') ||
    n.includes('tegal') || n.includes('brebes') || n.includes('cilacap') || n.includes('banyumas') ||
    n.includes('purbalingga') || n.includes('banjarnegara') || n.includes('kebumen') || n.includes('purworejo') ||
    n.includes('wonosobo') || n.includes('temanggung') || n.includes('boyolali') || n.includes('klaten') ||
    n.includes('sukoharjo') || n.includes('wonogiri') || n.includes('karanganyar') || n.includes('sragen') ||
    n.includes('grobogan') || n.includes('blora') || n.includes('rembang') || n.includes('pati')
  ) {
    return 'Jawa Tengah';
  }

  // Jawa Timur (cakupan lebih luas)
  if (
    n.includes('surabaya') || n.includes('malang') || n.includes('kediri') || n.includes('sidoarjo') ||
    n.includes('pasuruan') || n.includes('jombang') || n.includes('lamongan') || n.includes('jember') ||
    n.includes('probolinggo') || n.includes('banyuwangi') || n.includes('situbondo') || n.includes('bondowoso') ||
    n.includes('lumajang') || n.includes('tulungagung') || n.includes('trenggalek') || n.includes('ponorogo') ||
    n.includes('pacitan') || n.includes('madiun') || n.includes('ngawi') || n.includes('magetan') ||
    n.includes('gresik') || n.includes('mojokerto') || n.includes('blitar') || n.includes('batu')
  ) {
    return 'Jawa Timur';
  }

  // DI Yogyakarta (termasuk kabupaten di DIY)
  if (
    n.includes('yogyakarta') || n.includes('sleman') || n.includes('bantul') ||
    n.includes('gunungkidul') || n.includes('kulon progo')
  ) {
    return 'DI Yogyakarta';
  }

  return 'Lainnya';
};

/**
 * Hitung jumlah provinsi Pulau Jawa yang muncul dalam rawData.
 * Mengabaikan label 'Lainnya' dan memfilter ke whitelist Pulau Jawa.
 */
export const countJavaProvincesFromRawData = (rawData: Array<{ NAMOBJ: string }>): number => {
  const provinces = new Set<string>();
  for (const item of rawData || []) {
    const p = getProvinceFromName(item?.NAMOBJ ?? '');
  if (JAVA_PROVINCES_WHITELIST.includes(p as typeof JAVA_PROVINCES_WHITELIST[number])) provinces.add(p);
  }
  return provinces.size;
};

/**
 * Fungsi untuk menentukan level risiko berdasarkan jumlah kasus
 * @param cases - Jumlah kasus
 * @param average - Rata-rata kasus
 * @returns Level risiko
 */
export const getRiskLevel = (cases: number, average: number): 'High' | 'Medium' | 'Low' => {
  if (cases > average * 2) return 'High';
  if (cases > average) return 'Medium';
  return 'Low';
};

/**
 * Fungsi untuk memformat angka dengan pemisah ribuan
 * @param value - Nilai numerik
 * @returns String yang diformat
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('id-ID');
};