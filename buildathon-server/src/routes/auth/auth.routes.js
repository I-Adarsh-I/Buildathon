const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../../controllers/auth/auth.controller');

// Normal login (email & password)
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/api/v1/auth/failure',
    failureFlash: false,
  }),
  authController.loginSuccess
);

router.get('/logout', authController.logoutHandler);
// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/v1/auth/failure' }),
  authController.googleCallback
);

// Success & failure
router.get('/success', authController.authSuccess);
router.get('/failure', authController.authFailure);

module.exports = router;