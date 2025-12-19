const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
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

/* =========================
   ✅ CORS CONFIG (FIXED)
========================= */
const allowedOrigins = [
  'http://localhost:3000',
  'https://automatic-pesticide-sprinkler-syste.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight requests
app.options('*', cors());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Sanitize data
app.use(mongoSanitize());

// Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

/* =========================
   ✅ ROUTES
========================= */
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/farms', farms);
app.use('/api/spray', spray);
app.use('/api/analytics', analytics);
app.use('/api/notifications', notifications);
app.use('/api/upload', uploadRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/esp32', esp32Routes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be before 404)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server (needed for WebSocket)
const server = http.createServer(app);

/* =========================
   ✅ WEBSOCKET SETUP
========================= */
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

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
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
