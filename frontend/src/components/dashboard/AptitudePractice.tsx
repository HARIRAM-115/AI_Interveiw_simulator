import React, { useState, useEffect } from 'react';
import { CheckSquare, Timer, ArrowRight, CheckCircle, XCircle, HelpCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  category: string;
  questionText: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const AptitudePractice: React.FC = () => {
  const quizBank: Question[] = [
    {
      id: 1,
      category: 'Quantitative Aptitude',
      questionText: 'A train 125 m long passes a telegraph post in 9 seconds. Find the speed of the train in km/hr.',
      options: ['50 km/hr', '45 km/hr', '55 km/hr', '60 km/hr'],
      correctIdx: 0,
      explanation: 'Speed = Distance / Time = 125 / 9 m/sec. To convert to km/hr, multiply by 18/5. Speed = (125 / 9) * (18 / 5) = 50 km/hr.',
    },
    {
      id: 2,
      category: 'Logical Reasoning',
      questionText: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
      options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
      correctIdx: 1,
      explanation: 'This is a simple division series; each number is one-half of the previous number. Next term = (1/4) / 2 = 1/8.',
    },
    {
      id: 3,
      category: 'Computer Science Fundamental',
      questionText: 'Which of the following sorting algorithms has the best worst-case time complexity?',
      options: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Selection Sort'],
      correctIdx: 2,
      explanation: 'Merge Sort worst-case is O(n log n). Quick Sort is O(n^2), and Bubble/Selection sort are O(n^2) in the worst cases.',
    },
    {
      id: 4,
      category: 'Object Oriented Design',
      questionText: 'What is the primary OOP principle shown when a subclass overrides a base class method?',
      options: ['Abstraction', 'Encapsulation', 'Inheritance', 'Polymorphism'],
      correctIdx: 3,
      explanation: 'Method overriding is a classic representation of runtime (dynamic) Polymorphism, where the implementation executed is decided at execution time.',
    },
  ];

  const [step, setStep] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'quiz') {
      setStep('results');
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleStart = () => {
    setStep('quiz');
    setCurrentIdx(0);
    setSelectedAnswers({});
    setTimeLeft(600);
  };

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIdx]: optIdx,
    });
  };

  const handleNext = () => {
    if (currentIdx < quizBank.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setStep('results');
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate scores
  const totalCorrect = quizBank.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctIdx ? 1 : 0);
  }, 0);
  const percentScore = Math.round((totalCorrect / quizBank.length) * 100);

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-indigo-400" /> Aptitude & MCQ Practice
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Polish your foundational, logical, quantitative, and computer science basics before face-to-face mocks.
        </p>
      </div>

      {/* 1. SETUP CARD */}
      {step === 'setup' && (
        <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-8 max-w-2xl mx-auto space-y-6 text-center">
          <HelpCircle className="h-12 w-12 text-indigo-400 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-100">Ready to start MCQ session?</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              This session consists of **{quizBank.length} questions** covering Quantitative Reasoning, Logic, OOP, and algorithms. You have **10 minutes** to complete the exam.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-left max-w-sm mx-auto">
            <div className="rounded-xl bg-slate-950 border border-slate-900 p-3">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Questions</span>
              <span className="text-xs font-semibold text-slate-200">{quizBank.length} Items</span>
            </div>
            <div className="rounded-xl bg-slate-950 border border-slate-900 p-3">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Time Limit</span>
              <span className="text-xs font-semibold text-slate-200">10:00 Min</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-650 px-6 py-3 font-bold text-white shadow-lg transition hover:brightness-110"
          >
            Start Practice Quiz
          </button>
        </div>
      )}

      {/* 2. QUIZ RUNNING WORKSPACE */}
      {step === 'quiz' && (
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Question Viewer */}
          <div className="lg:col-span-3 rounded-3xl border border-slate-900 bg-slate-900/30 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <span className="text-[10px] font-black uppercase text-indigo-455 tracking-widest bg-indigo-950/40 border border-indigo-900 px-3 py-1 rounded-full">
                {quizBank[currentIdx].category}
              </span>
              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs bg-slate-950/60 px-3 py-1.5 rounded-full border border-slate-900">
                <Timer className="h-4 w-4 text-pink-400" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-xs text-slate-500 font-bold">Question {currentIdx + 1} of {quizBank.length}</span>
              <h2 className="text-lg font-bold text-slate-100 leading-snug">
                {quizBank[currentIdx].questionText}
              </h2>
            </div>

            {/* Options choices */}
            <div className="space-y-3 pt-2">
              {quizBank[currentIdx].options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentIdx] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left rounded-2xl p-4 text-xs font-semibold transition border flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-900 text-indigo-250'
                        : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-indigo-400 bg-indigo-500/20' : 'border-slate-850'
                    }`}>
                      {isSelected && <div className="h-2 w-2 rounded-full bg-indigo-400" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer triggers */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-900">
              <span className="text-xs text-slate-500 italic">Answers are autosaved</span>
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentIdx] === undefined}
                className="flex items-center gap-2 rounded-xl bg-indigo-650 px-5 py-2.5 font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50"
              >
                {currentIdx === quizBank.length - 1 ? 'Finish Test' : 'Next Question'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right sidebar: question list navigator */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-5 space-y-4 h-fit">
            <h3 className="text-xs font-black uppercase text-slate-350 tracking-wider">Test Overview</h3>
            <div className="grid grid-cols-4 gap-2">
              {quizBank.map((q, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isActive = currentIdx === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all border ${
                      isActive
                        ? 'bg-indigo-950 border-indigo-900 text-indigo-400 shadow-inner'
                        : isAnswered
                        ? 'bg-indigo-950/20 border-indigo-950/40 text-indigo-300'
                        : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. TEST SCORES & SOLUTIONS CARD */}
      {step === 'results' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-8 max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
            <CheckCircle className="h-12 w-12 text-emerald-450" />
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Quiz Evaluation Completed</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Review your core standing stats, accuracy metrics, and explanation logs.
              </p>
            </div>

            {/* Scorecard KPIs */}
            <div className="grid gap-3 grid-cols-3 w-full max-w-md">
              <div className="rounded-2xl bg-slate-950/60 border border-slate-900 p-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Correct</span>
                <span className="text-base font-extrabold text-emerald-450">{totalCorrect} / {quizBank.length}</span>
              </div>
              <div className="rounded-2xl bg-slate-950/60 border border-slate-900 p-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Percent</span>
                <span className="text-base font-extrabold text-white">{percentScore}%</span>
              </div>
              <div className="rounded-2xl bg-slate-950/60 border border-slate-900 p-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">XP Earned</span>
                <span className="text-base font-extrabold text-indigo-400">+{totalCorrect * 50} XP</span>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
            >
              <RotateCcw className="h-4 w-4 text-indigo-400" /> Retake Test
            </button>
          </div>

          {/* Solutions breakdown */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
            <h3 className="text-base font-bold text-slate-200">Solution Audit & Explanations</h3>
            <div className="divide-y divide-slate-900 space-y-6">
              {quizBank.map((q, idx) => {
                const userAnsIdx = selectedAnswers[idx];
                const isCorrect = userAnsIdx === q.correctIdx;
                return (
                  <div key={q.id} className="pt-6 first:pt-0 space-y-3 text-left">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase">{q.category}</span>
                      <div className="flex items-center gap-1 text-xs font-semibold">
                        {isCorrect ? (
                          <span className="text-emerald-450 flex items-center gap-1">Correct <CheckCircle className="h-4 w-4" /></span>
                        ) : (
                          <span className="text-red-400 flex items-center gap-1">Incorrect <XCircle className="h-4 w-4" /></span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-200">
                      {idx + 1}. {q.questionText}
                    </p>

                    <div className="grid gap-2 grid-cols-2">
                      {q.options.map((opt, oIdx) => {
                        const isCorrectOption = oIdx === q.correctIdx;
                        const isSelectedOption = oIdx === userAnsIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`rounded-xl p-3 text-xs border ${
                              isCorrectOption
                                ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400'
                                : isSelectedOption
                                ? 'bg-red-950/20 border-red-900/40 text-red-300'
                                : 'bg-slate-950/30 border-slate-900 text-slate-500'
                            }`}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl bg-slate-950 border border-slate-900 p-4 border-l-4 border-l-indigo-500">
                      <span className="text-[10px] font-bold text-indigo-455 block uppercase mb-1">AI Solution Explanation</span>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AptitudePractice;
