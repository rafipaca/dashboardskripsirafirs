export const animations = {
  // Card animations
  cardHover: "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-primary/20",
  cardEnter: "animate-in fade-in slide-in-from-bottom-4 duration-500",
  
  // Loading states
  skeleton: "animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent",
  
  // Interactive elements
  buttonHover: "transition-all duration-200 hover:scale-105 active:scale-95",
  
  // Chart animations
  chartEnter: "animate-in fade-in duration-700",
  
  // Map interactions
  mapHover: "transition-all duration-200 hover:brightness-110",
  
  // Responsive transitions
  responsive: "transition-all duration-300 ease-in-out",
} as const;

export const timing = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;
