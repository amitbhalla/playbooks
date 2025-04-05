import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './PageNavigator.css';

const PageNavigator = ({ 
  currentPage, 
  totalPages, 
  onNextPage, 
  onPrevPage, 
  isPrevDisabled,
  isNextDisabled
}) => {
  return (
    <div className="page-navigator">
      <div className="page-navigation-controls">
        <button
          className="page-nav-button prev"
          onClick={onPrevPage}
          disabled={isPrevDisabled}
          aria-label="Previous page"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          <span className="page-nav-label">Previous</span>
        </button>
        
        <div className="page-indicator">
          <div className="page-progress-bar">
            <div 
              className="page-progress-fill"
              style={{width: `${((currentPage + 1) / totalPages) * 100}%`}}
            ></div>
          </div>
          <div className="page-count">
            {currentPage + 1} / {totalPages}
          </div>
        </div>
        
        <button
          className="page-nav-button next"
          onClick={onNextPage}
          disabled={isNextDisabled}
          aria-label="Next page"
        >
          <span className="page-nav-label">Next</span>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      
      <div className="page-dots">
        {Array.from({length: totalPages}).map((_, index) => (
          <div 
            key={index}
            className={`page-dot ${index === currentPage ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PageNavigator;
