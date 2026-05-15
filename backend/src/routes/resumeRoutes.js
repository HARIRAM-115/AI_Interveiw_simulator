import express from 'express';
import multer from 'multer';
import { uploadResume, getResumes } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResumes);

export default router;
