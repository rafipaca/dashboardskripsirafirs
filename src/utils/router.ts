import { useRouter as useNextRouter } from 'next/navigation';

// Main application routes
export const AppRoutes = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ABOUT: '/dashboard/tentang',
  METHODOLOGY: '/dashboard/metodologi',
};

// Define route parameters and their types
export interface RouteParams {
  [key: string]: string | number;
}

// Type for breadcrumb items
export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

/**
 * Generate a route path with parameters
 * @param basePath - The base route path
 * @param params - Route parameters to replace in the path
 * @returns The formatted route path
 */
export const generatePath = (basePath: string, params?: RouteParams): string => {
  if (!params) return basePath;
  
  let path = basePath;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value));
  });
  
  return path;
};

/**
 * Hook that extends Next.js useRouter with additional utilities
 */
export const useRouter = () => {
  const router = useNextRouter();
  
  return {
    ...router,
    
    /**
     * Navigate to a route with optional parameters
     */
    navigateTo: (route: string, params?: RouteParams) => {
      const path = params ? generatePath(route, params) : route;
      router.push(path);
    },
    
    /**
     * Navigate to home page
     */
    goToHome: () => {
      router.push(AppRoutes.HOME);
    },
    
    /**
     * Navigate to about page
     */
    goToAbout: () => {
      router.push(AppRoutes.ABOUT);
    },
    
    /**
     * Navigate to methodology page
     */
    goToMethodology: () => {
      router.push(AppRoutes.METHODOLOGY);
    },
    
    /**
     * Create breadcrumbs for current path
     * @param customPath - Optional custom path to generate breadcrumbs for
     * @param additionalCrumbs - Optional additional breadcrumb items to append
     */
    createBreadcrumbs: (customPath?: string, additionalCrumbs?: BreadcrumbItem[]): BreadcrumbItem[] => {
      // Implementation would depend on the actual routes structure
      // This is a basic example
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', path: AppRoutes.HOME }
      ];
      
      // Add additional breadcrumbs
      if (additionalCrumbs) {
        breadcrumbs.push(...additionalCrumbs);
      }
      
      return breadcrumbs;
    }
  };
};