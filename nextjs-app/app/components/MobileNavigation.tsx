"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Disable scroll on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Re-enable scroll when menu closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

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
            className="absolute inset-0 bg-black/20"
            onClick={closeMenu}
            style={{ top: '-38px' }}
          />
          
          {/* Menu Content */}
          <div className="relative bg-white w-screen flex flex-col"
            style={{ 
              height: 'calc(100vh - 38px)',
              maxHeight: 'calc(100vh - 38px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}
            >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 flex-shrink-0">
              {/* Logo */}
              <div className="logo h-[50px] flex-shrink-0">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-html-link-for-pages
                  <a href="/" onClick={closeMenu} aria-label="Go to home page">
                    <Image 
                      src={urlForImage(logo).width(590).url()} 
                      alt={logo.alt || "Virginia Opioid Cost Data Tool"}
                      width={590}
                      height={50}
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

            {/* Navigation Items - Scrollable */}
            <nav className="flex-1 overflow-y-auto min-h-0 px-6 py-6">
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
                        className={`flex items-center justify-between no-underline py-4 text-[20px] font-normal text-black hover:text-gray-600 transition-colors ${
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

            {/* Footer - Fixed at bottom */}
            <div className="px-6 py-8 border-t border-gray-200 flex-shrink-0 bg-white"
              style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom, 0px))` }}
            >
              <div className="text-sm text-gray-600 mb-4">
                <div>Email: <a href="mailto:societyhealth@vcu.edu" className="underline">societyhealth@vcu.edu</a></div>
                <div>VCU Center on Society and Health</div>
              </div>
              
              {/* Logos */}
              <div className="flex items-center justify-start space-x-8">
                {/* CSH Logo */}
                <a href="https://societyhealth.vcu.edu/" target="_blank" rel="noopener noreferrer" title="Visit VCU Center on Society and Health website">
                    <Image src="/csh-logo.png" alt='CSH Logo' width={100} height={24} className="h-[24px] w-auto" />
                </a>
                {/* VDH Logo */}
                <a href="https://www.vdh.virginia.gov/" target="_blank" rel="noopener noreferrer" title="Visit Virginia Department of Health website">
                  <Image src="/vdh.png" alt='VDH Logo' width={100} height={24} className="h-[24px] w-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
