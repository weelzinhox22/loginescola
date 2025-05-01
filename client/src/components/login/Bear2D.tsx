import { useState, useEffect } from 'react';

interface Bear2DProps {
  isWatchingPassword: boolean;
}

export default function Bear2D({ isWatchingPassword }: Bear2DProps) {
  const [rotation, setRotation] = useState(0);
  const [blinking, setBlinking] = useState(false);
  
  // Gentle bobbing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => Math.sin(Date.now() * 0.0005) * 2);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Random blinking effect when not watching password
  useEffect(() => {
    if (isWatchingPassword) return;
    
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds
    
    return () => clearInterval(blinkInterval);
  }, [isWatchingPassword]);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div 
        className="relative w-36 h-36 transition-all duration-500 ease-in-out"
        style={{ 
          transform: `rotate(${rotation}deg) scale(${isWatchingPassword ? '1.05' : '1'})`,
          filter: `drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))` 
        }}
      >
        {/* Body - subtle behind head */}
        <div className="absolute w-20 h-12 bg-amber-300 rounded-full left-1/2 top-[75%] -translate-x-1/2 -z-10"></div>
        
        {/* Bear head - main circle with gradient */}
        <div className="absolute w-28 h-28 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-amber-300 to-amber-400 shadow-inner">
          {/* Bear ears with more detail */}
          <div className="absolute -top-4 -left-1 w-8 h-8 bg-amber-400 rounded-full border-2 border-amber-500 overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-300 to-amber-400"></div>
          </div>
          <div className="absolute -top-4 -right-1 w-8 h-8 bg-amber-400 rounded-full border-2 border-amber-500 overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-300 to-amber-400"></div>
          </div>
          
          {/* Inner ears with gradient */}
          <div className="absolute -top-3 left-2 w-4 h-4 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full"></div>
          <div className="absolute -top-3 right-2 w-4 h-4 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full"></div>
          
          {/* Bear eyes with animation */}
          <div className="absolute flex justify-center items-center w-full top-8 space-x-10">
            <div className="relative w-6 h-6 transition-all duration-300">
              <div className={`absolute w-6 h-${isWatchingPassword ? '0.5' : blinking ? '0.5' : '6'} bg-amber-950 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden ${isWatchingPassword ? 'translate-y-2' : ''}`}>
                {!isWatchingPassword && !blinking && (
                  <div className="absolute w-2.5 h-2.5 bg-white rounded-full top-1 left-1 shadow-inner"></div>
                )}
              </div>
              {isWatchingPassword && (
                <div className="absolute w-6 h-6 border-t-2 border-amber-950 rounded-full -top-1"></div>
              )}
            </div>
            <div className="relative w-6 h-6 transition-all duration-300">
              <div className={`absolute w-6 h-${isWatchingPassword ? '0.5' : blinking ? '0.5' : '6'} bg-amber-950 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden ${isWatchingPassword ? 'translate-y-2' : ''}`}>
                {!isWatchingPassword && !blinking && (
                  <div className="absolute w-2.5 h-2.5 bg-white rounded-full top-1 left-1 shadow-inner"></div>
                )}
              </div>
              {isWatchingPassword && (
                <div className="absolute w-6 h-6 border-t-2 border-amber-950 rounded-full -top-1"></div>
              )}
            </div>
          </div>
          
          {/* Bear nose with 3D effect */}
          <div className="absolute left-1/2 top-16 -translate-x-1/2 w-7 h-6 bg-gradient-to-br from-amber-900 to-amber-800 rounded-full shadow-inner">
            <div className="absolute top-1 left-1 w-2 h-1 bg-white rounded-full opacity-40"></div>
          </div>
          
          {/* Bear mouth based on state */}
          {isWatchingPassword ? (
            <div className="absolute left-1/2 top-[5rem] -translate-x-1/2 w-8 flex justify-center">
              <div className="w-6 h-3 flex items-center justify-center relative">
                <div className="w-6 h-0.5 bg-amber-900 rounded-full absolute transform rotate-12 translate-y-0.5"></div>
                <div className="w-6 h-0.5 bg-amber-900 rounded-full absolute transform -rotate-12 -translate-y-0.5"></div>
              </div>
            </div>
          ) : (
            <div className="absolute left-1/2 top-[4.7rem] -translate-x-1/2 w-6 h-2 bg-amber-900 rounded-full">
              <div className="absolute bottom-full w-2 h-[1px] bg-amber-900 left-1/2 -translate-x-1/2 rounded-full"></div>
            </div>
          )}
          
          {/* Enhanced blush with animation */}
          <div className={`absolute left-2 top-16 w-5 h-3 bg-gradient-to-r from-red-300 to-red-200 rounded-full transition-opacity duration-300 ${isWatchingPassword ? 'opacity-70' : 'opacity-40'}`}></div>
          <div className={`absolute right-2 top-16 w-5 h-3 bg-gradient-to-l from-red-300 to-red-200 rounded-full transition-opacity duration-300 ${isWatchingPassword ? 'opacity-70' : 'opacity-40'}`}></div>
          
          {/* Subtle fur texture */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-amber-500/10"></div>
        </div>
        
        {/* Paws when watching password */}
        <div className={`absolute -bottom-2 left-5 w-7 h-7 bg-amber-300 rounded-full transform transition-all duration-500 ease-in-out ${isWatchingPassword ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="absolute -bottom-1 left-1 w-2 h-2 bg-amber-400 rounded-full"></div>
          <div className="absolute -bottom-1 left-3 w-2 h-2 bg-amber-400 rounded-full"></div>
          <div className="absolute -bottom-1 left-5 w-2 h-2 bg-amber-400 rounded-full"></div>
        </div>
        <div className={`absolute -bottom-2 right-5 w-7 h-7 bg-amber-300 rounded-full transform transition-all duration-500 ease-in-out ${isWatchingPassword ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="absolute -bottom-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
          <div className="absolute -bottom-1 right-3 w-2 h-2 bg-amber-400 rounded-full"></div>
          <div className="absolute -bottom-1 right-5 w-2 h-2 bg-amber-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}