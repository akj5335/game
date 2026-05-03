require('express-async-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
require('./config/passport');
const env = require('./config/env');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');

// Connect to database
connectDB();

const rateLimit = require('express-rate-limit');
const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for auth routes
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use('/api/auth', authLimiter);

app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(passport.initialize());

// Routes
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const gameRoutes = require('./routes/gameRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const rewardRoutes = require('./routes/rewardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rewards', rewardRoutes);

// Static Files & Frontend Routing
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend build folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Catch-all route to serve the frontend's index.html
  app.get('*', (req, res) => {
    // Exclude API routes from catch-all
    if (req.path.startsWith('/api')) {
       return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
} else {
  // Root Route for Development/Health Checks
  app.get('/', (req, res) => {
    res.status(200).send('NeonPlay Backend API is running 🚀');
  });
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});
