/**
 * Fungsi untuk memuat dan memproses data penelitian dari file CSV
 * Data penelitian mencakup hasil pengolahan dan koefisien GWNBR
 */

export interface ResearchDataPoint {
  No: number;
  NAMOBJ: string;
  Penemuan: number;
  JumlahBalita: number;
  NTL: number;
  AOD: number;
  PM10: number;
  CO: number;
  SO2: number;
  NO2: number;
  NDVI: number;
  NDWI: number;
  CurahHujanSum: number;
  Kemiskinan: number;
  Kepadatan: number;
  Sanitasi: number;
  AirMinum: number;
  GiziKurang: number;
  IMD: number;
  PuskesJml: number;
  RasioPuskesmas: number;
  RokokPerkapita: number;
  VitA: number;
  VitA_P: number;
  Latitude: number;
  Longitude: number;
  LatitudeOSM: number;
  LongitudeOSM: number;
  Imunisasi_P: number;
  BBLR_P: number;
  RLSPr: number;
  AirMinumLayak: number;
  VariabelSignifikan: string;
}

export interface GWNBRCoefficient {
  Region: string;
  Theta: number;
  Intercept: number;
  InterceptZ: number;
  GiziKurangKoef: number;
  GiziKurangZ: number;
  IMDKoef: number;
  IMDZ: number;
  RokokPerkapitaKoef: number;
  RokokPerkapitaZ: number;
  KepadatanKoef: number;
  KepadatanZ: number;
  AirMinumKoef: number;
  AirMinumZ: number;
  SanitasiKoef: number;
  SanitasiZ: number;
}

/**
 * Memuat data hasil pengolahan dari CSV
 */
export async function loadResearchData(): Promise<ResearchDataPoint[]> {
  try {
    const response = await fetch('/data/Hasil_Pengolahan.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const data: ResearchDataPoint[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        // Robust CSV parsing
        const values = line.split(',').map(val => {
          let cleaned = val.trim();
          // Remove surrounding quotes
          if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
            cleaned = cleaned.slice(1, -1);
          }
          return cleaned;
        });
        
        if (values.length < 33) {
          continue;
        }
        
        const dataPoint: ResearchDataPoint = {
          No: parseInt(values[0]) || 0,
          NAMOBJ: (values[1] || '').replace(/"/g, ''), // Remove quotes
          Penemuan: parseInt(values[2]) || 0,
          JumlahBalita: parseInt(values[3]) || 0,
          NTL: parseFloat(values[4]) || 0,
          AOD: parseFloat(values[5]) || 0,
          PM10: parseFloat(values[6]) || 0,
          CO: parseFloat(values[7]) || 0,
          SO2: parseFloat(values[8]) || 0,
          NO2: parseFloat(values[9]) || 0,
          NDVI: parseFloat(values[10]) || 0,
          NDWI: parseFloat(values[11]) || 0,
          CurahHujanSum: parseFloat(values[12]) || 0,
          Kemiskinan: parseFloat(values[13]) || 0,
          Kepadatan: parseFloat(values[14]) || 0,
          Sanitasi: parseFloat(values[15]) || 0,
          AirMinum: parseFloat(values[16]) || 0,
          GiziKurang: parseFloat(values[17]) || 0,
          IMD: parseFloat(values[18]) || 0,
          PuskesJml: parseInt(values[19]) || 0,
          RasioPuskesmas: parseFloat(values[20]) || 0,
          RokokPerkapita: parseFloat(values[21]) || 0,
          VitA: parseInt(values[22]) || 0,
          VitA_P: parseFloat(values[23]) || 0,
          Latitude: parseFloat(values[24]) || 0,
          Longitude: parseFloat(values[25]) || 0,
          LatitudeOSM: parseFloat(values[26]) || 0,
          LongitudeOSM: parseFloat(values[27]) || 0,
          Imunisasi_P: parseFloat(values[28]) || 0,
          BBLR_P: parseFloat(values[29]) || 0,
          RLSPr: parseFloat(values[30]) || 0,
          AirMinumLayak: parseFloat(values[31]) || 0,
          VariabelSignifikan: (values[32] || '').replace(/"/g, '')
        };
        
        data.push(dataPoint);
      }
    }
    
    console.log('=== CSV LOADING SUCCESS ===');
    console.log('Total data points loaded:', data.length);
    console.log('First 3 data points:', data.slice(0, 3).map(item => ({ NAMOBJ: item.NAMOBJ, Penemuan: item.Penemuan })));
    console.log('=== END CSV LOADING ===');
    
    return data;
  } catch (error) {
    console.error('Error loading research data:', error);
    return [];
  }
}

