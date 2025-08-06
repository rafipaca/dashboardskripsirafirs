/**
 * InterpretationCard Component
 * Menampilkan interpretasi hasil analisis GWNBR untuk region yang dipilih
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Target, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Download
} from 'lucide-react';
import {
  RegionInterpretation
} from '@/types/prediction';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface InterpretationCardProps {
  interpretation: RegionInterpretation;
  className?: string;
}

export function InterpretationCard({ interpretation, className }: InterpretationCardProps) {
  const [activeTab, setActiveTab] = useState('summary');
  
  const { 
    regionName, 
    interpretations, 
    significantFactors, 
    dominantFactor, 
    recommendations, 
    summary 
  } = interpretation;
  
  // Export interpretation as report
  const exportReport = () => {
    const content = `LAPORAN INTERPRETASI GWNBR\n${regionName}\n${'='.repeat(50)}\n\n` +
      `RINGKASAN:\n${summary}\n\n` +
      `FAKTOR SIGNIFIKAN (${significantFactors.length}):\n` +
      significantFactors.map((factor, i) => 
        `${i + 1}. ${factor.variableName}\n   - Koefisien: ${factor.coefficient.toFixed(4)}\n   - Pengaruh: ${factor.effect} (${factor.percentChange})\n   - Interpretasi: ${factor.interpretation}\n`
      ).join('\n') +
      `\nFAKTOR DOMINAN:\n${dominantFactor ? `${dominantFactor.variableName} (${dominantFactor.percentChange})` : 'Tidak ada'}\n\n` +
      `REKOMENDASI:\n` +
      recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n') +
      `\n\nDETAIL SEMUA VARIABEL:\n` +
      interpretations.map((interp, i) => 
        `${i + 1}. ${interp.variableName}\n   - Koefisien: ${interp.coefficient.toFixed(4)}\n   - Z-value: ${interp.zValue.toFixed(3)}\n   - Signifikan: ${interp.isSignificant ? 'Ya' : 'Tidak'}\n   - Interpretasi: ${interp.interpretation}\n   - Implikasi: ${interp.implication}\n`
      ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interpretasi_${regionName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Laporan interpretasi berhasil diunduh!');
  };
  
  // Get effect icon
  const getEffectIcon = (effect: 'meningkatkan' | 'menurunkan') => {
    return effect === 'meningkatkan' ? 
      <ArrowUp className="h-4 w-4 text-red-500" /> : 
      <ArrowDown className="h-4 w-4 text-green-500" />;
  };
  
  // Get magnitude color
  const getMagnitudeColor = (magnitude: 'rendah' | 'sedang' | 'tinggi') => {
    switch (magnitude) {
      case 'tinggi': return 'text-red-600 bg-red-50';
      case 'sedang': return 'text-yellow-600 bg-yellow-50';
      case 'rendah': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Interpretasi Analisis - {regionName}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {significantFactors.length} Faktor Signifikan
            </Badge>
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Unduh Laporan
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Ringkasan</TabsTrigger>
            <TabsTrigger value="factors">Faktor</TabsTrigger>
            <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
            <TabsTrigger value="details">Detail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            {/* Summary */}
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription className="text-sm leading-relaxed">
                {summary}
              </AlertDescription>
            </Alert>
            
            {/* Dominant Factor */}
            {dominantFactor && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">Faktor Dominan</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dominantFactor.variableName}</span>
                    <div className="flex items-center space-x-2">
                      {getEffectIcon(dominantFactor.effect)}
                      <Badge className={getMagnitudeColor(dominantFactor.magnitude)}>
                        {dominantFactor.magnitude.toUpperCase()}
                      </Badge>
                      <span className="font-bold text-lg">{dominantFactor.percentChange}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{dominantFactor.interpretation}</p>
                </div>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {significantFactors.filter(f => f.effect === 'menurunkan').length}
                </div>
                <div className="text-sm text-green-700">Faktor Protektif</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {significantFactors.filter(f => f.effect === 'meningkatkan').length}
                </div>
                <div className="text-sm text-red-700">Faktor Risiko</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {interpretations.length - significantFactors.length}
                </div>
                <div className="text-sm text-gray-700">Tidak Signifikan</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="factors" className="space-y-4">
            {significantFactors.length > 0 ? (
              <div className="space-y-3">
                {significantFactors.map((factor, index) => (
                  <div 
                    key={index}
                    className={cn(
                      'p-4 rounded-lg border-l-4',
                      factor.effect === 'meningkatkan' 
                        ? 'bg-red-50 border-red-400' 
                        : 'bg-green-50 border-green-400'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getEffectIcon(factor.effect)}
                        <span className="font-semibold">{factor.variableName}</span>
                        <Badge className={getMagnitudeColor(factor.magnitude)}>
                          {factor.magnitude}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{factor.percentChange}</div>
                        <div className="text-xs text-gray-500">Z = {factor.zValue.toFixed(3)}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{factor.interpretation}</p>
                    <p className="text-xs text-gray-600 italic">{factor.implication}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Tidak ada faktor yang menunjukkan pengaruh signifikan terhadap kasus pneumonia balita di wilayah ini.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                    <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  Lakukan monitoring rutin dan identifikasi faktor risiko lokal lainnya untuk wilayah ini.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Priority Actions */}
            {significantFactors.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Prioritas Intervensi</span>
                </div>
                <div className="space-y-2">
                  {significantFactors
                    .filter(f => f.effect === 'meningkatkan')
                    .sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))
                    .slice(0, 3)
                    .map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="font-medium text-yellow-700">
                          {index + 1}. {factor.variableName}
                        </span>
                        <span className="text-yellow-600">({factor.percentChange})</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3">
              {interpretations.map((interp, index) => (
                <div 
                  key={index}
                  className={cn(
                    'p-4 rounded-lg border',
                    interp.isSignificant 
                      ? 'bg-white border-gray-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-100'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {interp.isSignificant ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Minus className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={cn(
                        'font-semibold',
                        interp.isSignificant ? 'text-gray-900' : 'text-gray-500'
                      )}>
                        {interp.variableName}
                      </span>
                      {interp.isSignificant && (
                        <Badge className={getMagnitudeColor(interp.magnitude)}>
                          {interp.magnitude}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        'font-mono text-sm',
                        interp.isSignificant ? 'text-gray-900' : 'text-gray-500'
                      )}>
                        β = {interp.coefficient.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Z = {interp.zValue.toFixed(3)}
                      </div>
                    </div>
                  </div>
                  
                  {interp.isSignificant && (
                    <div className="flex items-center space-x-2 mb-2">
                      {getEffectIcon(interp.effect)}
                      <span className="text-sm font-medium">
                        {interp.effect === 'meningkatkan' ? 'Meningkatkan' : 'Menurunkan'} risiko sebesar {interp.percentChange}
                      </span>
                    </div>
                  )}
                  
                  <p className={cn(
                    'text-sm mb-2',
                    interp.isSignificant ? 'text-gray-700' : 'text-gray-500'
                  )}>
                    {interp.interpretation}
                  </p>
                  
                  <p className={cn(
                    'text-xs italic',
                    interp.isSignificant ? 'text-gray-600' : 'text-gray-400'
                  )}>
                    {interp.implication}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

/**
 * InterpretationCardSkeleton - Loading state
 */
export function InterpretationCardSkeleton() {
  return (
    <Card className="w-full animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-64"></div>
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}