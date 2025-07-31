"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AppRoutes } from '@/utils/router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';

interface NavigationItemProps {
  href: string;
  label: string;
  isActive: boolean;
}

const NavigationItem = ({ href, label, isActive }: NavigationItemProps) => {
  return (
    <Link 
      href={href} 
      className={`${
        isActive 
          ? "text-primary font-medium" 
          : "text-muted-foreground hover:text-primary"
      } px-3 py-2 rounded-md font-medium`}
    >
      {label}
    </Link>
  );
};

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { href: AppRoutes.HOME, label: 'Dashboard' },
    { href: AppRoutes.ABOUT, label: 'Tentang' },
    { href: AppRoutes.METHODOLOGY, label: 'Metodologi' },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={AppRoutes.HOME} className="flex items-center">
              <Image 
                src="/globe.svg" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="mr-2"
              />
              <span className="font-bold text-lg text-primary">GWNBR Pneumonia</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(item => (
              <NavigationItem
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
            <ModeToggle />
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden flex items-center">
            <ModeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map(item => (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={`${
                        pathname === item.href
                          ? "text-primary font-medium" 
                          : "text-muted-foreground hover:text-primary"
                      } py-2 px-3`}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
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