import { Skeleton } from "@/components/ui/skeleton";
import { MapPinIcon } from "lucide-react";
import { motion } from "framer-motion";

export function MapLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Loading icon with Twitter-style animation */}
        <motion.div 
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative">
            <MapPinIcon className="h-12 w-12 text-primary" />
            <motion.div 
              className="absolute inset-0 border-2 border-primary/30 border-t-primary rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-foreground">Memuat Peta Interaktif</h3>
          <p className="text-sm text-muted-foreground">Menyiapkan data geografis Pulau Jawa...</p>
        </motion.div>

        {/* Animated loading dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Twitter-style skeleton components */}
        <motion.div 
          className="space-y-4 w-full max-w-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4 mx-auto rounded-full bg-gradient-to-r from-muted via-primary/10 to-muted animate-pulse" />
            <Skeleton className="h-3 w-full mx-auto rounded-full bg-gradient-to-r from-muted via-primary/5 to-muted animate-pulse" style={{ animationDelay: '0.2s' }} />
            <Skeleton className="h-3 w-5/6 mx-auto rounded-full bg-gradient-to-r from-muted via-primary/10 to-muted animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          
          {/* Map container skeleton */}
          <div className="mt-6 space-y-3">
            <Skeleton className="h-48 w-full rounded-xl bg-gradient-to-br from-muted/50 via-primary/5 to-muted/50 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </Skeleton>
            
            {/* Legend skeleton */}
            <div className="flex justify-center space-x-3">
              {[0, 1, 2].map((i) => (
                <Skeleton 
                  key={i}
                  className="h-6 w-16 rounded-full bg-gradient-to-r from-muted to-primary/10" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div 
          className="w-32 h-1 bg-muted rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
