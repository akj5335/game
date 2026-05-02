const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const env = require('./config/env');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100, // 100 requests
  windowMs: 15 * 60 * 1000, // 15 mins
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Routes
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const gameRoutes = require('./routes/gameRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/payments', paymentRoutes);

// Root Route for Cloud Health Checks (Railway/Render)
app.get('/', (req, res) => {
  res.status(200).send('NeonPlay Backend API is running 🚀');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});
