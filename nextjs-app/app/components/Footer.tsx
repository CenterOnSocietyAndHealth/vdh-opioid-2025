import Image from 'next/image'
import VDHlogo from '@/public/vdh.png'
import CSHlogo from '@/public/csh-logo.svg'

export default function Footer() {
  return (
    <footer className="pb-10 bg-[#F3F2EC]">
      <hr className="my-10"></hr>
      <div className="footer-container flex justify-between items-center max-w-[1280px] mx-auto">
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
