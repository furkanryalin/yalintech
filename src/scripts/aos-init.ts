// AOS initialization script
export default function initAOS() {
  if (typeof window === 'undefined') return;
  
  import('aos').then((AOS) => {
    AOS.default.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      disable: 'mobile'
    });
  }).catch((err) => {
    console.warn('AOS failed to load:', err);
  });
}

