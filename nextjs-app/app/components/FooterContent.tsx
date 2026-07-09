"use client";

export default function FooterContent() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button 
      onClick={scrollToTop}
      aria-label="Back to top"
      className="text-gray-700 font-medium hover:text-gray-900 cursor-pointer"
    >
      TOP ↑
    </button>
  );
}
