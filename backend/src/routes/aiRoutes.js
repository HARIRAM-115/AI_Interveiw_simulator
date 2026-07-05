import express from 'express';
import { generateQuestions, evaluateResponse } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-questions', protect, generateQuestions);
router.post('/evaluate-answer', protect, evaluateResponse);

export default router;
