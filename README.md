# Marketing Resource Hub

A modern, interactive web application for displaying premium marketing playbooks and guides. This application provides a clean, user-friendly interface for accessing structured marketing content with a focus on B2B strategies, product marketing, and analytics.

## 📋 Overview

The Marketing Resource Hub is a React-based web application that serves as a central repository for professional marketing playbooks. It features:

- Interactive, multi-page playbooks with comprehensive content
- Clean, modern UI with intuitive navigation
- Multiple content presentation formats (lists, callouts, comparisons, process flows, etc.)
- Enhanced mobile experience with gesture navigation
- URL parameter support for direct resource access
- Support for deep linking to specific content

## 🚀 Features

- **Content Navigation**: Browse through multiple playbooks using a dropdown selector
- **Page Navigation**: Easily move between pages with previous/next buttons or sidebar navigation
- **Rich Content Formats**: Display content as paragraphs, lists, callouts, steps, quotes, statistics, grids, tabs, comparisons, processes, and cards
- **URL Parameter Support**: Directly access specific playbooks and pages using URL parameters
- **Visual Design**: Modern, clean interface with appropriate spacing and typography
- **Mobile Optimization**: 
  - Dedicated mobile layout with optimized reading experience
  - Gesture-based navigation (swipe left/right to navigate pages)
  - Mobile-specific navigation with hamburger menu
  - Bottom navigation controls for easy access
- **Support Integration**: "Buy Me A Coffee" support section for viewers to contribute

## 🔧 Setup and Installation

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/amitbhalla/playbooks.git
   cd playbooks
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 🔄 Build and Deployment

### Local Build

To create a production build for local use:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### GitHub Pages Deployment

The project is set up for easy deployment to GitHub Pages. To deploy your latest changes:

```bash
npm run deploy
```

This command will build the project and publish it to the `gh-pages` branch of your repository. The live version will be available at: [https://amitbhalla.github.io/playbooks/](https://amitbhalla.github.io/playbooks/)

## 🧩 Project Structure

```
├── public/                  # Public assets
├── src/                     # Source files
│   ├── components/          # React components
│   │   ├── ResourceHub/     # Main resource hub component
│   │   │   ├── data/        # JSON data files for playbooks
│   │   │   │   ├── playbooks-index.json         # Index of all playbooks
│   │   │   │   ├── [playbook]-structure.json    # Structure definitions
│   │   │   │   └── [playbook]-content.json      # Content definitions
│   │   │   ├── ResourceHub.js                   # Main desktop component
│   │   │   └── ResourceHubMobile.js             # Mobile-optimized component
│   │   ├── MobileNavbar/    # Mobile navigation component
│   │   └── MobilePageContent/ # Mobile content display component
│   ├── App.js              # Main App component (with responsive routing)
│   └── index.js            # Application entry point
└── package.json            # Project dependencies and scripts
```

## 📝 Content Structure

The content is organized using a structured JSON format:

- **playbooks-index.json**: Lists all available playbooks with metadata
- **[playbook]-structure.json**: Defines the page structure and section types for each playbook
- **[playbook]-content.json**: Contains the actual content for each playbook

## 🔗 URL Parameters

The application supports URL parameters for direct access to specific content:

- **`p`**: Selects a specific playbook (1-based index)
  - Example: `?p=2` loads the second playbook in the list
- **`c`**: Jumps to a specific content page within the selected playbook (1-based index)
  - Example: `?p=2&c=3` loads the second playbook and jumps to the third page

Both parameters are maintained in sync with user navigation, making deep linking possible. If invalid parameters are provided, the application gracefully falls back to defaults.

## 📱 Mobile Experience

The application includes a dedicated mobile experience with the following features:

- **Responsive Design**: Automatically switches between desktop and mobile views based on screen size
- **Mobile Navigation**:
  - Clean, simplified navbar with playbook selector
  - Side menu for additional navigation options
  - Fixed bottom navigation controls for page navigation
- **Touch Gestures**: Swipe left/right to navigate between pages
- **Optimized Layout**: Content formatting optimized for smaller screens
- **Performance**: Optimized for mobile devices with smooth animations and transitions

## 📈 Change Log

### Version 1.0.0 (Initial Release)
- Basic playbook navigation and content display
- Desktop-oriented UI with responsive elements
- Support for multiple content formats

### Version 1.1.0
- Added URL parameter support (`?p=1`) for direct playbook access
- Improved navigation between playbooks
- Enhanced error handling for content loading

### Version 1.2.0
- Added deep linking support with content page parameters (`?p=1&c=2`)
- State synchronization with URL parameters
- Improved bookmarking and sharing functionality

### Version 1.3.0 (Current)
- Complete mobile experience overhaul:
  - Added dedicated mobile navigation component
  - Implemented gesture-based navigation with Hammer.js
  - Created optimized mobile content display
  - Added mobile-specific layout and styling
- Support section with "Buy Me A Coffee" integration
- Various UI/UX improvements and bug fixes

## 🔄 Adding New Playbooks

To add a new playbook:

1. Create the content JSON file (e.g., `my-new-playbook-content.json`)
2. Create the structure JSON file (e.g., `my-new-playbook-structure.json`)
3. Add an entry to `playbooks-index.json` with the appropriate metadata and file references

## 📱 Browser Compatibility

The application is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

All rights reserved. This code is the property of Amit Bhalla.

## 👨‍💻 Author

**Amit Bhalla**  
Email: [amit9815@gmail.com](mailto:amit9815@gmail.com)

---

© 2025 Amit Bhalla. All rights reserved.