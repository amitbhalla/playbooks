// File: src/components/ResourceHub/ResourceHubMobile.js
// Mobile-optimized version of the ResourceHub component

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight, 
  faSpinner, 
  faBookOpen,
  faCheck,
  faLightbulb,
  faInfoCircle,
  faExclamationTriangle,
  faStar,
  faArrowRight,
  faRocket,
  faChartLine,
  faLayerGroup,
  faUsers,
  faBullseye,
  faBrain,
  faCode,
  faToolbox,
  faSearch,
  faUserPlus,
  faComments,
  faHandshake,
  faShieldAlt,
  faChartBar,
  faServer,
  faRobot,
  faBars,
  faTimes,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import './ResourceHubMobile.css';

// Mobile-optimized ResourceHub component
const ResourceHubMobile = () => {
  const [playbooks, setPlaybooks] = useState([]);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState(null);
  const [currentPlaybook, setCurrentPlaybook] = useState(null);
  const [playbookStructure, setPlaybookStructure] = useState(null);
  const [playbookContent, setPlaybookContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playbookSelectorOpen, setPlaybookSelectorOpen] = useState(false);
  const contentRef = useRef(null);

  // Icon mapping
  const iconMap = {
    'check': faCheck,
    'lightbulb': faLightbulb,
    'info': faInfoCircle,
    'warning': faExclamationTriangle,
    'star': faStar,
    'arrow-right': faArrowRight,
    'rocket': faRocket,
    'chart-line': faChartLine,
    'layer-group': faLayerGroup,
    'users': faUsers,
    'bullseye': faBullseye,
    'brain': faBrain,
    'code': faCode,
    'toolbox': faToolbox,
    'search': faSearch,
    'user-plus': faUserPlus,
    'comments': faComments,
    'handshake': faHandshake,
    'shield': faShieldAlt,
    'chart-bar': faChartBar,
    'server': faServer,
    'robot': faRobot
  };

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

  // Scroll to top when changing pages
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    // Close menu when page changes
    setMenuOpen(false);
  }, [currentPage]);

  // Handle playbook selection change
  const handlePlaybookChange = (id) => {
    setSelectedPlaybookId(id);
    setPlaybookSelectorOpen(false);
    
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
      
      setCurrentPage(currentPage + 1);
    }
  };

  // Navigate to previous page
  const prevPage = () => {
    if (currentPage > 0) {
      // Update the URL parameter for content page
      const url = new URL(window.location);
      url.searchParams.set('c', currentPage.toString()); // currentPage is 0-based, but we're moving back, so we need current index in 1-based form
      window.history.pushState({}, '', url);
      
      setCurrentPage(currentPage - 1);
    }
  };

  // Jump to a specific page
  const jumpToPage = (pageIndex) => {
    if (pageIndex !== currentPage) {
      // Update URL parameter when page is changed manually
      const url = new URL(window.location);
      url.searchParams.set('c', (pageIndex + 1).toString()); // Store as 1-based index in URL
      window.history.pushState({}, '', url);
      
      setCurrentPage(pageIndex);
      setMenuOpen(false);
    }
  };

  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setPlaybookSelectorOpen(false);
  };

  // Toggle playbook selector
  const togglePlaybookSelector = () => {
    setPlaybookSelectorOpen(!playbookSelectorOpen);
    setMenuOpen(false);
  };

  // Render the correct icon based on the type
  const renderIcon = (iconType) => {
    return <FontAwesomeIcon icon={iconMap[iconType] || faLightbulb} />;
  };

  // Render the current page content based on structure and content
  const renderPageContent = () => {
    if (!playbookStructure || !playbookContent || loading) {
      return (
        <div className="playbook-loading-mobile">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <p>Loading playbook content...</p>
        </div>
      );
    }

    const currentPageStructure = playbookStructure.pages[currentPage];
    
    return (
      <div className="playbook-page-mobile">
        {currentPageStructure.sections.map((section, sectionIndex) => {
          // Helper to get section content
          const getContent = (ref) => playbookContent.sections[ref];
          
          switch(section.type) {
            case 'header':
              return (
                <h2 key={sectionIndex} className="section-header-mobile">
                  {getContent(section.contentRef)}
                </h2>
              );
              
            case 'subheader':
              return (
                <h3 key={sectionIndex} className="section-subheader-mobile">
                  {getContent(section.contentRef)}
                </h3>
              );
              
            case 'paragraph':
              return (
                <p key={sectionIndex} className="section-paragraph-mobile">
                  {getContent(section.contentRef)}
                </p>
              );
              
            case 'list':
              return (
                <ul key={sectionIndex} className="section-list-mobile">
                  {getContent(section.contentRef).map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <span className="list-icon-mobile">{renderIcon('check')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
              
            case 'callout':
              const calloutContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className={`section-callout-mobile ${calloutContent.type || 'info'}`}>
                  <div className="callout-icon-mobile">
                    {renderIcon(calloutContent.icon || 'info')}
                  </div>
                  <div className="callout-content-mobile">
                    <h3>{calloutContent.title}</h3>
                    <p>{calloutContent.content}</p>
                  </div>
                </div>
              );
              
            case 'icon':
              const iconContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-icon-mobile">
                  <div className="icon-container-mobile">
                    {renderIcon(iconContent.icon)}
                  </div>
                  {iconContent.caption && (
                    <p className="icon-caption-mobile">{iconContent.caption}</p>
                  )}
                </div>
              );
              
            case 'steps':
              const stepsContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-steps-mobile">
                  <h3 className="steps-title-mobile">{stepsContent.title}</h3>
                  <div className="steps-container-mobile">
                    {stepsContent.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="step-item-mobile">
                        <div className="step-number-mobile">{stepIndex + 1}</div>
                        <div className="step-content-mobile">
                          <h4>{step.title}</h4>
                          <p>{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
              
            case 'quote':
              const quoteContent = getContent(section.contentRef);
              return (
                <blockquote key={sectionIndex} className="section-quote-mobile">
                  <p>{quoteContent.text}</p>
                  {quoteContent.author && (
                    <cite>{quoteContent.author}</cite>
                  )}
                </blockquote>
              );
              
            case 'statistic':
              const statContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-statistic-mobile">
                  <div className="statistic-container-mobile">
                    <div className="statistic-value-mobile">{statContent.value}</div>
                    <div className="statistic-label-mobile">{statContent.label}</div>
                  </div>
                  {statContent.description && (
                    <p className="statistic-description-mobile">{statContent.description}</p>
                  )}
                </div>
              );
            
            case 'grid':
              const gridContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className={`section-grid-mobile columns-${gridContent.columns || 1}`}>
                  {gridContent.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="grid-item-mobile">
                      <div className="grid-icon-mobile">
                        {renderIcon(item.icon)}
                      </div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              );
            
            case 'tabs':
              const tabsContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-tabs-mobile">
                  <TabGroupMobile tabs={tabsContent.tabs} />
                </div>
              );
            
            case 'comparison':
              const comparisonContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-comparison-mobile">
                  <h3 className="comparison-title-mobile">{comparisonContent.title}</h3>
                  {comparisonContent.rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="comparison-card-mobile">
                      <div className="comparison-feature-mobile">{row.feature}</div>
                      <div className="comparison-values-mobile">
                        {row.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="comparison-value-item-mobile">
                            <div className="comparison-column-header-mobile">
                              {comparisonContent.columns[valueIndex]}
                            </div>
                            <div className="comparison-value-mobile">
                              {typeof value === 'boolean' ? 
                                (value ? <FontAwesomeIcon icon={faCheck} className="check-icon-mobile" /> : '-') : 
                                value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            
            case 'process':
              const processContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-process-mobile">
                  <h3 className="process-title-mobile">{processContent.title}</h3>
                  <div className="process-flow-mobile">
                    {processContent.steps.map((step, processIndex) => (
                      <div key={processIndex} className="process-step-mobile">
                        <div className="process-step-indicator-mobile">
                          <div className="process-step-number-mobile">{processIndex + 1}</div>
                        </div>
                        <div className="process-step-content-mobile">
                          <h4>{step.title}</h4>
                          <p>{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            
            case 'cards':
              const cardsContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-cards-mobile">
                  <h3 className="cards-title-mobile">{cardsContent.title}</h3>
                  <div className="cards-container-mobile">
                    {cardsContent.items.map((card, cardIndex) => (
                      <div key={cardIndex} className={`card-item-mobile ${card.highlight ? 'highlighted' : ''}`}>
                        {card.icon && (
                          <div className="card-icon-mobile">
                            {renderIcon(card.icon)}
                          </div>
                        )}
                        <h4 className="card-title-mobile">{card.title}</h4>
                        <p className="card-description-mobile">{card.description}</p>
                        {card.footer && (
                          <div className="card-footer-mobile">
                            {card.footer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
              
            case 'coffeeCallout':
              const coffeeContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-coffee-callout-mobile">
                  <div className="coffee-callout-content-mobile">
                    <div className="coffee-callout-icon-mobile">
                      {renderIcon(coffeeContent.icon || 'star')}
                    </div>
                    <h2 className="coffee-callout-title-mobile">{coffeeContent.title}</h2>
                    <p className="coffee-callout-text-mobile">{coffeeContent.content}</p>
                    {coffeeContent.actionButton && (
                      <a 
                        href={coffeeContent.actionButton.url} 
                        className={`coffee-callout-button-mobile ${coffeeContent.actionButton.primary ? 'primary' : 'secondary'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {coffeeContent.actionButton.text}
                      </a>
                    )}
                  </div>
                </div>
              );
            
            case 'featured-list':
              const featuredContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-featured-list-mobile">
                  <h3 className="featured-list-title-mobile">{featuredContent.title}</h3>
                  <div className="featured-list-container-mobile">
                    {featuredContent.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="featured-list-item-mobile">
                        <div className="featured-list-number-mobile">{itemIndex + 1}</div>
                        <div className="featured-list-content-mobile">
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
              
            case 'divider':
              return <hr key={sectionIndex} className="section-divider-mobile" />;
              
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Tab component for mobile
  const TabGroupMobile = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);
    
    return (
      <div className="tabs-component-mobile">
        <div className="tabs-header-mobile">
          <select 
            className="tabs-select-mobile"
            value={activeTab}
            onChange={(e) => setActiveTab(parseInt(e.target.value))}
          >
            {tabs.map((tab, index) => (
              <option key={index} value={index}>
                {tab.title}
              </option>
            ))}
          </select>
        </div>
        <div className="tab-content-mobile">
          {tabs[activeTab].content.map((item, index) => {
            switch (item.type) {
              case 'text':
                return <p key={index} className="tab-text-mobile">{item.value}</p>;
              case 'list':
                return (
                  <ul key={index} className="tab-list-mobile">
                    {item.items.map((li, liIndex) => (
                      <li key={liIndex}>
                        <span className="list-icon-mobile">{renderIcon('check')}</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  // Render the mobile navigation and header
  const renderMobileHeader = () => {
    if (!currentPlaybook) return null;
    
    return (
      <div className="mobile-header">
        <div className="mobile-header-top">
          <button className="menu-button" onClick={toggleMenu}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
          <div className="mobile-title-container" onClick={togglePlaybookSelector}>
            <h1 className="mobile-title">{currentPlaybook.title}</h1>
            <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
          </div>
        </div>
        
        {/* Playbook Selector Dropdown */}
        {playbookSelectorOpen && (
          <div className="mobile-playbook-selector">
            <h2>Select a Playbook</h2>
            <ul className="mobile-playbook-list">
              {playbooks.map((playbook) => (
                <li
                  key={playbook.id}
                  className={playbook.id === selectedPlaybookId ? 'active' : ''}
                  onClick={() => handlePlaybookChange(playbook.id)}
                >
                  {playbook.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Page Navigation Menu */}
        {menuOpen && playbookStructure && (
          <div className="mobile-menu">
            <h2>Contents</h2>
            <ul className="mobile-menu-pages">
              {playbookStructure.pages.map((page, index) => (
                <li
                  key={page.id}
                  className={index === currentPage ? 'active' : ''}
                  onClick={() => jumpToPage(index)}
                >
                  <span className="page-number-mobile">{index + 1}</span>
                  <span className="page-title-mobile">{page.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Current page subtitle */}
        {playbookStructure && !menuOpen && !playbookSelectorOpen && (
          <div className="mobile-page-info">
            <h2 className="mobile-page-title">
              {playbookStructure.pages[currentPage].title}
            </h2>
            <div className="mobile-page-progress">
              Page {currentPage + 1} of {playbookStructure.pages.length}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="resource-hub-mobile">
      {renderMobileHeader()}
      
      <div className="playbook-content-mobile" ref={contentRef}>
        {renderPageContent()}
      </div>
      
      {/* Fixed Navigation Buttons */}
      {playbookStructure && !loading && !menuOpen && !playbookSelectorOpen && (
        <div className="mobile-nav-buttons">
          <button
            className="mobile-nav-button prev"
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className="mobile-nav-button next"
            onClick={nextPage}
            disabled={currentPage === playbookStructure.pages.length - 1}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
      
      {/* Support CTA */}
      <div className="mobile-support-section">
        <div className="mobile-support-content">
          <div className="mobile-support-icon">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <h2 className="mobile-support-title">☕ Support My Work</h2>
          <p className="mobile-support-text">
            If you found these resources valuable, please consider supporting my work.
          </p>
          <a 
            href="https://ko-fi.com/amitbhalla" 
            className="mobile-support-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy Me a Coffee
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceHubMobile;
