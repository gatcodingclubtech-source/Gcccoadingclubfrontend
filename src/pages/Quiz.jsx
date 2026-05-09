import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, Code, Clock, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

// ─── All Quiz Questions ───────────────────────────────────────────────────────
const allQuestions = [
  { id: 1, category: 'Python', difficulty: 'Easy', diffColor: 'emerald',
    question: 'What is the output of print(type([]))?',
    code: 'print(type([]))',
    options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", 'TypeError'],
    answer: 0, explanation: "[] creates an empty list. type([]) returns <class 'list'>." },

  { id: 2, category: 'Python', difficulty: 'Medium', diffColor: 'yellow',
    question: 'Which keyword is used to define a generator in Python?',
    code: null,
    options: ['return', 'yield', 'generate', 'async'],
    answer: 1, explanation: "The 'yield' keyword turns a function into a generator." },

  { id: 3, category: 'Python', difficulty: 'Hard', diffColor: 'red',
    question: 'What is the output of the following code?',
    code: 'x = [1, 2, 3]\nprint(x[-1])',
    options: ['1', '3', 'IndexError', 'None'],
    answer: 1, explanation: 'Negative indexing starts from the end. x[-1] gives the last element: 3.' },

  { id: 4, category: 'JavaScript', difficulty: 'Easy', diffColor: 'emerald',
    question: 'What does typeof null return in JavaScript?',
    code: 'console.log(typeof null);',
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    answer: 2, explanation: "typeof null returns 'object' — a famous legacy bug in JavaScript." },

  { id: 5, category: 'JavaScript', difficulty: 'Medium', diffColor: 'yellow',
    question: 'What will this code print?',
    code: 'console.log(0.1 + 0.2 === 0.3);',
    options: ['true', 'false', 'NaN', 'TypeError'],
    answer: 1, explanation: 'Floating point precision: 0.1 + 0.2 = 0.30000000000000004, not 0.3.' },

  { id: 6, category: 'JavaScript', difficulty: 'Hard', diffColor: 'red',
    question: 'What is the output of the following code?',
    code: 'const arr = [1, 2, 3];\nconst [a, , b] = arr;\nconsole.log(a, b);',
    options: ['1 2', '1 3', '2 3', 'undefined 3'],
    answer: 1, explanation: 'Array destructuring with a hole skips index 1. So a=1, b=3.' },

  { id: 7, category: 'DSA', difficulty: 'Easy', diffColor: 'emerald',
    question: 'What is the time complexity of binary search?',
    code: null,
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    answer: 2, explanation: 'Binary search halves the search space each step: O(log n).' },

  { id: 8, category: 'DSA', difficulty: 'Medium', diffColor: 'yellow',
    question: 'Which data structure uses LIFO order?',
    code: null,
    options: ['Queue', 'Stack', 'Linked List', 'Heap'],
    answer: 1, explanation: 'A Stack follows LIFO — last element in, first element out.' },

  { id: 9, category: 'DSA', difficulty: 'Hard', diffColor: 'red',
    question: 'What is the worst-case time complexity of QuickSort?',
    code: null,
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
    answer: 1, explanation: 'QuickSort worst case is O(n²) when the pivot is always the min or max element.' },

  { id: 10, category: 'General CS', difficulty: 'Easy', diffColor: 'emerald',
    question: 'What does HTML stand for?',
    code: null,
    options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperText Machine Language', 'HighText Markup Language'],
    answer: 0, explanation: 'HTML = HyperText Markup Language, the standard language for web pages.' },

  { id: 11, category: 'General CS', difficulty: 'Medium', diffColor: 'yellow',
    question: 'What does API stand for?',
    code: null,
    options: ['Application Programming Interface', 'Automated Program Integration', 'Application Process Interaction', 'Advanced Programming Index'],
    answer: 0, explanation: 'API = Application Programming Interface — a way for programs to talk to each other.' },

  { id: 12, category: 'General CS', difficulty: 'Hard', diffColor: 'red',
    question: 'What does DNS stand for?',
    code: null,
    options: ['Domain Name System', 'Dynamic Network Service', 'Data Node Server', 'Distributed Name Server'],
    answer: 0, explanation: 'DNS = Domain Name System — translates domain names to IP addresses.' },
];

const CATEGORIES = ['All', 'Python', 'JavaScript', 'DSA', 'General CS'];
const TIMER_SECONDS = 30;

