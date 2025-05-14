import { NextResponse } from 'next/server';
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET() {
  try {
    const settings = await client.fetch(groq`*[_type == "settings"][0]{
      logo,
      "navigationItems": navigation[] {
        title,
        linkType,
        "slug": internalLink->slug.current,
        externalLink
      }
    }`);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
} 