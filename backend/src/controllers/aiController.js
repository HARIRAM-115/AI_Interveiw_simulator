import { generateInterviewQuestions, evaluateAnswer, generateCareerMatch, generateSkillTutorial } from '../utils/aiUtils.js';

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

export const getCareerRecommendations = async (req, res, next) => {
  try {
    const { skills, interviews } = req.body;
    const recommendations = await generateCareerMatch({ skills, interviews });
    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};

export const getSkillTutorial = async (req, res, next) => {
  try {
    const { skillName } = req.body;
    const tutorial = await generateSkillTutorial({ skillName });
    res.json({ success: true, data: tutorial });
  } catch (error) {
    next(error);
  }
};
