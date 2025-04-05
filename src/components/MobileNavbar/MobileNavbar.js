// File: src/components/MobileNavbar/MobileNavbar.js
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faChevronDown, 
  faChevronUp, 
  faBook, 
  faArrowLeft, 
  faSearch,
  faChevronRight 
} from '@fortawesome/free-solid-svg-icons';
import './MobileNavbar.css';

const MobileNavbar = ({ 
  title,
  currentPlaybook,
  playbooks,
  handlePlaybookChange,
  selectedPlaybookId
}) => {
  // References to detect clicks outside elements
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  
  // State for UI components
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close the menu when a playbook is selected
  const onPlaybookSelect = (id) => {
    handlePlaybookChange(id);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Close everything when pressing Escape
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close menu if click is outside menu and menu button
      if (
        isMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      
      // Close dropdown if click is outside dropdown and dropdown button
      if (
        isDropdownOpen && 
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    
    // Add listener only if either menu is open
    if (isMenuOpen || isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen, isDropdownOpen]);

  return (
    <nav className="navbar-mobile">
      <div className="navbar-mobile-container">
        {/* Top navbar with logo, title and menu button */}
        <div className="navbar-mobile-top">
          <div className="navbar-mobile-brand">
            <FontAwesomeIcon icon={faBook} className="navbar-mobile-logo" />
            <h1 
              className="navbar-mobile-title" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              ref={dropdownButtonRef}
            >
              {currentPlaybook?.title || title}
              <FontAwesomeIcon 
                icon={isDropdownOpen ? faChevronUp : faChevronDown} 
                className="navbar-mobile-dropdown-icon" 
              />
            </h1>
          </div>
          <button 
            className="navbar-menu-button" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            ref={menuButtonRef}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
        
        {/* No overlay - removed as requested */}

        {/* Playbook selector dropdown */}
        {isDropdownOpen && (
          <div className="playbook-selector-dropdown" ref={dropdownRef}>
            <div className="playbook-selector-header">
              <h2>Select a Playbook</h2>
              <button 
                className="playbook-selector-close" 
                onClick={() => setIsDropdownOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <ul className="playbook-selector-list">
              {playbooks.map((playbook) => (
                <li
                  key={playbook.id}
                  className={`playbook-selector-item ${playbook.id === selectedPlaybookId ? 'active' : ''}`}
                  onClick={() => onPlaybookSelect(playbook.id)}
                >
                  <span className="playbook-selector-icon">
                    <FontAwesomeIcon icon={faBook} />
                  </span>
                  <span className="playbook-selector-title">
                    {playbook.title}
                  </span>
                  {playbook.id === selectedPlaybookId && (
                    <span className="playbook-selector-active">
                      <FontAwesomeIcon icon={faChevronRight} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Side menu */}
        <div 
          className={`navbar-mobile-menu ${isMenuOpen ? 'open' : ''}`}
          ref={menuRef}
        >
          <div className="navbar-mobile-menu-header">
            <button 
              className="navbar-mobile-close-button" 
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="navbar-mobile-menu-title">Menu</h2>
          </div>
          <div className="navbar-mobile-menu-content">
            <div className="navbar-mobile-menu-section">
              <h3>Playbooks</h3>
              <ul className="navbar-mobile-menu-list">
                {playbooks.map((playbook) => (
                  <li
                    key={playbook.id}
                    className={`navbar-mobile-menu-item ${playbook.id === selectedPlaybookId ? 'active' : ''}`}
                    onClick={() => onPlaybookSelect(playbook.id)}
                  >
                    <FontAwesomeIcon icon={faBook} className="navbar-mobile-menu-icon" />
                    <span>{playbook.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="navbar-mobile-menu-section">
              <h3>Resources</h3>
              <ul className="navbar-mobile-menu-list">
                <li 
                  className="navbar-mobile-menu-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Handle search functionality here
                    alert('Search functionality coming soon!');
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} className="navbar-mobile-menu-icon" />
                  <span>Search All Playbooks</span>
                </li>
                <li 
                  className="navbar-mobile-menu-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.location.href = '/';
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="navbar-mobile-menu-icon" />
                  <span>Back to Main Site</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
