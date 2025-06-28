'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navigation({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/' && (pathname === '/add-website' || pathname.startsWith('/edit-website')));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'text-secondary bg-secondary-active border-b-2 border-secondary'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex items-center ml-8 xl:ml-16">
      <div className="flex items-center space-x-4 xl:space-x-6">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/' && (pathname === '/add-website' || pathname.startsWith('/edit-website')));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'py-4 px-2 xl:px-3 border-b-2 text-xs xl:text-sm font-medium transition-colors relative whitespace-nowrap',
                isActive
                  ? 'border-secondary text-secondary bg-secondary-active'
                  : 'border-transparent text-primary'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}