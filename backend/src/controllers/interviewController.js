import Interview from '../models/interviewModel.js';
import { generateInterviewQuestions, evaluateAnswer, evaluateOverallInterview, generatePersonalizedRoadmap } from '../utils/aiUtils.js';

export const startInterview = async (req, res, next) => {
  try {
    const { role, skills, resumeText, difficulty, type, company, count } = req.body;

    // Fetch previous questions to avoid repetition
    const previousInterviews = await Interview.find({ userId: req.user._id })
      .select('questions')
      .limit(10)
      .lean();
    const excludeList = previousInterviews.flatMap((i) => i.questions || []);

    const limit = count ? Number(count) : 5;
    const questions = await generateInterviewQuestions({
      role,
      skills,
      resumeText,
      difficulty,
      type,
      company: company || 'None',
      count: limit,
      excludeList,
    });

    const interview = await Interview.create({
      userId: req.user._id,
      role,
      difficulty,
      type: type || 'Mixed',
      company: company || 'None',
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
      detailedExplanation: evaluation.detailedExplanation || '',
      modelAnswer: evaluation.modelAnswer || '',
      fillerWords: evaluation.fillerWords || [],
      fillerCount: evaluation.fillerCount || 0,
      communicationScore: evaluation.communicationScore || 100,
      codeComplexity: evaluation.codeComplexity || 'N/A',
      codeQualityScore: evaluation.codeQualityScore || 0,
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
    const collectedWeaknesses = [];
    for (let i = 0; i < interview.questions.length; i++) {
      const evalItem = interview.evaluations.find((e) => e.questionIndex === i) || {
        score: 0,
        feedback: 'No answer provided.',
        strengths: [],
        weaknesses: ['Did not answer'],
        detailedExplanation: 'Candidate did not provide a response.',
        modelAnswer: 'A model answer is not generated for skipped questions.',
        fillerWords: [],
        fillerCount: 0,
        communicationScore: 100,
        codeComplexity: 'N/A',
        codeQualityScore: 0,
      };
      sortedEvaluations[i] = evalItem;
      if (Array.isArray(evalItem.weaknesses)) {
        collectedWeaknesses.push(...evalItem.weaknesses);
      }
    }

    const overall = await evaluateOverallInterview({
      role: interview.role,
      difficulty: interview.difficulty,
      questions: interview.questions,
      answers: interview.answers,
      evaluations: sortedEvaluations,
    });

    const uniqueWeaknesses = [...new Set(collectedWeaknesses)].filter(w => w !== 'Did not answer');
    const roadmap = await generatePersonalizedRoadmap({
      role: interview.role,
      weakAreas: uniqueWeaknesses,
    });

    interview.overallScore = overall.overallScore;
    interview.overallFeedback = overall.overallFeedback;
    interview.roadmap = roadmap;
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

export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Interview.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: '$userId',
          averageScore: { $avg: '$overallScore' },
          totalInterviews: { $sum: 1 },
          bestScore: { $max: '$overallScore' },
          latestRole: { $first: '$role' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          averageScore: { $round: ['$averageScore', 1] },
          totalInterviews: 1,
          bestScore: 1,
          latestRole: 1,
          name: '$user.name',
          role: '$user.role',
          email: '$user.email'
        }
      },
      { $sort: { averageScore: -1, totalInterviews: -1 } },
      { $limit: 15 }
    ]);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};
