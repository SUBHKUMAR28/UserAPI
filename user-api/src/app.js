// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const adminRoutes = require('./routes/admin/index');
const walletRoutes = require('./routes/wallet.routes');
const paymentRoutes = require('./routes/payment.routes');
const loanRoutes = require('./routes/loan.routes');
const userkycRoutes = require('./routes/userkyc.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');


const errorMiddleware = require('./middlewares/error.middleware');
const notFoundMiddleware = require('./middlewares/notFound.middleware');

const app = express();

// ---------- Global Middlewares ----------
app.use(helmet());

// Bug #7 Fix: CORS sirf allowed origins ke liye
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---------- Static files (uploaded images) ----------
// app.use('/uploads', express.static('uploads'));

// ---------- Routes ----------
app.get('/', (req, res) => {
  res.json({ status: true, message: 'LockPe API is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/kyc', userkycRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);


// ---------- 404 + Error Handler (always last) ----------
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;