/**
 * PredictionCard Component
 * Menampilkan hasil prediksi GWNBR untuk setiap region
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { GWNBRPrediction } from '@/types/prediction';
import { cn } from '@/lib/utils';

interface PredictionCardProps {
  prediction: GWNBRPrediction;
  onClick?: () => void;
  isSelected?: boolean;
  showDetails?: boolean;
  className?: string;
}

export function PredictionCard({ 
  prediction, 
  onClick, 
  isSelected = false, 
  showDetails = true,
  className 
}: PredictionCardProps) {
  const { regionName, prediction: predResult, localMetrics } = prediction;
  const { actualValue, predictedValue, residual, confidenceInterval } = predResult;
  
  // Hitung accuracy
  const accuracy = actualValue > 0 ? (1 - Math.abs(residual / actualValue)) * 100 : 0;
  
  // Determine prediction quality
  const getQualityColor = (acc: number) => {
    if (acc >= 90) return 'text-green-600';
    if (acc >= 80) return 'text-blue-600';
    if (acc >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getQualityBadge = (acc: number) => {
    if (acc >= 90) return { label: 'Sangat Baik', variant: 'default' as const };
    if (acc >= 80) return { label: 'Baik', variant: 'secondary' as const };
    if (acc >= 70) return { label: 'Cukup', variant: 'outline' as const };
    return { label: 'Perlu Perbaikan', variant: 'destructive' as const };
  };
  
  const qualityBadge = getQualityBadge(accuracy);
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-blue-500 shadow-lg',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold truncate">
            {regionName}
          </CardTitle>
          <Badge variant={qualityBadge.variant} className="ml-2">
            {qualityBadge.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Prediction vs Actual */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Prediksi</div>
            <div className="text-xl font-bold text-blue-600">
              {predictedValue.toFixed(1)}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Aktual</div>
            <div className="text-xl font-bold text-gray-700">
              {actualValue.toFixed(1)}
            </div>
          </div>
        </div>
        
        {/* Accuracy Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Akurasi</span>
            <span className={cn('text-sm font-bold', getQualityColor(accuracy))}>
              {accuracy.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={Math.max(0, Math.min(100, accuracy))} 
            className="h-2"
          />
        </div>
        
        {/* Residual */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center space-x-2">
            {residual > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
            <span className="text-sm font-medium">Residual</span>
          </div>
          <span className={cn(
            'text-sm font-bold',
            residual > 0 ? 'text-red-600' : 'text-green-600'
          )}>
            {residual > 0 ? '+' : ''}{residual.toFixed(2)}
          </span>
        </div>
        
        {showDetails && (
          <>
            {/* Confidence Interval */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Interval Kepercayaan 95%
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Batas Bawah: {confidenceInterval.lower.toFixed(1)}</span>
                <span>Batas Atas: {confidenceInterval.upper.toFixed(1)}</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded">
                <div 
                  className="absolute h-full bg-blue-300 rounded"
                  style={{
                    left: `${Math.max(0, (confidenceInterval.lower / (confidenceInterval.upper * 1.2)) * 100)}%`,
                    width: `${Math.min(100, ((confidenceInterval.upper - confidenceInterval.lower) / (confidenceInterval.upper * 1.2)) * 100)}%`
                  }}
                />
                <div 
                  className="absolute w-1 h-full bg-blue-600 rounded"
                  style={{
                    left: `${(predictedValue / (confidenceInterval.upper * 1.2)) * 100}%`
                  }}
                />
              </div>
            </div>
            
            {/* Model Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">R²:</span>
                <span className="font-medium">{localMetrics.r2.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">RMSE:</span>
                <span className="font-medium">{localMetrics.rmse.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MAE:</span>
                <span className="font-medium">{localMetrics.mae.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MAPE:</span>
                <span className="font-medium">{localMetrics.mape.toFixed(1)}%</span>
              </div>
            </div>
          </>
        )}
        
        {/* Action Hint */}
        <div className="flex items-center justify-center pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Target className="h-3 w-3" />
            <span>Klik untuk detail analisis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * PredictionCardSkeleton - Loading state
 */
export function PredictionCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
        
        <div className="h-10 bg-gray-100 rounded"></div>
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-40"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        
        <div className="h-6 bg-gray-100 rounded"></div>
      </CardContent>
    </Card>
  );
}

/**
 * PredictionCardCompact - Compact version untuk grid view
 */
interface PredictionCardCompactProps {
  prediction: GWNBRPrediction;
  onClick?: () => void;
  isSelected?: boolean;
}

export function PredictionCardCompact({ 
  prediction, 
  onClick, 
  isSelected = false 
}: PredictionCardCompactProps) {
  const { regionName, prediction: predResult } = prediction;
  const { actualValue, predictedValue, residual } = predResult;
  
  const accuracy = actualValue > 0 ? (1 - Math.abs(residual / actualValue)) * 100 : 0;
  
  const getQualityColor = (acc: number) => {
    if (acc >= 90) return 'bg-green-100 text-green-800';
    if (acc >= 80) return 'bg-blue-100 text-blue-800';
    if (acc >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md p-4',
        isSelected && 'ring-2 ring-blue-500 shadow-lg'
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm truncate">{regionName}</h3>
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            getQualityColor(accuracy)
          )}>
            {accuracy.toFixed(0)}%
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-gray-500">Prediksi</div>
            <div className="font-bold text-blue-600">{predictedValue.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-gray-500">Aktual</div>
            <div className="font-bold">{actualValue.toFixed(1)}</div>
          </div>
        </div>
        
        <Progress value={Math.max(0, Math.min(100, accuracy))} className="h-1" />
      </div>
    </Card>
  );
}