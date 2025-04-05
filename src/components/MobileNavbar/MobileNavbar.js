// File: src/components/MobileNavbar/MobileNavbar.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faChevronDown, 
  faChevronUp, 
  faBook, 
  faArrowLeft, 
  faSearch 
} from '@fortawesome/free-solid-svg-icons';
import './MobileNavbar.css';

const MobileNavbar = ({ 
  title,
  currentPlaybook,
  playbooks,
  handlePlaybookChange,
  selectedPlaybookId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [playbookSelectorOpen, setPlaybookSelectorOpen] = useState(false);

  // Force the menu to close on route changes
  useEffect(() => {
    // Ensure menu is closed initially
    setIsOpen(false);
    
    // Add escape key listener
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setPlaybookSelectorOpen(false);
      }
    };
    
    // Listen for route changes (URL changes) to close menu
    const handleRouteChange = () => {
      setIsOpen(false);
      setPlaybookSelectorOpen(false);
    };
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.navbar-mobile-menu') && 
          !event.target.closest('.navbar-menu-button')) {
        setIsOpen(false);
      }
      
      if (playbookSelectorOpen && !event.target.closest('.playbook-selector-dropdown') &&
          !event.target.closest('.navbar-mobile-title')) {
        setPlaybookSelectorOpen(false);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, playbookSelectorOpen, selectedPlaybookId]);

  // Handle playbook selection
  const onPlaybookSelect = (id) => {
    handlePlaybookChange(id);
    setPlaybookSelectorOpen(false);
    setIsOpen(false);
  };

  // Toggle playbook selector
  const togglePlaybookSelector = () => {
    setPlaybookSelectorOpen(!playbookSelectorOpen);
  };

  return (
    <nav className="navbar-mobile">
      <div className="navbar-mobile-container">
        {/* Top navbar with logo, title and menu button */}
        <div className="navbar-mobile-top">
          <div className="navbar-mobile-brand">
            <FontAwesomeIcon icon={faBook} className="navbar-mobile-logo" />
            <h1 className="navbar-mobile-title" onClick={togglePlaybookSelector}>
              {currentPlaybook?.title || title}
              <FontAwesomeIcon 
                icon={playbookSelectorOpen ? faChevronUp : faChevronDown} 
                className="navbar-mobile-dropdown-icon" 
              />
            </h1>
          </div>
          <button 
            className="navbar-menu-button" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
        
        {/* Menu overlay (only visible when menu is open) */}
        {isOpen && (
          <div 
            className="navbar-mobile-overlay" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Playbook selector dropdown */}
        {playbookSelectorOpen && (
          <div className="playbook-selector-dropdown">
            <div className="playbook-selector-header">
              <h2>Select a Playbook</h2>
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
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Side menu */}
        <div className={`navbar-mobile-menu ${isOpen ? 'open' : ''}`}>
          <div className="navbar-mobile-menu-header">
            <button 
              className="navbar-mobile-close-button" 
              onClick={() => setIsOpen(false)}
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
                    setIsOpen(false);
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
                    setIsOpen(false);
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
