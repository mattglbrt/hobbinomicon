export function getHeroImage(heroImage?: string, youtubeId?: string): string {
  // If custom hero image is provided, use it
  if (heroImage) {
    return heroImage;
  }

  // If YouTube ID is provided, check for cached local version first
  // This improves LCP by serving from local CDN instead of YouTube
  if (youtubeId) {
    // Use cached local image (downloaded by scripts/download-hero-images.js)
    // Falls back to YouTube URL if cache doesn't exist (handled at runtime)
    return `/images/hero-cache/yt-${youtubeId}.jpg`;
  }

  // Fallback placeholder image
  return '/images/placeholder.jpg';
}
