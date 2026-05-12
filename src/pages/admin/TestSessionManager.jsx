import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, Shield, ExternalLink, 
  Search, Users, CheckCircle2, XCircle, 
  Save, X, Clock, Copy, Trash2, HelpCircle,
  FileJson, FileText, Upload, PlusCircle
} from 'lucide-react';
import axios from 'axios';

export default function TestSessionManager() {
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    testId: '',
    password: '',
    domain: 'general'
  });

  useEffect(() => {
    fetchSessions();
    fetchQuestions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/quiz-sessions');
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error('Error fetching sessions', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('/api/quiz');
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Error fetching questions', err);
    }
  };

  const generateCredentials = async () => {
    try {
      const res = await axios.get('/api/quiz-sessions/generate');
      if (res.data.success) {
        setFormData({
          ...formData,
          testId: res.data.testId,
          password: res.data.password
        });
      }
    } catch (err) {
      alert('Failed to generate credentials');
    }
  };

  const toggleQuestion = (id) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter(qId => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedQuestions.length === 0) {
      return alert('Select at least one logic node (question)');
    }
    
    try {
      const res = await axios.post('/api/quiz-sessions', {
        ...formData,
        questions: selectedQuestions
      });
      
      if (res.data.success) {
        setSessions([res.data.session, ...sessions]);
        closeModal();
      }
    } catch (err) {
      alert('Failed to initialize session');
    }
  };

  const openModal = () => {
    setFormData({
      title: '',
      testId: '',
      password: '',
      domain: 'general'
    });
    setSelectedQuestions([]);
    generateCredentials();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [newQuestionData, setNewQuestionData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    domain: 'general',
    difficulty: 'Medium',
    explanation: ''
  });

  const handleAddQuickQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/quiz', newQuestionData);
      if (res.data.success) {
        setQuestions([res.data.question, ...questions]);
        setSelectedQuestions([...selectedQuestions, res.data.question._id]);
        setIsQuestionModalOpen(false);
        setNewQuestionData({
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          domain: 'general',
          difficulty: 'Medium',
          explanation: ''
        });
      }
    } catch (err) {
      alert('Failed to save question');
    }
  };

  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (Array.isArray(data)) {
          let count = 0;
          for (const q of data) {
            const res = await axios.post('/api/quiz', q);
            if (res.data.success) {
              setQuestions(prev => [res.data.question, ...prev]);
              count++;
            }
          }
          alert(`Successfully imported ${count} questions!`);
          fetchQuestions(); // Refresh pool
        }
      } catch (err) {
        alert('Invalid JSON format. Please use an array of question objects.');
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: add toast notification
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Autonomous Testing</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Construct and monitor live validation sessions.</p>
        </div>
        
        <button 
          onClick={openModal}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" /> Initialize Session
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="glass-panel h-64 animate-pulse bg-black/5 dark:bg-white/5" />
          ))
        ) : sessions.length === 0 ? (
          <div className="col-span-full py-24 glass-panel flex flex-col items-center justify-center gap-6 text-slate-500">
            <div className="p-6 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <Shield className="w-12 h-12 opacity-30" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">No active test sessions in sector</span>
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session._id} className="glass-panel p-8 flex flex-col gap-6 group hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{session.title}</h3>
                  <span className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em]">{session.domain} / {session.questions.length} Queries</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                  session.isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
                }`}>
                  {session.isActive ? 'Live' : 'Closed'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-5 border border-black/5 dark:border-white/10 flex flex-col gap-2 relative group/item">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Test ID</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white tracking-widest">{session.testId}</span>
                  <button 
                    onClick={() => copyToClipboard(session.testId)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover/item:opacity-100 transition-all text-emerald-500"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-5 border border-black/5 dark:border-white/10 flex flex-col gap-2 relative group/item">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Access Key</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white tracking-widest">{session.password}</span>
                  <button 
                    onClick={() => copyToClipboard(session.password)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover/item:opacity-100 transition-all text-emerald-500"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{session.results.length} Participants</span>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
                  View Results <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" onClick={closeModal} />
          <div data-lenis-prevent className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in zoom-in duration-500 shadow-2xl">
            <div className="px-10 py-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Initialize Session</h2>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Configure test parameters and validation nodes.</p>
              </div>
              <button onClick={closeModal} className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-10">
              {/* Credentials Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3 md:col-span-1">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Session Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Recruitment Phase 1"
                    className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Generated Test ID</label>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-6 py-4 text-xs text-emerald-500 font-black tracking-widest flex items-center justify-between">
                    {formData.testId}
                    <Clock className="w-4 h-4 opacity-50" />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Generated Access Key</label>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-6 py-4 text-xs text-emerald-500 font-black tracking-widest flex items-center justify-between">
                    {formData.password}
                    <Shield className="w-4 h-4 opacity-50" />
                  </div>
                </div>
              </div>

              {/* Question Selection */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Question Injection ({selectedQuestions.length} Selected)</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsQuestionModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Quick Add
                    </button>
                    <label className="flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-xl text-[9px] font-black text-brand uppercase tracking-widest hover:bg-brand hover:text-white transition-all cursor-pointer">
                      <Upload className="w-3.5 h-3.5" /> Import JSON
                      <input type="file" accept=".json" onChange={handleBulkImport} className="hidden" />
                    </label>
                    <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5 dark:border-white/5">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="Search queries..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white w-40" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions.map((q) => (
                    <button 
                      key={q._id}
                      onClick={() => toggleQuestion(q._id)}
                      className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left ${
                        selectedQuestions.includes(q._id)
                          ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                          : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 hover:border-emerald-500/20'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center border mt-0.5 ${
                        selectedQuestions.includes(q._id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 text-slate-400'
                      }`}>
                        {selectedQuestions.includes(q._id) ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 uppercase">{q.question}</span>
                        <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">{q.domain} / {q.difficulty}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-10 py-8 border-t border-black/5 dark:border-white/5 flex justify-end bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
              <div className="flex gap-4">
                <button onClick={closeModal} className="px-8 py-4 rounded-2xl border border-black/5 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  Abort
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-10 py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-5 h-5" /> Launch Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsQuestionModalOpen(false)} />
          <div data-lenis-prevent className="glass-panel w-full max-w-lg max-h-[85vh] overflow-y-auto relative z-10 p-10 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Quick Logic Injection</h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuickQuestion} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Question Text</label>
                <textarea 
                  required
                  rows="3"
                  value={newQuestionData.question}
                  onChange={(e) => setNewQuestionData({...newQuestionData, question: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50"
                  placeholder="Enter challenge question..."
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Options (Select Correct)</label>
                {newQuestionData.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setNewQuestionData({...newQuestionData, correctAnswer: idx})}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        newQuestionData.correctAnswer === idx ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </button>
                    <input 
                      required
                      value={opt}
                      onChange={(e) => {
                        const next = [...newQuestionData.options];
                        next[idx] = e.target.value;
                        setNewQuestionData({...newQuestionData, options: next});
                      }}
                      className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Domain</label>
                  <select 
                    value={newQuestionData.domain}
                    onChange={(e) => setNewQuestionData({...newQuestionData, domain: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-900 dark:text-white outline-none"
                  >
                    <option value="general">General</option>
                    <option value="web-development">Web Dev</option>
                    <option value="ai-ml">AI / ML</option>
                    <option value="competitive-coding">Coding</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Difficulty</label>
                  <select 
                    value={newQuestionData.difficulty}
                    onChange={(e) => setNewQuestionData({...newQuestionData, difficulty: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Add to Test Pool
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
