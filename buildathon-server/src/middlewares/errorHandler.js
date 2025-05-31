module.exports = (err, req, res, next) => {
  console.error('Error:', err.stack || err.message || err);
  
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};