import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, ChevronRight } from 'lucide-react';

interface Message {
  sender: 'coach' | 'user';
  text: string;
}

const CareerCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'coach',
      text: "Hello! I am your AI Career Coach. Ask me anything about job hunting, resume tuning, mock interview tips, negotiation strategy, or how to explain job changes. What's on your mind today?",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputText('');
    setTyping(true);

    setTimeout(() => {
      // Mock Coach Responses based on keywords
      const lower = text.toLowerCase();
      let responseText = "That's a great question. Let's break it down. First, focus on organizing your key accomplishments into quantifiable achievements (using percentages or numbers). Second, structure your narrative using the STAR methodology: Situation, Task, Action, and Result.";
      
      if (lower.includes('tell me about yourself') || lower.includes('introduce')) {
        responseText = "To answer 'Tell me about yourself', follow the **Present-Past-Future** framework: \n1. **Present**: Talk about your current role, primary responsibilities, and a recent high-impact success.\n2. **Past**: Briefly touch on how you got here, highlighting relevant skills or projects.\n3. **Future**: Connect your aspirations directly to this specific opportunity and explain why you're a great fit.";
      } else if (lower.includes('gap') || lower.includes('resume gap')) {
        responseText = "When explaining resume gaps: \n- **Be transparent & positive**: State the reason simply (personal development, family care, health, travel) without over-explaining.\n- **Show growth**: Highlight any courses completed, freelancing, or self-learning you undertook during the break.\n- **Redirect**: Bring the focus back to your readiness to contribute in the target role immediately.";
      } else if (lower.includes('salary') || lower.includes('negotiate')) {
        responseText = "For salary negotiations: \n- **Let them state the range first**: Ask for their target budget.\n- **Research market rates**: Use tools like Levels.fyi or Glassdoor to know your value.\n- **Negotiate total compensation**: Think about stock options, signing bonuses, work hours flexibility, and education allowances, not just basic pay.";
      }

      setMessages((prev) => [...prev, { sender: 'coach', text: responseText }]);
      setTyping(false);
    }, 1500);
  };

  const suggestionPrompts = [
    'How do I answer "Tell me about yourself"?',
    'How can I explain a gap in my resume?',
    'What are key tips for salary negotiation?',
  ];

  return (
    <div className="rounded-3xl border border-slate-900 bg-slate-900/30 flex flex-col h-[550px] overflow-hidden fade-slide-up">
      {/* Coach Header */}
      <div className="bg-slate-950/80 border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 p-2.5 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-100 text-sm">AI Career Coach</h2>
            <span className="text-[9px] text-emerald-450 font-bold uppercase tracking-wider">Online &bull; Advice Advisor</span>
          </div>
        </div>
      </div>

      {/* Suggestion panel */}
      {messages.length === 1 && (
        <div className="bg-slate-950/30 border-b border-slate-900/60 p-4 space-y-2">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Frequently Asked Questions</span>
          <div className="flex flex-wrap gap-2">
            {suggestionPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="flex items-center gap-1 text-[11px] rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-slate-350 hover:bg-slate-800 hover:text-white transition-all font-semibold"
              >
                {prompt} <ChevronRight className="h-3 w-3 text-indigo-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable chat body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
        {messages.map((m, idx) => {
          const isCoach = m.sender === 'coach';
          return (
            <div key={idx} className={`flex items-start gap-3.5 ${isCoach ? '' : 'justify-end'}`}>
              {isCoach && (
                <div className="rounded-xl bg-indigo-950/50 border border-indigo-900/50 p-2 text-indigo-400 shrink-0">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
              )}

              <div className={`rounded-2xl p-4 text-xs leading-relaxed max-w-[80%] font-sans whitespace-pre-wrap ${
                isCoach
                  ? 'bg-slate-950/50 border border-slate-900 text-slate-300'
                  : 'bg-indigo-650 text-white font-semibold'
              }`}>
                {m.text}
              </div>

              {!isCoach && (
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-2 text-indigo-400 shrink-0">
                  <User className="h-4.5 w-4.5" />
                </div>
              )}
            </div>
          );
        })}

        {typing && (
          <div className="flex items-start gap-3.5">
            <div className="rounded-xl bg-indigo-950/50 border border-indigo-900/50 p-2 text-indigo-400 shrink-0">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div className="rounded-2xl bg-slate-950/50 border border-slate-900 p-4 max-w-xs flex gap-1 h-10 items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input container */}
      <div className="bg-slate-950 border-t border-slate-900 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question about interview strategy, cover letters, salaries..."
            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-650"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-650 p-3 font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerCoach;
