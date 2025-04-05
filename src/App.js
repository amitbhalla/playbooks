import React from 'react';
import ResourceHub from './components/ResourceHub/ResourceHub';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-content">
          <h1>Marketing Resource Hub</h1>
          <p>Access my premium playbooks and guides to elevate your marketing strategy</p>
        </div>
      </header>
      
      <main className="App-main">
        <ResourceHub />
      </main>
      
      <footer className="App-footer">
        <div className="App-footer-content">
          <div className="footer-section">
            <h3>About these Resources</h3>
            <p>My marketing playbooks and guides are created for industry experts with years of experience. I regularly update the content to reflect the latest trends and best practices.</p>
          </div>
          <div className="footer-section">
            <h3>Need Help?</h3>
            <p>If you have any questions about these resources or need personalized assistance, please don't hesitate to contact me at <a href="mailto:amit9815@gmail.com">amit9815@gmail.com</a>.</p>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <p>© {new Date().getFullYear()} Amit Bhalla. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;