import express from 'express';
import authRoutes from './authRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import aiRoutes from './aiRoutes.js';
import interviewRoutes from './interviewRoutes.js';
import { getUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/resume', resumeRoutes);
router.use('/ai', aiRoutes);
router.use('/interviews', interviewRoutes);
router.get('/users', protect, getUsers);


router.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

export default router;
