import React, { useState, useEffect } from 'react';
import { 
  Plus, HelpCircle, Trash2, Edit2, 
  Search, CheckCircle2, XCircle, 
  Save, X, Filter, ChevronDown
} from 'lucide-react';
import axios from 'axios';

export default function QuizManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filterDomain, setFilterDomain] = useState('all');
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    domain: 'general',
    difficulty: 'Medium',
    explanation: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/quiz');
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Error fetching quiz questions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (idx, val) => {
    const newOptions = [...formData.options];
    newOptions[idx] = val;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        const res = await axios.put(`/api/quiz/${editingQuestion._id}`, formData);
        if (res.data.success) {
          setQuestions(questions.map(q => q._id === editingQuestion._id ? res.data.question : q));
        }
      } else {
        const res = await axios.post('/api/quiz', formData);
        if (res.data.success) {
          setQuestions([res.data.question, ...questions]);
        }
      }
      closeModal();
    } catch (err) {
      const message = err.response?.data?.message || 'Save failed';
      alert(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this question?')) {
      try {
        const res = await axios.delete(`/api/quiz/${id}`);
        if (res.data.success) {
          setQuestions(questions.filter(q => q._id !== id));
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Delete failed';
        alert(message);
      }
    }
  };

  const openModal = (q = null) => {
    if (q) {
      setEditingQuestion(q);
      setFormData({ ...q });
    } else {
      setEditingQuestion(null);
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        domain: 'general',
        difficulty: 'Medium',
        explanation: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const domains = [
    { id: 'all', label: 'All Domains' },
    { id: 'web-development', label: 'Web Dev' },
    { id: 'ai-ml', label: 'AI / ML' },
    { id: 'competitive-coding', label: 'Coding' },
    { id: 'app-development', label: 'App Dev' },
    { id: 'cyber-security', label: 'Security' },
    { id: 'cloud-computing', label: 'Cloud' },
    { id: 'general', label: 'General' },
  ];

  const filteredQuestions = filterDomain === 'all' 
    ? questions 
    : questions.filter(q => q.domain === filterDomain);

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Quiz Questions</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Manage your quiz questions and answers.</p>
        </div>
        
        <button 
          id="admin-add-quiz-btn"
          onClick={() => openModal()}
          className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" /> Add Question
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {domains.map((domain) => (
          <button 
            key={domain.id}
            onClick={() => setFilterDomain(domain.id)}
            className={`whitespace-nowrap px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
              filterDomain === domain.id 
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                : 'bg-black/5 dark:bg-white/5 text-slate-500 border-transparent hover:bg-black/10 dark:hover:bg-white/10 shadow-sm'
            }`}
          >
            {domain.label}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass-panel h-40 animate-pulse bg-black/5 dark:bg-white/5" />
          ))
        ) : filteredQuestions.length === 0 ? (
          <div className="py-24 glass-panel flex flex-col items-center justify-center gap-6 text-slate-500">
            <div className="p-6 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <HelpCircle className="w-12 h-12 opacity-30" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">No questions found</span>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q._id} className="glass-panel p-6 md:p-8 group hover:border-emerald-500/30 transition-all">
              <div className="flex items-start justify-between gap-8">
                <div className="flex flex-col gap-5 flex-1">
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      q.difficulty === 'Easy' ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' :
                      q.difficulty === 'Hard' ? 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10' :
                      'border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
                    }`}>
                      {q.difficulty}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">Domain: {q.domain}</span>
                  </div>
                  
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-relaxed uppercase">
                    {q.question}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border text-[11px] font-bold shadow-sm transition-all ${
                          idx === q.correctAnswer 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/5' 
                            : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 text-slate-500'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          idx === q.correctAnswer ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 text-slate-400'
                        }`}>
                          <span className="text-[9px] font-black uppercase">{String.fromCharCode(65 + idx)}</span>
                        </div>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => openModal(q)}
                    className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all shadow-sm"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(q._id)}
                    className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" onClick={closeModal} />
          <div data-lenis-prevent className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in duration-500 shadow-2xl">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-10 px-6 md:px-10 py-6 md:py-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {editingQuestion ? 'Edit Question' : 'Add Question'}
                </h2>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Fill in the details below.</p>
              </div>
              <button onClick={closeModal} className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-10 flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Question</label>
                <textarea 
                  name="question"
                  required
                  rows="3"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="Enter your question here..."
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all resize-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Domain</label>
                  <select 
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all appearance-none font-bold"
                  >
                    {domains.filter(d => d.id !== 'all').map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Difficulty</label>
                  <select 
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all appearance-none font-bold"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Options</label>
                <div className="grid grid-cols-1 gap-5">
                  {formData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-5">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, correctAnswer: idx})}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all shadow-sm ${
                          formData.correctAnswer === idx 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-400'
                        }`}
                      >
                        {formData.correctAnswer === idx ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-[11px] font-black uppercase">{String.fromCharCode(65 + idx)}</span>}
                      </button>
                      <input 
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}...`}
                        className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Explanation (Optional)</label>
                <textarea 
                  rows="2"
                  value={formData.explanation}
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  placeholder="Explain why this is the correct answer..."
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="pt-10 flex flex-col sm:flex-row justify-end gap-5 border-t border-black/5 dark:border-white/5">
                <button type="button" onClick={closeModal} className="px-8 py-4 rounded-2xl border border-black/5 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-10 py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <Save className="w-5 h-5" /> {editingQuestion ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
