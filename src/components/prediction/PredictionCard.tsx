/**
 * PredictionCard Component
 * Menampilkan hasil prediksi GWNBR untuk setiap region
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Target } from 'lucide-react';
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
  const { actualValue, predictedValue } = predResult;
  
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
        <CardTitle className="text-lg font-semibold truncate">
          {regionName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Prediction vs Actual */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Prediksi</div>
            <div className="text-xl font-bold text-blue-600">
              {Math.round(predictedValue).toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Aktual</div>
            <div className="text-xl font-bold text-gray-700">
              {Math.round(actualValue).toLocaleString('id-ID')}
            </div>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              <p>Perbandingan antara jumlah kasus pneumonia aktual dan hasil prediksi model GWNBR untuk wilayah {regionName}.</p>
            </div>
            
            {/* Model Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs mt-4">
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
          </div>
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
  const { actualValue, predictedValue } = predResult;
  
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
          <div className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Prediksi
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-gray-500">Prediksi</div>
            <div className="font-bold text-blue-600">{Math.round(predictedValue).toLocaleString('id-ID')}</div>
          </div>
          <div>
            <div className="text-gray-500">Aktual</div>
            <div className="font-bold">{Math.round(actualValue).toLocaleString('id-ID')}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}