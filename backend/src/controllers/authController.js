import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error('Email is already registered');
    }

    const user = await User.create({ name, email, password, role });
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const { _id, name, email, role } = req.user;
    res.json({ success: true, data: { id: _id, name, email, role } });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error('Email is required');
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('No account found with that email address');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });

    console.log(`\n========================================`);
    console.log(`  🔑 PASSWORD RESET OTP FOR: ${email}`);
    console.log(`  CODE: ${otp}`);
    console.log(`  Expires in 10 minutes`);
    console.log(`========================================\n`);

    res.json({ success: true, message: 'Verification code sent to your email address.' });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400);
      throw new Error('Email and OTP are required');
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOtp) {
      res.status(400);
      throw new Error('No password reset request found. Please request a new OTP.');
    }
    if (new Date() > user.resetPasswordExpires) {
      res.status(400);
      throw new Error('OTP has expired. Please request a new code.');
    }
    if (user.resetPasswordOtp !== otp) {
      res.status(400);
      throw new Error('Invalid verification code. Please try again.');
    }

    res.json({ success: true, message: 'OTP verified successfully.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400);
      throw new Error('Email, OTP, and new password are required');
    }
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOtp) {
      res.status(400);
      throw new Error('No password reset request found.');
    }
    if (new Date() > user.resetPasswordExpires) {
      res.status(400);
      throw new Error('OTP has expired. Please request a new code.');
    }
    if (user.resetPasswordOtp !== otp) {
      res.status(400);
      throw new Error('Invalid verification code.');
    }

    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. Please log in.' });
  } catch (error) {
    next(error);
  }
};

