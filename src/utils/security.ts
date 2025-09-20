// Security utilities for input validation and sanitization

/**
 * Validates and sanitizes YouTube URLs to prevent malicious inputs
 */
export const validateYouTubeUrl = (url: string): { isValid: boolean; videoId: string | null } => {
  // Remove any potentially dangerous characters
  const cleanUrl = url.trim().replace(/[<>"']/g, '');
  
  // Strict YouTube URL patterns
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(\&.*)?$/,
    /^https?:\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(\?.*)?$/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(\?.*)?$/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match) {
      const videoId = match[2] || match[1]; // Extract video ID
      
      // Validate video ID format (11 characters, alphanumeric + _ -)
      if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return { isValid: true, videoId };
      }
    }
  }

  return { isValid: false, videoId: null };
};

/**
 * Sanitizes text input to prevent XSS
 */
export const sanitizeText = (input: string, maxLength: number = 100): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>"'&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[char] || char;
    });
};

/**
 * Validates album cover URLs to ensure they're from trusted sources
 */
export const validateAlbumCoverUrl = (url: string): boolean => {
  const trustedDomains = [
    'img.youtube.com',
    'i.ytimg.com',
    'd64gsuwffb70l.cloudfront.net'
  ];
  
  try {
    const urlObj = new URL(url);
    return trustedDomains.some(domain => urlObj.hostname === domain);
  } catch {
    return false;
  }
};

/**
 * Rate limiting for localStorage operations
 */
class RateLimiter {
  private operations: number[] = [];
  private readonly maxOperations = 10;
  private readonly timeWindow = 60000; // 1 minute

  canPerformOperation(): boolean {
    const now = Date.now();
    
    // Remove old operations outside time window
    this.operations = this.operations.filter(time => now - time < this.timeWindow);
    
    // Check if we're under the limit
    if (this.operations.length >= this.maxOperations) {
      return false;
    }
    
    this.operations.push(now);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
