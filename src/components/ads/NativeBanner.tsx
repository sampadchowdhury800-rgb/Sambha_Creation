'use client';

import { useEffect, useRef } from 'react';

/**
 * NativeBanner Adsterra Component
 * Hardcoded container ID per Adsterra's requirement.
 */
export default function NativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only inject if the container exists and hasn't been populated yet
    if (!containerRef.current) return;
    
    // Adsterra's script looks for this exact ID in the DOM.
    // If the script tag is already in the DOM, we don't need to inject it again,
    // but if the component remounted, the script might need to re-execute.
    // However, usually these network scripts detect the container on their own.
    
    // To prevent strict mode double injection
    const scriptSrc = "https://pl30513331.effectivecpmnetwork.com/49c686eb5fb9ec66ceb607a363fb7272/invoke.js";
    let scriptTag = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.async = true;
      scriptTag.src = scriptSrc;
      scriptTag.setAttribute('data-cfasync', 'false');
      
      // We append it to the body or head. Body is fine.
      document.body.appendChild(scriptTag);
    }
  }, []);

  return (
    <div 
      className="native-banner-container"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '2rem 0',
        minHeight: '90px' // prevent layout shift
      }}
    >
      <div id="container-49c686eb5fb9ec66ceb607a363fb7272" ref={containerRef}></div>
    </div>
  );
}
