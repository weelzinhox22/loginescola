import React from 'react';

interface Book2DProps {
  // Optional props to control animation or appearance
  animationSpeed?: number;
}

export default function Book2D({ animationSpeed = 3 }: Book2DProps) {
  return (
    <div className="book-container w-full h-full flex items-center justify-center">
      <div className="book-animation relative transform">
        {/* Book */}
        <div className="relative w-40 h-52 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-r-lg rounded-l-sm shadow-xl transform rotate-y-10 hover:rotate-y-20 transition-transform duration-700">
          {/* Book spine */}
          <div className="absolute left-0 top-0 w-3 h-full bg-indigo-800 rounded-l-sm shadow-inner"></div>
          
          {/* Book cover design */}
          <div className="absolute top-3 left-6 right-3 bottom-3 bg-white/90 rounded-r-md">
            <div className="absolute top-4 left-4 right-4 h-8 bg-indigo-400 rounded-md"></div>
            <div className="absolute top-16 left-4 right-4 h-2 bg-indigo-300 rounded-md"></div>
            <div className="absolute top-20 left-4 right-4 h-2 bg-indigo-300 rounded-md"></div>
            <div className="absolute top-24 left-4 right-4 h-2 bg-indigo-300 rounded-md"></div>
            <div className="absolute top-32 left-4 right-4 h-12 bg-indigo-200 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/50 to-transparent"></div>
            </div>
          </div>
          
          {/* Animated page turning effect */}
          <div className="page absolute top-1 right-0 w-[calc(100%-8px)] h-[calc(100%-2px)] bg-white rounded-r-lg origin-left"
               style={{ animation: `${animationSpeed}s ease-in-out 0s infinite normal none running pageTurn` }}>
            <div className="absolute inset-3 bg-indigo-50">
              <div className="absolute top-4 left-2 right-2 h-1.5 bg-indigo-200 rounded-sm"></div>
              <div className="absolute top-8 left-2 right-2 h-1.5 bg-indigo-200 rounded-sm"></div>
              <div className="absolute top-12 left-2 right-2 h-1.5 bg-indigo-200 rounded-sm"></div>
              <div className="absolute top-16 left-2 right-6 h-1.5 bg-indigo-200 rounded-sm"></div>
            </div>
          </div>
          
          {/* Digital elements */}
          <div className="absolute -right-6 top-3 w-12 h-12 bg-cyan-400 rounded-full shadow-lg opacity-70 pulse-animation"></div>
          <div className="absolute -left-5 bottom-6 w-6 h-6 bg-purple-400 rounded-full shadow-lg opacity-80 pulse-animation"></div>
          
          {/* Glowing effect */}
          <div className="absolute -inset-4 bg-indigo-400/20 rounded-full blur-xl opacity-70 pulse-slow"></div>
        </div>
      </div>
    </div>
  );
} 