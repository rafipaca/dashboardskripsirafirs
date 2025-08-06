/**
 * Template Interpretasi Sederhana untuk GWNBR
 * Menyediakan template interpretasi yang mudah dipahami tanpa istilah teknis
 */

export interface FactorInterpretation {
  variable: string;
  coefficient: number;
  significant: boolean;
  effect: 'increase' | 'decrease';
}

export interface SimpleInterpretation {
  regionName: string;
  significantFactors: FactorInterpretation[];
  nonSignificantFactors: FactorInterpretation[];
  dominantFactor?: FactorInterpretation;
  summary: string;
  recommendations: string[];
}

/**
 * Template untuk faktor yang berpengaruh signifikan
 */
export function getSignificantFactorTemplate(factor: FactorInterpretation): string {
  const variableNames: Record<string, string> = {
    'giziKurang': 'Gizi Kurang',
    'imd': 'Inisiasi Menyusu Dini (IMD)',
    'rokokPerkapita': 'Konsumsi Rokok Per Kapita',
    'kepadatan': 'Kepadatan Penduduk',
    'airMinum': 'Akses Air Minum Layak',
    'sanitasi': 'Akses Sanitasi Layak'
  };

  const varName = variableNames[factor.variable] || factor.variable;
  const effectText = factor.effect === 'increase' ? 'meningkatkan' : 'menurunkan';


  if (factor.variable === 'giziKurang') {
    return `Faktor **${varName}** berpengaruh signifikan terhadap kasus pneumonia di wilayah ini. Setiap peningkatan 1 kasus gizi kurang akan ${effectText} risiko pneumonia. Hal ini menunjukkan pentingnya program perbaikan gizi untuk mencegah pneumonia pada balita.`;
  }

  if (factor.variable === 'imd') {
    return `Faktor **${varName}** berpengaruh signifikan terhadap kasus pneumonia. Peningkatan praktik IMD akan ${effectText} risiko pneumonia pada balita. IMD membantu meningkatkan kekebalan tubuh bayi sehingga lebih tahan terhadap infeksi.`;
  }

  if (factor.variable === 'rokokPerkapita') {
    return `Faktor **${varName}** berpengaruh signifikan terhadap kasus pneumonia. Peningkatan konsumsi rokok di wilayah ini akan ${effectText} risiko pneumonia pada balita. Asap rokok dapat merusak sistem pernapasan dan menurunkan daya tahan tubuh anak.`;
  }

  if (factor.variable === 'kepadatan') {
    return `Faktor **${varName}** berpengaruh signifikan terhadap kasus pneumonia. Kepadatan penduduk yang tinggi akan ${effectText} risiko penularan pneumonia karena kontak antar individu yang lebih sering.`;
  }

  if (factor.variable === 'airMinum') {
    return `Faktor **${varName}** berpengaruh signifikan terhadap kasus pneumonia. Akses yang baik terhadap air minum layak akan ${effectText} risiko pneumonia karena mendukung kebersihan dan kesehatan keluarga.`;
  }

  if (factor.variable === 'sanitasi') {
    return `Faktor **${varName}** berpengaruh signifikan terhadap kasus pneumonia. Akses sanitasi yang baik akan ${effectText} risiko pneumonia dengan mencegah penyebaran bakteri dan virus penyebab infeksi.`;
  }

  return `Faktor **${varName}** berpengaruh signifikan dan akan ${effectText} risiko pneumonia di wilayah ini.`;
}

/**
 * Template untuk faktor yang tidak berpengaruh signifikan
 */
export function getNonSignificantFactorTemplate(factor: FactorInterpretation): string {
  const variableNames: Record<string, string> = {
    'giziKurang': 'Gizi Kurang',
    'imd': 'Inisiasi Menyusu Dini (IMD)',
    'rokokPerkapita': 'Konsumsi Rokok Per Kapita',
    'kepadatan': 'Kepadatan Penduduk',
    'airMinum': 'Akses Air Minum Layak',
    'sanitasi': 'Akses Sanitasi Layak'
  };

  const varName = variableNames[factor.variable] || factor.variable;

  if (factor.variable === 'giziKurang') {
    return `Faktor **${varName}** tidak menunjukkan pengaruh yang signifikan terhadap kasus pneumonia di wilayah ini. Meskipun demikian, perbaikan status gizi tetap penting untuk kesehatan balita secara keseluruhan.`;
  }

  if (factor.variable === 'imd') {
    return `Faktor **${varName}** tidak menunjukkan pengaruh yang signifikan terhadap kasus pneumonia di wilayah ini. Namun, praktik IMD tetap direkomendasikan untuk manfaat kesehatan lainnya.`;
  }

  if (factor.variable === 'rokokPerkapita') {
    return `Faktor **${varName}** tidak menunjukkan pengaruh yang signifikan terhadap kasus pneumonia di wilayah ini. Meski begitu, pengurangan konsumsi rokok tetap penting untuk kesehatan masyarakat.`;
  }

  if (factor.variable === 'kepadatan') {
    return `Faktor **${varName}** tidak menunjukkan pengaruh yang signifikan terhadap kasus pneumonia di wilayah ini. Kondisi kepadatan penduduk mungkin sudah dalam batas yang dapat dikelola dengan baik.`;
  }

  if (factor.variable === 'airMinum') {
    return `Faktor **${varName}** tidak menunjukkan pengaruh yang signifikan terhadap kasus pneumonia di wilayah ini. Hal ini mungkin menunjukkan bahwa akses air minum sudah cukup baik di wilayah ini.`;
  }

  if (factor.variable === 'sanitasi') {
    return `Faktor **${varName}** tidak menunjukkan pengaruh yang signifikan terhadap kasus pneumonia di wilayah ini. Kondisi sanitasi di wilayah ini mungkin sudah memadai.`;
  }

  return `Faktor **${varName}** tidak menunjukkan pengaruh yang signifikan terhadap kasus pneumonia di wilayah ini.`;
}

