// File: src/components/MobilePageContent/MobilePageContent.js
import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
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
  faSpinner,
  
} from '@fortawesome/free-solid-svg-icons';
import Hammer from 'hammerjs';
import './MobilePageContent.css';

const MobilePageContent = ({ 
  playbookStructure,
  playbookContent,
  currentPage,
  loading,
  onNextPage,
  onPrevPage,
  pageTransitionState
}) => {
  const contentRef = useRef(null);
  const pageRef = useRef(null);

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

  // Setup swipe gestures
  useEffect(() => {
    if (!pageRef.current) return;

    const hammer = new Hammer(pageRef.current);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammer.on('swipeleft', () => {
      if (onNextPage) onNextPage();
    });

    hammer.on('swiperight', () => {
      if (onPrevPage) onPrevPage();
    });

    return () => {
      hammer.destroy();
    };
  }, [onNextPage, onPrevPage, pageRef]);

  // Scroll to top when changing pages
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // Render the correct icon based on the type
  const renderIcon = (iconType) => {
    return <FontAwesomeIcon icon={iconMap[iconType] || faLightbulb} />;
  };

  // Tab component for mobile
  const TabGroupMobile = ({ tabs }) => {
    const [activeTab, setActiveTab] = React.useState(0);
    
    return (
      <div className="mobile-tabs-component">
        <div className="mobile-tabs-header">
          <select 
            className="mobile-tabs-select"
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
        <div className="mobile-tab-content">
          {tabs[activeTab].content.map((item, index) => {
            switch (item.type) {
              case 'text':
                return <p key={index} className="mobile-tab-text">{item.value}</p>;
              case 'list':
                return (
                  <ul key={index} className="mobile-tab-list">
                    {item.items.map((li, liIndex) => (
                      <li key={liIndex}>
                        <span className="mobile-list-icon">{renderIcon('check')}</span>
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

  // If loading, show loading spinner
  if (loading || !playbookStructure || !playbookContent) {
    return (
      <div className="mobile-page-loading">
        <FontAwesomeIcon icon={faSpinner} spin className="mobile-loading-icon" />
        <p>Loading content...</p>
      </div>
    );
  }

  const currentPageStructure = playbookStructure.pages[currentPage];
  
  // Render page content
  return (
    <div 
      className={`mobile-page-container ${pageTransitionState}`} 
      ref={contentRef}
    >
      <div 
        className="mobile-page-content" 
        ref={pageRef}
      >
        <div className="mobile-page-header">
          <h1 className="mobile-page-title">{currentPageStructure.title}</h1>
          <div className="mobile-page-progress">
            <div className="mobile-progress-indicator">
              {currentPage + 1} of {playbookStructure.pages.length}
            </div>
            <div className="mobile-progress-bar">
              <div 
                className="mobile-progress-fill" 
                style={{ width: `${((currentPage + 1) / playbookStructure.pages.length) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Render sections based on structure */}
        {currentPageStructure.sections.map((section, sectionIndex) => {
          // Helper to get section content
          const getContent = (ref) => playbookContent.sections[ref];
          
          switch(section.type) {
            case 'header':
              return (
                <h2 key={sectionIndex} className="mobile-section-header">
                  {getContent(section.contentRef)}
                </h2>
              );
              
            case 'subheader':
              return (
                <h3 key={sectionIndex} className="mobile-section-subheader">
                  {getContent(section.contentRef)}
                </h3>
              );
              
            case 'paragraph':
              return (
                <p key={sectionIndex} className="mobile-section-paragraph">
                  {getContent(section.contentRef)}
                </p>
              );
              
            case 'list':
              return (
                <ul key={sectionIndex} className="mobile-section-list">
                  {getContent(section.contentRef).map((item, itemIndex) => (
                    <li key={itemIndex} className="mobile-list-item">
                      <span className="mobile-list-icon">{renderIcon('check')}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
              
            case 'callout':
              const calloutContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className={`mobile-section-callout ${calloutContent.type || 'info'}`}>
                  <div className="mobile-callout-icon">
                    {renderIcon(calloutContent.icon || 'info')}
                  </div>
                  <div className="mobile-callout-content">
                    <h3>{calloutContent.title}</h3>
                    <p>{calloutContent.content}</p>
                  </div>
                </div>
              );
              
            case 'icon':
              const iconContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="mobile-section-icon">
                  <div className="mobile-icon-container">
                    {renderIcon(iconContent.icon)}
                  </div>
                  {iconContent.caption && (
                    <p className="mobile-icon-caption">{iconContent.caption}</p>
                  )}
                </div>
              );
              
            case 'steps':
              const stepsContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="mobile-section-steps">
                  <h3 className="mobile-steps-title">{stepsContent.title}</h3>
                  <div className="mobile-steps-container">
                    {stepsContent.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="mobile-step-item">
                        <div className="mobile-step-number">{stepIndex + 1}</div>
                        <div className="mobile-step-content">
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
                <blockquote key={sectionIndex} className="mobile-section-quote">
                  <p>"{quoteContent.text}"</p>
                  {quoteContent.author && (
                    <cite>— {quoteContent.author}</cite>
                  )}
                </blockquote>
              );
              
            case 'statistic':
              const statContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="mobile-section-statistic">
                  <div className="mobile-statistic-container">
                    <div className="mobile-statistic-value">{statContent.value}</div>
                    <div className="mobile-statistic-label">{statContent.label}</div>
                  </div>
                  {statContent.description && (
                    <p className="mobile-statistic-description">{statContent.description}</p>
                  )}
                </div>
              );
            
            case 'grid':
              const gridContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className={`mobile-section-grid columns-${gridContent.columns || 1}`}>
                  {gridContent.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="mobile-grid-item">
                      <div className="mobile-grid-icon">
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
                <div key={sectionIndex} className="mobile-section-tabs">
                  <TabGroupMobile tabs={tabsContent.tabs} />
                </div>
              );
            
            case 'comparison':
              const comparisonContent = getContent(section.contentRef);
              return (
                <div key={sectionIndex} className="mobile-section-comparison">
                  <h3 className="mobile-comparison-title">{comparisonContent.title}</h3>
                  {comparisonContent.rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="mobile-comparison-card">
                      <div className="mobile-comparison-feature">{row.feature}</div>
                      <div className="mobile-comparison-values">
                        {row.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="mobile-comparison-value-item">
                            <div className="mobile-comparison-column-header">
                              {comparisonContent.columns[valueIndex]}
                            </div>
                            <div className="mobile-comparison-value">
                              {typeof value === 'boolean' ? 
                                (value ? <FontAwesomeIcon icon={faCheck} className="mobile-check-icon" /> : '-') : 
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
                <div key={sectionIndex} className="mobile-section-process">
                  <h3 className="mobile-process-title">{processContent.title}</h3>
                  <div className="mobile-process-flow">
                    {processContent.steps.map((step, processIndex) => (
                      <div key={processIndex} className="mobile-process-step">
                        <div className="mobile-process-step-indicator">
                          <div className="mobile-process-step-number">{processIndex + 1}</div>
                        </div>
                        <div className="mobile-process-step-content">
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
                <div key={sectionIndex} className="mobile-section-cards">
                  <h3 className="mobile-cards-title">{cardsContent.title}</h3>
                  <div className="mobile-cards-container">
                    {cardsContent.items.map((card, cardIndex) => (
                      <div key={cardIndex} className={`mobile-card-item ${card.highlight ? 'highlighted' : ''}`}>
                        {card.icon && (
                          <div className="mobile-card-icon">
                            {renderIcon(card.icon)}
                          </div>
                        )}
                        <h4 className="mobile-card-title">{card.title}</h4>
                        <p className="mobile-card-description">{card.description}</p>
                        {card.footer && (
                          <div className="mobile-card-footer">
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
                <div key={sectionIndex} className="mobile-section-coffee-callout">
                  <div className="mobile-coffee-callout-content">
                    <div className="mobile-coffee-callout-icon">
                      {renderIcon(coffeeContent.icon || 'star')}
                    </div>
                    <h2 className="mobile-coffee-callout-title">{coffeeContent.title}</h2>
                    <p className="mobile-coffee-callout-text">{coffeeContent.content}</p>
                    {coffeeContent.actionButton && (
                      <a 
                        href={coffeeContent.actionButton.url} 
                        className={`mobile-coffee-callout-button ${coffeeContent.actionButton.primary ? 'primary' : 'secondary'}`}
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
                <div key={sectionIndex} className="mobile-section-featured-list">
                  <h3 className="mobile-featured-list-title">{featuredContent.title}</h3>
                  <div className="mobile-featured-list-container">
                    {featuredContent.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mobile-featured-list-item">
                        <div className="mobile-featured-list-number">{itemIndex + 1}</div>
                        <div className="mobile-featured-list-content">
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
              
            case 'divider':
              return <hr key={sectionIndex} className="mobile-section-divider" />;
              
            default:
              return null;
          }
        })}

        {/* Page navigation indicators */}
        <div className="mobile-page-navigation-hint">
          <div className="mobile-swipe-hint">
            <span>Swipe left or right to navigate between pages</span>
          </div>
          <div className="mobile-page-dots">
            {playbookStructure.pages.map((_, index) => (
              <div 
                key={index} 
                className={`mobile-page-dot ${index === currentPage ? 'active' : ''}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePageContent;
