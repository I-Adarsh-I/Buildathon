const User = require('../../models/users.models');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, googleId, profilePhoto, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are mandatory fields that cannot be empty.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      googleId,
      profilePhoto,
      role
    });
    
    return res.status(201).json({ message: 'User created successfully.', user });
  } catch (error) {
    console.error('Error creating user:', error);
    next(err)
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    next(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Not authenticated.' });

    const allowedFields = ['name', 'profilePhoto', 'interests', 'languagePreference', 'bio', 'aiTags'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });

    if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    next(err);
  }
};
