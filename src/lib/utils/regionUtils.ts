/**
 * Utility functions untuk mapping dan manipulasi data wilayah
 * Mengurangi duplikasi logika mapping provinsi
 */

/**
 * Fungsi untuk menentukan provinsi berdasarkan nama wilayah
 * @param name - Nama wilayah/kabupaten/kota
 * @returns Nama provinsi yang sesuai
 */
export const getProvinceFromName = (name: string): string => {
  if (name.includes('Jakarta') || name.includes('Adm.')) return 'DKI Jakarta';
  if (name.includes('Tangerang') || name.includes('Serang') || name.includes('Lebak') || name.includes('Pandeglang')) return 'Banten';
  if (name.includes('Bandung') || name.includes('Bekasi') || name.includes('Bogor') || name.includes('Ciamis')) return 'Jawa Barat';
  if (name.includes('Semarang') || name.includes('Solo') || name.includes('Surakarta')) return 'Jawa Tengah';
  if (name.includes('Surabaya') || name.includes('Malang') || name.includes('Kediri')) return 'Jawa Timur';
  if (name.includes('Yogya') || name.includes('Jogja')) return 'DI Yogyakarta';
  return 'Lainnya';
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