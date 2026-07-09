import pdfParse from 'pdf-parse';
import Resume from '../models/resumeModel.js';
import { parseResumeText } from '../utils/parseResume.js';

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400);
      throw new Error('Resume file is required');
    }

    const { originalname, buffer } = req.file;
    const parsed = await pdfParse(buffer);
    const { extractedText, skills, education, experience, atsScore, missingKeywords, weakKeywords } = parseResumeText(parsed.text);

    const resume = await Resume.create({
      userId: req.user._id,
      originalFileName: originalname,
      extractedText,
      skills,
      education,
      experience,
      atsScore,
      missingKeywords,
      weakKeywords,
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
};
