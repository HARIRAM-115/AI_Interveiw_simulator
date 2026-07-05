import OpenAI from 'openai';

const createClient = () => {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

const buildFallbackQuestions = ({ role = 'software engineer', skills = [], resumeText = '', count = 5 }) => {
  const skillList = Array.isArray(skills) && skills.length > 0 ? skills : ['problem solving', 'communication'];
  const resumeSummary = resumeText ? resumeText.slice(0, 120) : 'professional experience';
  const roleLabel = role || 'software engineer';

  const baseQuestions = [
    `Tell me about your experience in ${roleLabel}.`,
    `How have you used ${skillList.slice(0, 2).join(' and ')} in your work?`,
    `Describe a project where you solved a challenging problem and explain the outcome.`,
    `What approach do you take when you need to learn a new technology quickly?`,
    `How would you explain your background and strengths to a hiring manager based on ${resumeSummary}?`,
    `Describe your typical workflow when collaborating with cross-functional teams.`,
    `How do you handle technical debt or design trade-offs under tight deadlines?`
  ];

  return baseQuestions.slice(0, count);
};

const buildFallbackEvaluation = ({ question = '', answer = '', role = 'software engineer' }) => {
  const cleanedAnswer = (answer || '').trim();
  let score = 4;

  if (cleanedAnswer.length > 80) score += 2;
  if (cleanedAnswer.length > 180) score += 2;
  if (/(because|for example|team|project|problem|solution|result|improve)/i.test(cleanedAnswer)) score += 1;
  if (score > 10) score = 10;

  return {
    score,
    feedback: `Your answer to "${question}" was thoughtful and relevant for a ${role} role. Add a few more concrete examples and outcomes to strengthen it further.`,
    strengths: ['Clear communication', 'Shows relevant domain awareness'],
    weaknesses: ['Can be more specific', 'Needs stronger examples and measurable outcomes'],
  };
};

export const generateInterviewQuestions = async ({ role = 'software engineer', skills = [], resumeText = '', difficulty = 'Mid', count = 5 }) => {
  const client = createClient();

  if (!client) {
    return buildFallbackQuestions({ role, skills, resumeText, count });
  }

  try {
    const prompt = `You are an interviewer for an AI interview simulator. Generate exactly ${count} concise and professional interview questions for a ${difficulty}-level ${role} role. Use the candidate's resume skills and background when relevant.
Resume skills: ${skills.join(', ') || 'general software engineering'}.
Resume text: ${resumeText.slice(0, 1800)}.

Return the questions as a simple numbered list, one question per line. Do not include any intro, outro, headers, or explanations.`;

    const response = await client.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const text = response.choices?.[0]?.message?.content || '';
    return text
      .split(/\n+/)
      .map((line) => line.replace(/^[-*\d.\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, count);
  } catch (error) {
    console.warn('Groq question generation failed, using fallback questions.', error);
    return buildFallbackQuestions({ role, skills, resumeText, count });
  }
};

export const evaluateAnswer = async ({ question = '', answer = '', role = 'software engineer' }) => {
  const client = createClient();

  if (!client) {
    return buildFallbackEvaluation({ question, answer, role });
  }

  try {
    const prompt = `You are a strict interview evaluator. Evaluate the following answer to the interview question for a ${role} role.
Provide your output as a raw JSON object containing exactly the following fields (do not include markdown wrapping or other text):
- "score": (number from 0 to 10)
- "feedback": (detailed feedback string)
- "strengths": (array of strings, e.g. ["Strong technical depth", ...])
- "weaknesses": (array of strings, e.g. ["Could give more specific metrics", ...])

Question: ${question}
Answer: ${answer}`;

    const response = await client.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    const text = response.choices?.[0]?.message?.content || '{}';
    try {
      const cleanJsonText = text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanJsonText);
    } catch {
      // Basic extraction regex if json parsing fails directly
      const scoreMatch = text.match(/"score"\s*:\s*(\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 6;
      return {
        score,
        feedback: text.slice(0, 500),
        strengths: ['Relevant domain experience'],
        weaknesses: ['Could benefit from more structural depth'],
      };
    }
  } catch (error) {
    console.warn('Groq evaluation failed, using fallback evaluation.', error);
    return buildFallbackEvaluation({ question, answer, role });
  }
};

export const evaluateOverallInterview = async ({ role = 'software engineer', difficulty = 'Mid', questions = [], answers = [], evaluations = [] }) => {
  const client = createClient();

  if (!client) {
    const avgScore = evaluations.length > 0
      ? Math.round((evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length) * 10) / 10
      : 5;
    return {
      overallScore: avgScore,
      overallFeedback: `You completed a ${difficulty}-level interview for the ${role} role. Keep practicing to improve details in your answers.`,
    };
  }

  try {
    const summaryData = questions.map((q, idx) => ({
      question: q,
      answer: answers[idx] || '',
      score: evaluations[idx]?.score || 0,
      feedback: evaluations[idx]?.feedback || '',
    }));

    const prompt = `You are a professional recruitment manager. Review the performance of a candidate who took a ${difficulty}-level interview for the role of ${role}.
Here is the summary of questions asked, candidate's answers, and individual scores:
${JSON.stringify(summaryData, null, 2)}

Provide an overall assessment of the candidate. Return a raw JSON object containing exactly:
- "overallScore": (number from 0 to 10)
- "overallFeedback": (detailed paragraph summary, highlighting overall strengths, major areas for improvement, and advice)

Do not include any text, code blocks, or markdown formatting outside the raw JSON object.`;

    const response = await client.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1000,
    });

    const text = response.choices?.[0]?.message?.content || '{}';
    try {
      const cleanJsonText = text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJsonText);
      return {
        overallScore: Number(parsed.overallScore || 5),
        overallFeedback: parsed.overallFeedback || 'Completed evaluation.',
      };
    } catch {
      const scoreMatch = text.match(/"overallScore"\s*:\s*(\d+(\.\d+)?)/);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : 6;
      return {
        overallScore: score,
        overallFeedback: text,
      };
    }
  } catch (error) {
    console.warn('Groq overall evaluation failed, using fallback.', error);
    const avgScore = evaluations.length > 0
      ? Math.round((evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length) * 10) / 10
      : 5;
    return {
      overallScore: avgScore,
      overallFeedback: `Overall evaluation completed for the ${role} position. Average question score was ${avgScore}/10. Check individual answers for details.`,
    };
  }
};

