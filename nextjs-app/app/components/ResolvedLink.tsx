import Link from "next/link";

import { linkResolver } from "@/sanity/lib/utils";

interface ResolvedLinkProps {
  link: any;
  children: React.ReactNode;
  className?: string;
  tabIndex?: number;
}

export default function ResolvedLink({
  link,
  children,
  className,
  tabIndex,
}: ResolvedLinkProps) {
  // resolveLink() is used to determine the type of link and return the appropriate URL.
  const resolvedLink = linkResolver(link);
  
  // Debug logging for internal page links
  if (link?.linkType === 'page') {
    console.log('ResolvedLink - Page link:', { link, resolvedLink });
  }
  
  // Debug logging for all links to see what's happening
  console.log('ResolvedLink - All links:', { link, resolvedLink, children });
  
  // Debug: Check if linkResolver is being called
  if (link && !resolvedLink) {
    console.log('ResolvedLink - linkResolver returned null for link:', link);
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
          tabIndex={tabIndex}
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
          tabIndex={tabIndex}
        >
          {children}
        </Link>
      );
    }
  }
  
  // If no valid link was resolved, render as plain text (not as a link)
  console.warn('ResolvedLink - No valid link resolved:', { link, resolvedLink });
  
  // Extract text content from children to avoid rendering nested <a> tags
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (node && typeof node === 'object' && node !== null && 'props' in node) {
      const props = (node as any).props;
      if (props && props.children) {
        return getTextContent(props.children);
      }
    }
    return '';
  };
  
  const textContent = getTextContent(children);
  return <span className={className}>{textContent}</span>;
}
