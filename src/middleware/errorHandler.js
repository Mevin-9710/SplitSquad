import logger from '../utils/logger.js';

/**
 * Global Error Handler Middleware
 *
 * Catches all unhandled errors and logs them appropriately
 * Returns appropriate HTTP response based on error type
 */

/**
 * Express error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
export function errorHandler(err, req, res, next) {
  // Log the error with full details
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Determine status code
  let statusCode = err.statusCode || err.status || 500;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
  } else if (err.code === 'SQLITE_CONSTRAINT') {
    statusCode = 409;
  }

  // Build error response
  const response = {
    success: false,
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : err.message,
      code: err.code || 'INTERNAL_ERROR',
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * Not Found Handler
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'NOT_FOUND',
    },
  });
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 * @param {Function} fn - Async function
 * @returns {Function} - Wrapped function
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};