/**
 * Parse a CSV line handling quoted values properly
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      // Handle escaped quotes ("")
      if (nextChar === '"' && inQuotes) {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Memuat data koefisien GWNBR dari CSV
 */
export async function loadGWNBRCoefficients(): Promise<GWNBRCoefficient[]> {
  try {
    const response = await fetch('/data/KoefGWNBR_ZHitung.csv');
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const data: GWNBRCoefficient[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',');
        
        const coefficient: GWNBRCoefficient = {
          Region: values[0] || '',
          Theta: parseFloat(values[1]) || 0,
          Intercept: parseFloat(values[2]) || 0,
          InterceptZ: parseFloat(values[3]) || 0,
          GiziKurangKoef: parseFloat(values[4]) || 0,
          GiziKurangZ: parseFloat(values[5]) || 0,
          IMDKoef: parseFloat(values[6]) || 0,
          IMDZ: parseFloat(values[7]) || 0,
          RokokPerkapitaKoef: parseFloat(values[8]) || 0,
          RokokPerkapitaZ: parseFloat(values[9]) || 0,
          KepadatanKoef: parseFloat(values[10]) || 0,
          KepadatanZ: parseFloat(values[11]) || 0,
          AirMinumKoef: parseFloat(values[12]) || 0,
          AirMinumZ: parseFloat(values[13]) || 0,
          SanitasiKoef: parseFloat(values[14]) || 0,
          SanitasiZ: parseFloat(values[15]) || 0
        };
        
        data.push(coefficient);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error loading GWNBR coefficients:', error);
    return [];
  }
}

/**
 * Mengolah data penelitian untuk visualisasi dashboard
 */
export function processDataForDashboard(data: ResearchDataPoint[]) {
  // Mengurutkan berdasarkan jumlah kasus tertinggi
  const topRegions = data
    .sort((a, b) => b.Penemuan - a.Penemuan)
    .slice(0, 10)
    .map(item => ({
      name: item.NAMOBJ,
      value: item.Penemuan,
      kepadatan: item.Kepadatan,
      sanitasi: item.Sanitasi,
      airMinum: item.AirMinum
    }));

  // Statistik ringkasan berdasarkan data yang tersedia
  const totalCases = data.reduce((sum, item) => sum + item.Penemuan, 0);
  const avgCasesPerRegion = Math.round((totalCases / data.length) * 10) / 10;
  const highRiskAreas = data.filter(item => item.Penemuan > avgCasesPerRegion * 2).length;
  
  // Distribusi risiko berdasarkan jumlah kasus relatif terhadap rata-rata
  const threshold = avgCasesPerRegion;
  const riskDistribution = {
    high: data.filter(item => item.Penemuan > threshold * 3).length,
    mediumHigh: data.filter(item => item.Penemuan > threshold * 2 && item.Penemuan <= threshold * 3).length,
    medium: data.filter(item => item.Penemuan > threshold && item.Penemuan <= threshold * 2).length,
    low: data.filter(item => item.Penemuan <= threshold).length
  };

  return {
    topRegions,
    summaryStats: {
      totalCases,
      analyzedCases: data.length,
      avgCasesPerRegion,
      highRiskAreas,
      studyPeriod: "2019-2022"
    },
    riskDistribution
  };
}

/**
 * Menganalisis korelasi antar variabel
 */
export function analyzeCorrelations(data: ResearchDataPoint[]) {
  const correlations = {
    casesVsKepadatan: calculateCorrelation(
      data.map(d => d.Penemuan),
      data.map(d => d.Kepadatan)
    ),
    casesVsSanitasi: calculateCorrelation(
      data.map(d => d.Penemuan),
      data.map(d => d.Sanitasi)
    ),
    casesVsAirMinum: calculateCorrelation(
      data.map(d => d.Penemuan),
      data.map(d => d.AirMinum)
    ),
    casesVsGiziKurang: calculateCorrelation(
      data.map(d => d.Penemuan),
      data.map(d => d.GiziKurang)
    )
  };

  return correlations;
}

/**
 * Menghitung korelasi Pearson antara dua array
 */
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Mengidentifikasi wilayah dengan pola khusus
 */
export function identifyPatterns(data: ResearchDataPoint[]) {
  const patterns = {
    highCasesLowSanitasi: data.filter(d => d.Penemuan > 2000 && d.Sanitasi < 70),
    lowCasesHighSanitasi: data.filter(d => d.Penemuan < 1000 && d.Sanitasi > 90),
    urbanHighDensity: data.filter(d => d.Kepadatan > 5000),
    ruralLowDensity: data.filter(d => d.Kepadatan < 1000)
  };

  return patterns;
}