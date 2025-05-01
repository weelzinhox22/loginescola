import { useState, useEffect } from 'react';

interface Bear2DProps {
  isWatchingPassword: boolean;
}

export default function Bear2D({ isWatchingPassword }: Bear2DProps) {
  const [rotation, setRotation] = useState(0);
  
  // Gentle bobbing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => Math.sin(Date.now() * 0.001) * 2);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div 
        className="relative w-32 h-32 transition-all duration-300 ease-in-out" 
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Bear head - main circle */}
        <div className="absolute w-28 h-28 bg-amber-400 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Bear ears */}
          <div className="absolute -top-4 -left-1 w-8 h-8 bg-amber-400 rounded-full border-2 border-amber-500"></div>
          <div className="absolute -top-4 -right-1 w-8 h-8 bg-amber-400 rounded-full border-2 border-amber-500"></div>
          
          {/* Inner ears */}
          <div className="absolute -top-3 left-2 w-4 h-4 bg-amber-300 rounded-full"></div>
          <div className="absolute -top-3 right-2 w-4 h-4 bg-amber-300 rounded-full"></div>
          
          {/* Bear eyes */}
          <div className="absolute flex justify-center items-center w-full top-8 space-x-10">
            <div className="relative w-5 h-5">
              {isWatchingPassword ? (
                <>
                  <div className="absolute w-5 h-5 bg-amber-950 rounded-full"></div>
                  <div className="absolute w-10 h-3 bg-amber-400 -top-1 left-1/2 -translate-x-1/2 rounded-sm"></div>
                </>
              ) : (
                <>
                  <div className="absolute w-5 h-5 bg-amber-950 rounded-full"></div>
                  <div className="absolute w-2 h-2 bg-white rounded-full top-1 left-2"></div>
                </>
              )}
            </div>
            <div className="relative w-5 h-5">
              {isWatchingPassword ? (
                <>
                  <div className="absolute w-5 h-5 bg-amber-950 rounded-full"></div>
                  <div className="absolute w-10 h-3 bg-amber-400 -top-1 left-1/2 -translate-x-1/2 rounded-sm"></div>
                </>
              ) : (
                <>
                  <div className="absolute w-5 h-5 bg-amber-950 rounded-full"></div>
                  <div className="absolute w-2 h-2 bg-white rounded-full top-1 left-2"></div>
                </>
              )}
            </div>
          </div>
          
          {/* Bear nose */}
          <div className="absolute left-1/2 top-16 -translate-x-1/2 w-6 h-5 bg-amber-900 rounded-full"></div>
          
          {/* Bear mouth */}
          <div className="absolute left-1/2 top-[4.5rem] -translate-x-1/2 w-8 h-1.5 bg-amber-900 rounded-full"></div>
          
          {/* Blush */}
          <div className="absolute left-3 top-16 w-4 h-2 bg-red-300 rounded-full opacity-50"></div>
          <div className="absolute right-3 top-16 w-4 h-2 bg-red-300 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
}