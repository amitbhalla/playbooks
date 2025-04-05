import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ContentSection from '../ContentSection/ContentSection';
import PageNavigator from '../PageNavigator/PageNavigator';
import Hammer from 'hammerjs';
import './MobilePageContent.css';

const MobilePageContent = ({ 
  playbookStructure, 
  playbookContent, 
  currentPage, 
  onPageChange,
  jumpToPage
}) => {
  const contentRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [exitDirection, setExitDirection] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  // Initialize Hammer.js for swipe gestures
  useEffect(() => {
    if (!contentRef.current) return;
    
    const hammer = new Hammer(contentRef.current);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    
    hammer.on('swipeleft', () => {
      if (currentPage < playbookStructure.pages.length - 1) {
        handleChangePage(currentPage + 1, 'left');
      }
    });
    
    hammer.on('swiperight', () => {
      if (currentPage > 0) {
        handleChangePage(currentPage - 1, 'right');
      }
    });
    
    return () => {
      hammer.destroy();
    };
  }, [contentRef, currentPage, playbookStructure]);

  // Reset scroll position when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSection(0);
  }, [currentPage]);

  // Handle page transition
  const handleChangePage = (newPage, direction) => {
    if (isTransitioning) return;
    if (newPage < 0 || newPage >= playbookStructure.pages.length) return;
    
    setIsTransitioning(true);
    setExitDirection(direction);
    
    setTimeout(() => {
      onPageChange(newPage);
      setIsTransitioning(false);
      setExitDirection(null);
    }, 300);
  };

  // Track scroll position to highlight section in progress indicator
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const sections = contentRef.current.querySelectorAll('.mobile-content-section');
      const scrollPosition = window.scrollY + 100; // Offset to trigger earlier
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(i);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Get current page content
  const currentPageContent = playbookStructure.pages[currentPage] || { sections: [] };

  // Functions for navigation
  const goToNextPage = () => {
    if (currentPage < playbookStructure.pages.length - 1) {
      handleChangePage(currentPage + 1, 'left');
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      handleChangePage(currentPage - 1, 'right');
    }
  };
  
  // Function to scroll to a specific section
  const scrollToSection = (index) => {
    const sections = contentRef.current.querySelectorAll('.mobile-content-section');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mobile-page-content-wrapper">
      {/* Progress indicator */}
      <div className="mobile-section-progress">
        {currentPageContent.sections.map((_, index) => (
          <div 
            key={index}
            className={`section-progress-dot ${index === activeSection ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div 
        ref={contentRef}
        className={`mobile-page-content ${isTransitioning ? 'transitioning' : ''} ${exitDirection ? `exit-${exitDirection}` : ''}`}
      >
        <div className="mobile-content-container">
          {/* Page title */}
          <div className="mobile-page-header">
            <h1 className="mobile-page-title">{currentPageContent.title}</h1>
            {currentPageContent.subtitle && (
              <p className="mobile-page-subtitle">{currentPageContent.subtitle}</p>
            )}
          </div>
          
          {/* Content sections */}
          {currentPageContent.sections.map((section, index) => (
            <div key={index} className="mobile-content-section">
              <ContentSection 
                section={section} 
                sectionIndex={index}
                playbookContent={playbookContent}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Page navigation */}
      <PageNavigator 
        currentPage={currentPage}
        totalPages={playbookStructure.pages.length}
        onNextPage={goToNextPage}
        onPrevPage={goToPrevPage}
        isPrevDisabled={currentPage === 0}
        isNextDisabled={currentPage === playbookStructure.pages.length - 1}
      />
    </div>
  );
};

export default MobilePageContent;
