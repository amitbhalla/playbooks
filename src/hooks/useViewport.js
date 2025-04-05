// Custom hook for detecting viewport size
import { useState, useEffect } from 'react';

const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleWindowResize);
    
    // Call handler right away to ensure initial state matches viewport
    handleWindowResize();
    
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return { width, isMobile };
};

export default useViewport;
