const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'api/v1/auth/failure',
    successRedirect: 'api/v1/auth/success'
  })
);

// Success & failure
router.get('/success', (req, res) => {
  res.send(`Welcome`);
});

router.get('/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

module.exports = router;