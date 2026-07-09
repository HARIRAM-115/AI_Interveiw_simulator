import React, { useState } from 'react';
import { Code, Play, CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  templates: { [key: string]: string };
}

const CodingChallenges: React.FC = () => {
  const challenges: Challenge[] = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
      ],
      templates: {
        javascript: `function twoSum(nums, target) {\n    // Write your solution here\n    \n};`,
        python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass`,
        typescript: `function twoSum(nums: number[], target: number): number[] {\n    // Write your solution here\n    return [];\n};`,
        java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
      },
    },
    {
      id: 2,
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
      examples: [
        { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      ],
      constraints: [
        'The number of nodes in the list is the range [0, 5000].',
        '-5000 <= Node.val <= 5000',
      ],
      templates: {
        javascript: `function reverseList(head) {\n    // Write your solution here\n    \n};`,
        python: `class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your solution here\n        pass`,
        typescript: `function reverseList(head: ListNode | null): ListNode | null {\n    // Write your solution here\n    return null;\n};`,
        java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your solution here\n        return null;\n    }\n}`,
      },
    },
    {
      id: 3,
      title: 'LRU Cache',
      difficulty: 'Medium',
      description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
      examples: [
        { input: '["LRUCache", "put", "put", "get", "put", "get"]\\n[[2], [1, 1], [2, 2], [1], [3, 3], [2]]', output: '[null, null, null, 1, null, -1]' },
      ],
      constraints: [
        '1 <= capacity <= 3000',
        '0 <= key <= 10^4',
        '0 <= value <= 10^5',
      ],
      templates: {
        javascript: `class LRUCache {\n    constructor(capacity) {\n        // Initialize cache\n    }\n    get(key) {\n        return -1;\n    }\n    put(key, value) {\n        \n    }\n}`,
        python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass`,
        typescript: `class LRUCache {\n    constructor(capacity: number) {\n    }\n    get(key: number): number {\n        return -1;\n    }\n    put(key: number, value: number): void {\n    }\n}`,
        java: `class LRUCache {\n    public LRUCache(int capacity) {\n    }\n    public int get(int key) {\n        return -1;\n    }\n    public void put(int key, int value) {\n    }\n}`,
      },
    },
  ];

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(challenges[0]);
  const [lang, setLang] = useState<string>('javascript');
  const [code, setCode] = useState<string>(challenges[0].templates.javascript);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [running, setRunning] = useState(false);

  const handleSelectChallenge = (c: Challenge) => {
    setSelectedChallenge(c);
    const codeTemplate = c.templates[lang] || c.templates.javascript;
    setCode(codeTemplate);
    setTestResults(null);
  };

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    setCode(selectedChallenge.templates[newLang] || selectedChallenge.templates.javascript);
  };

  const handleReset = () => {
    setCode(selectedChallenge.templates[lang] || selectedChallenge.templates.javascript);
    setTestResults(null);
  };

  const handleRunCode = () => {
    setRunning(true);
    setTestResults(null);
    setTimeout(() => {
      // Mock compiler response
      setTestResults([
        { id: 1, name: 'Sample Case 1', passed: true, output: 'Expected: [0,1], Got: [0,1]' },
        { id: 2, name: 'Sample Case 2', passed: true, output: 'Expected: [1,2], Got: [1,2]' },
        { id: 3, name: 'Boundary Check (Empty)', passed: Math.random() > 0.3, output: 'Expected: [], Got: []' },
      ]);
      setRunning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 fade-slide-up h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Code className="h-6 w-6 text-indigo-400" /> Interactive Coding Challenges
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Build coding accuracy and speed with LeetCode-style algorithms and instant test suite feedback.
          </p>
        </div>

        <div className="flex gap-2">
          {challenges.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectChallenge(c)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                selectedChallenge.id === c.id
                  ? 'bg-indigo-950 border-indigo-900 text-indigo-350 shadow-inner'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 flex-1 min-h-[550px]">
        {/* Left column: instructions */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col justify-between overflow-y-auto space-y-6 max-h-[600px] scrollbar-thin">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-100">{selectedChallenge.title}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                selectedChallenge.difficulty === 'Hard'
                  ? 'bg-red-950/40 border border-red-900/40 text-red-400'
                  : selectedChallenge.difficulty === 'Medium'
                  ? 'bg-amber-955/40 border border-amber-900/40 text-amber-455'
                  : 'bg-emerald-950/40 border border-emerald-900/40 text-emerald-450'
              }`}>
                {selectedChallenge.difficulty}
              </span>
            </div>

            <p className="text-xs text-slate-350 leading-relaxed font-sans whitespace-pre-wrap">
              {selectedChallenge.description}
            </p>

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Examples</span>
              {selectedChallenge.examples.map((ex, idx) => (
                <div key={idx} className="rounded-2xl bg-slate-950/50 border border-slate-900 p-4 space-y-1.5 font-mono text-xs text-slate-300">
                  <p><span className="text-slate-500 font-bold">Input:</span> {ex.input}</p>
                  <p><span className="text-slate-500 font-bold">Output:</span> {ex.output}</p>
                  {ex.explanation && (
                    <p className="text-slate-400 italic text-[11px] font-sans border-t border-slate-900 pt-1.5 mt-1.5">
                      <span className="font-bold text-slate-500">Explanation:</span> {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Constraints</span>
              <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                {selectedChallenge.constraints.map((c, i) => (
                  <li key={i} className="font-mono">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right column: code editor */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-900 bg-[#070412]/80 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-950 border-b border-slate-900 px-5 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-500">solution.{lang === 'python' ? 'py' : lang === 'java' ? 'java' : 'js'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Language:</span>
              <select
                value={lang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="rounded-lg bg-slate-900 border border-slate-800 px-2 py-1 text-xs font-mono text-indigo-350 outline-none focus:border-indigo-650"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
              </select>
            </div>
          </div>

          {/* Textarea Editor workspace */}
          <div className="flex-1 flex p-4 min-h-[300px] overflow-hidden">
            <div className="w-8 text-slate-650 font-mono text-xs text-right pr-2 select-none border-r border-slate-900">
              {Array.from({ length: Math.max(16, code.split('\n').length + 2) }).map((_, i) => (
                <div key={i} className="leading-relaxed">{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent pl-3 text-slate-200 outline-none resize-none font-mono text-xs leading-relaxed overflow-y-auto"
              spellCheck={false}
            />
          </div>

          {/* Test results console */}
          {testResults && (
            <div className="bg-slate-950 border-t border-slate-900 p-4 space-y-2 max-h-[160px] overflow-y-auto font-mono text-xs scrollbar-thin">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Console output / Test outcomes</span>
              {testResults.map((tr) => (
                <div key={tr.id} className="flex items-center justify-between text-[11px] border-b border-slate-900/40 pb-1">
                  <div className="flex items-center gap-2">
                    {tr.passed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-450 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                    )}
                    <span className={tr.passed ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>{tr.name}</span>
                  </div>
                  <span className="text-slate-450">{tr.output}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="bg-slate-950/80 border-t border-slate-900 px-5 py-3 flex justify-between items-center shrink-0">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-semibold transition"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Template
            </button>

            <button
              onClick={handleRunCode}
              disabled={running}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-650 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {running ? (
                <>
                  <Play className="h-3.5 w-3.5 animate-spin" /> Compiling...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-indigo-200 fill-indigo-200" /> Run Test Suite
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingChallenges;
