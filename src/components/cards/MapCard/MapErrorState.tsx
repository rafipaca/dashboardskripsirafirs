import React from 'react';
import { AlertTriangleIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface MapErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function MapErrorState({ error, onRetry }: MapErrorStateProps) {
  // Determine type of error for more helpful messages
  const isNetworkError = error.message.includes('network') || 
    error.message.includes('fetch') || 
    error.message.includes('Failed to fetch');
  
  const isTimeoutError = error.message.includes('timeout') || 
    error.message.includes('aborted') || 
    error.message.toLowerCase().includes('dibatalkan');
  
  const isFormatError = error.message.includes('JSON') || 
    error.message.includes('parse') || 
    error.message.includes('Unexpected token');

  let errorTitle = "Tidak dapat memuat peta";
  let errorMessage = error.message;
  let solution = "Silakan coba muat ulang peta.";

  if (isNetworkError) {
    errorTitle = "Gagal terhubung ke server";
    errorMessage = "Tidak dapat mengakses data peta. Periksa koneksi internet Anda.";
    solution = "Periksa koneksi internet dan coba lagi.";
  } else if (isTimeoutError) {
    errorTitle = "Waktu muat habis";
    errorMessage = "Data peta terlalu besar dan memakan waktu terlalu lama untuk dimuat.";
    solution = "Kami akan memperbaiki masalah ini. Silakan coba lagi nanti.";
  } else if (isFormatError) {
    errorTitle = "Format data tidak valid";
    errorMessage = "Data peta memiliki format yang tidak dapat diproses.";
    solution = "Tim teknis kami akan memperbaiki masalah ini.";
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <Alert variant="destructive" className="border-2 shadow-lg">
          <AlertTriangleIcon className="h-6 w-6 mr-2" />
          <AlertTitle className="text-lg font-semibold mb-2">{errorTitle}</AlertTitle>
          <AlertDescription className="text-sm space-y-4">
            <p>{errorMessage}</p>
            <p className="font-medium">{solution}</p>
            <div className="pt-2">
              <Button 
                onClick={onRetry}
                variant="outline"
                className="mt-2 hover:bg-red-50"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
}
