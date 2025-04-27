
import { useState, useEffect } from 'react';

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  initialLoad?: boolean;
}

export function useLazyLoad(
  ref: React.RefObject<HTMLElement>,
  options: UseLazyLoadOptions = {}
) {
  const { rootMargin = '200px', threshold = 0, initialLoad = false } = options;
  const [isVisible, setIsVisible] = useState(initialLoad);
  const [hasLoaded, setHasLoaded] = useState(initialLoad);

  useEffect(() => {
    const element = ref.current;
    
    if (!element || typeof IntersectionObserver !== 'function') {
      setIsVisible(true);
      setHasLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, rootMargin, threshold]);

  return { isVisible, hasLoaded };
}

export default useLazyLoad;
