import Link from "next/link";
import imageUrlBuilder from '@sanity/image-url'
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

async function getSettings() {
  return client.fetch(groq`*[_type == "settings"][0]{
    headerLine1,
    headerLine2,
    headerBackground
  }`);
}

export default async function Header() {
  const settings = await getSettings();
  const backgroundImageUrl = settings?.headerBackground ? urlForImage(settings.headerBackground).url() : '';

  return (
    <header 
      role="banner" 
      className="relative w-full min-h-[275px] bg-no-repeat bg-[0_0] p-[63px_35px_5px] m-[16px_0_59px] rounded-[15px_55px_15px_55px] bg-cover my-[8px_0_59px] overflow-hidden"
      style={{
        backgroundImage: backgroundImageUrl ? `linear-gradient(180deg, transparent 10.94%, rgba(0, 0, 0, .28) 33.33%, #6d6d6d 99.99%, rgba(1, 1, 1, .99)), url(${backgroundImageUrl})` : 'none',
      }}
    >
      <div className="relative z-10">
        <h1 
          className="text-white font-bold mb-[6px] leading-none text-[31px] italic mt-[140px] font-size-[31px]" 
          style={{
            fontWeight: 700,
            textShadow: '5px 5px 10px #000'
          }}
          title='title line 1'
        >
          {settings?.headerLine1 || 'Opioid Data'}
        </h1>
        <h1 
          className="text-white font-bold leading-none mb-[33px] w-1/2" 
          style={{
            fontWeight: 700,
            textShadow: '5px 5px 10px #000',
            color: '#fff',
            fontSize: '57px',
            marginTop: 0,
            fontStyle: 'normal'
          }}
          title='title line 2'
        >
          {settings?.headerLine2 || 'Financial Impact'}
        </h1>
      </div>

    </header>
  );
}
