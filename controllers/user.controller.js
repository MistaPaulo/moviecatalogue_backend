import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    const { name, email, password } = req.body;
    if (name)   updates.name = name;
    if (email)  updates.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updates.password = hashed;
    }

    const user = await User
      .findByIdAndUpdate(req.user.id, updates, { new: true })
      .select('-password');

    res.json(user);
  } catch (err) {
    next(err);
  }
};
