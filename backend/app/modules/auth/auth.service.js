const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const { JWT_SECRET } = require('../../../config/env');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { status: 400, message: 'Email already registered' };
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
  });

  const token = generateToken(user);
  return { user, token };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 401, message: 'Invalid email or password' };
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw { status: 401, message: 'Invalid email or password' };
  }

  const token = generateToken(user);
  return { user, token };
};

exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }
  return user;
};
