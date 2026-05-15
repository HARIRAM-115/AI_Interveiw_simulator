import User from '../models/userModel.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.create({ name, email, role });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
