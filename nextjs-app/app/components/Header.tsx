import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from '@sanity/image-url'
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Navigation from "./Navigation";

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

async function getSettings() {
  return client.fetch(groq`*[_type == "settings"][0]{
    logo,
    "navigationItems": navigation[] {
      title,
      linkType,
      "slug": internalLink->slug.current,
      externalLink
    }
  }`);
}

export default async function Header() {
  const settings = await getSettings();
  const logoUrl = settings?.logo ? urlForImage(settings.logo).width(295).url() : '';
  const navigationItems = settings?.navigationItems || [];

  return (
    <header 
      role="banner" 
      className="w-full p-4 flex items-center justify-between bg-[#FFFDF8]"
    >
      <div className="container max-w-[1311px] px-1 mx-auto flex items-center justify-between">
        <div className="logo h-[70px]">
          {logoUrl ? (
            <Link href="/">
              <Image 
                src={logoUrl} 
                alt={settings.logo.alt || "Virginia Opioid Cost Data Tool"}
                width={295}
                height={102}
                style={{ maxHeight: '70px', width: 'auto', height: '100%' }}
              />
            </Link>
          ) : (
            <Link href="/" className="text-2xl font-bold">
              Virginia Opioid Cost Data Tool
            </Link>
          )}
        </div>

        {/* Use the client-side Navigation component */}
        <Navigation items={navigationItems} />
        <div className="flex items-center gap-4 w-48"></div>
      </div>
    </header>
  );
}
