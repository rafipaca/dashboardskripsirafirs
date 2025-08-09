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
export function getSignificantFactorTemplate(factor: FactorInterpretation, regionName: string): string {
  const variableNames: Record<string, string> = {
    'giziKurang': 'Gizi Kurang',
    'imd': 'Inisiasi Menyusu Dini (IMD)',
    'rokokPerkapita': 'Konsumsi Rokok Per Kapita',
    'kepadatan': 'Kepadatan Penduduk',
    'airMinum': 'Akses Air Minum Layak',
    'sanitasi': 'Akses Sanitasi Layak'
  };

  const varName = variableNames[factor.variable] || factor.variable;
  const arahPengaruh = factor.effect === 'increase' ? 'Positif' : 'Negatif';
  const lebihTinggiRendah = factor.effect === 'increase' ? 'lebih tinggi' : 'lebih rendah';
  
  // Hitung persentase perubahan dari koefisien (exp(β) - 1) * 100
  const percentageChange = ((Math.exp(factor.coefficient) - 1) * 100).toFixed(1);
  
  let variableDescription = '';
  let implikasiPrioritas = '';
  
  if (factor.variable === 'giziKurang') {
    variableDescription = 'tingkat gizi kurang';
    implikasiPrioritas = 'perbaikan status gizi';
  } else if (factor.variable === 'imd') {
    variableDescription = 'praktik IMD';
    implikasiPrioritas = 'peningkatan praktik IMD';
  } else if (factor.variable === 'rokokPerkapita') {
    variableDescription = 'rata-rata konsumsi rokok per kapita';
    implikasiPrioritas = 'pengurangan paparan asap rokok di tingkat rumah tangga';
  } else if (factor.variable === 'kepadatan') {
    variableDescription = 'kepadatan penduduk';
    implikasiPrioritas = 'pengelolaan dampak kepadatan';
  } else if (factor.variable === 'airMinum') {
    variableDescription = 'akses air minum layak';
    implikasiPrioritas = 'peningkatan akses air minum layak';
  } else if (factor.variable === 'sanitasi') {
    variableDescription = 'akses sanitasi layak';
    implikasiPrioritas = 'peningkatan akses sanitasi';
  } else {
    variableDescription = factor.variable;
    implikasiPrioritas = `perbaikan ${factor.variable}`;
  }

  return `**${varName} - (Pengaruh Signifikan)**

• **Arah Pengaruh:** ${arahPengaruh}

• **Interpretasi:** Di ${regionName}, variabel ini menunjukkan asosiasi yang signifikan secara statistik dengan jumlah kasus pneumonia. Berdasarkan koefisien model lokal (β = ${factor.coefficient.toFixed(4)}), dapat diinterpretasikan bahwa, dengan asumsi faktor-faktor lain konstan (ceteris paribus), wilayah dengan ${variableDescription} yang ${lebihTinggiRendah} diperkirakan memiliki rata-rata jumlah kasus pneumonia sekitar ${percentageChange}% ${lebihTinggiRendah}.

• **Implikasi Prioritas:** Temuan ini mengindikasikan bahwa ${implikasiPrioritas} merupakan area intervensi prioritas untuk dipertimbangkan di wilayah ini.`;
}

/**
 * Template untuk faktor yang tidak berpengaruh signifikan
 */
export function getNonSignificantFactorTemplate(factor: FactorInterpretation, regionName: string): string {
  const variableNames: Record<string, string> = {
    'giziKurang': 'Gizi Kurang',
    'imd': 'Inisiasi Menyusu Dini (IMD)',
    'rokokPerkapita': 'Konsumsi Rokok Per Kapita',
    'kepadatan': 'Kepadatan Penduduk',
    'airMinum': 'Akses Air Minum Layak',
    'sanitasi': 'Akses Sanitasi Layak'
  };

  const varName = variableNames[factor.variable] || factor.variable;
  
  let topikVariabel = '';
  
  if (factor.variable === 'giziKurang') {
    topikVariabel = 'status gizi';
  } else if (factor.variable === 'imd') {
    topikVariabel = 'praktik IMD';
  } else if (factor.variable === 'rokokPerkapita') {
    topikVariabel = 'pengurangan paparan rokok';
  } else if (factor.variable === 'kepadatan') {
    topikVariabel = 'pengelolaan kepadatan penduduk';
  } else if (factor.variable === 'airMinum') {
    topikVariabel = 'akses air minum';
  } else if (factor.variable === 'sanitasi') {
    topikVariabel = 'akses sanitasi';
  } else {
    topikVariabel = factor.variable;
  }

  return `**${varName} - (Pengaruh Tidak Signifikan)**

• **Interpretasi:** Di ${regionName}, variabel ini tidak menunjukkan pengaruh yang signifikan secara statistik terhadap jumlah kasus pneumonia dalam model ini.

• **Penjelasan Kontekstual:** Meskipun secara teoretis ${topikVariabel} tetap penting untuk kesehatan anak, ketidaksignifikanannya di sini kemungkinan besar mengindikasikan dua hal: (1) dampaknya 'tertelan' atau didominasi oleh pengaruh yang lebih kuat dari faktor-faktor risiko lain yang signifikan di wilayah ini, atau (2) variabel ini tidak cukup bervariasi di wilayah ini untuk menunjukkan hubungan yang jelas.`;
}

/**
 * Membuat ringkasan interpretasi
 */
export function generateSummary(interpretation: SimpleInterpretation): string {
  const { regionName, significantFactors, dominantFactor } = interpretation;

  // Helper to get readable variable name
  const getVarName = (variable: string): string => {
    const names: Record<string, string> = {
      'giziKurang': 'Gizi Kurang',
      'imd': 'Inisiasi Menyusu Dini (IMD)',
      'rokokPerkapita': 'Konsumsi Rokok Per Kapita',
      'kepadatan': 'Kepadatan Penduduk',
      'airMinum': 'Akses Air Minum Layak',
      'sanitasi': 'Akses Sanitasi Layak'
    };
    return names[variable] || variable;
  };

  if (significantFactors.length === 0) {
    return `Ringkasan Diagnosis Spasial — Di ${regionName}, tidak ada faktor yang menunjukkan pengaruh signifikan terhadap kasus pneumonia balita dalam model ini. Pertimbangkan analisis tambahan atau sumber data lain untuk menelusuri faktor risiko lokal.`;
  }

  const risk = significantFactors.filter(f => f.effect === 'increase');
  const protective = significantFactors.filter(f => f.effect === 'decrease');

  let text = `Ringkasan Diagnosis Spasial — Di ${regionName}, terdapat ${significantFactors.length} faktor yang berpengaruh signifikan terhadap kasus pneumonia balita. `;

  if (dominantFactor) {
    const pct = ((Math.exp(dominantFactor.coefficient) - 1) * 100).toFixed(1);
    text += `Faktor dominan adalah ${getVarName(dominantFactor.variable)} yang ` +
            `${dominantFactor.effect === 'increase' ? 'meningkatkan' : 'menurunkan'} risiko (β = ${dominantFactor.coefficient.toFixed(4)}, ≈ ${pct}%). `;
  }

  if (risk.length > 0) {
    text += `Faktor risiko utama: ${risk.map(f => getVarName(f.variable)).join(', ')}. `;
  }

  if (protective.length > 0) {
    text += `Faktor protektif: ${protective.map(f => getVarName(f.variable)).join(', ')}.`;
  }

  return text.trim();
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