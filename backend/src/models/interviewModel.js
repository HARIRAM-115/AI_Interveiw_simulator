import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Junior', 'Mid', 'Senior'],
      default: 'Mid',
    },
    skills: {
      type: [String],
      default: [],
    },
    questions: {
      type: [String],
      required: true,
    },
    answers: {
      type: [String],
      default: [],
    },
    evaluations: [
      {
        questionIndex: Number,
        score: Number,
        feedback: String,
        strengths: [String],
        weaknesses: [String],
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
