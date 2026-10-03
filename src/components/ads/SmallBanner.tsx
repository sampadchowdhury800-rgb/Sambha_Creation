'use client';

import { useEffect, useRef } from 'react';

export default function SmallBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    
    // Prevent multiple injections in React Strict Mode
    if (bannerRef.current.firstChild) return;

    const conf = document.createElement('script');
    const script = document.createElement('script');
    
    conf.type = 'text/javascript';
    conf.innerHTML = `atOptions = {
      'key' : 'af806af917a5c8d36c4a88b03e14f673',
      'format' : 'iframe',
      'height' : 60,
      'width' : 468,
      'params' : {}
    };`;

    script.type = 'text/javascript';
    script.src = 'https://www.highperformanceformat.com/af806af917a5c8d36c4a88b03e14f673/invoke.js';

    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);
  }, []);

  return (
    <div 
      className="small-banner" 
      style={{ 
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        margin: '2rem auto', 
        width: '100%',
        maxWidth: 468,
        minHeight: 60,
        overflow: 'hidden'
      }}
    >
      <div ref={bannerRef}></div>
    </div>
  );
}