/**
 * Membuat ringkasan interpretasi
 */
export function generateSummary(interpretation: SimpleInterpretation): string {
  const { regionName, significantFactors, dominantFactor } = interpretation;
  const sigCount = significantFactors.length;
  
  if (sigCount === 0) {
    return `Berdasarkan analisis model GWNBR untuk wilayah ${regionName}, tidak ada faktor yang menunjukkan pengaruh signifikan terhadap kasus pneumonia. Hal ini menunjukkan bahwa faktor-faktor lain di luar model mungkin lebih berperan dalam menentukan kasus pneumonia di wilayah ini.`;
  }

  let summary = `Berdasarkan analisis model GWNBR untuk wilayah ${regionName}, terdapat ${sigCount} faktor yang berpengaruh signifikan terhadap kasus pneumonia.`;
  
  if (dominantFactor) {
    const varNames: Record<string, string> = {
      'giziKurang': 'Gizi Kurang',
      'imd': 'Inisiasi Menyusu Dini (IMD)',
      'rokokPerkapita': 'Konsumsi Rokok Per Kapita',
      'kepadatan': 'Kepadatan Penduduk',
      'airMinum': 'Akses Air Minum Layak',
      'sanitasi': 'Akses Sanitasi Layak'
    };
    
    const dominantName = varNames[dominantFactor.variable] || dominantFactor.variable;
    summary += ` Faktor yang paling dominan adalah ${dominantName}.`;
  }

  return summary;
}

/**
 * Membuat rekomendasi berdasarkan faktor signifikan
 */
export function generateRecommendations(interpretation: SimpleInterpretation): string[] {
  const recommendations: string[] = [];
  const { significantFactors } = interpretation;

  significantFactors.forEach(factor => {
    if (factor.variable === 'giziKurang' && factor.effect === 'increase') {
      recommendations.push('Perkuat program perbaikan gizi balita melalui posyandu dan puskesmas');
      recommendations.push('Tingkatkan edukasi gizi kepada ibu dan keluarga');
    }

    if (factor.variable === 'imd' && factor.effect === 'decrease') {
      recommendations.push('Tingkatkan sosialisasi dan praktik Inisiasi Menyusu Dini (IMD)');
      recommendations.push('Latih tenaga kesehatan untuk mendukung praktik IMD');
    }

    if (factor.variable === 'rokokPerkapita' && factor.effect === 'increase') {
      recommendations.push('Intensifkan kampanye anti-rokok dan bahayanya bagi kesehatan anak');
      recommendations.push('Terapkan kebijakan kawasan tanpa rokok yang lebih ketat');
    }

    if (factor.variable === 'kepadatan' && factor.effect === 'increase') {
      recommendations.push('Tingkatkan ventilasi dan sirkulasi udara di pemukiman padat');
      recommendations.push('Perkuat program deteksi dini dan isolasi kasus pneumonia');
    }

    if (factor.variable === 'airMinum' && factor.effect === 'decrease') {
      recommendations.push('Perbaiki akses dan kualitas air minum layak');
      recommendations.push('Edukasi masyarakat tentang pentingnya air bersih untuk kesehatan');
    }

    if (factor.variable === 'sanitasi' && factor.effect === 'decrease') {
      recommendations.push('Tingkatkan akses sanitasi layak di wilayah ini');
      recommendations.push('Edukasi masyarakat tentang praktik higienis dan sanitasi');
    }
  });

  // Rekomendasi umum
  recommendations.push('Perkuat sistem surveilans pneumonia untuk deteksi dini');
  recommendations.push('Tingkatkan kualitas pelayanan kesehatan anak di fasilitas kesehatan');

  return [...new Set(recommendations)]; // Remove duplicates
}