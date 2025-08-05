export interface Province {
  id: string;
  nama: string;
}

export interface Regency {
  id: string;
  province_id: string;
  name: string;
}

export type ProvinceDataMap = Record<string, string[]>;

// Function to normalize region names (e.g., "KABUPATEN PACITAN" -> "Pacitan")
function normalizeRegionName(name: string): string {
  // Strip "Kabupaten/Kota" and standardize to Title Case for matching with GeoJSON properties
  return name
    .replace(/^(KABUPATEN|KOTA)\s+/i, '')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function loadWilayahData(): Promise<ProvinceDataMap> {
  try {
    const [provincesRes, regenciesRes] = await Promise.all([
      fetch('https://raw.githubusercontent.com/ibnux/data-indonesia/master/provinsi.json'),
      fetch('https://raw.githubusercontent.com/yusufsyaifudin/wilayah-indonesia/master/data/list_of_area/regencies.json')
    ]);

    if (!provincesRes.ok || !regenciesRes.ok) {
      throw new Error('Failed to fetch wilayah data');
    }

    const allProvinces: Province[] = await provincesRes.json();
    const allRegencies: Regency[] = await regenciesRes.json();

    const allowedProvinceNames = new Set([
      'BANTEN',
      'DKI JAKARTA',
      'JAWA BARAT',
      'JAWA TENGAH',
      'DAERAH ISTIMEWA YOGYAKARTA',
      'JAWA TIMUR'
    ]);

    const filteredProvinces = allProvinces.filter(p => allowedProvinceNames.has(p.nama.toUpperCase()));

    const provinceMap = new Map(filteredProvinces.map(p => [p.id, p.nama]));
    const dataMap: ProvinceDataMap = {};

    // Initialize map with allowed provinces to maintain order
    for (const province of filteredProvinces) {
      dataMap[province.nama] = [];
    }

    // Populate regencies for the allowed provinces
    for (const regency of allRegencies) {
      const provinceName = provinceMap.get(regency.province_id);
      if (provinceName) { // This check ensures we only add regencies for our filtered provinces
        dataMap[provinceName].push(normalizeRegionName(regency.name));
      }
    }
    
    // Sort the keys (provinces) and the regencies within each province
    const sortedDataMap: ProvinceDataMap = {};
    Object.keys(dataMap).sort().forEach(key => {
        sortedDataMap[key] = dataMap[key].sort();
    });

    return sortedDataMap;
  } catch (error) {
    console.error("Error loading wilayah data:", error);
    return {};
  }
}
