"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppRoutes } from '@/utils/router';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BarChart3, Info, BookOpen, Activity } from 'lucide-react';

interface NavigationItemProps {
  href: string;
  label: string;
  isActive: boolean;
  icon: React.ReactNode;
}

const NavigationItem = ({ href, label, isActive, icon }: NavigationItemProps) => {
  return (
    <Link 
      href={href} 
      className={`twitter-nav-item ${isActive ? 'twitter-nav-item-active' : ''}`}
    >
      <span className="twitter-nav-icon">
        {icon}
      </span>
      <span className="twitter-nav-label">{label}</span>
      {isActive && <div className="twitter-nav-indicator" />}
    </Link>
  );
};

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { 
      href: AppRoutes.HOME, 
      label: 'Dashboard', 
      icon: <BarChart3 className="w-4 h-4" />
    },
    { 
      href: AppRoutes.ABOUT, 
      label: 'Tentang', 
      icon: <Info className="w-4 h-4" />
    },
    { 
      href: AppRoutes.METHODOLOGY, 
      label: 'Metodologi', 
      icon: <BookOpen className="w-4 h-4" />
    },
  ];

  return (
    <nav className="twitter-nav-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={AppRoutes.HOME} className="twitter-nav-brand">
              <div className="twitter-nav-logo">
                <Activity className="w-5 h-5" />
              </div>
              <span className="twitter-nav-brand-text">
                GWNBR Dashboard
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center twitter-nav-desktop">
            {navItems.map(item => (
              <NavigationItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            ))}

          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <div className="twitter-nav-mobile-trigger">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="twitter-nav-mobile-sheet">
                <div className="twitter-nav-mobile-content">
                  <div className="twitter-nav-mobile-header">
                    <h3 className="twitter-nav-mobile-title">
                      Navigation
                    </h3>
                  </div>
                  {navItems.map(item => (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={`twitter-nav-mobile-item ${
                        pathname === item.href ? 'twitter-nav-mobile-item-active' : ''
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <span className="twitter-nav-mobile-icon">
                        {item.icon}
                      </span>
                      <span className="twitter-nav-mobile-label">{item.label}</span>
                      {pathname === item.href && <div className="twitter-nav-mobile-indicator" />}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}