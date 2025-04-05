// File: src/components/ResourceHub/ResourceHubMobile.js
// Enhanced mobile-optimized version of the ResourceHub component

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import MobileNavbar from '../MobileNavbar/MobileNavbar';
import MobilePageContent from '../MobilePageContent/MobilePageContent';
import './ResourceHubMobile.css';

// Enhanced mobile-optimized ResourceHub component
const ResourceHubMobile = () => {
  const [playbooks, setPlaybooks] = useState([]);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState(null);
  const [currentPlaybook, setCurrentPlaybook] = useState(null);
  const [playbookStructure, setPlaybookStructure] = useState(null);
  const [playbookContent, setPlaybookContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageTransitionState, setPageTransitionState] = useState(''); // For page transitions

  // Application title
  const appTitle = "Marketing Resource Hub";

  // Fetch the list of available playbooks
  useEffect(() => {
    // Simulating fetch from server
    const fetchPlaybooks = async () => {
      try {
        // In production, you would fetch this from your server
        const response = await import('./data/playbooks-index.json');
        const playbooks = response.default;
        setPlaybooks(playbooks);
        
        // Check URL parameters for a specific playbook index
        const urlParams = new URLSearchParams(window.location.search);
        const playbookParam = urlParams.get('p');
        
        if (playbookParam && !isNaN(parseInt(playbookParam)) && playbooks.length > 0) {
          // Convert parameter to integer (1-based) and adjust to 0-based index
          const playbookIndex = parseInt(playbookParam) - 1;
          
          // Check if the index is valid
          if (playbookIndex >= 0 && playbookIndex < playbooks.length) {
            // Set the selected playbook ID - make sure it's selected from the loaded playbooks
            setSelectedPlaybookId(playbooks[playbookIndex].id);
          } else {
            // If invalid index, default to the first playbook
            setSelectedPlaybookId(playbooks[0].id);
          }
        } else if (playbooks.length > 0) {
          // If no parameter or invalid parameter, set the first playbook as default
          setSelectedPlaybookId(playbooks[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading playbooks:', error);
        setLoading(false);
      }
    };

    fetchPlaybooks();
  }, []);

  // Load the selected playbook structure and content
  useEffect(() => {
    if (!selectedPlaybookId || playbooks.length === 0) return;

    const loadPlaybook = async () => {
      setLoading(true);
      try {
        // Find the selected playbook info
        const selected = playbooks.find(p => p.id === selectedPlaybookId);
        
        // Check if the selected playbook exists
        if (!selected) {
          console.error('Selected playbook not found:', selectedPlaybookId);
          // Fallback to the first playbook if the selected one doesn't exist
          if (playbooks.length > 0) {
            setSelectedPlaybookId(playbooks[0].id);
          }
          setLoading(false);
          return;
        }
        
        setCurrentPlaybook(selected);
        
        // Load structure and content files
        const structureResponse = await import(`./data/${selected.structureFile}`);
        const contentResponse = await import(`./data/${selected.contentFile}`);
        
        setPlaybookStructure(structureResponse.default);
        setPlaybookContent(contentResponse.default);
        
        // Check URL parameters for a specific content page
        const urlParams = new URLSearchParams(window.location.search);
        const contentPageParam = urlParams.get('c');
        
        if (contentPageParam && !isNaN(parseInt(contentPageParam)) && structureResponse.default.pages) {
          const contentPageIndex = parseInt(contentPageParam) - 1; // Convert from 1-based to 0-based
          
          // Verify the requested page exists
          if (contentPageIndex >= 0 && contentPageIndex < structureResponse.default.pages.length) {
            setCurrentPage(contentPageIndex);
          } else {
            // If invalid page index, default to first page
            setCurrentPage(0);
          }
        } else {
          // If no parameter or invalid parameter, set to first page
          setCurrentPage(0);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading playbook data:', error);
        setLoading(false);
      }
    };

    loadPlaybook();
  }, [selectedPlaybookId, playbooks]);

  // Handle page transitions
  const handlePageTransition = (direction) => {
    // Apply transition classes
    if (direction === 'next') {
      setPageTransitionState('slide-out');
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setPageTransitionState('slide-in');
      }, 300);
    } else if (direction === 'prev') {
      setPageTransitionState('slide-back-out');
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setPageTransitionState('slide-back-in');
      }, 300);
    }
  };

  // Handle playbook selection change
  const handlePlaybookChange = (id) => {
    setSelectedPlaybookId(id);
    
    // Update URL parameter when playbook is changed manually
    const newPlaybookIndex = playbooks.findIndex(p => p.id === id) + 1;
    const url = new URL(window.location);
    url.searchParams.set('p', newPlaybookIndex.toString());
    // Remove the content page parameter when changing playbooks
    url.searchParams.delete('c');
    window.history.pushState({}, '', url);
  };

  // Navigate to next page
  const nextPage = () => {
    if (playbookStructure && currentPage < playbookStructure.pages.length - 1) {
      // Update the URL parameter for content page
      const url = new URL(window.location);
      url.searchParams.set('c', (currentPage + 2).toString()); // +2 because we're moving to next page and using 1-based indexing
      window.history.pushState({}, '', url);
      
      // Apply transition animation
      handlePageTransition('next');
    }
  };

  // Navigate to previous page
  const prevPage = () => {
    if (currentPage > 0) {
      // Update the URL parameter for content page
      const url = new URL(window.location);
      url.searchParams.set('c', currentPage.toString()); // currentPage is 0-based, but we're moving back, so we need current index in 1-based form
      window.history.pushState({}, '', url);
      
      // Apply transition animation
      handlePageTransition('prev');
    }
  };

  // Jump to a specific page
  const jumpToPage = (pageIndex) => {
    if (pageIndex !== currentPage) {
      // Update URL parameter when page is changed manually
      const url = new URL(window.location);
      url.searchParams.set('c', (pageIndex + 1).toString()); // Store as 1-based index in URL
      url.searchParams.set('c', (pageIndex + 1).toString());
      window.history.pushState({}, '', url);
    }
  };

  // Calculate if prev/next buttons should be disabled
  const isPrevDisabled = currentPage === 0;
  const isNextDisabled = playbookStructure ? currentPage >= playbookStructure.pages.length - 1 : true;

  return (
    <div className="resource-hub-mobile">
      {/* Mobile Navigation Bar */}
      <MobileNavbar 
        title={appTitle}
        currentPlaybook={currentPlaybook}
        playbooks={playbooks}
        handlePlaybookChange={handlePlaybookChange}
        selectedPlaybookId={selectedPlaybookId}
      />
      
      {/* Mobile Page Content with Gesture Support */}
      <MobilePageContent
        playbookStructure={playbookStructure}
        playbookContent={playbookContent}
        currentPage={currentPage}
        loading={loading}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        pageTransitionState={pageTransitionState}
      />
      
      {/* Support My Work Section */}
      <div className="mobile-support-section">
        <div className="mobile-support-content">
          <div className="mobile-support-icon">☕</div>
          <h2 className="mobile-support-title">Support My Work</h2>
          <p className="mobile-support-text">
            If you found these resources valuable, please consider supporting my work.
            Your contribution helps me create more in-depth marketing resources.
          </p>
          <a 
            href="https://ko-fi.com/amitbhalla" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mobile-support-button"
          >
            Buy Me A Coffee
          </a>
        </div>
      </div>
      
      {/* Fixed Navigation Buttons */}
      {playbookStructure && !loading && (
        <div className="mobile-page-navigation">
          <button
            className="mobile-nav-button prev"
            onClick={prevPage}
            disabled={isPrevDisabled}
            aria-label="Previous page"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          
          <div className="mobile-page-indicator">
            <div className="mobile-page-count">
              {currentPage + 1} / {playbookStructure.pages.length}
            </div>
          </div>
          
          <button
            className="mobile-nav-button next"
            onClick={nextPage}
            disabled={isNextDisabled}
            aria-label="Next page"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceHubMobile;
