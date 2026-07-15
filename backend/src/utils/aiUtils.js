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

export const analyzeCommunication = (answer = '') => {
  const text = (answer || '').trim();
  if (!text) {
    return {
      fillerWords: [],
      fillerCount: 0,
      communicationScore: 100,
    };
  }

  const fillerRegex = /\b(like|basically|actually|uhm|uh|um|you\s+know|literally|seriously)\b/gi;
  const matches = text.match(fillerRegex) || [];
  const fillerCount = matches.length;
  const communicationScore = Math.max(40, 100 - (fillerCount * 5));
  const fillerWords = Array.from(new Set(matches.map(w => w.toLowerCase())));

  return {
    fillerWords,
    fillerCount,
    communicationScore,
  };
};

const buildFallbackEvaluation = ({ question = '', answer = '', role = 'software engineer' }) => {
  const cleanedAnswer = (answer || '').trim();
  let score = 4;

  if (cleanedAnswer.length > 80) score += 2;
  if (cleanedAnswer.length > 180) score += 2;
  if (/(because|for example|team|project|problem|solution|result|improve)/i.test(cleanedAnswer)) score += 1;
  if (score > 10) score = 10;

  const comms = analyzeCommunication(answer);
  const isCode = /(const|let|function|def |class |import |include|using |public |void |#include|{)/i.test(cleanedAnswer);

  return {
    score,
    feedback: `Your answer to "${question}" was thoughtful and relevant for a ${role} role. Add a few more concrete examples and outcomes to strengthen it further.`,
    strengths: ['Clear communication', 'Shows relevant domain awareness'],
    weaknesses: ['Can be more specific', 'Needs stronger examples and measurable outcomes'],
    detailedExplanation: `In this question, the candidate was asked: "${question}". The response touches on key concepts. A complete answer would explain standard design patterns, lifecycle methods, or situational judgment in depth.`,
    modelAnswer: `A comprehensive answer for a ${role} candidate would explain the challenge, the steps taken, and the results. For example: 'We faced a lookup latency of 300ms. I optimized the indexes on our database, which reduced retrieval times down to 12ms.'`,
    fillerWords: comms.fillerWords,
    fillerCount: comms.fillerCount,
    communicationScore: comms.communicationScore,
    codeComplexity: isCode ? 'O(N) time, O(1) space' : 'N/A',
    codeQualityScore: isCode ? 7 : 0,
  };
};

export const generateInterviewQuestions = async ({ role = 'software engineer', skills = [], resumeText = '', difficulty = 'Mid', type = 'Mixed', company = 'None', count = 5, excludeList = [] }) => {
  const client = createClient();

  if (!client) {
    return buildFallbackQuestions({ role, skills, resumeText, count });
  }

  try {
    let focusInstructions = '';
    if (type === 'Technical') {
      focusInstructions = 'Focus heavily on deep technical skills, language-specific concepts, code architecture, databases, system design, and algorithmic problem-solving related to the candidate\'s stack.';
    } else if (type === 'Behavioral') {
      focusInstructions = 'Focus heavily on behavioral, cultural-fit, teamwork, situational judgment, conflict resolution, leadership, and past experiences using the STAR methodology approach.';
    } else {
      focusInstructions = 'Provide a balanced mix of both technical concept assessment and behavioral/situational questions.';
    }

    let companyInstructions = '';
    if (company && company !== 'None') {
      companyInstructions = `\nIMPORTANT: Tailor these questions to match the typical hiring patterns, core values, and interview style of "${company}". (For example, Google questions should prioritize complex algorithms/structures; Amazon should heavily target core technical depth along with behavioral Leadership Principles; Zoho focuses on problem-solving puzzles and custom programming logic; TCS/Infosys focus on core OOPs, DBMS/SQL, and fundamental coding standards).`;
    }

    let excludeInstructions = '';
    if (Array.isArray(excludeList) && excludeList.length > 0) {
      const validExcludes = excludeList.map(q => q.trim()).filter(Boolean);
      if (validExcludes.length > 0) {
        excludeInstructions = `\nCRITICAL: Do NOT repeat or generate any of the following questions (or questions that are very similar to them):
- ${validExcludes.slice(-15).join('\n- ')}`;
      }
    }

    const prompt = `You are an interviewer for an AI interview simulator. Generate exactly ${count} concise, professional, and unique interview questions for a ${difficulty}-level ${role} role. The interview type is ${type}.${companyInstructions}
${focusInstructions}
Use the candidate's resume skills and background when relevant.
Resume skills: ${skills.join(', ') || 'general software engineering'}.
Resume text: ${resumeText.slice(0, 1800)}.
${excludeInstructions}

Generate different and creative questions covering a variety of scenarios. Return the questions as a simple numbered list, one question per line. Do not include any intro, outro, headers, or explanations.`;

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

const isGibberishOrTrivial = (text) => {
  const cleaned = (text || '').trim();
  if (cleaned.length < 5) return true;

  // Check if it's just a repetition of the same word or character
  const words = cleaned.split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  if (uniqueWords.size === 1 && words.length > 1) return true;

  // Calculate vowel-to-letter ratio for gibberish detection
  const letters = cleaned.replace(/[^a-zA-Z]/g, '');
  const isCodePattern = /[\{\}\[\]\(\);=<>!]/.test(cleaned);

  if (letters.length > 0) {
    const vowelCount = (letters.match(/[aeiouyAEIOUY]/g) || []).length;
    const vowelRatio = vowelCount / letters.length;
    
    // Standard English has ~30%+ vowel ratio. If it's < 18% and not code syntax, it's gibberish.
    if (vowelRatio < 0.18 && !isCodePattern) return true;
  }

  // Check if longer words have no vowels at all (e.g. "sdfghjk")
  const longWords = words.filter(w => w.length > 3);
  if (longWords.length > 0) {
    const longVowels = longWords.filter(w => /[aeiouyAEIOUY]/i.test(w) || /[\{\}\[\]\(\);=<>!]/.test(w));
    if (longVowels.length === 0) return true;
  }
  
  return false;
};

export const evaluateAnswer = async ({ question = '', answer = '', role = 'software engineer' }) => {
  const cleanedAnswer = (answer || '').trim();

  // Pre-validate for gibberish/empty/trivial answers
  if (!cleanedAnswer || cleanedAnswer.length < 4 || isGibberishOrTrivial(cleanedAnswer)) {
    return {
      score: 1,
      feedback: "The response is too brief, trivial, or contains invalid gibberish characters. Please provide a meaningful answer to receive a proper assessment.",
      strengths: [],
      weaknesses: ["Answer is empty, too short, or contains gibberish"],
      detailedExplanation: "A valid technical or behavioral answer is required to perform an evaluation.",
      modelAnswer: "Please provide a complete and structured answer to receive a proper model answer.",
      fillerWords: [],
      fillerCount: 0,
      communicationScore: 0,
      codeComplexity: "N/A",
      codeQualityScore: 0
    };
  }

  const client = createClient();

  if (!client) {
    return buildFallbackEvaluation({ question, answer: cleanedAnswer, role });
  }

  try {
    const isCode = /(const|let|function|def |class |import |include|using |public |void |#include|{)/i.test(cleanedAnswer);
    
    const prompt = `You are a Senior Technical Interview Evaluator. Evaluate the candidate's answer to the following interview question for a ${role} role.
Be extremely strict, objective, and critical in your assessment. Do not give high scores for brief, vague, incorrect, or low-effort answers.

CRITICAL INSTRUCTIONS:
1. GIBBERISH OR TRIVIAL ANSWERS: If the answer is gibberish, empty, or completely unrelated to the question, assign a score of 0 or 1.
2. TECHNICAL ACCURACY: If the question asks for code or a technical solution, analyze the logic line-by-line. If there are logical bugs, syntax errors, or if the code does not actually solve the question, deduct points heavily and list the bugs under "weaknesses".
3. NO CODE PROVIDED: If the question requires code/implementation but the candidate only gives a brief description without code, score it below 4.
4. EDGE CASES: Check if the answer/code handles edge cases (e.g. empty inputs, null pointers, division by zero). Deduct points if edge cases are ignored.

Provide your output as a raw JSON object containing exactly the following fields (do not include markdown wrapping or other text):
- "score": (number from 0 to 10. 10 means perfect production-grade solution, 0 means blank/unrelated/gibberish)
- "feedback": (constructive feedback explaining what is wrong or how to improve)
- "strengths": (array of strings, or empty array if none)
- "weaknesses": (array of strings pointing out exact errors, bugs, or missing points)
- "detailedExplanation": (detailed paragraph explaining the correct concept, the logic, and why the candidate's answer is correct/incorrect)
- "modelAnswer": (a perfect 10/10 mock answer/code for this question that is professional, thorough, and tailored to a ${role})
${isCode ? `- "codeComplexity": (a string representing time and space complexity, e.g. "O(N) Time, O(N) Space")\n- "codeQualityScore": (a number from 0 to 10 evaluating correctness, syntax, edge cases, and design)` : ''}

Question: ${question}
Answer: ${cleanedAnswer}`;

    const response = await client.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 800,
    });

    const text = response.choices?.[0]?.message?.content || '{}';
    try {
      const cleanJsonText = text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJsonText);
      const comms = analyzeCommunication(answer);
      return {
        score: Number(parsed.score || 5),
        feedback: parsed.feedback || 'Completed evaluation.',
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        detailedExplanation: parsed.detailedExplanation || 'Detailed evaluation completed.',
        modelAnswer: parsed.modelAnswer || 'A model response should cover the core concepts step-by-step.',
        fillerWords: comms.fillerWords,
        fillerCount: comms.fillerCount,
        communicationScore: comms.communicationScore,
        codeComplexity: parsed.codeComplexity || (isCode ? 'O(N) Time, O(1) Space' : 'N/A'),
        codeQualityScore: Number(parsed.codeQualityScore || (isCode ? 6 : 0)),
      };
    } catch {
      // Basic extraction regex if json parsing fails directly
      const scoreMatch = text.match(/"score"\s*:\s*(\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 6;
      const comms = analyzeCommunication(answer);
      return {
        score,
        feedback: text.slice(0, 500),
        strengths: ['Relevant domain experience'],
        weaknesses: ['Could benefit from more structural depth'],
        detailedExplanation: 'Concept evaluation completed.',
        modelAnswer: 'A model response covers the core problem-solving methodologies.',
        fillerWords: comms.fillerWords,
        fillerCount: comms.fillerCount,
        communicationScore: comms.communicationScore,
        codeComplexity: isCode ? 'O(N) Time, O(1) Space' : 'N/A',
        codeQualityScore: isCode ? 6 : 0,
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

export const generateCareerMatch = async ({ skills = [], interviews = [] }) => {
  const client = createClient();

  if (!client) {
    return [
      {
        role: "Full Stack Engineer",
        matchPercentage: 80,
        rationale: "Matches your skills in " + (skills.slice(0, 4).join(', ') || 'development') + ".",
        missingSkills: ["System Design", "AWS", "Docker"],
        actionPlan: "Study system scalability, cloud deployment on AWS, and containerization using Docker."
      },
      {
        role: "Frontend Engineer",
        matchPercentage: 75,
        rationale: "Strong alignment with frontend skills like React and JavaScript.",
        missingSkills: ["TypeScript", "Next.js"],
        actionPlan: "Deep dive into TypeScript interfaces and study static generation patterns in Next.js."
      },
      {
        role: "Backend Engineer",
        matchPercentage: 60,
        rationale: "Relevant alignment with server-side scripting and database querying.",
        missingSkills: ["Node.js", "Redis"],
        actionPlan: "Practice asynchronous design in Node.js and caching strategies using Redis."
      }
    ];
  }

  try {
    const prompt = `You are an AI career counselor and HR planner. Analyze the candidate's skills and interview assessment logs to suggest the top 3 best matching job roles.
Candidate Skills: ${skills.join(', ') || 'None listed'}
Past Interview Attempt Logs: ${JSON.stringify(interviews.map(i => ({ role: i.role, score: i.overallScore, difficulty: i.difficulty })))}

Provide your output as a raw JSON array containing exactly 3 objects (do not include markdown wrapping or other text). Each object must have exactly these fields:
- "role": (name of suggested job role, e.g. "Senior React Developer")
- "matchPercentage": (integer from 0 to 100)
- "rationale": (1-2 sentences explaining why this matches their skills and past performance)
- "missingSkills": (array of 2-3 skills they need to learn, e.g. ["AWS", "System Design"])
- "actionPlan": (suggested learning path or focus area to increase their candidacy)

Raw JSON array output:`;

    const response = await client.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1000,
    });

    const text = response.choices?.[0]?.message?.content || '[]';
    const cleanJsonText = text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (error) {
    console.warn('Groq career matchmaking failed, using fallback.', error);
    return [
      {
        role: "Full Stack Engineer",
        matchPercentage: 80,
        rationale: "Matches your skills in " + (skills.slice(0, 4).join(', ') || 'development') + ".",
        missingSkills: ["System Design", "AWS", "Docker"],
        actionPlan: "Study system scalability, cloud deployment on AWS, and containerization using Docker."
      }
    ];
  }
};

export const generateSkillTutorial = async ({ skillName }) => {
  const client = createClient();

  if (!client) {
    return {
      skillName,
      steps: [
        { title: "1. Core Introduction", content: `Learn the fundamentals of ${skillName}. Understand its primary use-case in software development and standard lifecycle.` },
        { title: "2. Setting Up", content: `Install tools and configure the working environment for ${skillName} development.` },
        { title: "3. First Hello World", content: `Write a basic project or script to check compilation and runs.` },
        { title: "4. Best Practices", content: `Explore code structure, clean formatting, performance tweaks, and modularity principles.` },
        { title: "5. Next Milestones", content: `Build mini-projects, review real-world architectures, and read documentation to advance.` }
      ]
    };
  }

  try {
    const prompt = `You are an expert AI software tutor. Generate an interactive 5-step crash course for the skill: "${skillName}".
Provide your output as a raw JSON object containing exactly these fields (do not include markdown wrapping or other text):
- "skillName": (string)
- "steps": (an array of exactly 5 objects, each having "title" (string) and "content" (string - a detailed paragraph of 3-4 sentences teaching this step, with code snippet placeholders if relevant))

Raw JSON output:`;

    const response = await client.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1200,
    });

    const text = response.choices?.[0]?.message?.content || '{}';
    const cleanJsonText = text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (error) {
    console.warn('Groq skill tutoring failed, using fallback.', error);
    return {
      skillName,
      steps: [
        { title: "1. Core Introduction", content: `Learn the fundamentals of ${skillName}. Understand its primary use-case in software development and standard lifecycle.` },
        { title: "2. Setting Up", content: `Install tools and configure the working environment for ${skillName} development.` },
        { title: "3. First Hello World", content: `Write a basic project or script to check compilation and runs.` },
        { title: "4. Best Practices", content: `Explore code structure, clean formatting, performance tweaks, and modularity principles.` },
        { title: "5. Next Milestones", content: `Build mini-projects, review real-world architectures, and read documentation to advance.` }
      ]
    };
  }
};

export const generatePersonalizedRoadmap = async ({ role = 'software engineer', weakAreas = [] }) => {
  const client = createClient();

  if (!client || !weakAreas || weakAreas.length === 0) {
    return [
      { day: "Day 1-2: Core Concepts Refinement", topic: `Review fundamentals of ${role}`, details: "Re-read official documentation, take notes on core system patterns and operational lifecycles." },
      { day: "Day 3-4: Problem Solving Patterns", topic: "Practice key problem templates", details: "Implement basic mock problems and trace variables step-by-step to understand memory layouts." },
      { day: "Day 5: Mock Assessment", topic: "Re-take custom AI evaluations", details: "Review previous feedback, record speech response, and evaluate confidence levels." }
    ];
  }

  try {
    const prompt = `You are a professional technical career mentor. Create a personalized 5-step daily study roadmap (Day 1 through Day 5) to help a candidate targeting a ${role} role improve on these specific weak areas: ${weakAreas.join(', ')}.
Provide your output as a raw JSON array containing exactly 5 objects (do not include markdown wrapping or other text). Each object must have exactly these fields:
- "day": (string, e.g. "Day 1")
- "topic": (short title of what to study, e.g. "Mastering SQL Joins & Subqueries")
- "details": (2-3 sentences explaining exactly what resources to review, what to practice, or how to address the weakness)

Raw JSON array output:`;

    const response = await client.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const text = response.choices?.[0]?.message?.content || '[]';
    const cleanJsonText = text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (error) {
    console.warn('Groq roadmap generation failed, using fallback.', error);
    return [
      { day: "Day 1-2: Core Concepts Refinement", topic: `Review fundamentals of ${role}`, details: "Re-read official documentation, take notes on core system patterns and operational lifecycles." },
      { day: "Day 3-4: Problem Solving Patterns", topic: "Practice key problem templates", details: "Implement basic mock problems and trace variables step-by-step to understand memory layouts." },
      { day: "Day 5: Mock Assessment", topic: "Re-take custom AI evaluations", details: "Review previous feedback, record speech response, and evaluate confidence levels." }
    ];
  }
};

