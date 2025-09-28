const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');

// Load env vars
dotenv.config();

// Import routes
const auth = require('./routes/auth');
const users = require('./routes/users');
const farms = require('./routes/farms');
const spray = require('./routes/spray');
const analytics = require('./routes/analytics');
const notifications = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');
const diseaseRoutes = require('./routes/disease');
const esp32Routes = require('./routes/esp32');


// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import database connection
const connectDatabase = require('./config/database');

// Connect to database
connectDatabase();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000' ,
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting (optional)
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 mins
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/farms', farms);
app.use('/api/spray', spray);
app.use('/api/analytics', analytics);
app.use('/api/notifications', notifications);
app.use('/api/upload', uploadRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/esp32', esp32Routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server (needed for WebSocket upgrade handling)
const server = http.createServer(app);

// WebSocket setup
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected to /notifications');

  ws.on('message', (message) => {
    console.log('Received:', message);
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Handle WebSocket upgrade for /notifications
server.on('upgrade', (req, socket, head) => {
  if (req.url === '/notifications') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
