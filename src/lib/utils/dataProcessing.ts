import { FeatureCollection } from "geojson";

export interface ProcessedData {
  totalCases: number;
  regions: Array<{
    id: string;
    name: string;
    cases: number;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  timeframes: Array<{
    period: string;
    cases: number;
  }>;
}

export class DataProcessor {
  static processGeojsonData(geojsonData: FeatureCollection): ProcessedData {
    const regions: ProcessedData['regions'] = [];
    let totalCases = 0;

    geojsonData.features.forEach((feature) => {
      const properties = feature.properties || {};
      const cases = Number(properties.cases) || 0;
      const regionName = String(properties.name || 'Unknown');
      const regionId = String(properties.id || regionName.toLowerCase());

      regions.push({
        id: regionId,
        name: regionName,
        cases,
        riskLevel: this.getRiskLevel(cases),
      });

      totalCases += cases;
    });

    return {
      totalCases,
      regions: regions.sort((a, b) => b.cases - a.cases),
      timeframes: this.generateTimeframes(),
    };
  }

  private static getRiskLevel(cases: number): 'low' | 'medium' | 'high' {
    if (cases < 25) return 'low';
    if (cases < 50) return 'medium';
    return 'high';
  }

  private static generateTimeframes(): Array<{ period: string; cases: number }> {
    return [
      { period: '1m', cases: Math.floor(Math.random() * 100) },
      { period: '3m', cases: Math.floor(Math.random() * 200) },
      { period: '6m', cases: Math.floor(Math.random() * 300) },
      { period: '1y', cases: Math.floor(Math.random() * 500) },
    ];
  }

  static formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(num);
  }

  static formatPercentage(num: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 4,
    }).format(num / 100);
  }
}
