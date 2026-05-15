import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized');
      }
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Token is invalid or has expired'));
    }
  }

  res.status(401);
  next(new Error('Authorization header missing')); 
};
