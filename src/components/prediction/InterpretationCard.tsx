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
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Download
} from 'lucide-react';
import { EquationDisplay } from '@/types/prediction';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  createSimpleInterpretation, 
  generateFullInterpretation,
  getVariableName
} from '@/lib/interpretation/utils';
import {
  getSignificantFactorTemplate,
  getNonSignificantFactorTemplate
} from '@/lib/interpretation/templates';


interface InterpretationCardProps {
  equation: EquationDisplay;
  className?: string;
}

export function InterpretationCard({ equation, className }: InterpretationCardProps) {
  const [activeTab, setActiveTab] = useState('summary');
  
  // Buat interpretasi sederhana dari equation
  const interpretation = createSimpleInterpretation(equation);
  const { 
    regionName, 
    significantFactors, 
    nonSignificantFactors,
    dominantFactor, 
    recommendations, 
    summary 
  } = interpretation;
  
  // Export interpretation as report
  const exportReport = () => {
    const content = generateFullInterpretation(interpretation);
    
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
  const getEffectIcon = (effect: 'increase' | 'decrease') => {
    return effect === 'increase' ? 
      <ArrowUp className="h-4 w-4 text-red-500" /> : 
      <ArrowDown className="h-4 w-4 text-green-500" />;
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
                    <span className="font-medium">{getVariableName(dominantFactor.variable)}</span>
                    <div className="flex items-center space-x-2">
                      {getEffectIcon(dominantFactor.effect)}
                      <Badge variant="secondary">
                        {dominantFactor.effect === 'increase' ? 'MENINGKATKAN' : 'MENURUNKAN'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{dominantFactor.description}</p>
                </div>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {significantFactors.filter(f => f.effect === 'decrease').length}
                </div>
                <div className="text-sm text-green-700">Faktor Protektif</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {significantFactors.filter(f => f.effect === 'increase').length}
                </div>
                <div className="text-sm text-red-700">Faktor Risiko</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {nonSignificantFactors.length}
                </div>
                <div className="text-sm text-gray-700">Tidak Signifikan</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="factors" className="space-y-4">
            {/* Significant Factors */}
            {significantFactors.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-3">Faktor Berpengaruh Signifikan</h3>
                {significantFactors.map((factor, index) => {
                  const template = getSignificantFactorTemplate(factor, regionName);
                  return (
                    <div 
                      key={index}
                      className={cn(
                        'p-4 rounded-lg border-l-4',
                        factor.effect === 'increase' 
                          ? 'bg-red-50 border-red-400' 
                          : 'bg-green-50 border-green-400'
                      )}
                    >
                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: template.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Non-Significant Factors */}
            {nonSignificantFactors.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-3">Faktor Tidak Berpengaruh Signifikan</h3>
                {nonSignificantFactors.map((factor, index) => {
                  const template = getNonSignificantFactorTemplate(factor, regionName);
                  return (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border-l-4 bg-gray-50 border-gray-400"
                    >
                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: template.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {significantFactors.length === 0 && nonSignificantFactors.length === 0 && (
              <Alert>
                <AlertDescription>
                  Tidak ada data faktor yang tersedia untuk interpretasi.
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
            {significantFactors.filter(f => f.effect === 'increase').length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Prioritas Intervensi</span>
                </div>
                <div className="space-y-2">
                  {significantFactors
                    .filter(f => f.effect === 'increase')
                    .slice(0, 3)
                    .map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="font-medium text-yellow-700">
                          {index + 1}. {getVariableName(factor.variable)}
                        </span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3">
              {/* Significant Factors Details */}
              {significantFactors.map((factor, index) => (
                <div 
                  key={`sig-${index}`}
                  className="p-4 rounded-lg border bg-white border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        {getVariableName(factor.variable)}
                      </span>
                      <Badge variant="secondary">
                        {factor.effect === 'increase' ? 'MENINGKATKAN' : 'MENURUNKAN'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    {getEffectIcon(factor.effect)}
                    <span className="text-sm font-medium">
                      {factor.effect === 'increase' ? 'Meningkatkan' : 'Menurunkan'} risiko pneumonia balita
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    {factor.description}
                  </p>
                </div>
              ))}
              
              {/* Non-Significant Factors Details */}
              {nonSignificantFactors.map((factor, index) => (
                <div 
                  key={`non-sig-${index}`}
                  className="p-4 rounded-lg border bg-gray-50 border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-gray-400" />
                      <span className="font-semibold text-gray-500">
                        {getVariableName(factor.variable)}
                      </span>
                      <Badge variant="outline">
                        TIDAK SIGNIFIKAN
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {factor.description}
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