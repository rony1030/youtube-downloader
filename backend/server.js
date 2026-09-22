const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
fs.ensureDirSync(downloadsDir);

// Routes
app.use('/api/video', videoRoutes);

// Serve downloaded files
app.use('/downloads', express.static(downloadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// In production, serve the compiled React application from this same service.
const frontendDist = path.join(__dirname, '../frontend/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
