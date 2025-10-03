import Link from "next/link";

import { linkResolver } from "@/sanity/lib/utils";

interface ResolvedLinkProps {
  link: any;
  children: React.ReactNode;
  className?: string;
}

export default function ResolvedLink({
  link,
  children,
  className,
}: ResolvedLinkProps) {
  // resolveLink() is used to determine the type of link and return the appropriate URL.
  const resolvedLink = linkResolver(link);
  
  // Debug logging for internal page links
  if (link?.linkType === 'page') {
    console.log('ResolvedLink - Page link:', { link, resolvedLink });
  }

  if (typeof resolvedLink === "string") {
    // Check if it's an external URL (http/https/mailto) or internal page
    const isExternalUrl = resolvedLink.startsWith('http://') || 
                         resolvedLink.startsWith('https://') || 
                         resolvedLink.startsWith('mailto:');
    
    if (isExternalUrl) {
      return (
        <a
          href={resolvedLink}
          target={link?.openInNewTab || link?.blank ? "_blank" : undefined}
          rel={link?.openInNewTab || link?.blank ? "noopener noreferrer" : undefined}
          className={className}
        >
          {children}
        </a>
      );
    } else {
      // Internal page link - use Next.js Link
      return (
        <Link
          href={resolvedLink}
          target={link?.openInNewTab || link?.blank ? "_blank" : undefined}
          rel={link?.openInNewTab || link?.blank ? "noopener noreferrer" : undefined}
          className={className}
        >
          {children}
        </Link>
      );
    }
  }
  return <>{children}</>;
}
