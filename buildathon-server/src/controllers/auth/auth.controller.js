const User = require('../../models/users.models');

exports.googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/api/v1/auth/failure');
    }

    // You can now use req.user to fetch details
    const { id, displayName, emails, photos } = req.user;

    const email = emails?.[0]?.value;
    const profilePhoto = photos?.[0]?.value;

    // Check if user already exists
    let user = await User.findOne({ googleId: id });

    if (!user) {
      // Check by email in case user already signed up manually
      user = await User.findOne({ email });

      if (user) {
        // Link Google ID if account exists with same email
        user.googleId = id;
        user.profilePhoto = profilePhoto || user.profilePhoto;
        await user.save();
      } else {
        // New Google user
        user = await User.create({
          name: displayName,
          email: email,
          googleId: id,
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

exports.authSuccess = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'No active session' });
  }
  res.status(200).json({ success: true, user: req.session.user });
};

exports.authFailure = (req, res) => {
  res.status(401).json({ success: false, message: 'Authentication failed' });
};
