import { useEffect, useState } from 'react';

/**
 * Hook for parallax scroll effect
 * Updates scroll position for parallax animations
 * 
 * @param {number} speed - Parallax speed multiplier (0-1)
 * @returns {number} - Scroll offset for parallax
 */
export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setOffset(scrollY * speed);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [speed]);

  return offset;
};

