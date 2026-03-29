const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev (include stack in development)
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  } else {
    // In production only log the message, not the full stack
    console.error(`[${new Date().toISOString()}] ${err.name || 'Error'}: ${err.message}`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = { message: 'Resource not found', statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = { message: 'Duplicate field value entered', statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token', statusCode: 401 };
  }
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired, please log in again', statusCode: 401 };
  }

  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    // In production, hide raw internal error messages for 500s to prevent info-leak
    error: isProduction && statusCode === 500
      ? 'Internal Server Error'
      : (error.message || 'Server Error'),
  });
};

module.exports = errorHandler;
