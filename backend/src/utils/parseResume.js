const SKILL_KEYWORDS = [
  'javascript', 'typescript', 'react', 'node', 'express', 'python', 'java', 'c#', 'c++',
  'sql', 'mongodb', 'postgresql', 'docker', 'kubernetes', 'aws', 'azure', 'git',
  'graphql', 'rest', 'api', 'html', 'css', 'sass', 'figma', 'jira', 'linux',
  'tensorflow', 'pandas', 'numpy', 'machine learning', 'data analysis', 'agile',
  'scrum', 'testing', 'jest', 'mocha', 'react native', 'next.js', 'vue', 'angular',
];

const normalizeText = (text) => text.replace(/\r/g, '\n').replace(/\n{2,}/g, '\n').trim();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractSection = (text, heading) => {
  const regex = new RegExp(`${escapeRegex(heading)}[:\s]*`, 'i');
  const match = regex.exec(text);
  if (!match) return '';

  const start = match.index + match[0].length;
  const nextHeading = /\n[A-Z][A-Za-z ]{3,}:?/g;
  nextHeading.lastIndex = start;
  const nextMatch = nextHeading.exec(text);
  const end = nextMatch ? nextMatch.index : text.length;
  return text.slice(start, end).trim();
};

const extractLines = (sectionText) =>
  sectionText
    .split(/\n|\r/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

export const parseResumeText = (rawText) => {
  const text = normalizeText(rawText);

  const lowerText = text.toLowerCase();
  const skills = SKILL_KEYWORDS.filter((skill) => {
    const safeSkill = escapeRegex(skill);
    return new RegExp(`\\b${safeSkill}\\b`, 'i').test(lowerText);
  });

  const educationSection = extractSection(text, 'education');
  const experienceSection = extractSection(text, 'experience');
  const skillsSection = extractSection(text, 'skills');

  const education = educationSection ? extractLines(educationSection) : [];
  const experience = experienceSection ? extractLines(experienceSection) : [];
  const skillsFromSection = skillsSection ? extractLines(skillsSection) : [];

  const finalSkills = Array.from(new Set([...skills, ...skillsFromSection])).slice(0, 40);

  // ATS Scoring Logic
  let atsScore = 35;
  if (finalSkills.length > 0) {
    atsScore += Math.min(30, finalSkills.length * 3.5);
  }
  if (education.length > 0) {
    atsScore += 15;
  }
  if (experience.length > 0) {
    atsScore += 15;
  }
  if (text.length > 1000) {
    atsScore += 5;
  }
  atsScore = Math.min(100, Math.round(atsScore));

  // Missing modern keywords detector
  const commonImportant = ['docker', 'kubernetes', 'aws', 'typescript', 'next.js', 'testing', 'system design', 'microservices'];
  const missingKeywords = commonImportant.filter(k => !finalSkills.map(s => s.toLowerCase()).includes(k));

  // Weak/Generic keywords suggestions
  const weakDetector = ['html', 'css', 'api', 'git', 'sql'];
  const weakKeywords = finalSkills
    .filter(s => weakDetector.includes(s.toLowerCase()))
    .map(s => {
      if (s.toLowerCase() === 'html' || s.toLowerCase() === 'css') return `${s} (Consider replacing with React/Tailwind)`;
      if (s.toLowerCase() === 'api') return `${s} (Specify RESTful API design / GraphQL)`;
      if (s.toLowerCase() === 'sql') return `${s} (Specify PostgreSQL / Database Normalization)`;
      return `${s} (Consider highlighting advanced methodologies)`;
    });

  return {
    extractedText: text,
    skills: finalSkills,
    education,
    experience,
    atsScore,
    missingKeywords,
    weakKeywords,
  };
};
