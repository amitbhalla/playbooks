# Marketing Resource Hub

A modern, interactive web application for displaying premium marketing playbooks and guides. This application provides a clean, user-friendly interface for accessing structured marketing content with a focus on B2B strategies, product marketing, and analytics.

## 📋 Overview

The Marketing Resource Hub is a React-based web application that serves as a central repository for professional marketing playbooks. It features:

- Interactive, multi-page playbooks with comprehensive content
- Clean, modern UI with intuitive navigation
- Multiple content presentation formats (lists, callouts, comparisons, process flows, etc.)
- Mobile-responsive design
- URL parameter support for direct resource access

## 🚀 Features

- **Content Navigation**: Browse through multiple playbooks using a dropdown selector
- **Page Navigation**: Easily move between pages with previous/next buttons or sidebar navigation
- **Rich Content Formats**: Display content as paragraphs, lists, callouts, steps, quotes, statistics, grids, tabs, comparisons, processes, and cards
- **URL Parameter Support**: Directly access specific playbooks and pages using URL parameters
- **Visual Design**: Modern, clean interface with appropriate spacing and typography

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

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 🧩 Project Structure

```
├── public/                  # Public assets
├── src/                     # Source files
│   ├── components/          # React components
│   │   └── ResourceHub/     # Main resource hub component
│   │       ├── data/        # JSON data files for playbooks
│   │       │   ├── playbooks-index.json         # Index of all playbooks
│   │       │   ├── [playbook]-structure.json    # Structure definitions
│   │       │   └── [playbook]-content.json      # Content definitions
│   │       └── ResourceHub.js                   # Main component
│   ├── App.js              # Main App component
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

If an invalid parameter is provided or the parameter is missing, the application defaults to the first playbook and/or first page.

Examples:
- `/?p=1` - Opens the first playbook at the first page
- `/?p=2&c=5` - Opens the second playbook at the fifth page
- `/?p=3&c=2` - Opens the third playbook at the second page

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