module.exports = (req, res, next) => {
  try {
    // Passport automatically attaches `req.isAuthenticated()` and `req.user`
    if (req.isAuthenticated && req.isAuthenticated()) {
      if (!req.user) {
        return res.status(403).json({
          message: 'User authentication failed: No user found in session.'
        });
      }

      // User is authenticated
      return next();
    } else {
      // Not logged in
      return res.status(401).json({
        message: 'Unauthorized: Please log in to access this resource.'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      message: 'Internal server error during authentication.'
    });
  }
};
