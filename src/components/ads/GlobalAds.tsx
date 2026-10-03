'use client';

import { useEffect, useRef } from 'react';

/**
 * GlobalAds ensures global Adsterra scripts (Popunder, Social Bar)
 * are injected exactly once into the DOM, avoiding React Strict Mode 
 * double-execution and Next.js hydration mismatch issues.
 */
export default function GlobalAds() {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    injected.current = true;

    // 1. Popunder Ad
    // Adsterra instructions: Paste the code snippet right before the closing </head> tag.
    const popunderScript = document.createElement('script');
    popunderScript.type = 'text/javascript';
    popunderScript.src = 'https://pl30513330.effectivecpmnetwork.com/ce/c0/e7/cec0e781afbad9f03209ca1e6b97316b.js';
    
    // We check if it already exists to prevent hot-reload duplication
    const existingPopunder = document.querySelector(`script[src="${popunderScript.src}"]`);
    if (!existingPopunder) {
      document.head.appendChild(popunderScript);
    }

    // 2. Social Bar Ad
    // Adsterra instructions: Insert it right above the closing </body> tag.
    const socialBarScript = document.createElement('script');
    socialBarScript.type = 'text/javascript';
    socialBarScript.src = 'https://pl30513333.effectivecpmnetwork.com/30/10/60/30106020730194838cc72ae48f5d5559.js';
    
    const existingSocialBar = document.querySelector(`script[src="${socialBarScript.src}"]`);
    if (!existingSocialBar) {
      document.body.appendChild(socialBarScript);
    }
  }, []);

  return null; // This component does not render anything to the DOM directly
}
