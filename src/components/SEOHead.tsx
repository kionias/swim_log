import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'SWIM LOG — 수영 운동 기록',
  description = 'SWIM LOG - 나의 수영 운동 기록 및 월별 수영 통계. 오늘도 수영하는 멋진 당신을 응원합니다.',
  image = '/image/og_tag_image_01.png',
  url,
  type = 'website',
}) => {
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const absoluteImageUrl = image.startsWith('http')
      ? image
      : `${origin}${image.startsWith('/') ? '' : '/'}${image}`;

    // Document Title
    document.title = title;

    // Helper function to update or create meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta
    setMetaTag('name', 'description', description);

    // Open Graph meta tags
    setMetaTag('property', 'og:site_name', 'SWIM LOG');
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', absoluteImageUrl);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:locale', 'ko_KR');

    // Twitter Card meta tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', absoluteImageUrl);
  }, [title, description, image, url, type]);

  return null;
};
