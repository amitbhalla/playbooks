import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBook, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './PlaybookSelector.css';

const PlaybookSelector = ({
  playbooks,
  selectedPlaybookId,
  onPlaybookSelect,
  isOpen,
  onClose,
  selectorRef
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="playbook-selector" ref={selectorRef}>
      <div className="playbook-selector-backdrop" onClick={onClose} />
      <div className="playbook-selector-panel">
        <div className="playbook-selector-header">
          <h2>Select a Playbook</h2>
          <button 
            className="playbook-selector-close" 
            onClick={onClose}
            aria-label="Close selector"
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
              <div className="playbook-selector-item-content">
                <span className="playbook-selector-icon">
                  <FontAwesomeIcon icon={faBook} />
                </span>
                <div className="playbook-selector-details">
                  <span className="playbook-selector-title">
                    {playbook.title}
                  </span>
                  {playbook.description && (
                    <span className="playbook-selector-description">
                      {playbook.description}
                    </span>
                  )}
                </div>
                {playbook.id === selectedPlaybookId && (
                  <span className="playbook-selector-active">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaybookSelector;
