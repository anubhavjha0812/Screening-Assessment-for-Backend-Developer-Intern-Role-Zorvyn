const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');
const setupSwagger = require('./config/swagger');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const recordRoutes = require('./routes/records');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

// Set up Swagger UI
setupSwagger(app);

// Apply general rate limiting
app.use(generalLimiter);

// Auth Limiter specifically applied to sensitive routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Mount main routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global Error Handler must be last
app.use(errorHandler);

module.exports = app;
