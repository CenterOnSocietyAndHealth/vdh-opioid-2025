"use client";

import React from "react";
import { usePathname } from "next/navigation";

type NavigationItemProps = {
  title: string;
  linkType: 'internal' | 'external';
  slug?: string;
  externalLink?: string;
};

export default function Navigation({ 
  items = [],
  context = 'header'
}: { 
  items: NavigationItemProps[];
  context?: 'header' | 'footer';
}) {
  const pathname = usePathname();

  // Different classes based on context
  const navClasses = context === 'footer' 
    ? "flex flex-col lg:flex-row lg:space-x-8 space-y-4 lg:space-y-0" 
    : "hidden lg:flex";
  
  const ulClasses = context === 'footer' 
    ? "flex flex-col lg:flex-row lg:space-x-8 space-y-4 lg:space-y-0" 
    : "flex space-x-8";

  const navLabel = context === 'footer' ? 'Footer navigation' : 'Main navigation';

  return (
    <nav className={navClasses} aria-label={navLabel}>
      <ul className={ulClasses}>
        {items.map((item, index) => {
          const href = item.linkType === 'internal' 
            ? `/${item.slug || ''}` 
            : item.externalLink || '#';

          // Check if this is the current page
          const isCurrentPage = item.linkType === 'internal' && 
            (pathname === `/${item.slug}` || 
             (pathname === '/' && item.slug === '') || 
             (pathname === '/' && item.slug === 'home'));
            
          return (
            <li key={index}>
              <a 
                href={href}
                className={`nav-link text-lg ${isCurrentPage ? 'font-bold no-shadow' : ''}`}
                {...(isCurrentPage ? { 'aria-current': 'page' as const } : {})}
                {...(item.linkType === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.title}
                {item.linkType === 'external' && (
                  <span className="sr-only"> (opens in new tab)</span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
} 