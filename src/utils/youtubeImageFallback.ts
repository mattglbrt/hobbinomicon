/**
 * Generate the onerror handler for YouTube thumbnail images
 * Provides fallback from maxresdefault -> sddefault -> hqdefault
 *
 * Usage with data-youtube-id attribute:
 * <img
 *   src="..."
 *   data-youtube-id="VIDEO_ID"
 *   onerror={getYouTubeFallbackHandler()}
 * />
 *
 * Usage with data-youtube-url attribute:
 * <img
 *   src="..."
 *   data-youtube-url="URL"
 *   onerror={getYouTubeFallbackHandler('url')}
 * />
 */
export function getYouTubeFallbackHandler(mode: 'id' | 'url' = 'id'): string {
  if (mode === 'id') {
    return "if(this.dataset.youtubeId && this.src.includes('maxresdefault')) { this.src = 'https://img.youtube.com/vi/' + this.dataset.youtubeId + '/sddefault.jpg'; } else if(this.dataset.youtubeId && this.src.includes('sddefault')) { this.src = 'https://img.youtube.com/vi/' + this.dataset.youtubeId + '/hqdefault.jpg'; }";
  } else {
    return "if(this.dataset.youtubeUrl && this.src.includes('maxresdefault')) { this.src = this.src.replace('maxresdefault', 'sddefault'); } else if(this.dataset.youtubeUrl && this.src.includes('sddefault')) { this.src = this.src.replace('sddefault', 'hqdefault'); }";
  }
}
