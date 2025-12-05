import type { ImageMetadata } from 'astro';

// Pre-import all hero cache images using Vite's glob import
// This allows Astro to process them at build time for WebP generation
const heroImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/hero-cache/*.jpg',
  { eager: true }
);

/**
 * Get the hero image for a post
 * Returns either a string path (for public images) or an ImageMetadata object (for optimized images)
 */
export function getHeroImage(heroImage?: string, youtubeId?: string): string | ImageMetadata {
  // If custom hero image is provided, use it as-is
  if (heroImage) {
    return heroImage;
  }

  // If YouTube ID is provided, try to get the cached/optimized version
  if (youtubeId) {
    const imagePath = `/src/assets/hero-cache/yt-${youtubeId}.jpg`;
    const imageModule = heroImages[imagePath];

    if (imageModule) {
      // Return the ImageMetadata for Astro's Image component
      return imageModule.default;
    }

    // Fall back to YouTube URL if not in cache
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }

  // Fallback placeholder image
  return '/images/placeholder.jpg';
}

/**
 * Check if a hero image value is an optimized ImageMetadata object
 */
export function isImageMetadata(image: string | ImageMetadata): image is ImageMetadata {
  return typeof image === 'object' && 'src' in image;
}

/**
 * Get hero image URL string (for preloading, og:image, etc.)
 * Always returns a string URL, extracting from ImageMetadata if needed
 */
export function getHeroImageUrl(heroImage?: string, youtubeId?: string): string {
  const image = getHeroImage(heroImage, youtubeId);

  if (isImageMetadata(image)) {
    return image.src;
  }

  return image;
}
