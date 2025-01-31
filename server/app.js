require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const supabase = require('./supabase');

const allowedOrigins = [
  'http://localhost:5173',
  'https://zendesk-50cz.onrender.com'
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Allow credentials (cookies, authorization headers, etc)
}));

app.use(express.json());

// Auth middleware
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(401)

    try {
    const { data: { user }, error } = await supabase.auth.getUser(authHeader.split(' ')[1]);
    if (error) throw error
    req.user = user
    next()
  } catch (error) {
    console.error('Auth error:', error);
    return res.sendStatus(403)
  }
}

// Simple request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use('/api', authenticateUser, require('./routes'));

// Public routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Protected routes - use auth middleware

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// For testing
module.exports = app;
