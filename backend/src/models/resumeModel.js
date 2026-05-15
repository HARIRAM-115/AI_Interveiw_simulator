import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    originalFileName: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: [String],
      default: [],
    },
    experience: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
