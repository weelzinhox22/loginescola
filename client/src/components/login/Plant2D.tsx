import { useState, useEffect } from 'react';

interface Plant2DProps {
  growthFactor: number;
}

export default function Plant2D({ growthFactor }: Plant2DProps) {
  const [leafScale, setLeafScale] = useState(0.5);

  useEffect(() => {
    setLeafScale(0.5 + (growthFactor * 0.5));
  }, [growthFactor]);
  
  return (
    <div className="plant-container w-full h-full flex items-center justify-center">
      <div className="plant-pot relative w-40 h-40">
        {/* Pot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-16 bg-amber-800 rounded-b-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-amber-900 rounded-t-sm"></div>
        </div>
        
        {/* Soil */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-20 h-4 bg-amber-950 rounded-t-md"></div>
        
        {/* Plant stem */}
        <div className="plant-animation">
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-3 h-20 bg-green-700 rounded-full">
            {/* Leaves - scaling with growth factor */}
            <div className="absolute -left-6 top-4 w-8 h-5 bg-green-500 rounded-full -rotate-30" 
                style={{ transform: `scale(${leafScale}) rotate(-30deg)` }}></div>
            <div className="absolute -right-6 top-8 w-9 h-5 bg-green-500 rounded-full rotate-20" 
                style={{ transform: `scale(${leafScale}) rotate(20deg)` }}></div>
            <div className="absolute -left-8 top-12 w-10 h-6 bg-green-500 rounded-full -rotate-20" 
                style={{ transform: `scale(${leafScale}) rotate(-20deg)` }}></div>
            <div className="absolute -right-8 top-16 w-10 h-6 bg-green-500 rounded-full rotate-30" 
                style={{ transform: `scale(${leafScale}) rotate(30deg)` }}></div>
            
            {/* Top leaf - gets bigger with growth */}
            <div className="absolute -translate-x-1/2 left-1/2 -top-6 w-12 h-8 bg-green-400 rounded-full"
                style={{ transform: `scale(${leafScale}) translateX(-50%)` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}