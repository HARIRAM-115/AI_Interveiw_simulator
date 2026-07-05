import { generateInterviewQuestions, evaluateAnswer } from '../utils/aiUtils.js';

export const generateQuestions = async (req, res, next) => {
  try {
    const { role, skills, resumeText } = req.body;
    const questions = await generateInterviewQuestions({ role, skills, resumeText });
    res.json({ success: true, data: { questions } });
  } catch (error) {
    next(error);
  }
};

export const evaluateResponse = async (req, res, next) => {
  try {
    const { question, answer, role } = req.body;
    const result = await evaluateAnswer({ question, answer, role });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
