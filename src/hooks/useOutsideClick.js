import { useEffect } from 'react';

/**
 * Hook that handles clicks outside of specified ref elements
 * @param {React.RefObject} mainRef - Ref object for the main element to detect outside clicks
 * @param {React.RefObject} ignoreRef - Optional ref object for elements to ignore (won't trigger the callback)
 * @param {Function} callback - Function to call when a click outside is detected
 */
const useOutsideClick = (mainRef, ignoreRef, callback) => {
  useEffect(() => {
    const handleClick = (event) => {
      // If main element doesn't exist, do nothing
      if (!mainRef.current) return;
      
      // Check if click is outside the main element
      if (!mainRef.current.contains(event.target)) {
        // If ignoreRef is provided, make sure click is not on that element
        if (ignoreRef && ignoreRef.current && ignoreRef.current.contains(event.target)) {
          return;
        }
        
        // Call the callback function
        callback();
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [mainRef, ignoreRef, callback]);
};

export default useOutsideClick;
