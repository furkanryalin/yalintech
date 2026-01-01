// Shared animation utilities for better performance and consistency
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Optimized scrub reveal with better performance
export function initScrubReveal(selector = '.scrub-reveal') {
  if (prefersReducedMotion) {
    // For users who prefer reduced motion, just show elements
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 });
    });
    return;
  }

  const revealElements = document.querySelectorAll(selector);
  
  revealElements.forEach((element) => {
    const el = element as HTMLElement;
    
    // Add will-change for better performance
    el.style.willChange = 'opacity, transform';
    
    gsap.fromTo(el, 
      {
        opacity: 0,
        y: 50,
        scale: 0.96
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1.5, // Slightly smoother scrub
          onEnter: () => {
            el.style.willChange = 'auto'; // Remove will-change after animation
          },
          onLeaveBack: () => {
            el.style.willChange = 'opacity, transform';
          }
        }
      }
    );
  });
}

// Optimized magnetic button with throttling
export function initMagneticButtons(selector = '.magnetic-btn') {
  if (prefersReducedMotion) return;

  const magneticButtons = document.querySelectorAll(selector);
  let rafId: number | null = null;
  
  magneticButtons.forEach((btn) => {
    if (!(btn instanceof HTMLElement)) return;
    
    let x = 0;
    let y = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return; // Throttle with RAF
      
      rafId = requestAnimationFrame(() => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        x = (e.clientX - centerX) * 0.25; // Reduced intensity for smoother feel
        y = (e.clientY - centerY) * 0.25;
        
        gsap.to(btn, {
          x: x,
          y: y,
          duration: 0.6,
          ease: 'power2.out'
        });
        
        rafId = null;
      });
    };
    
    const handleMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.5)' // Slight bounce for better feel
      });
    };
    
    btn.addEventListener('mousemove', handleMouseMove, { passive: true });
    btn.addEventListener('mouseleave', handleMouseLeave);
  });
}

// Optimized hero parallax
export function initHeroParallax() {
  if (prefersReducedMotion) return;

  const heroSection = document.querySelector('.hero-parallax');
  if (!heroSection) return;

  // Use a single ScrollTrigger for better performance
  const parallaxElements = [
    { selector: '[data-parallax="bg"]', yPercent: 40, opacity: 1 },
    { selector: '[data-parallax="bg2"]', yPercent: 25, opacity: 1 },
    { selector: '[data-parallax="title"]', yPercent: -15, opacity: 0.85 },
    { selector: '[data-parallax="subtitle"]', yPercent: -12, opacity: 0.9 },
    { selector: '[data-parallax="description"]', yPercent: -8, opacity: 0.95 },
    { selector: '[data-parallax="buttons"]', yPercent: -4, opacity: 0.98 }
  ];

  parallaxElements.forEach(({ selector, yPercent, opacity }) => {
    const element = document.querySelector(selector);
    if (!element) return;

    gsap.to(element, {
      yPercent: yPercent,
      opacity: opacity,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  });
}

// Stagger reveal for cards/grids
export function initStaggerReveal(selector: string, stagger = 0.1) {
  if (prefersReducedMotion) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 });
    });
    return;
  }

  const elements = document.querySelectorAll(selector);
  
  gsap.fromTo(elements,
    {
      opacity: 0,
      y: 40,
      scale: 0.96
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: stagger,
      scrollTrigger: {
        trigger: elements[0]?.parentElement || elements[0],
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    }
  );
}

// Fade in on scroll (simpler alternative)
export function initFadeIn(selector: string, delay = 0) {
  if (prefersReducedMotion) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1 });
    });
    return;
  }

  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    gsap.fromTo(element,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        delay: delay + index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });
}

// Split text reveal (line by line)
export function initSplitTextReveal(selector: string) {
  if (prefersReducedMotion) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1 });
    });
    return;
  }

  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element) => {
    const text = element.textContent || '';
    const words = text.split(' ');
    element.innerHTML = words.map(word => `<span class="word-wrapper" style="display: inline-block; overflow: hidden;"><span class="word" style="display: inline-block;">${word}</span></span>`).join(' ');
    
    const words_el = element.querySelectorAll('.word');
    
    gsap.fromTo(words_el,
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });
}

// Slide from sides
export function initSlideReveal(selector: string, direction: 'left' | 'right' | 'up' | 'down' = 'left') {
  if (prefersReducedMotion) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
    });
    return;
  }

  const elements = document.querySelectorAll(selector);
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 }
  };

  const dir = directions[direction];
  
  elements.forEach((element) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        x: dir.x,
        y: dir.y
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });
}

// Scale + rotate reveal (for cards)
export function initScaleRotateReveal(selector: string, stagger = 0.1) {
  if (prefersReducedMotion) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1, scale: 1, rotation: 0 });
    });
    return;
  }

  const elements = document.querySelectorAll(selector);
  
  gsap.fromTo(elements,
    {
      opacity: 0,
      scale: 0.8,
      rotation: -5
    },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.7,
      ease: 'back.out(1.2)',
      stagger: stagger,
      scrollTrigger: {
        trigger: elements[0]?.parentElement || elements[0],
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    }
  );
}

// Zoom reveal (for images/cards)
export function initZoomReveal(selector: string, stagger = 0.1) {
  if (prefersReducedMotion) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1, scale: 1 });
    });
    return;
  }

  const elements = document.querySelectorAll(selector);
  
  gsap.fromTo(elements,
    {
      opacity: 0,
      scale: 1.2
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: stagger,
      scrollTrigger: {
        trigger: elements[0]?.parentElement || elements[0],
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    }
  );
}

// Sequential reveal (for forms)
export function initSequentialReveal(selector: string, delay = 0.1) {
  if (prefersReducedMotion) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
    });
    return;
  }

  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: delay * index,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element.parentElement || element,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });
}

// Fade in from bottom (for CTAs)
export function initFadeUpReveal(selector: string) {
  if (prefersReducedMotion) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
    });
    return;
  }

  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        y: 60
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });
}

// Cleanup function
export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

