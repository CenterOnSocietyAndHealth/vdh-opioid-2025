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
    <>
      {/* Skip Navigation Link for Accessibility */}
      <div className="skip-navigation-container">
        <a 
          href="#main-content" 
          className="skip-navigation"
          tabIndex={1}
        >
          Skip navigation »
        </a>
      </div>

      {/* Announcement Bar */}
      <div className="w-full py-2 px-4 text-center announcement-bar">
        <div className="container max-w-[1311px] mx-auto">
          Update: Our site is now the Virginia Opioid Cost Data Tool. Read more about new features in{' '}
          <Link href="/whats-new/">
            our announcement. ––&gt;
          </Link>
        </div>
      </div>

      <header 
        role="banner" 
        className="w-full p-4 flex items-center justify-between bg-[#F3F2EC]"
      >
        <div className="container max-w-[1311px] px-1 mx-auto flex items-center justify-between">
        <div className="logo h-[50px]">
          {logoUrl ? (
            <Link href="/">
              <Image 
                src={urlForImage(settings.logo).width(590).url()} 
                alt={settings.logo.alt || "Virginia Opioid Cost Data Tool"}
                width={590}
                height={204}
                style={{ maxHeight: '50px', width: 'auto', height: '100%' }}
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
        <div className="flex items-center gap-4 w-[135px]"></div>
      </div>
    </header>
    </>
  );
}
