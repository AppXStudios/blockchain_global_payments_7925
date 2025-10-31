function errorHandler(err, req, res, next) {
  console.error('API Error:', {
    message: err?.message,
    stack: err?.stack,
    url: req?.url,
    method: req?.method,
    timestamp: new Date()?.toISOString()
  });

  // Default error response
  let status = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (err?.name === 'ValidationError') {
    status = 400;
    message = err?.message;
  } else if (err?.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
  } else if (err?.name === 'ForbiddenError') {
    status = 403;
    message = 'Forbidden';
  } else if (err?.name === 'NotFoundError') {
    status = 404;
    message = 'Resource not found';
  } else if (err?.message) {
    message = err?.message;
  }

  // Send error response
  res?.status(status)?.json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err?.stack })
  });
}

module.exports = errorHandler;