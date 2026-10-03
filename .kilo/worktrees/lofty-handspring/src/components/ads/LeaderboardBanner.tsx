'use client';

import { useEffect, useRef } from 'react';

export default function LeaderboardBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    
    // Prevent multiple injections in React Strict Mode
    if (bannerRef.current.firstChild) return;

    const conf = document.createElement('script');
    const script = document.createElement('script');
    
    conf.type = 'text/javascript';
    conf.innerHTML = `atOptions = {
      'key' : 'b199322c9c97c9b50c8c208fd685a1f4',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };`;

    script.type = 'text/javascript';
    script.src = 'https://www.highperformanceformat.com/b199322c9c97c9b50c8c208fd685a1f4/invoke.js';

    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);
  }, []);

  return (
    <div 
      className="leaderboard-banner hidden md:flex" 
      style={{ 
        justifyContent: 'center', 
        alignItems: 'center',
        margin: '2rem auto', 
        width: '100%',
        maxWidth: 728,
        minHeight: 90,
        overflow: 'hidden'
      }}
    >
      <div ref={bannerRef}></div>
    </div>
  );
}
