import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, ChevronRight, Code, Clock, 
  Trophy, RotateCcw, CheckCircle, XCircle, Shield, Key 
} from 'lucide-react';
import axios from 'axios';

const TIMER_SECONDS = 30;

const diffColors = {
  emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  yellow:  'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  red:     'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function Quiz() {
  const [category, setCategory] = useState('All');
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testSession, setTestSession] = useState(null);
  const [testCredentials, setTestCredentials] = useState({ testId: '', password: '' });
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/quiz');
      if (res.data.success) {
        const mapped = res.data.questions.map(q => ({
          ...q,
          id: q._id,
          category: q.domain,
          diffColor: q.difficulty === 'Easy' ? 'emerald' : q.difficulty === 'Hard' ? 'red' : 'yellow'
        }));
        setAllQuestions(mapped);
        setQuestions(mapped);
        
        // Extract unique categories
        const uniqueCats = ['All', ...new Set(mapped.map(q => q.category))];
        setCategories(uniqueCats);
      }
    } catch (err) {
      console.error('Error fetching questions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isTestMode) {
      const filtered = category === 'All' ? allQuestions : allQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
      setQuestions(filtered);
      resetQuiz();
    }
  }, [category, isTestMode, allQuestions]);

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
    setIsTestMode(false);
    setTestSession(null);
  };

  const handleJoinTest = async (e) => {
    e.preventDefault();
    setJoining(true);
    setJoinError('');
    try {
      const res = await axios.post('/api/quiz-sessions/join', testCredentials);
      if (res.data.success) {
        const session = res.data.session;
        const mappedQuestions = session.questions.map(q => ({
          id: q._id,
          category: q.domain,
          difficulty: q.difficulty,
          diffColor: q.difficulty === 'Easy' ? 'emerald' : q.difficulty === 'Hard' ? 'red' : 'yellow',
          question: q.question,
          options: q.options,
          answer: q.correctAnswer, // Corrected to use backend field
          explanation: q.explanation || ''
        }));
        
        setTestSession(session);
        setQuestions(mappedQuestions);
        setIsTestMode(true);
        setStarted(true);
      }
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setJoining(false);
    }
  };

  const handleStart = () => {
    setStarted(true);
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

  const submitResults = async () => {
    try {
      await axios.post('/api/quiz-sessions/submit', {
        sessionId: testSession._id,
        score: score,
        totalQuestions: questions.length
      });
    } catch (err) {
      console.error('Failed to submit results', err);
    }
  };

  const handleNext = () => {
    clearInterval(timerRef.current);
    if (current + 1 >= questions.length) { 
      setFinished(true); 
      if (isTestMode && testSession) {
        submitResults();
      }
    }
    else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); setTimeLeft(TIMER_SECONDS); }
  };

  const q = questions[current];
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;

  // ── Start Screen ─────────────────────────────────────────────────────────────
  if (!started) return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-start px-4 md:px-12 py-12 md:py-20 relative">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Standard Quiz */}
        <div className="flex flex-col gap-6 glass-panel p-10">
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

          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Choose Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[11px] font-black border-2 transition-all uppercase tracking-widest ${
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

          <button
            onClick={handleStart}
            disabled={loading || questions.length === 0}
            className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? 'Loading Questions...' : questions.length === 0 ? 'No Questions Available' : 'Practice Solo'} <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>

        {/* Right Side: Live Test Portal */}
        <div className="flex flex-col gap-8 glass-panel p-10 border-emerald-500/20 bg-emerald-500/[0.02]">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" /> Validation Sector
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Live Tests
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Enter the credentials provided by the admin to join an autonomous validation session.
            </p>
          </div>

          <form onSubmit={handleJoinTest} className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Test Terminal ID</label>
              <div className="relative group">
                <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  required
                  placeholder="GCC-XXXX"
                  value={testCredentials.testId}
                  onChange={(e) => setTestCredentials({...testCredentials, testId: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Access Key</label>
              <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  value={testCredentials.password}
                  onChange={(e) => setTestCredentials({...testCredentials, password: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            {joinError && (
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5" /> {joinError}
              </p>
            )}

            <button
              type="submit"
              disabled={joining}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
            >
              {joining ? 'Authenticating...' : 'Join Validation Session'} <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

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
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {pct === 100 ? 'Perfect Score!' : pct >= 60 ? 'Well Done!' : 'Keep Practising!'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
              You scored <span className="font-black text-brand">{score} / {questions.length}</span> — {pct}%
            </p>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <div className="w-full flex flex-col gap-2 text-left overflow-hidden">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Review</span>
            {questions.map((qq, i) => {
              const ans = answers[i];
              const correct = ans?.selected === qq.answer;
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${correct ? 'border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5' : 'border-red-400/20 bg-red-50 dark:bg-red-500/5'}`}>
                  {correct ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{qq.question}</p>
                    {!correct && <p className="text-[11px] font-medium text-slate-500">Correct: <span className="text-emerald-600 font-black">{qq.options[qq.answer]}</span></p>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button onClick={resetQuiz} className="flex-1 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl text-sm uppercase tracking-widest">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button onClick={() => setStarted(false)} className="flex-1 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white font-black flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Back to Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden px-4 py-12 md:py-20 relative flex flex-col items-center justify-start">
      <div className="w-full max-w-4xl min-w-0 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button onClick={() => setStarted(false)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Setup
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{current + 1} / {questions.length}</span>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/5">
              <Clock className={`w-3 h-3 ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-500'}`} />
              <span className={`text-xs font-black tabular-nums ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-brand/10 border border-brand/20">
              <Trophy className="w-3 h-3 text-brand" />
              <span className="text-xs font-black text-brand">{score}</span>
            </div>
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>
        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${timerPct}%` }} />
        </div>
        <div className="glass-panel p-4 md:p-6 flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${diffColors[q.diffColor]}`}>{q.difficulty}</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black border border-black/5 dark:border-white/5 uppercase tracking-widest">{q.category}</span>
          </div>
          <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-snug">{q.question}</p>
          {q.code && (
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-white/10 w-full">
              <div className="px-3 py-2 bg-slate-900 border-b border-white/5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-slate-500 font-mono">{q.category.toLowerCase()}</span>
              </div>
              <pre className="px-4 py-4 text-xs md:text-sm font-mono text-cyan-300 whitespace-pre-wrap break-all overflow-x-auto">{q.code}</pre>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {q.options.map((opt, idx) => {
              let style = 'border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-pointer';
              if (selected === idx && !revealed) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
              if (revealed && idx === q.answer) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
              if (revealed && selected === idx && idx !== q.answer) style = 'border-red-400 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300';
              return (
                <button key={idx} onClick={() => handleSelect(idx)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-xs md:text-sm font-bold text-left transition-all duration-200 w-full ${style}`}>
                  <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-black shrink-0">{String.fromCharCode(65 + idx)}</span>
                  <span className="break-words min-w-0">{opt}</span>
                </button>
              );
            })}
          </div>
          {revealed && (
            <div className="flex items-start gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/5">
              <span className="text-lg">💡</span>
              <p className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{q.explanation}</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {!revealed ? (
            <button onClick={() => handleReveal(false)} disabled={selected === null} className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl disabled:opacity-40 uppercase tracking-widest">
              Reveal Answer <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleNext} className="px-6 py-3 rounded-full bg-brand text-white text-sm font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-brand/20 uppercase tracking-widest">
              {current + 1 >= questions.length ? 'See Results 🏆' : 'Next Question'} <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button onClick={resetQuiz} className="text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>
      </div>
    </div>
  );
}
