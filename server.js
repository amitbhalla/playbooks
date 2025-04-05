const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Basic request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build'), {
  // Set cache headers for static assets
  maxAge: '30d'
}));

// For any request that doesn't match one above, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
