import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

interface MapErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function MapErrorState({ error, onRetry }: MapErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-background via-muted/10 to-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Error icon animation */}
        <motion.div
          className="flex justify-center mb-6"
          animate={{ 
            rotate: [0, -5, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl" />
            <div className="relative bg-destructive/10 p-4 rounded-full border border-destructive/20">
              <WifiOff className="h-8 w-8 text-destructive" />
            </div>
          </div>
        </motion.div>

        <Alert className="border-destructive/30 bg-destructive/5 backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive font-bold text-lg mb-2">
            Gagal Memuat Peta
          </AlertTitle>
          <AlertDescription className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {error.message || "Tidak dapat memuat data geografis. Periksa koneksi internet Anda dan coba lagi."}
            </p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="default" 
                size="sm" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg transition-all duration-200 group" 
                onClick={onRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Coba Lagi
              </Button>
            </motion.div>
            
            {/* Help text */}
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground/80 text-center">
                Pastikan koneksi internet stabil dan refresh halaman jika masalah berlanjut
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-destructive/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-destructive/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </motion.div>
    </div>
  );
}
