import express from 'express';
import {
  startInterview,
  submitAnswer,
  finishInterview,
  getInterviews,
  getInterviewDetails,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/start', startInterview);
router.post('/:id/submit-answer', submitAnswer);
router.post('/:id/finish', finishInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewDetails);

export default router;
