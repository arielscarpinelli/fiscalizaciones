function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    errors: err.errors
  });
  console.error(err);
}

module.exports = errorHandler;
