import { useState, useEffect } from 'react';

interface Plant2DProps {
  growthFactor: number;
}

export default function Plant2D({ growthFactor }: Plant2DProps) {
  const [leafScale, setLeafScale] = useState(0.5);
  const [flowerVisible, setFlowerVisible] = useState(false);
  const [flowersVisible, setFlowersVisible] = useState(0);

  useEffect(() => {
    setLeafScale(0.5 + (growthFactor * 0.5));
    
    // Show flower when growth factor is more than 50%
    if (growthFactor > 0.5 && !flowerVisible) {
      setFlowerVisible(true);
    }
    
    // Show multiple flowers based on growth
    setFlowersVisible(Math.floor(growthFactor * 4));
  }, [growthFactor, flowerVisible]);
  
  return (
    <div className="plant-container w-full h-full flex items-center justify-center">
      <div className="plant-pot relative w-60 h-60 transform -translate-y-5">
        {/* Decorative pot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-20 bg-gradient-to-b from-indigo-300 to-indigo-400 rounded-b-xl rounded-t-sm overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-5 bg-indigo-500 rounded-t-sm"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 rounded-b-xl">
            {/* Decorative pattern */}
            <div className="absolute top-0 left-1/4 w-1/2 h-full border-l-2 border-r-2 border-indigo-200 opacity-30"></div>
            <div className="absolute top-1/3 left-0 w-full h-1/4 border-t-2 border-indigo-200 opacity-30"></div>
          </div>
        </div>
        
        {/* Soil with realistic texture */}
        <div className="absolute bottom-18 left-1/2 -translate-x-1/2 w-24 h-5 bg-gradient-to-b from-amber-800 to-amber-950 rounded-t-md shadow-inner overflow-hidden">
          {/* Soil texture elements */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className="absolute bg-amber-700 rounded-full opacity-40"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        {/* Plant stem with animation */}
        <div className="plant-animation">
          <div className="absolute bottom-22 left-1/2 -translate-x-1/2 w-3 h-32 bg-gradient-to-t from-green-800 to-green-600 rounded-full shadow-md">
            {/* Stem details */}
            <div className="absolute inset-x-0 top-1/3 bottom-0 bg-gradient-to-r from-transparent via-green-700 to-transparent"></div>
            
            {/* Leaves - scaling with growth factor */}
            <div className="absolute -left-8 top-6 w-10 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-sm" 
                style={{ transform: `scale(${leafScale}) rotate(-30deg)`, opacity: Math.min(1, leafScale) }}></div>
            
            <div className="absolute -right-8 top-12 w-10 h-6 bg-gradient-to-bl from-green-400 to-green-600 rounded-full shadow-sm" 
                style={{ transform: `scale(${leafScale}) rotate(20deg)`, opacity: Math.min(1, leafScale) }}></div>
            
            <div className="absolute -left-9 top-18 w-11 h-7 bg-gradient-to-tr from-green-500 to-green-400 rounded-full shadow-sm" 
                style={{ transform: `scale(${leafScale}) rotate(-25deg)`, opacity: Math.min(1, leafScale) }}></div>
            
            <div className="absolute -right-9 top-24 w-11 h-7 bg-gradient-to-tl from-green-500 to-green-400 rounded-full shadow-sm" 
                style={{ transform: `scale(${leafScale}) rotate(25deg)`, opacity: Math.min(1, leafScale) }}></div>
            
            {/* Flower bud at top - appears when growth is sufficient */}
            {flowerVisible && (
              <div className="absolute -translate-x-1/2 left-1/2 -top-8">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full shadow-lg pulse-animation"
                    style={{ opacity: Math.min(1, (leafScale - 0.5) * 2) }}></div>
              </div>
            )}
            
            {/* Small flowers that appear with growth */}
            {flowersVisible > 0 && (
              <div className="absolute -left-12 top-10 w-5 h-5 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full shadow-sm pulse-animation"
                  style={{ opacity: Math.min(1, leafScale) }}></div>
            )}
            
            {flowersVisible > 1 && (
              <div className="absolute -right-12 top-16 w-5 h-5 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full shadow-sm pulse-animation"
                  style={{ opacity: Math.min(1, leafScale) }}></div>
            )}
            
            {flowersVisible > 2 && (
              <div className="absolute -left-13 top-22 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-sm pulse-animation"
                  style={{ opacity: Math.min(1, leafScale) }}></div>
            )}
          </div>
        </div>
        
        {/* Water droplets - animated */}
        {growthFactor > 0.3 && (
          <div className="absolute -bottom-2 left-1/3 w-1.5 h-6 bg-gradient-to-b from-blue-300 to-blue-500 rounded-b-full opacity-70"
              style={{ animation: 'float 3s ease-in-out infinite' }}></div>
        )}
        
        {growthFactor > 0.6 && (
          <div className="absolute -bottom-4 right-1/3 w-2 h-8 bg-gradient-to-b from-blue-300 to-blue-500 rounded-b-full opacity-70"
              style={{ animation: 'float 4s ease-in-out infinite 1s' }}></div>
        )}
      </div>
    </div>
  );
}