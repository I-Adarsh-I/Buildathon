module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized: Login required.' });
      }

      const user = req.user;

      if (!user || !user.role) {
        return res.status(403).json({ message: 'Access denied: Role not found.' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied: Insufficient permissions.' });
      }

      next();
    } catch (err) {
      console.error('Role authorization error:', err);
      return res.status(500).json({ message: 'Internal server error during role check.' });
    }
  };
};
