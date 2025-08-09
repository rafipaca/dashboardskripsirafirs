import { useCallback, useMemo } from 'react';
import { Feature } from 'geojson';
import { useResearchData } from './useResearchData';
import type { ResearchDataPoint, GWNBRCoefficient } from '@/lib/data/research-data';

const gray = '#B0B0B0';

/**
 * Custom hook to provide map-related data and styling functions.
 */

export const useMapData = () => {
  const { rawData: researchData, coefficients, loading, error } = useResearchData();

  const regionNames = useMemo(() => {
    if (!researchData) return [];
    const names = researchData.map(d => d.NAMOBJ).filter(Boolean);
    return [...new Set(names)].sort();
  }, [researchData]);

  // Helpers to normalize names and detect type
  const normalizeBase = (name: string) => name
    .toLowerCase()
    .replace(/kota\s+adm\.?/g, 'kota administrasi')
    .replace(/adm\.?\s+kep\.?/g, 'kepulauan seribu')
    .replace(/kab\.?/g, 'kabupaten')
    .replace(/[.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const detectType = (name: string): 'kota' | 'kabupaten' | 'kota administrasi' | undefined => {
    const n = name.toLowerCase();
    if (n.includes('kota administrasi') || n.includes('adm.') || n.includes('administrasi')) return 'kota administrasi';
    if (n.includes('kota')) return 'kota';
    if (n.includes('kabupaten') || n.includes('kab.')) return 'kabupaten';
    return undefined;
  };

  const findRegionData = useCallback(
    (regionName: string): ResearchDataPoint | undefined => {
      if (!researchData || !regionName) return undefined;
      
      // 1) Exact match first (case-insensitive)
      const exact = researchData.find((item) => item.NAMOBJ?.toLowerCase() === regionName.toLowerCase());
      if (exact) return exact;
      
      // 2) Base-name match with type preference
      const targetBase = normalizeBase(regionName);
      const targetType = detectType(regionName);
      const candidates = researchData.filter((item) => normalizeBase(item.NAMOBJ || '') === targetBase);
      if (candidates.length === 1) return candidates[0];
      if (candidates.length > 1 && targetType) {
        const typeFiltered = candidates.filter((c) => {
          const t = detectType(c.NAMOBJ || '');
          if (targetType === 'kota administrasi') return t === 'kota administrasi' || (t === 'kota' && (c.NAMOBJ || '').toLowerCase().includes('adm'));
          return t === targetType;
        });
        if (typeFiltered.length > 0) return typeFiltered[0];
      }
      
      // 3) Fallback to inclusive matching
      const nrm = targetBase;
      const loose = researchData.find((item) => {
        const base = normalizeBase(item.NAMOBJ || '');
        return base.includes(nrm) || nrm.includes(base);
      });
      return loose;
    },
    [researchData]
  );

  const getSignificanceColor = useCallback((feature: Feature): string => {
    const regionName = feature?.properties?.NAMOBJ || feature?.properties?.WADMKK || "";
    const regionData = findRegionData(regionName);
    if (!regionData) return gray;
    
    const significantVars = regionData.VariabelSignifikan;
    if (!significantVars) return gray;
    const codes = new Set(significantVars.replace(/"/g, '').split(',').map((code: string) => code.trim()));

    const has = (v: string) => codes.has(v);

    if (has('X1') && has('X3') && has('X4') && codes.size === 3) return '#b91c1c'; // Dark Red
    if (has('X1') && has('X4') && codes.size === 2) return '#581c87'; // Dark Purple
    if (has('X3') && has('X4') && codes.size === 2) return '#166534'; // Green
    if (has('X1') && codes.size === 1) return '#facc15'; // Yellow
    if (has('X3') && codes.size === 1) return '#2563eb'; // Blue
    if (has('X4') && codes.size === 1) return '#9333ea'; // Purple
    
    return gray;
  }, [findRegionData]);

  const variableThresholds = useMemo(() => ({
    Penemuan: { medium: 2425, high: 6212 },
    GiziKurang: { medium: 2068, high: 4933 },
    IMD: { medium: 44.3, high: 81.6 },
    RokokPerkapita: { medium: 12.067, high: 15.538 },
    Kepadatan: { medium: 4619, high: 12332 },
    AirMinumLayak: { medium: 87.560, high: 95.940 },
    Sanitasi: { medium: 66.7, high: 86.36 },
  }), []);

  const getChoroplethColor = useCallback((value: number, layer: string): string => {
    const thresholds = variableThresholds[layer as keyof typeof variableThresholds];
    if (!thresholds || isNaN(value) || value === null) return gray;

    if (value <= thresholds.medium) return '#fef08a'; // Low
    if (value <= thresholds.high) return '#f97316'; // Medium
    return '#b91c1c'; // High
  }, [variableThresholds]);

  const getFeatureStyle = useCallback(
    (feature: Feature, activeLayer: string) => {
      const regionName = feature?.properties?.NAMOBJ || feature?.properties?.WADMKK || "";
      const regionData = findRegionData(regionName);

      let fillColor = gray;

      if (regionData && researchData) {
        if (activeLayer === 'significance') {
          fillColor = getSignificanceColor(feature);
        } else {
          const value = parseFloat(regionData[activeLayer as keyof ResearchDataPoint] as string);
          fillColor = getChoroplethColor(value, activeLayer);
        }
      }

      return {
        fillColor,
        color: 'rgba(15, 20, 25, 0.2)',
        weight: 1.5,
        fillOpacity: 0.75,
      };
    },
    [researchData, findRegionData, getSignificanceColor, getChoroplethColor]
  );

  const generateTooltipContent = useCallback(
    (feature: Feature): string => {
      const regionName = feature?.properties?.NAMOBJ || feature?.properties?.WADMKK || "Unknown Region";
      const regionData = findRegionData(regionName);

      if (loading) return 'Memuat data...';
      if (error) return `Error: ${error}`;
      if (!regionData) return `${regionName}<br>Data tidak ditemukan.`;

  const regionNameFromFeature = regionData.NAMOBJ || 'N/A';
  const formatValue = (value: unknown) => (value !== undefined && value !== null && typeof value === 'number') ? value.toLocaleString() : 'N/A';
  const formatInt = (value: unknown) => (value !== undefined && value !== null && typeof value === 'number') ? Math.round(value).toLocaleString() : 'N/A';

      // Map X-codes to descriptive labels for display
      const variableNameMap: Record<string, string> = {
        X1: 'Gizi Kurang',
        X2: 'IMD',
        X3: 'Rokok per Kapita',
        X4: 'Kepadatan Penduduk',
        X5: 'Air Minum Layak',
        X6: 'Sanitasi',
      };

      const formattedVars = (regionData.VariabelSignifikan || '')
        .toString()
        .replace(/"/g, '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(code => variableNameMap[code] || code)
        .join(', ');

      return `
        <div style="font-family: Arial, sans-serif; font-size: 14px; min-width: 250px;">
          <strong style="font-size: 16px; color: #333;">${regionNameFromFeature}</strong>
          <hr style="margin: 4px 0;"/>
          <p><strong>Kasus Pneumonia:</strong> ${formatValue(regionData.Penemuan)}</p>
          <p><strong>Gizi Kurang:</strong> ${formatInt(regionData.GiziKurang)}</p>
          <p><strong>IMD:</strong> ${formatValue(regionData.IMD)}%</p>
          <p><strong>Perokok/Kapita:</strong> ${formatValue(regionData.RokokPerkapita)}</p>
          <p><strong>Kepadatan Penduduk:</strong> ${formatValue(regionData.Kepadatan)} jiwa/km²</p>
          <p><strong>Sanitasi Layak:</strong> ${formatValue(regionData.Sanitasi)}%</p>
          <p><strong>Air Minum Layak:</strong> ${formatValue(regionData.AirMinumLayak)}%</p>
          <hr style="margin: 4px 0;"/>
          <strong style="color: #b91c1c;">Variabel Signifikan:</strong>
          <p>${formattedVars || 'Tidak ada'}</p>
        </div>
      `;
    },
    [findRegionData, loading, error]
  );

  const generateModelEquation = useCallback(
    (regionName: string): string => {
      if (!coefficients || !regionName) return 'Pilih wilayah untuk melihat model.';

      const normalizedRegionName = regionName.replace(/^KABUPATEN\s/i, '').toLowerCase();
      const regionCoeffs = coefficients.find(
        (c: GWNBRCoefficient) => c.Region?.toLowerCase().includes(normalizedRegionName)
      );

      if (!regionCoeffs) return `Model untuk ${regionName} tidak ditemukan.`;

  const formatCoeff = (val: number) => (val >= 0 ? `+ ${val.toFixed(7)}` : `- ${Math.abs(val).toFixed(7)}`);

  let equation = `Y = ${regionCoeffs.Intercept.toFixed(7)} `;
      if (Math.abs(regionCoeffs.GiziKurangZ) > 1.96) equation += `${formatCoeff(regionCoeffs.GiziKurangKoef)}*X1 `;
      if (Math.abs(regionCoeffs.IMDZ) > 1.96) equation += `${formatCoeff(regionCoeffs.IMDKoef)}*X2 `;
      if (Math.abs(regionCoeffs.RokokPerkapitaZ) > 1.96) equation += `${formatCoeff(regionCoeffs.RokokPerkapitaKoef)}*X3 `;
      if (Math.abs(regionCoeffs.KepadatanZ) > 1.96) equation += `${formatCoeff(regionCoeffs.KepadatanKoef)}*X4 `;
      if (Math.abs(regionCoeffs.AirMinumZ) > 1.96) equation += `${formatCoeff(regionCoeffs.AirMinumKoef)}*X5 `;
      if (Math.abs(regionCoeffs.SanitasiZ) > 1.96) equation += `${formatCoeff(regionCoeffs.SanitasiKoef)}*X6 `;

      return equation.trim();
    },
    [coefficients]
  );

  return { 
    loading,
    error,
    regionNames,
    getFeatureStyle,
    generateTooltipContent,
  generateModelEquation,
  findRegionData,
  // Invalidate map styles when data becomes ready or when dataset size changes
  styleVersion: useMemo(() => (loading ? 0 : (researchData?.length || 0)), [loading, researchData]),
  };
};
