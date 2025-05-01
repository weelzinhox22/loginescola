import { useEffect, useState, useRef } from "react";

interface TypewriterTitleProps {
  text: string;
  speed?: number;
}

export default function TypewriterTitle({ 
  text,
  speed = 100
}: TypewriterTitleProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentIndex <= text.length && isTyping) {
      timerRef.current = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex));
        setCurrentIndex(prev => prev + 1);
        
        if (currentIndex >= text.length) {
          setIsTyping(false);
          // After completing, wait a bit before blinking cursor starts
          setTimeout(() => {
            setIsTyping(true);
          }, 2000);
        }
      }, speed);
    } else if (!isTyping) {
      // Wait and then start erasing
      timerRef.current = setTimeout(() => {
        // We don't erase, we just restart the blinking cursor
        setIsTyping(true);
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, isTyping, text, speed]);

  return (
    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 flex">
      <span>{displayText}</span>
      <span className={`w-1 h-8 ml-1 bg-primary inline-block ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
    </h1>
  );
}
