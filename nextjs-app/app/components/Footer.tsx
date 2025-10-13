import Image from 'next/image'
import VDHlogo from '@/public/vdh.png'
import CSHlogo from '@/public/csh-logo.png'
import Navigation from './Navigation'
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import FooterContent from './FooterContent';

async function getSettings() {
  return client.fetch(groq`*[_type == "settings"][0]{
    "navigationItems": navigation[] {
      title,
      linkType,
      "slug": internalLink->slug.current,
      externalLink
    }
  }`);
}

export default async function Footer() {
  const settings = await getSettings();
  const navigationItems = settings?.navigationItems || [];

  return (
    <footer className="pb-10 mt-10 bg-[#F3F2EC]">
      <hr className=""></hr>
      
      {/* Top section with "TOP" and arrow */}
      <div className="bg-[#E2E0D4] py-4 text-center">
        <FooterContent />
      </div>
      
      {/* Main footer content */}
      <div className="bg-[#F3F2EC] py-8 text-center">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Navigation Links */}
          <div className="mb-6">
            <Navigation items={navigationItems} />
          </div>
          
          {/* Contact Information */}
          <div className="mb-4">
            <div className="mb-2">
              <span className="text-black">Email: </span>
              <a href="mailto:societyhealth@vcu.edu" className="underline text-black hover:text-gray-600">societyhealth@vcu.edu</a>
            </div>
            <div className="text-black">
              Phone: (804) 628-4055
            </div>
          </div>
          
          {/* Physical Address */}
          <div className="mb-4 text-black">
            <div>830 East Main Street, Suite 5035</div>
            <div>P.O. Box 980212</div>
            <div>Richmond, Virginia 23298-0212</div>
          </div>
          
          {/* Copyright */}
          <div className="text-black">
            © Copyright 2025 VCU Center on Society and Health
          </div>
          <div className="text-black text-[12px] my-4 max-w-[450px] mx-auto">
            This work was partially supported by the National Center for Advancing Translational Sciences (grant UM1TR004360).
          </div>
        </div>
      </div>
      
      {/* Existing logo section */}
      <div className="footer-container flex flex-col gap-4 md:flex-row md:justify-between items-center max-w-[880px] mx-auto px-4">
        <div className="footer-left">
          <a href="https://www.vdh.virginia.gov/" target="_blank" rel="noopener noreferrer">
            <Image src={VDHlogo} alt='VDH Logo' className="h-[50px] w-auto" />
          </a>
        </div>
        <div className="footer-right">
          <a href="https://societyhealth.vcu.edu/" target="_blank" rel="noopener noreferrer">
            <Image src={CSHlogo} alt='CSH Logo' className="h-[50px] w-auto" />
          </a>
        </div>
      </div>
    </footer>
  );
}
