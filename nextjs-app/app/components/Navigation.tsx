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
  items = [] 
}: { 
  items: NavigationItemProps[] 
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 flex justify-center">
      <ul className="flex space-x-8">
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
                style={{ }}
                className={`text-lg hover:text-primary no-underline hover:underline hover:bg-transparent border-b-2 border-transparent hover:border-[#000000] ${isCurrentPage ? 'font-bold' : ''}`}
                {...(item.linkType === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
} 