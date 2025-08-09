/**
 * EquationCard Component
 * Menampilkan persamaan matematika GWNBR untuk region yang dipilih
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  Eye, 
  EyeOff, 
  Copy, 
  Download,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { EquationDisplay } from '@/types/prediction';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EquationCardProps {
  equation: EquationDisplay;
  className?: string;
}

export function EquationCard({ equation, className }: EquationCardProps) {
  const [showZValues, setShowZValues] = useState(false);
  const [activeTab, setActiveTab] = useState('equation');
  
  const { regionName, coefficients, theta, equation: equationString } = equation;
  
  // Format coefficient dengan tanda dan warna
  const formatCoefficient = (value: number, isSignificant: boolean) => {
    const formatted = value >= 0 ? `+${value.toFixed(7)}` : value.toFixed(7);
    return {
      value: formatted,
      color: isSignificant ? 'text-green-600' : 'text-gray-500'
    };
  };
  
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
  
  const significantCount = Object.values(coefficients).filter(c => c.significant).length;
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Persamaan GWNBR - {regionName}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {significantCount}/7 Signifikan
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowZValues(!showZValues)}
            >
              {showZValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showZValues ? 'Sembunyikan Status' : 'Tampilkan Status'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="equation">Persamaan</TabsTrigger>
            <TabsTrigger value="coefficients">Koefisien</TabsTrigger>
            <TabsTrigger value="matrix">Matriks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="equation" className="space-y-4">
            {/* Main Equation Display */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="text-center">
                <div className="text-lg font-mono mb-2">
                  ln(μ) = 
                </div>
                <div className="text-sm font-mono leading-relaxed break-all">
                  <span className={coefficients.intercept.significant ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                    {coefficients.intercept.value.toFixed(7)}
                  </span>
                  {Object.entries(coefficients).slice(1).map(([key, coef]) => {
                    const formatted = formatCoefficient(coef.value, coef.significant);
                    const varLabel = key === 'giziKurang' ? 'X₁' : 
                                   key === 'imd' ? 'X₂' :
                                   key === 'rokokPerkapita' ? 'X₃' :
                                   key === 'kepadatan' ? 'X₄' :
                                   key === 'airMinum' ? 'X₅' :
                                   key === 'sanitasi' ? 'X₆' : 'X';
                    
                    return (
                      <span key={key}>
                        <span className={formatted.color}>
                          {' '}{formatted.value}
                        </span>
                        <span className="text-gray-700">×{varLabel}</span>
                      </span>
                    );
                  })}
                </div>
                
                {showZValues && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-2">Status Signifikansi Variabel:</div>
                    <div className="text-xs">
                      {Object.entries(coefficients).map(([key, coef]) => (
                        <div key={key} className="flex justify-between items-center py-1">
                          <span>{variableLabels[key] || key}:</span>
                          <span className={coef.significant ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                            {coef.significant ? 'Berpengaruh Signifikan' : 'Tidak Berpengaruh Signifikan'}
                            {coef.significant && <CheckCircle className="inline h-3 w-3 ml-1" />}
                            {!coef.significant && <XCircle className="inline h-3 w-3 ml-1" />}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Model Information */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Model GWNBR</span>
                </div>
                <span className="text-sm text-blue-700">{significantCount} dari 7 variabel signifikan</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Geographically Weighted Negative Binomial Regression untuk prediksi kasus pneumonia
              </p>
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
          </TabsContent>
          
          <TabsContent value="coefficients" className="space-y-4">
            <div className="space-y-3">
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
          </TabsContent>
          
          <TabsContent value="matrix" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium mb-3">Matriks Koefisien</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Variabel</th>
                      <th className="text-right py-2">Koefisien</th>
                      <th className="text-center py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(coefficients).map(([key, coef]) => (
                      <tr key={key} className="border-b border-gray-200">
                        <td className="py-2">{variableLabels[key] || key}</td>
                        <td className={cn(
                          'text-right py-2',
                          coef.significant ? 'text-green-600 font-semibold' : 'text-gray-500'
                        )}>
                          {coef.value.toFixed(7)}
                        </td>
                        <td className="text-center py-2">
                          {coef.significant ? (
                            <CheckCircle className="h-3 w-3 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-3 w-3 text-gray-400 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Model Information */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-medium text-blue-800">Variabel Signifikan</div>
                <div className="text-2xl font-bold text-blue-600">{significantCount}</div>
                <div className="text-xs text-blue-600">dari 7 variabel</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-medium text-green-800">Model</div>
                <div className="text-lg font-bold text-green-600">GWNBR</div>
                <div className="text-xs text-green-600">Negative Binomial</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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