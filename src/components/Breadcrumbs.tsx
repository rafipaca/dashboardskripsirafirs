"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BreadcrumbItem, AppRoutes } from '@/utils/router';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // If no items provided, generate based on current path
  const breadcrumbs = items || generateBreadcrumbsFromPath(pathname);

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.path} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              )}
              
              {isLast ? (
                <span className="text-sm font-medium text-muted-foreground md:ml-1">
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  href={crumb.path}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 md:ml-1"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Helper function to generate breadcrumbs from path
function generateBreadcrumbsFromPath(path: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', path: AppRoutes.HOME }
  ];
  
  if (path === AppRoutes.HOME) {
    return breadcrumbs;
  }
  
  // Mapping from paths to readable names
  const pathToLabel: Record<string, string> = {
    [AppRoutes.ABOUT]: 'Tentang',
    [AppRoutes.METHODOLOGY]: 'Metodologi',
  };
  
  // Add current page to breadcrumbs
  if (pathToLabel[path]) {
    breadcrumbs.push({
      label: pathToLabel[path],
      path: path,
      isActive: true
    });
  } else {
    // Handle dynamic routes or unknown paths
    const segments = path.split('/').filter(Boolean);
    let currentPath = '';
    
    segments.forEach(segment => {
      currentPath += `/${segment}`;
      
      breadcrumbs.push({
        label: capitalizeFirstLetter(segment.replace(/-/g, ' ')),
        path: currentPath,
        isActive: currentPath === path
      });
    });
  }
  
  return breadcrumbs;
}

// Helper to capitalize first letter of a string
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
} 