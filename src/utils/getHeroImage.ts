export function getHeroImage(heroImage?: string, youtubeId?: string): string {
  // If custom hero image is provided, use it
  if (heroImage) {
    return heroImage;
  }

  // If YouTube ID is provided, use the highest quality thumbnail
  // YouTube provides thumbnails in this priority order:
  // 1. maxresdefault.jpg (1280x720) - not always available
  // 2. sddefault.jpg (640x480) - not always available
  // 3. hqdefault.jpg (480x360) - almost always available
  // We'll use maxresdefault and let the browser fall back via onerror
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }

  // Fallback placeholder image
  return '/images/placeholder.jpg';
}
