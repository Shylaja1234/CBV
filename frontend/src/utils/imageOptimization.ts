
/**
 * Utility functions for image optimization
 */

/**
 * Returns optimized image URL with appropriate size parameters
 * @param url Original image URL
 * @param width Desired width
 * @param quality Image quality (1-100)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (url: string, width?: number, quality: number = 80): string => {
  // Only process Unsplash images
  if (url.includes('unsplash.com')) {
    // If URL already has parameters, modify them
    if (url.includes('?')) {
      // Remove existing w, h, q params if they exist
      const baseUrl = url.split('?')[0];
      const params = new URLSearchParams(url.split('?')[1]);
      
      // Set new parameters
      if (width) params.set('w', width.toString());
      params.set('q', quality.toString());
      params.set('auto', 'format');
      
      return `${baseUrl}?${params.toString()}`;
    } else {
      // Add parameters
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      params.set('q', quality.toString());
      params.set('auto', 'format');
      
      return `${url}?${params.toString()}`;
    }
  }
  
  // Return original URL for non-Unsplash images
  return url;
};

/**
 * Custom hook for lazy loading images
 * @param src Image source
 * @param placeholder Placeholder image to show while loading
 * @returns Object with image src and loading status
 */
export const getResponsiveImageSrc = (src: string): string => {
  // Get correct image size based on screen width
  const screenWidth = window.innerWidth;
  
  if (screenWidth <= 640) { // Mobile
    return getOptimizedImageUrl(src, 600);
  } else if (screenWidth <= 1024) { // Tablet
    return getOptimizedImageUrl(src, 800);
  } else if (screenWidth <= 1536) { // Desktop
    return getOptimizedImageUrl(src, 1200);
  } else { // Large screens
    return getOptimizedImageUrl(src, 1600);
  }
};
