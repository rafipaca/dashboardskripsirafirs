/**
 * EquationCard Component
 * Menampilkan persamaan matematika GWNBR untuk region yang dipilih
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { 
  Calculator, 
  Copy, 
  Download,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { EquationDisplay } from '@/types/prediction';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { MathTex } from '@/components/ui/MathTex';

interface EquationCardProps {
  equation: EquationDisplay;
  className?: string;
}

export function EquationCard({ equation, className }: EquationCardProps) {

  
  const { regionName, coefficients, theta, equation: equationString } = equation;
  
  // Build TeX equation from the original equation string with significance indicators on X variables

  const equationTeX = React.useMemo(() => {
    // Map variable names to their significance
    const significanceMap: Record<string, boolean> = {
      'GiziKurang': coefficients.giziKurang?.significant || false,
      'IMD': coefficients.imd?.significant || false,
      'Rokok': coefficients.rokokPerkapita?.significant || false,
      'Kepadatan': coefficients.kepadatan?.significant || false,
      'AirMinum': coefficients.airMinum?.significant || false,
      'Sanitasi': coefficients.sanitasi?.significant || false,
    };

    const mapping = [
      { idx: 1, pattern: 'GiziKurang', label: 'Gizi Kurang', significant: significanceMap['GiziKurang'] },
      { idx: 2, pattern: 'IMD', label: 'IMD', significant: significanceMap['IMD'] },
      { idx: 3, pattern: 'Rokok', label: 'Rokok Per Kapita', significant: significanceMap['Rokok'] },
      { idx: 4, pattern: 'Kepadatan', label: 'Kepadatan Penduduk', significant: significanceMap['Kepadatan'] },
      { idx: 5, pattern: 'AirMinum', label: 'Air Minum Layak', significant: significanceMap['AirMinum'] },
      { idx: 6, pattern: 'Sanitasi', label: 'Sanitasi Layak', significant: significanceMap['Sanitasi'] },
    ];

    let processedEquation = equationString
      // Normalize ln(mu) variants to KaTeX form
      .replace(/ln\s*\((μ|µ|mu)\)/gi, '\\ln(\\mu)')
      .replace(/×/g, '\\cdot ');

    // Map variable names to X_i notation with exponent for significant variables
    let toXi = processedEquation;
    mapping.forEach(m => {
      const pattern = new RegExp(m.pattern, 'g');
      const replacement = m.significant ? `X_{${m.idx}}^{\\ast}` : `X_{${m.idx}}`;
      toXi = toXi.replace(pattern, replacement);
    });

    return toXi;
  }, [equationString, coefficients]);
  
  // Copy equation to clipboard
  const copyEquation = async () => {
    try {
      await navigator.clipboard.writeText(equationString);
      toast.success('Persamaan berhasil disalin!');
    } catch {
      toast.error('Gagal menyalin persamaan');
    }
  };
  
  // Export equation as text
  const exportEquation = () => {
    const content = `Persamaan GWNBR - ${regionName}\n\n${equationString}\n\nKoefisien:\n${Object.entries(coefficients).map(([key, coef]) => 
      `${key}: ${coef.value.toFixed(7)} (Z: ${coef.zValue.toFixed(3)}, Signifikan: ${coef.significant ? 'Ya' : 'Tidak'})`
    ).join('\n')}\n\nTheta (θ): ${theta.toFixed(4)}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equation_${regionName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Persamaan berhasil diunduh!');
  };
  
  const variableLabels: Record<string, string> = {
    intercept: 'Intercept (β₀)',
    giziKurang: 'Gizi Kurang (β₁)',
    imd: 'IMD (β₂)',
    rokokPerkapita: 'Rokok Per Kapita (β₃)',
    kepadatan: 'Kepadatan Penduduk (β₄)',
    airMinum: 'Air Minum Layak (β₅)',
    sanitasi: 'Sanitasi Layak (β₆)'
  };
  
  // Count significant coefficients excluding intercept (intercept is not a variable)
  const significantCount = Object.entries(coefficients)
    .filter(([key, coef]) => key !== 'intercept' && coef.significant).length;
  const totalVariables = Object.keys(coefficients).filter(k => k !== 'intercept').length;
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Persamaan GWNBR - {regionName}</span>
          </CardTitle>
          <Badge variant="outline">
            {significantCount}/{totalVariables} Variabel Signifikan
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Equation Display using KaTeX */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <div className="flex flex-col items-center justify-center">
            {/* Render inline to keep one line and allow horizontal scrolling */}
            <div className="max-w-full overflow-x-auto">
              <MathTex inline className="inline-block min-w-max whitespace-nowrap text-sm sm:text-base" tex={equationTeX} />
            </div>
            {/* Legend mapping X_i to variable names - more compact */}
            <div className="mt-2 flex flex-wrap gap-1 justify-center text-xs text-gray-600">
              {[
                { idx: 1, label: 'Gizi Kurang' },
                { idx: 2, label: 'IMD' },
                { idx: 3, label: 'Rokok Per Kapita' },
                { idx: 4, label: 'Kepadatan Penduduk' },
                { idx: 5, label: 'Air Minum Layak' },
                { idx: 6, label: 'Sanitasi Layak' },
              ].map(({ idx, label }) => {
                const formattedLabel = label.replace(/ /g, '~');
                return (
                  <span key={idx} className="px-1.5 py-0.5 rounded border bg-white text-xs">
                    <MathTex tex={`X_{${idx}} = \\text{${formattedLabel}}`} />
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coefficients Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Koefisien Model</div>
          {Object.entries(coefficients).map(([key, coef]) => (
            <div 
              key={key} 
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border',
                coef.significant ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              )}
            >
              <div className="flex items-center space-x-3">
                {coef.significant ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <div className="font-medium text-sm">
                    {variableLabels[key] || key}
                  </div>
                  <div className="text-xs text-gray-500">
                    {coef.significant ? 'Berpengaruh Signifikan' : 'Tidak Berpengaruh Signifikan'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  'font-mono text-lg',
                  coef.significant ? 'text-green-700' : 'text-gray-500'
                )}>
                  {coef.value.toFixed(7)}
                </div>
                <div className="text-xs text-gray-500">
                  {coef.value > 0 ? 'Meningkatkan' : 'Menurunkan'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Model Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Model Information */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Model GWNBR</span>
            </div>
            <div className="text-xs text-blue-600">
              {significantCount} dari {totalVariables} variabel signifikan
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Geographically Weighted Negative Binomial Regression
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={copyEquation}>
            <Copy className="h-4 w-4 mr-2" />
            Salin
          </Button>
          <Button variant="outline" size="sm" onClick={exportEquation}>
            <Download className="h-4 w-4 mr-2" />
            Unduh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * EquationCardSkeleton - Loading state
 */
export function EquationCardSkeleton() {
  return (
    <Card className="w-full animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-64"></div>
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
          <div className="h-16 bg-gray-100 rounded"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}