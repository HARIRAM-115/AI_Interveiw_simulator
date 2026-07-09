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
    type: {
      type: String,
      enum: ['Technical', 'Behavioral', 'Mixed'],
      default: 'Mixed',
    },
    company: {
      type: String,
      default: 'None',
    },
    skills: {
      type: [String],
      default: [],
    },
    roadmap: {
      type: Array,
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
        detailedExplanation: {
          type: String,
          default: '',
        },
        modelAnswer: {
          type: String,
          default: '',
        },
        fillerWords: {
          type: [String],
          default: [],
        },
        fillerCount: {
          type: Number,
          default: 0,
        },
        communicationScore: {
          type: Number,
          default: 100,
        },
        codeComplexity: {
          type: String,
          default: '',
        },
        codeQualityScore: {
          type: Number,
          default: 0,
        },
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
