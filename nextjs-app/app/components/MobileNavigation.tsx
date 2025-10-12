"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import imageUrlBuilder from '@sanity/image-url'
import { client } from "@/sanity/lib/client";

type NavigationItemProps = {
  title: string;
  linkType: 'internal' | 'external';
  slug?: string;
  externalLink?: string;
};

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

export default function MobileNavigation({ 
  items = [],
  logo
}: { 
  items: NavigationItemProps[];
  logo?: any;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={toggleMenu}
          className="flex flex-col items-center justify-center p-2"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {/* Hamburger/X Icon */}
          <div className="relative w-6 h-5 flex flex-col justify-center">
            <span
              className={`block h-0.5 w-6 bg-black transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-all duration-300 ease-in-out mt-1.5 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-all duration-300 ease-in-out mt-1.5 ${
                isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </div>
          
          {/* Menu Label */}
          <span className="text-xs font-normal text-black mt-1">
            {isMenuOpen ? 'CLOSE' : 'MENU'}
          </span>
        </button>
      </div>

      {/* Full Screen Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" style={{ top: '38px' }}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0"
            onClick={closeMenu}
            style={{ top: '-38px' }}
          />
          
          {/* Menu Content */}
          <div className="relative bg-white w-screen flex flex-col"
            style={{ height: 'calc(100vh - 38px)' }}
            >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {/* Logo */}
              <div className="logo h-[50px] flex-shrink-0">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-html-link-for-pages
                  <a href="/" onClick={closeMenu}>
                    <img 
                      src={urlForImage(logo).width(590).url()} 
                      alt={logo.alt || "Virginia Opioid Cost Data Tool"}
                      style={{ maxHeight: '50px', width: 'auto', height: '100%' }}
                    />
                  </a>
                ) : (
                  // eslint-disable-next-line @next/next/no-html-link-for-pages
                  <a href="/" className="text-lg font-bold text-black" onClick={closeMenu}>
                    Virginia Opioid Cost Data Tool
                  </a>
                )}
              </div>
              
              {/* Close Button */}
              <button
                onClick={closeMenu}
                className="flex flex-col items-center justify-center p-2"
                aria-label="Close menu"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <span className="absolute h-0.5 w-6 bg-black rotate-45" />
                  <span className="absolute h-0.5 w-6 bg-black -rotate-45" />
                </div>
                <span className="text-xs font-normal text-black mt-1">CLOSE</span>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-6 py-8">
              <ul className="space-y-0">
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
                    <li key={index} className="border-b border-gray-200">
                      <a
                        href={href}
                        onClick={closeMenu}
                        className={`flex items-center justify-between no-underline py-6 text-lg font-normal text-black hover:text-gray-600 transition-colors ${
                          isCurrentPage ? 'font-bold' : ''
                        }`}
                        {...(item.linkType === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        <span>{item.title}</span>
                              <span className="text-[#414141] text-2xl no-underline">›</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="px-6 py-8 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-4">
                <div>Email: societyhealth@vcu.edu</div>
                <div>VCU Center on Society and Health</div>
              </div>
              
              {/* Logos */}
              <div className="flex items-center justify-start space-x-8">
                {/* CSH Logo */}
                <a href="https://societyhealth.vcu.edu/" target="_blank" rel="noopener noreferrer" title="Visit VCU Center on Society and Health website">
                    <img src="/csh-logo.png" alt='CSH Logo' className="h-[24px] w-auto" />
                </a>
                {/* VDH Logo */}
                <a href="https://www.vdh.virginia.gov/" target="_blank" rel="noopener noreferrer" title="Visit Virginia Department of Health website">
                  <img src="/vdh.png" alt='VDH Logo' className="h-[24px] w-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
