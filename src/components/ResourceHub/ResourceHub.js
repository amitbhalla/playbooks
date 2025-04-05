// File: src/components/ResourceHub/ResourceHub.js
// Place this file in your src/components/ResourceHub directory

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
  faRobot
} from '@fortawesome/free-solid-svg-icons';
import './ResourceHub.css';

// Main ResourceHub component
const ResourceHub = () => {
  const [playbooks, setPlaybooks] = useState([]);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState(null);
  const [currentPlaybook, setCurrentPlaybook] = useState(null);
  const [playbookStructure, setPlaybookStructure] = useState(null);
  const [playbookContent, setPlaybookContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  }, [currentPage]);

  // Handle playbook selection change
  const handlePlaybookChange = (event) => {
    setSelectedPlaybookId(event.target.value);
    
    // Update URL parameter when playbook is changed manually
    const newPlaybookIndex = playbooks.findIndex(p => p.id === event.target.value) + 1;
    const url = new URL(window.location);
    url.searchParams.set('p', newPlaybookIndex.toString());
    // Remove the content page parameter when changing playbooks
    url.searchParams.delete('c');
    window.history.pushState({}, '', url);
  };

  // Navigate to next page with animation
  const nextPage = () => {
    if (playbookStructure && currentPage < playbookStructure.pages.length - 1) {
      setDirection('next');
      setAnimating(true);
      
      // Update the URL parameter for content page
      const url = new URL(window.location);
      url.searchParams.set('c', (currentPage + 2).toString()); // +2 because we're moving to next page and using 1-based indexing
      window.history.pushState({}, '', url);
      
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setTimeout(() => {
          setAnimating(false);
        }, 50);
      }, 300);
    }
  };

  // Navigate to previous page with animation
  const prevPage = () => {
    if (currentPage > 0) {
      setDirection('prev');
      setAnimating(true);
      
      // Update the URL parameter for content page
      const url = new URL(window.location);
      url.searchParams.set('c', currentPage.toString()); // currentPage is 0-based, but we're moving back, so we need current index in 1-based form
      window.history.pushState({}, '', url);
      
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setTimeout(() => {
          setAnimating(false);
        }, 50);
      }, 300);
    }
  };

  // Jump to a specific page
  const jumpToPage = (pageIndex) => {
    if (pageIndex !== currentPage) {
      setDirection(pageIndex > currentPage ? 'next' : 'prev');
      setAnimating(true);
      
      // Update URL parameter when page is changed manually
      const url = new URL(window.location);
      url.searchParams.set('c', (pageIndex + 1).toString()); // Store as 1-based index in URL
      window.history.pushState({}, '', url);
      
      setTimeout(() => {
        setCurrentPage(pageIndex);
        setTimeout(() => {
          setAnimating(false);
        }, 50);
      }, 300);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render the correct icon based on the type
  const renderIcon = (iconType) => {
    return <FontAwesomeIcon icon={iconMap[iconType] || faLightbulb} />;
  };

  // Render the current page content based on structure and content
  const renderPageContent = () => {
    if (!playbookStructure || !playbookContent || loading) {
      return (
        <div className="playbook-loading">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <p>Loading playbook content...</p>
        </div>
      );
    }

    const currentPageStructure = playbookStructure.pages[currentPage];
    
    return (
      <div className={`playbook-page ${animating ? `slide-${direction}` : 'active'}`}>
        {currentPageStructure.sections.map((section, sectionIndex) => {
          // Helper to get section content
          const getContent = (ref) => playbookContent.sections[ref];
          
          switch(section.type) {
            case 'header':
              return (
                <h2 key={sectionIndex} className="section-header">
                  {getContent(section.contentRef)}
                </h2>
              );
              
            case 'subheader':
              return (
                <h3 key={sectionIndex} className="section-subheader">
                  {getContent(section.contentRef)}
                </h3>
              );
              
            case 'paragraph':
              return (
                <p key={sectionIndex} className="section-paragraph">
                  {getContent(section.contentRef)}
                </p>
              );
              
            case 'list':
              return (
                <ul key={sectionIndex} className="section-list">
                  {getContent(section.contentRef).map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <span className="list-icon">{renderIcon('check')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
              
            case 'callout':
              const calloutContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className={`section-callout ${calloutContent.type || 'info'}`}>
                  <div className="callout-icon">
                    {renderIcon(calloutContent.icon || 'info')}
                  </div>
                  <div className="callout-content">
                    <h3>{calloutContent.title}</h3>
                    <p>{calloutContent.content}</p>
                  </div>
                </div>
              );
              
            case 'icon':
              const iconContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-icon">
                  <div className="icon-container">
                    {renderIcon(iconContent.icon)}
                  </div>
                  {iconContent.caption && (
                    <p className="icon-caption">{iconContent.caption}</p>
                  )}
                </div>
              );
              
            case 'steps':
              const stepsContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-steps">
                  <h3 className="steps-title">{stepsContent.title}</h3>
                  <div className="steps-container">
                    {stepsContent.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="step-item">
                        <div className="step-number">{stepIndex + 1}</div>
                        <div className="step-content">
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
                <blockquote key={sectionIndex} className="section-quote">
                  <p>{quoteContent.text}</p>
                  {quoteContent.author && (
                    <cite>{quoteContent.author}</cite>
                  )}
                </blockquote>
              );
              
            case 'statistic':
              const statContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-statistic">
                  <div className="statistic-container">
                    <div className="statistic-value">{statContent.value}</div>
                    <div className="statistic-label">{statContent.label}</div>
                  </div>
                  {statContent.description && (
                    <p className="statistic-description">{statContent.description}</p>
                  )}
                </div>
              );
            
            case 'grid':
              const gridContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className={`section-grid columns-${gridContent.columns || 2}`}>
                  {gridContent.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="grid-item">
                      <div className="grid-icon">
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
                <div key={sectionIndex} className="section-tabs">
                  <TabGroup tabs={tabsContent.tabs} />
                </div>
              );
            
            case 'comparison':
              const comparisonContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-comparison">
                  <h3 className="comparison-title">{comparisonContent.title}</h3>
                  <div className="comparison-table">
                    <div className="comparison-headers">
                      <div className="comparison-feature-header">Feature</div>
                      {comparisonContent.columns.map((column, colIndex) => (
                        <div key={colIndex} className="comparison-column-header">
                          {column}
                        </div>
                      ))}
                    </div>
                    {comparisonContent.rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="comparison-row">
                        <div className="comparison-feature">{row.feature}</div>
                        {row.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="comparison-value">
                            {typeof value === 'boolean' ? 
                              (value ? <FontAwesomeIcon icon={faCheck} className="check-icon" /> : '-') : 
                              value}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            
            case 'process':
              const processContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="section-process">
                  <h3 className="process-title">{processContent.title}</h3>
                  <div className={`process-flow ${processContent.layout || 'horizontal'}`}>
                    {processContent.steps.map((step, processIndex) => (
                      <div key={processIndex} className="process-step">
                        <div className="process-step-indicator">
                          <div className="process-step-number">{processIndex + 1}</div>
                          {processIndex < processContent.steps.length - 1 && (
                            <div className="process-step-connector"></div>
                          )}
                        </div>
                        <div className="process-step-content">
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
                <div key={sectionIndex} className={`section-cards ${cardsContent.layout || 'grid'}`}>
                  <h3 className="cards-title">{cardsContent.title}</h3>
                  <div className="cards-container">
                    {cardsContent.items.map((card, cardIndex) => (
                      <div key={cardIndex} className={`card-item ${card.highlight ? 'highlighted' : ''}`}>
                        {card.icon && (
                          <div className="card-icon">
                            {renderIcon(card.icon)}
                          </div>
                        )}
                        <h4 className="card-title">{card.title}</h4>
                        <p className="card-description">{card.description}</p>
                        {card.footer && (
                          <div className="card-footer">
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
                <div key={sectionIndex} className="section-coffee-callout">
                  <div className="coffee-callout-content">
                    <div className="coffee-callout-icon">
                      {renderIcon(coffeeContent.icon || 'star')}
                    </div>
                    <h2 className="coffee-callout-title">{coffeeContent.title}</h2>
                    <p className="coffee-callout-text">{coffeeContent.content}</p>
                    {coffeeContent.actionButton && (
                      <a 
                        href={coffeeContent.actionButton.url} 
                        className={`coffee-callout-button ${coffeeContent.actionButton.primary ? 'primary' : 'secondary'}`}
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
                <div key={sectionIndex} className="section-featured-list">
                  <h3 className="featured-list-title">{featuredContent.title}</h3>
                  <div className="featured-list-container">
                    {featuredContent.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="featured-list-item">
                        <div className="featured-list-number">{itemIndex + 1}</div>
                        <div className="featured-list-content">
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
              
            case 'divider':
              return <hr key={sectionIndex} className="section-divider" />;
              
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Tab component for tab sections
  const TabGroup = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);
    
    return (
      <div className="tabs-component">
        <div className="tabs-header">
          {tabs.map((tab, index) => (
            <button 
              key={index} 
              className={`tab-button ${index === activeTab ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {tabs[activeTab].content.map((item, index) => {
            switch (item.type) {
              case 'text':
                return <p key={index} className="tab-text">{item.value}</p>;
              case 'list':
                return (
                  <ul key={index} className="tab-list">
                    {item.items.map((li, liIndex) => (
                      <li key={liIndex}>
                        <span className="list-icon">{renderIcon('check')}</span>
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

  return (
    <div className="resource-hub">
      <div className="playbook-selector">
        <div className="selector-label">
          <FontAwesomeIcon icon={faBookOpen} className="selector-icon" />
          <span>Select a Playbook:</span>
        </div>
        <select 
          value={selectedPlaybookId || ''} 
          onChange={handlePlaybookChange}
          className="selector-dropdown"
        >
          <option value="" disabled>Choose a playbook</option>
          {playbooks.map(playbook => (
            <option key={playbook.id} value={playbook.id}>
              {playbook.title}
            </option>
          ))}
        </select>
      </div>
      
      {currentPlaybook && (
        <div className="playbook-viewer">
          <div className="playbook-header">
            <h1>{currentPlaybook.title}</h1>
            {currentPlaybook.subtitle && (
              <p className="playbook-subtitle">{currentPlaybook.subtitle}</p>
            )}
            <div className="playbook-meta">
              <div className="meta-item">
                <span className="meta-label">Level:</span>
                <span className="meta-value">{currentPlaybook.level}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Reading Time:</span>
                <span className="meta-value">{currentPlaybook.estimatedTime}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{currentPlaybook.category}</span>
              </div>
            </div>
          </div>
          
          <div className="playbook-container">
            <div className={`playbook-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
              <button className="sidebar-toggle" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} />
              </button>
              {playbookStructure && (
                <>
                  <h3 className="sidebar-title">Contents</h3>
                  <ul className="sidebar-nav">
                    {playbookStructure.pages.map((page, index) => (
                      <li 
                        key={page.id} 
                        className={index === currentPage ? 'active' : ''}
                        onClick={() => jumpToPage(index)}
                      >
                        <span className="page-number">{index + 1}</span>
                        <span className="page-title">{page.title}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            
            <div className="playbook-content" ref={contentRef}>
              {renderPageContent()}
            </div>
          </div>
          
          <div className="playbook-navigation">
            <button 
              className="nav-button prev" 
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="nav-icon" />
              <span>Previous</span>
            </button>
            <div className="page-indicator">
              <div className="page-dots">
                {playbookStructure && playbookStructure.pages.map((_, index) => (
                  <span 
                    key={index} 
                    className={`page-dot ${index === currentPage ? 'active' : ''}`}
                    onClick={() => jumpToPage(index)}
                  ></span>
                ))}
              </div>
              <span className="page-numbers">
                Page {currentPage + 1} of {playbookStructure ? playbookStructure.pages.length : 0}
              </span>
            </div>
            <button 
              className="nav-button next" 
              onClick={nextPage}
              disabled={!playbookStructure || currentPage === playbookStructure.pages.length - 1}
            >
              <span>Next</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-icon" />
            </button>
          </div>
        </div>
      )}
      
      <div className="global-support-section">
        <div className="support-content">
          <div className="support-icon">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <h2 className="support-title">☕ Support My Work</h2>
          <p className="support-text">
            If you found these resources valuable, please consider supporting my work.
            Your contribution helps me create more practical, actionable content for marketers like you!
          </p>
          <a 
            href="https://ko-fi.com/amitbhalla" 
            className="support-button"
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

export default ResourceHub;