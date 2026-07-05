import Interview from '../models/interviewModel.js';
import { generateInterviewQuestions, evaluateAnswer, evaluateOverallInterview } from '../utils/aiUtils.js';

export const startInterview = async (req, res, next) => {
  try {
    const { role, skills, resumeText, difficulty, count } = req.body;

    const limit = count ? Number(count) : 5;
    const questions = await generateInterviewQuestions({
      role,
      skills,
      resumeText,
      difficulty,
      count: limit,
    });

    const interview = await Interview.create({
      userId: req.user._id,
      role,
      difficulty,
      skills: skills || [],
      questions,
      answers: new Array(questions.length).fill(''),
      evaluations: [],
      completed: false,
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, answer } = req.body;
    const interviewId = req.params.id;

    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }

    const idx = Number(questionIndex);
    if (idx < 0 || idx >= interview.questions.length) {
      res.status(400);
      throw new Error('Invalid question index');
    }

    const questionText = interview.questions[idx];
    const evaluation = await evaluateAnswer({
      question: questionText,
      answer,
      role: interview.role,
    });

    // Update answer
    interview.answers[idx] = answer;

    // Remove any existing evaluation for the same index to prevent duplicates
    interview.evaluations = interview.evaluations.filter((e) => e.questionIndex !== idx);

    // Push new evaluation
    interview.evaluations.push({
      questionIndex: idx,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
    });

    // Mark modifications so Mongoose knows the nested array / items changed
    interview.markModified('answers');
    interview.markModified('evaluations');

    await interview.save();

    res.json({ success: true, data: { evaluation, interview } });
  } catch (error) {
    next(error);
  }
};

export const finishInterview = async (req, res, next) => {
  try {
    const interviewId = req.params.id;

    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }

    // Sort evaluations to align with questions
    const sortedEvaluations = [];
    for (let i = 0; i < interview.questions.length; i++) {
      const evalItem = interview.evaluations.find((e) => e.questionIndex === i) || {
        score: 0,
        feedback: 'No answer provided.',
        strengths: [],
        weaknesses: ['Did not answer'],
      };
      sortedEvaluations[i] = evalItem;
    }

    const overall = await evaluateOverallInterview({
      role: interview.role,
      difficulty: interview.difficulty,
      questions: interview.questions,
      answers: interview.answers,
      evaluations: sortedEvaluations,
    });

    interview.overallScore = overall.overallScore;
    interview.overallFeedback = overall.overallFeedback;
    interview.completed = true;

    await interview.save();

    res.json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

export const getInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: interviews });
  } catch (error) {
    next(error);
  }
};

export const getInterviewDetails = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id })
      .lean();
    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }
    res.json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};
