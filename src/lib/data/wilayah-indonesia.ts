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

function toTitleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

// Build display name to align with CSV NAMOBJ and user rules
// - Kabupaten: drop the prefix (e.g., "Kabupaten Malang" -> "Malang")
// - Kota: keep prefix (e.g., "Kota Malang")
// - DKI admin cities: "Kota Adm. Jakarta Pusat/Utara/Barat/Selatan/Timur"
// - Kepulauan Seribu: "Adm. Kep. Seribu"
function formatDisplayName(raw: string, provinceName?: string): string {
  const name = raw.trim();
  const lower = name.toLowerCase();

  // Special case: Kepulauan Seribu
  if (lower.includes('kepulauan seribu')) return 'Adm. Kep. Seribu';

  // DKI Jakarta special handling: enforce Kota Adm. Jakarta <Arah>
  const isDKI = (provinceName || '').toUpperCase() === 'DKI JAKARTA';
  if (isDKI) {
    // Normalize forms like 'Kota Jakarta Barat', 'Kota Administrasi Jakarta Barat', etc.
    if (lower.startsWith('kota')) {
      let rest = name
        .replace(/^kota\s+adm(inistrasi)?\.?\s*/i, '')
        .replace(/^kota\s+/i, '')
        .trim();
      // Remove leading 'Jakarta' from rest if present
      rest = rest.replace(/^jakarta\s+/i, '').trim();
      // If nothing left (edge), fall back to original name
      if (!rest) return 'Kota Adm. Jakarta';
      return `Kota Adm. Jakarta ${toTitleCase(rest)}`;
    }
  }

  // DKI admin cities
  if (lower.startsWith('kota administrasi ') || lower.startsWith('kota adm') || lower.startsWith('kota adm.')) {
    const rest = name.replace(/kota\s+adm(inistrasi)?\.?\s*/i, '').trim();
    return `Kota Adm. ${toTitleCase(rest)}`;
  }

  // Regular cities
  if (lower.startsWith('kota ')) {
    const rest = name.replace(/^kota\s+/i, '').trim();
    return `Kota ${toTitleCase(rest)}`;
  }

  // Kabupaten: drop prefix entirely
  if (lower.startsWith('kabupaten ') || lower.startsWith('kab. ')) {
    const rest = name.replace(/^(kabupaten|kab\.)\s+/i, '').trim();
    return toTitleCase(rest);
  }

  // Default: title case
  return toTitleCase(name);
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
    const displayName = formatDisplayName(regency.name, provinceName);
    dataMap[provinceName].push(displayName);
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
