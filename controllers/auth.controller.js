 import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const signup = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      password,
      role,
    });

    if (user) {
      const token = generateToken(user._id, user.role);

      res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken(user._id, user.role);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: token,
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};