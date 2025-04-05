import React from 'react';
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
  faRobot
} from '@fortawesome/free-solid-svg-icons';
import './ContentSection.css';

const ContentSection = ({ section, sectionIndex, playbookContent }) => {
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

  // Helper to get section content
  const getContent = (ref) => playbookContent.sections[ref];
  
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

  // Render content based on section type
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
            <li key={itemIndex} className="list-item">
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
          <p>"{quoteContent.text}"</p>
          {quoteContent.author && (
            <cite>— {quoteContent.author}</cite>
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
        <div key={sectionIndex} className={`section-grid columns-${gridContent.columns || 1}`}>
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
          <TabGroupMobile tabs={tabsContent.tabs} />
        </div>
      );
    
    case 'comparison':
      const comparisonContent = getContent(section.contentRef);
      return (
        <div key={sectionIndex} className="section-comparison">
          <h3 className="comparison-title">{comparisonContent.title}</h3>
          {comparisonContent.rows.map((row, rowIndex) => (
            <div key={rowIndex} className="comparison-card">
              <div className="comparison-feature">{row.feature}</div>
              <div className="comparison-values">
                {row.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="comparison-value-item">
                    <div className="comparison-column-header">
                      {comparisonContent.columns[valueIndex]}
                    </div>
                    <div className="comparison-value">
                      {typeof value === 'boolean' ? 
                        (value ? <FontAwesomeIcon icon={faCheck} className="check-icon" /> : '-') : 
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
        <div key={sectionIndex} className="section-process">
          <h3 className="process-title">{processContent.title}</h3>
          <div className="process-flow">
            {processContent.steps.map((step, processIndex) => (
              <div key={processIndex} className="process-step">
                <div className="process-step-indicator">
                  <div className="process-step-number">{processIndex + 1}</div>
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
        <div key={sectionIndex} className="section-cards">
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
};

export default ContentSection;
