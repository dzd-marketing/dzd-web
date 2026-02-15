import React, { useEffect, useState } from 'react';

export default function PageLoader() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      // Smoothly increase width randomly like Google buffering
      progress += Math.random() * 10;
      if (progress >= 90) progress = 90; // stop at 90% until page fully loads
      setWidth(progress);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Top buffering bar */}
      <div className="h-1 w-full bg-transparent">
        <div
          className="h-1 bg-blue-600 transition-all duration-200 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>

      {/* Full-page overlay with spinner */}
      <div className="flex-1 flex items-center justify-center bg-black/30">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
