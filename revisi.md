# Panduan Revisi Dashboard GWNBR Pneumonia Balita

## Ringkasan Permintaan Revisi

Berdasarkan analisis proyek dashboard, berikut adalah panduan revisi untuk memperbaiki dashboard sesuai dengan kebutuhan interpretasi yang lebih sederhana dan fokus pada hasil analisis:

---

## 1. PERBAIKAN FORMAT ANGKA DAN SATUAN

### 1.1 Format Angka Indonesia
**Status:** ✅ Sudah benar (menggunakan `toLocaleString('id-ID')`)

**Lokasi yang perlu dipastikan konsisten:**
- `src/lib/utils/dataProcessing.ts` - sudah menggunakan format Indonesia
- `src/lib/utils/regionUtils.ts` - sudah menggunakan format Indonesia
- Semua komponen yang menampilkan angka

**Contoh format yang benar:**
- Ribuan: `1.593` (titik sebagai pemisah ribuan)
- Desimal: `15,7%` (koma sebagai pemisah desimal)

### 1.2 Perbaikan Satuan Data
**Masalah:** Beberapa variabel mungkin ditampilkan dalam format persentase padahal seharusnya angka absolut

**Yang perlu diperbaiki:**

#### File: `public/data/Hasil_Pengolahan.csv`
- **Angka Rokok (RokokPerkapita):** Pastikan dalam satuan batang/orang/tahun, bukan persentase
- **Gizi Kurang (GiziKurang):** Pastikan dalam jumlah kasus absolut, bukan persentase

#### Komponen yang perlu diperbarui:
1. **`src/components/prediction/PredictionCard.tsx`**
   - Hapus format persentase untuk variabel yang seharusnya absolut
   - Gunakan `formatNumber()` untuk angka absolut

2. **`src/components/cards/RegionalInsights.tsx`**
   - Periksa format tampilan data rokok dan gizi kurang
   - Pastikan konsistensi satuan

---

## 2. SEDERHANAKAN TAMPILAN - HAPUS METRIK TEKNIS

### 2.1 Metrik yang Harus Dihapus
**Fokus:** Dashboard untuk interpretasi hasil, bukan evaluasi model

**Hapus metrik berikut dari semua komponen:**
- RMSE (Root Mean Square Error)
- R-squared Global
- Akurasi Model (Accuracy)
- Standard Error (SE)
- Confidence Interval (CI)
- Residual
- Parameter Dispersi (θ)

### 2.2 File yang Perlu Dimodifikasi

#### `src/components/prediction/PredictionCard.tsx`
```typescript
// HAPUS bagian ini:
- accuracy calculation
- getQualityColor function
- getQualityBadge function
- residual display
- standard error display
- confidence interval display

// PERTAHANKAN:
- actualValue (Kasus Aktual)
- predictedValue (Prediksi Model)
- regionName
```

#### `src/components/prediction/EquationCard.tsx`
```typescript
// HAPUS:
- Parameter Dispersi (θ) display
- Z-statistik details (opsional, bisa disembunyikan)
- Model performance metrics

// PERTAHANKAN:
- Persamaan matematis
- Koefisien dan signifikansi
- Interpretasi variabel
```

#### `src/types/prediction.ts`
```typescript
// UPDATE interface untuk menghapus metrik teknis:
interface GWNBRPrediction {
  regionName: string;
  prediction: {
    actualValue: number;
    predictedValue: number;
    // HAPUS: residual, standardError, confidenceInterval
  };
  // HAPUS: localMetrics yang berisi RMSE, R-squared
}
```

---

## 3. IMPLEMENTASI TEMPLATE INTERPRETASI SEDERHANA

### 3.1 Template untuk Faktor Signifikan

#### File Baru: `src/lib/interpretation/templates.ts`
```typescript
export const getSignificantFactorInterpretation = (
  factorName: string,
  regionName: string,
  effect: 'positif' | 'negatif',
  percentChange: string
) => {
  const effectText = effect === 'positif' ? 'naik' : 'turun';
  const oppositeEffect = effect === 'positif' ? 'turun' : 'naik';
  
  return {
    title: factorName,
    pengaruh: effect === 'positif' ? 'Positif' : 'Negatif',
    artinya: `Di **${regionName}**, faktor ini **berpengaruh nyata** terhadap jumlah kasus pneumonia. Jika ${getFactorDescription(factorName)} **${effectText}**, maka perkiraan jumlah kasus pneumonia juga akan **${effectText}**.`,
    saranTindakan: getSuggestion(factorName, effect)
  };
};

const getFactorDescription = (factorName: string): string => {
  const descriptions = {
    'Konsumsi Rokok': 'tingkat konsumsi rokok',
    'Gizi Kurang': 'jumlah kasus gizi kurang',
    'IMD': 'praktik Inisiasi Menyusu Dini',
    'Sanitasi': 'kualitas sanitasi',
    'Air Minum': 'akses air minum layak',
    'Kepadatan Penduduk': 'kepadatan penduduk'
  };
  return descriptions[factorName] || factorName.toLowerCase();
};

const getSuggestion = (factorName: string, effect: 'positif' | 'negatif'): string => {
  const suggestions = {
    'Konsumsi Rokok': 'Mengurangi paparan asap rokok di level rumah tangga harus menjadi prioritas utama',
    'Gizi Kurang': 'Program perbaikan gizi balita perlu diperkuat dan diprioritaskan',
    'IMD': 'Promosi dan edukasi Inisiasi Menyusu Dini perlu ditingkatkan',
    'Sanitasi': 'Perbaikan infrastruktur sanitasi menjadi prioritas pembangunan',
    'Air Minum': 'Peningkatan akses air minum layak perlu dipercepat',
    'Kepadatan Penduduk': 'Penataan wilayah dan pelayanan kesehatan perlu disesuaikan dengan kepadatan'
  };
  return suggestions[factorName] || 'Perlu intervensi yang tepat sasaran';
};
```

