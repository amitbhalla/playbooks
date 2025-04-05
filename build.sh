#!/bin/bash
# File: setup-resource-hub.sh
# Description: Script to create the directory structure and empty files for the Marketing Resource Hub

echo "Setting up Marketing Resource Hub project structure..."

# Create main directories
echo "Creating main directories..."
mkdir -p src/components/ResourceHub/data
mkdir -p public/images

# Create component files
echo "Creating component files..."
touch src/components/ResourceHub/ResourceHub.js
touch src/components/ResourceHub/ResourceHub.css
touch src/App.js
touch src/index.js
touch src/index.css

# Create JSON data files
echo "Creating JSON data files..."
touch src/components/ResourceHub/data/playbooks-index.json
touch src/components/ResourceHub/data/content-marketing-playbook-structure.json
touch src/components/ResourceHub/data/content-marketing-playbook-content.json
touch src/components/ResourceHub/data/conversion-optimization-guide-structure.json
touch src/components/ResourceHub/data/conversion-optimization-guide-content.json

# Create placeholder images (empty files)
echo "Creating placeholder image files..."
touch public/images/content-marketing-overview.svg
touch public/images/conversion-optimization-overview.svg

# Create project files
echo "Creating project files..."
touch package.json
touch README.md
touch .gitignore

echo "Adding empty placeholder for public/index.html..."
touch public/index.html

echo "Project structure setup complete! Directory structure:"
echo "
project-root/
├── src/
│   ├── components/
│   │   └── ResourceHub/
│   │       ├── data/
│   │       │   ├── playbooks-index.json
│   │       │   ├── content-marketing-playbook-structure.json
│   │       │   ├── content-marketing-playbook-content.json
│   │       │   ├── conversion-optimization-guide-structure.json
│   │       │   └── conversion-optimization-guide-content.json
│   │       ├── ResourceHub.js
│   │       └── ResourceHub.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── public/
│   ├── images/
│   │   ├── content-marketing-overview.svg
│   │   └── conversion-optimization-overview.svg
│   └── index.html
├── package.json
├── README.md
└── .gitignore
"

echo "Next steps:"
echo "1. Install required dependencies: npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome"
echo "2. Copy the component code and data from the provided files into their respective locations"
echo "3. Import and use the ResourceHub component in your App.js"