import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faBook } from '@fortawesome/free-solid-svg-icons';
import './MobileHeader.css';

const MobileHeader = ({ 
  title, 
  currentPlaybook, 
  isDropdownOpen, 
  setIsDropdownOpen, 
  dropdownButtonRef
}) => {
  return (
    <div className="mobile-header">
      <div className="mobile-header-brand">
        <FontAwesomeIcon icon={faBook} className="mobile-header-logo" />
        <h1 
          className="mobile-header-title" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          ref={dropdownButtonRef}
        >
          {currentPlaybook?.title || title}
          <FontAwesomeIcon 
            icon={isDropdownOpen ? faChevronUp : faChevronDown} 
            className="mobile-header-dropdown-icon" 
          />
        </h1>
      </div>
    </div>
  );
};

export default MobileHeader;
