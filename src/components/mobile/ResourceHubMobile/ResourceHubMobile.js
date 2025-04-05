import React, { useState, useEffect, useRef, useCallback } from 'react';
import MobileHeader from '../MobileHeader/MobileHeader';
import PlaybookSelector from '../PlaybookSelector/PlaybookSelector';
import MobilePageContent from '../MobilePageContent/MobilePageContent';
import useOutsideClick from '../../../hooks/useOutsideClick';
import AdBanner from '../../AdBanner/AdBanner';
import './ResourceHubMobile.css';

const ResourceHubMobile = () => {
  const [playbooks, setPlaybooks] = useState([]);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [playbookStructure, setPlaybookStructure] = useState(null);
  const [playbookContent, setPlaybookContent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const dropdownButtonRef = useRef(null);
  const selectorRef = useRef(null);
  
  // Handle clicks outside of the dropdown to close it
  useOutsideClick(selectorRef, dropdownButtonRef, () => {
    if (isDropdownOpen) setIsDropdownOpen(false);
  });

  // Load playbooks index
  useEffect(() => {
    const loadPlaybooksIndex = async () => {
      try {
        // Import from the original ResourceHub component's data directory
        const playbooksIndex = await import('../../ResourceHub/data/playbooks-index.json');
        setPlaybooks(playbooksIndex.default);
        
        // Initialize with URL parameter or first playbook
        initializeFromUrlParams(playbooksIndex.default);
      } catch (error) {
        console.error('Error loading playbooks index:', error);
        setIsLoading(false);
      }
    };
    
    loadPlaybooksIndex();
  }, []);
  
  // URL parameter handling
  const initializeFromUrlParams = useCallback((availablePlaybooks) => {
    if (!availablePlaybooks || availablePlaybooks.length === 0) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const playbookParam = urlParams.get('p');
    const contentParam = urlParams.get('c');
    
    // Find playbook by index (1-based in URL)
    let targetPlaybookId = null;
    let targetPage = 0;
    
    if (playbookParam) {
      const playbookIndex = parseInt(playbookParam, 10) - 1;
      if (playbookIndex >= 0 && playbookIndex < availablePlaybooks.length) {
        targetPlaybookId = availablePlaybooks[playbookIndex].id;
      }
    }
    
    // If no valid playbook found in URL, use the first one
    if (!targetPlaybookId && availablePlaybooks.length > 0) {
      targetPlaybookId = availablePlaybooks[0].id;
    }
    
    // Set content page if specified
    if (contentParam) {
      targetPage = Math.max(0, parseInt(contentParam, 10) - 1);
    }
    
    // Load the selected playbook
    setSelectedPlaybookId(targetPlaybookId);
    setCurrentPage(targetPage);
  }, []);
  
  // Update URL parameters when playbook or page changes
  useEffect(() => {
    if (!selectedPlaybookId || playbooks.length === 0) return;
    
    const playbookIndex = playbooks.findIndex(p => p.id === selectedPlaybookId) + 1;
    const pageIndex = currentPage + 1;
    
    const url = new URL(window.location);
    url.searchParams.set('p', playbookIndex.toString());
    url.searchParams.set('c', pageIndex.toString());
    window.history.replaceState({}, '', url);
  }, [selectedPlaybookId, currentPage, playbooks]);
  
  // Load playbook structure and content when selected playbook changes
  useEffect(() => {
    if (!selectedPlaybookId || playbooks.length === 0) return;
    
    const loadPlaybook = async () => {
      setIsLoading(true);
      
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
          setIsLoading(false);
          return;
        }
        
        // Load structure and content files using the same pattern as the original component
        const structureResponse = await import(`../../ResourceHub/data/${selected.structureFile}`);
        const contentResponse = await import(`../../ResourceHub/data/${selected.contentFile}`);
        
        setPlaybookStructure(structureResponse.default);
        setPlaybookContent(contentResponse.default);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading playbook:', error);
        setIsLoading(false);
      }
    };
    
    loadPlaybook();
  }, [selectedPlaybookId]);
  
  // Handle playbook selection
  const handlePlaybookSelect = (playbookId) => {
    if (playbookId === selectedPlaybookId) {
      setIsDropdownOpen(false);
      return;
    }
    
    setSelectedPlaybookId(playbookId);
    setCurrentPage(0);
    setIsDropdownOpen(false);
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Jump to specific page (used for URL params)
  const jumpToPage = (pageIndex) => {
    if (pageIndex >= 0 && playbookStructure && pageIndex < playbookStructure.pages.length) {
      setCurrentPage(pageIndex);
    }
  };
  
  // Get current playbook
  const currentPlaybook = playbooks.find(p => p.id === selectedPlaybookId) || null;

  return (
    <div className="resource-hub-mobile">
      {/* Mobile Header */}
      <MobileHeader 
        title="Resource Hub"
        currentPlaybook={currentPlaybook}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        dropdownButtonRef={dropdownButtonRef}
      />
      
      {/* Playbook Selector */}
      <PlaybookSelector 
        playbooks={playbooks}
        selectedPlaybookId={selectedPlaybookId}
        onPlaybookSelect={handlePlaybookSelect}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        selectorRef={selectorRef}
      />
      
      {/* Loading State */}
      {isLoading && (
        <div className="mobile-loading">
          <div className="mobile-loader"></div>
          <p>Loading playbook...</p>
        </div>
      )}
      
      {/* Page Content */}
      {!isLoading && playbookStructure && playbookContent && (
        <MobilePageContent 
          playbookStructure={playbookStructure}
          playbookContent={playbookContent}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          jumpToPage={jumpToPage}
        />
      )}
      
      {/* Support Section - Buy Me a Coffee */}
      {!isLoading && (
        <div className="mobile-support-section">
          <div className="mobile-support-container">
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
      )}

      {/* Ad Banner */}
      <div className="mobile-footer">
        <AdBanner isMobile={true} />
      </div>
    </div>
  );
};

export default ResourceHubMobile;
