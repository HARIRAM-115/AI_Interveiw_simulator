import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, PlusCircle, User, ArrowLeft, Send } from 'lucide-react';

interface Thread {
  id: number;
  title: string;
  author: string;
  authorRank: string;
  repliesCount: number;
  likes: number;
  content: string;
  date: string;
  replies: { author: string; rank: string; text: string; date: string }[];
}

const CommunityDiscussion: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 1,
      title: 'Google Frontend Mock: Key Takeaways',
      author: 'Hari Ram',
      authorRank: 'Level 12 Architect',
      repliesCount: 3,
      likes: 12,
      content: 'Just finished a Google mock session with 5 questions. Heavy focus on system design metrics, component optimizations, and standard graph BFS coding solutions. Make sure to describe time complexity proactively!',
      date: 'Today',
      replies: [
        { author: 'Vikram Singh', rank: 'Mid Tier', text: 'Totally agree, Google interviewers love it when you start with brute-force and explain runtime optimizations before coding.', date: '3 hours ago' },
        { author: 'Priya Patel', rank: 'System Expert', text: 'Did they ask anything about concurrent rendering or hooks reconciliation?', date: '1 hour ago' },
      ],
    },
    {
      id: 2,
      title: 'STAR behavioral answers strategy',
      author: 'Arjun Das',
      authorRank: 'Eloquence Expert',
      repliesCount: 1,
      likes: 8,
      content: 'How do you structure Amazon mock replies? I feel I talk too long during the Action phase. Do you keep a target word count or timer check?',
      date: 'Yesterday',
      replies: [
        { author: 'Meera K.', rank: 'HR Recruiter', text: 'Keep Situation & Task under 1 minute. Spend 2 minutes on Action and 1 minute summarizing the Result metrics.', date: 'Yesterday' },
      ],
    },
  ]);

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(
      threads.map((t) => ({
        ...t,
        likes: t.id === id ? t.likes + 1 : t.likes,
      }))
    );
    if (selectedThread && selectedThread.id === id) {
      setSelectedThread({ ...selectedThread, likes: selectedThread.likes + 1 });
    }
  };

  const handlePostComment = () => {
    if (!newComment.trim() || !selectedThread) return;
    const updated = {
      ...selectedThread,
      replies: [
        ...selectedThread.replies,
        { author: 'You (Hari Ram)', rank: 'Level 12 Architect', text: newComment, date: 'Just now' },
      ],
      repliesCount: selectedThread.repliesCount + 1,
    };
    setSelectedThread(updated);
    setThreads(threads.map((t) => (t.id === selectedThread.id ? updated : t)));
    setNewComment('');
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const nt: Thread = {
      id: threads.length + 1,
      title: newTitle,
      author: 'You (Hari Ram)',
      authorRank: 'Level 12 Architect',
      repliesCount: 0,
      likes: 0,
      content: newContent,
      date: 'Just now',
      replies: [],
    };
    setThreads([nt, ...threads]);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 fade-slide-up h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-indigo-400" /> Community Discussions
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Exchange mock interview reports, algorithmic tactics, and company feedback with fellow candidates.
          </p>
        </div>

        {!selectedThread && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-650 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition"
          >
            <PlusCircle className="h-4 w-4" /> Start Thread
          </button>
        )}
      </div>

      {/* 1. THREADS LIST VIEW */}
      {!selectedThread && !showCreateModal && (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-thin">
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedThread(t)}
              className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-4 hover:border-slate-800 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-200 text-base leading-snug">{t.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 flex-wrap font-medium">
                    <span className="text-slate-400">By {t.author}</span>
                    <span className="rounded bg-indigo-950 px-1.5 py-0.2 text-[8px] text-indigo-400 font-bold uppercase">{t.authorRank}</span>
                    <span>&bull;</span>
                    <span>{t.date}</span>
                  </div>
                </div>

                <div className="flex gap-4 text-xs font-semibold text-slate-500 shrink-0">
                  <button
                    onClick={(e) => handleLike(t.id, e)}
                    className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" /> {t.likes}
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> {t.repliesCount}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                {t.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 2. CREATE NEW THREAD WORKSPACE */}
      {showCreateModal && (
        <div className="rounded-3xl border border-slate-905 bg-slate-909/30 p-6 max-w-2xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h3 className="text-base font-bold text-slate-100">Create New Thread</h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-xs text-slate-500 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateThread} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title summarizing your post topic..."
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-900 px-3.5 py-3 text-xs text-slate-205 outline-none focus:border-indigo-650"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Content Body</label>
              <textarea
                rows={6}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your preparation reports or queries here..."
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-900 p-3 text-xs text-slate-205 outline-none resize-none focus:border-indigo-650"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-indigo-650 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600"
            >
              Publish Thread
            </button>
          </form>
        </div>
      )}

      {/* 3. EXPANDED THREAD VIEW */}
      {selectedThread && (
        <div className="space-y-6 flex-1 overflow-y-auto pr-1 scrollbar-thin">
          <button
            onClick={() => setSelectedThread(null)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Forums
          </button>

          {/* Core Post */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-100 leading-snug">{selectedThread.title}</h2>
                <div className="flex items-center gap-2 text-[10px] text-slate-550 mt-1 flex-wrap">
                  <span className="font-semibold text-slate-350">By {selectedThread.author}</span>
                  <span className="rounded bg-indigo-950 px-1.5 py-0.2 text-[8px] text-indigo-400 font-bold uppercase">{selectedThread.authorRank}</span>
                  <span>&bull;</span>
                  <span>{selectedThread.date}</span>
                </div>
              </div>
              <button
                onClick={(e) => handleLike(selectedThread.id, e)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 font-semibold shrink-0"
              >
                <ThumbsUp className="h-4 w-4" /> {selectedThread.likes}
              </button>
            </div>
            <p className="text-xs text-slate-350 leading-relaxed font-sans whitespace-pre-wrap">{selectedThread.content}</p>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Comments ({selectedThread.replies.length})</h3>
            <div className="space-y-3 pl-4 border-l border-slate-900">
              {selectedThread.replies.map((reply, rIdx) => (
                <div key={rIdx} className="rounded-2xl border border-slate-900 bg-slate-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-550">
                    <span className="font-semibold text-slate-350">{reply.author}</span>
                    <span className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.2 text-[8px] text-slate-500 font-bold uppercase">{reply.rank}</span>
                    <span>&bull;</span>
                    <span>{reply.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{reply.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Write comment */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-4 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-xl bg-slate-950 border border-slate-900 px-4 py-2.5 text-xs text-slate-202 outline-none focus:border-indigo-650"
            />
            <button
              onClick={handlePostComment}
              disabled={!newComment.trim()}
              className="rounded-xl bg-indigo-650 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDiscussion;
