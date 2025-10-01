/**
 * Image optimization utilities
 */

export const generateImageSizes = (baseUrl: string, widths: number[]) => {
  return widths.map(width => ({
    width,
    url: `${baseUrl}?w=${width}&q=75`
  }));
};

export const generateSrcSet = (baseUrl: string, widths: number[]) => {
  return widths
    .map(width => `${baseUrl}?w=${width}&q=75 ${width}w`)
    .join(', ');
};

export const getOptimalImageSize = (containerWidth: number, devicePixelRatio: number = 1) => {
  const targetWidth = containerWidth * devicePixelRatio;
  const standardWidths = [320, 640, 768, 1024, 1280, 1536, 1920];
  
  return standardWidths.find(w => w >= targetWidth) || standardWidths[standardWidths.length - 1];
};

export const createBlurDataURL = (width: number = 10, height: number = 10) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/png');
};

/**
 * Preload critical images for better LCP
 */
export const preloadCriticalImages = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  onLoad?: () => void,
  onError?: () => void
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          img.onload = () => {
            observer.unobserve(img);
            onLoad?.();
          };
          img.onerror = () => {
            observer.unobserve(img);
            onError?.();
          };
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.01
    }
  );

  observer.observe(img);
  return () => observer.disconnect();
};
