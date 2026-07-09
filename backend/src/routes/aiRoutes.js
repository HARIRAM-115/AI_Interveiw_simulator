import express from 'express';
import { generateQuestions, evaluateResponse, getCareerRecommendations, getSkillTutorial } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-questions', protect, generateQuestions);
router.post('/evaluate-answer', protect, evaluateResponse);
router.post('/career-match', protect, getCareerRecommendations);
router.post('/skill-tutor', protect, getSkillTutorial);

export default router;