### 3.2 Template untuk Faktor Tidak Signifikan

```typescript
export const getNonSignificantFactorInterpretation = (
  factorName: string,
  regionName: string
) => {
  return {
    title: factorName,
    artinya: `Di **${regionName}**, **tidak ditemukan bukti statistik yang kuat** bahwa faktor ini berhubungan langsung dengan jumlah kasus pneumonia dalam model analisis kami.`,
    kenapa: {
      alasan1: `Pengaruhnya **'kalah kuat'** oleh faktor lain yang lebih dominan (seperti gizi buruk atau paparan rokok).`,
      alasan2: `Data untuk faktor ini di wilayah tersebut **kurang beragam**, sehingga hubungannya sulit diukur.`
    }
  };
};
```

### 3.3 Update Komponen Interpretasi

#### `src/components/prediction/InterpretationCard.tsx`
```typescript
// GANTI interpretasi teknis dengan template sederhana
// HAPUS:
- Koefisien detail
- Z-value
- Statistical significance tests
- Technical jargon

// TAMBAH:
- Template interpretasi sederhana
- Bahasa yang mudah dipahami
- Fokus pada implikasi praktis
- Saran tindakan konkret
```

---

## 4. STRUKTUR FILE YANG PERLU DIMODIFIKASI

### 4.1 File Utama untuk Direvisi

1. **`src/components/prediction/PredictionCard.tsx`**
   - Hapus metrik teknis (RMSE, R-squared, accuracy)
   - Sederhanakan tampilan prediksi
   - Fokus pada nilai aktual vs prediksi

2. **`src/components/prediction/InterpretationCard.tsx`**
   - Implementasi template interpretasi sederhana
   - Hapus jargon teknis
   - Tambah bahasa yang mudah dipahami

3. **`src/components/prediction/EquationCard.tsx`**
   - Hapus parameter dispersi
   - Sederhanakan tampilan koefisien
   - Fokus pada signifikansi praktis

4. **`src/types/prediction.ts`**
   - Update interface untuk menghapus metrik teknis
   - Tambah tipe untuk interpretasi sederhana

5. **`src/lib/prediction/gwnbrModel.ts`**
   - Update fungsi untuk menggunakan template interpretasi
   - Hapus kalkulasi metrik teknis yang tidak diperlukan

### 4.2 File Baru yang Perlu Dibuat

1. **`src/lib/interpretation/templates.ts`**
   - Template interpretasi untuk faktor signifikan
   - Template interpretasi untuk faktor tidak signifikan
   - Fungsi helper untuk generate interpretasi

2. **`src/lib/interpretation/utils.ts`**
   - Utility functions untuk interpretasi
   - Mapping variabel ke deskripsi sederhana
   - Fungsi untuk generate saran tindakan

---

## 5. CHECKLIST IMPLEMENTASI

### Phase 1: Perbaikan Format dan Satuan
- [ ] Verifikasi format angka Indonesia di semua komponen
- [ ] Perbaiki satuan Angka Rokok (absolut, bukan persentase)
- [ ] Perbaiki satuan Gizi Kurang (absolut, bukan persentase)
- [ ] Test konsistensi format di seluruh dashboard

### Phase 2: Hapus Metrik Teknis
- [ ] Hapus RMSE, R-squared, Accuracy dari PredictionCard
- [ ] Hapus Standard Error dan Confidence Interval
- [ ] Hapus Parameter Dispersi dari EquationCard
- [ ] Update interface TypeScript
- [ ] Test tampilan yang sudah disederhanakan

### Phase 3: Implementasi Template Interpretasi
- [ ] Buat file template interpretasi
- [ ] Update InterpretationCard dengan template sederhana
- [ ] Implementasi interpretasi untuk faktor signifikan
- [ ] Implementasi interpretasi untuk faktor tidak signifikan
- [ ] Test interpretasi di berbagai region

### Phase 4: Testing dan Finalisasi
- [ ] Test keseluruhan dashboard
- [ ] Verifikasi konsistensi bahasa dan format
- [ ] Pastikan semua interpretasi mudah dipahami
- [ ] Review final dengan stakeholder

---

## 6. CONTOH IMPLEMENTASI

### Sebelum Revisi:
```
Akurasi: 87.5%
RMSE: 245.67
R-squared: 0.823
Koefisien Gizi Kurang: 0.000187 (Z: 1.92, p < 0.05)
```

### Setelah Revisi:
```
**Faktor: Gizi Kurang**
• Pengaruh: Positif
• Artinya: Di Kabupaten Brebes, gizi kurang terbukti nyata dapat menaikkan kasus pneumonia. Setiap kenaikan kasus gizi kurang, diperkirakan akan menaikkan jumlah kasus pneumonia.
• Saran Tindakan: Program perbaikan gizi balita harus menjadi prioritas utama di Brebes.
```

---

## 7. PRIORITAS IMPLEMENTASI

**Prioritas Tinggi:**
1. Perbaikan format angka dan satuan
2. Hapus metrik teknis dari tampilan utama

**Prioritas Sedang:**
3. Implementasi template interpretasi sederhana
4. Update komponen interpretasi

**Prioritas Rendah:**
5. Optimisasi performa
6. Enhancement UI/UX tambahan

---

**Catatan:** Fokus utama revisi adalah membuat dashboard lebih mudah dipahami oleh stakeholder non-teknis dengan menghilangkan jargon statistik dan fokus pada interpretasi praktis yang dapat ditindaklanjuti.