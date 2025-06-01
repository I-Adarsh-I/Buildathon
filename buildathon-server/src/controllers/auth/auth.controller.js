const User = require('../../models/users.models');

exports.googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      console.log("Went inside");
      return res.redirect('/api/v1/auth/failure');
    }

    // You can now use req.user to fetch details
    const { googleId, name, email, profilePhoto } = req.user;

    console.log("logging google id", req.user);

    // const email = emails?.[0]?.value;
    // const profilePhoto = photos?.[0]?.value;

    // Check if user already exists
    let user = await User.findOne({ googleId: googleId });

    if (!user) {
      // Check by email in case user already signed up manually
      user = await User.findOne({ email });

      if (user) {
        // Link Google ID if account exists with same email
        user.googleId = googleId;
        user.profilePhoto = profilePhoto || user.profilePhoto;
        await user.save();
      } else {
        // New Google user
        user = await User.create({
          name: name,
          email: email,
          googleId: googleId,
          profilePhoto
        });
      }
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    
    return res.redirect('/api/v1/auth/success');
  } catch (error) {
    console.error('Google login error:', error);
    return res.redirect('/api/v1/auth/failure');
  }
};

exports.loginSuccess = (req, res) => {
  res.status(200).json({
    message: 'Login successful',
    user: req.user, // Passport attaches user here
  });
};

exports.authSuccess = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'No active session' });
  }
  res.status(200).json({ success: true, user: req.session.user });
};

exports.authFailure = (req, res) => {
  res.status(401).json({ success: false, message: 'Authentication failed' });
};

exports.logoutHandler = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(400).json({ message: 'No active session to log out.' });
  }
  
  req.logout(function(err) {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed.' });
      }

      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Successfully logged out.' });
    });
  });
};