const diffColors = {
  emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  yellow:  'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  red:     'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function Quiz() {
  const [category, setCategory] = useState('All');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    const filtered = category === 'All' ? allQuestions : allQuestions.filter(q => q.category === category);
    setQuestions(filtered);
    resetQuiz();
  }, [category]);

  useEffect(() => {
    if (!started || finished || revealed) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleReveal(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, current, revealed, finished]);

  const resetQuiz = () => {
    clearInterval(timerRef.current);
    setCurrent(0); setSelected(null); setRevealed(false);
    setScore(0); setAnswers([]); setFinished(false);
    setStarted(false); setTimeLeft(TIMER_SECONDS);
  };

  const handleStart = () => {
    const filtered = category === 'All' ? allQuestions : allQuestions.filter(q => q.category === category);
    setQuestions(filtered);
    resetQuiz();
    // Defer setStarted so resetQuiz's setStarted(false) doesn't cancel it
    setTimeout(() => setStarted(true), 0);
  };

  const handleSelect = (idx) => { if (!revealed) setSelected(idx); };

  const handleReveal = (timeout = false) => {
    if (!timeout && selected === null) return;
    clearInterval(timerRef.current);
    setRevealed(true);
    const q = questions[current];
    if (selected === q?.answer) setScore(s => s + 1);
    setAnswers(prev => [...prev, { selected, correct: q?.answer, timeout }]);
  };

  const handleNext = () => {
    clearInterval(timerRef.current);
    if (current + 1 >= questions.length) { setFinished(true); }
    else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); setTimeLeft(TIMER_SECONDS); }
  };

  const q = questions[current];
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;

  // ── Start Screen ─────────────────────────────────────────────────────────────
  if (!started) return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-start justify-start px-4 md:px-12 py-12 md:py-20 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-cyan-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-colors w-max">
          <ArrowLeft className="w-4 h-4 flex-shrink-0" /> Back to Home
        </Link>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-brand flex items-center gap-2">
            <Code className="w-3.5 h-3.5 flex-shrink-0" /> Challenge Arena
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Coding Quiz
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Pick a category, beat the timer, and test your coding knowledge!
          </p>
        </div>

        {/* Category picker */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Choose Category</span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-black border-2 transition-all ${
                  category === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg'
                    : 'border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-brand hover:text-brand'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Questions', value: category === 'All' ? allQuestions.length : allQuestions.filter(q => q.category === category).length },
            { label: 'Time / Q', value: `${TIMER_SECONDS}s` },
            { label: 'Levels', value: '3' },
          ].map(({ label, value }) => (
            <div key={label} className="glass-panel p-3 flex flex-col gap-0.5 items-center text-center">
              <span className="text-xl font-black text-brand">{value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl"
        >
          Start Quiz <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  );

  // ── Result Screen ─────────────────────────────────────────────────────────────
  if (finished) return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-colors w-max">
          <ArrowLeft className="w-4 h-4 flex-shrink-0" /> Back to Home
        </Link>

        <div className="glass-panel p-5 md:p-6 flex flex-col items-center gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center text-4xl flex-shrink-0">
            {pct === 100 ? '🏆' : pct >= 60 ? '🎯' : '📚'}
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {pct === 100 ? 'Perfect Score!' : pct >= 60 ? 'Well Done!' : 'Keep Practising!'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
              You scored <span className="font-black text-brand">{score} / {questions.length}</span> — {pct}%
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Answer review */}
          <div className="w-full flex flex-col gap-2 text-left overflow-hidden">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Review</span>
            {questions.map((qq, i) => {
              const ans = answers[i];
              const correct = ans?.selected === qq.answer;
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${correct ? 'border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5' : 'border-red-400/20 bg-red-50 dark:bg-red-500/5'}`}>
                  {correct
                    ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{qq.question}</p>
                    {!correct && (
                      <p className="text-[11px] font-medium text-slate-500">
                        Correct: <span className="text-emerald-600 font-black">{qq.options[qq.answer]}</span>
                        {ans?.timeout && <span className="text-red-400 ml-1">(time up)</span>}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={resetQuiz}
              className="flex-1 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl text-sm"
            >
              <RotateCcw className="w-4 h-4 flex-shrink-0" /> Try Again
            </button>
            <button
              onClick={() => setStarted(false)}
              className="flex-1 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white font-black flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" /> Back to Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Active Question ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full overflow-x-hidden px-4 py-12 md:py-20 relative flex flex-col items-center justify-start">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-4xl min-w-0 flex flex-col gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button 
            onClick={() => setStarted(false)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-colors"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" /> Back to Setup
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {current + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/5">
              <Clock className={`w-3 h-3 flex-shrink-0 ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-500'}`} />
              <span className={`text-xs font-black tabular-nums ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-brand/10 border border-brand/20">
              <Trophy className="w-3 h-3 text-brand flex-shrink-0" />
              <span className="text-xs font-black text-brand">{score}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>

        {/* Timer bar */}
        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : 'bg-emerald-500'}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        {/* Question card */}
        <div className="glass-panel p-4 md:p-6 flex flex-col gap-4 w-full min-w-0 max-w-full">
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${diffColors[q.diffColor]}`}>
              {q.difficulty}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black border border-black/5 dark:border-white/5">
              {q.category}
            </span>
          </div>

          {/* Question */}
          <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-snug">
            {q.question}
          </p>

          {/* Code block */}
          {q.code && (
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-white/10 w-full">
              <div className="px-3 py-2 bg-slate-900 border-b border-white/5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="ml-2 text-xs text-slate-500 font-mono">{q.category.toLowerCase()}</span>
              </div>
              <pre className="px-4 py-4 text-xs md:text-sm font-mono text-cyan-300 whitespace-pre-wrap break-all overflow-x-auto max-w-full">{q.code}</pre>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {q.options.map((opt, idx) => {
              let style = 'border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-pointer';
              if (selected === idx && !revealed) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
              if (revealed && idx === q.answer) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
              if (revealed && selected === idx && idx !== q.answer) style = 'border-red-400 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300';
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-xs md:text-sm font-bold text-left transition-all duration-200 w-full ${style}`}
                >
                  <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-black flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="break-words min-w-0">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed && (
            <div className="flex items-start gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/5">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                {q.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {!revealed ? (
            <button
              onClick={() => handleReveal(false)}
              disabled={selected === null}
              className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Reveal Answer <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-full bg-brand text-white text-sm font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-brand/20"
            >
              {current + 1 >= questions.length ? 'See Results 🏆' : 'Next Question'} <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </button>
          )}
          <button
            onClick={resetQuiz}
            className="text-xs font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors uppercase tracking-widest flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" /> Restart
          </button>
        </div>
      </div>
    </div>
  );
}
