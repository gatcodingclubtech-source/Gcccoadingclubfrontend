import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Shield, Code, Layers, Globe, Terminal as TerminalIcon, Users, Rocket, User as UserIcon, Mail, Book, Hash, Phone, Send, Calendar, ChevronRight, Trophy } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const IconMap = {
  Code: <Code className="w-12 h-12" />,
  Sparkles: <Sparkles className="w-12 h-12" />,
  Terminal: <TerminalIcon className="w-12 h-12" />,
  Layers: <Layers className="w-12 h-12" />,
  Shield: <Shield className="w-12 h-12" />,
  Globe: <Globe className="w-12 h-12" />
};

const InputField = ({ label, icon: Icon, name, type = "text", placeholder, required = true, disabled = false, options = null, formData, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className={`relative group ${disabled ? 'opacity-70' : ''}`}>
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      {options ? (
        <select
          name={name}
          value={formData[name]}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all appearance-none"
        >
          <option value="">Select {label}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
        />
      )}
    </div>
  </div>
);

export default function DomainRegistration() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState('form'); // 'form', 'test', 'success'
  const [error, setError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '', email: '', usn: '', department: '', year: '', phone: ''
  });

  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const cardRef = useRef(null);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await axios.get(`/api/domains/${slug}`);
        if (res.data.success) {
          setDomain(res.data.domain);
          if (user && user.joinedDomains?.includes(res.data.domain._id)) {
            setStep('success');
          }
        }
      } catch (err) {
        setError('Failed to load domain details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDomain();
  }, [slug, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        usn: user.usn || '',
        department: user.department || '',
        year: user.year || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (domain?.questions?.length > 0) {
      setStep('test');
      gsap.fromTo('.test-container', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
    } else {
      submitFinalApplication(0, 0);
    }
  };

  const handleAnswerSelect = (optIndex) => {
    setQuizAnswers({ ...quizAnswers, [currentQuestionIndex]: optIndex });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < domain.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndSubmit();
    }
  };

  const calculateAndSubmit = () => {
    let score = 0;
    domain.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) score++;
    });
    submitFinalApplication(score, domain.questions.length);
  };

  const submitFinalApplication = async (score, total) => {
    setSubmitting(true);
    try {
      const endpoint = user ? `/api/domains/${domain._id}/join` : `/api/domains/${domain._id}/join-guest`;
      const res = await axios.post(endpoint, { ...formData, testScore: score, totalQuestions: total });
      if (res.data.success) {
        setStep('success');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
      <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link to={`/domain/${slug}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-brand font-bold mb-8 group transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Link>

        <div ref={cardRef} className="glass-panel overflow-hidden border border-black/5 dark:border-white/10 shadow-2xl relative">
          
          {/* Step 1: Registration Form */}
          {step === 'form' && (
            <div className="grid lg:grid-cols-5 animate-in fade-in duration-500">
              <div className={`lg:col-span-2 p-8 md:p-12 bg-${domain.color}-500/5 dark:bg-${domain.color}-500/10 border-r border-black/5 dark:border-white/5`}>
                <div className={`w-20 h-20 rounded-[2rem] bg-${domain.color}-500/10 flex items-center justify-center text-${domain.color}-600 mb-8`}>
                  {IconMap[domain.icon] || <Layers className="w-12 h-12" />}
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">{domain.title}</h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">{domain.desc}</p>
                <div className="flex flex-col gap-4">
                  {['Exclusive Workshops', 'Expert Mentorship', 'Community Projects'].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className={`w-5 h-5 text-${domain.color}-500`} /> {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Application</h2>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Step 1 of 2
                  </div>
                </div>

                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-6 flex items-center gap-3"><AlertCircle className="w-4 h-4" /> {error}</div>}

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <InputField label="Full Name" icon={UserIcon} name="name" placeholder="John Doe" disabled={!!user} formData={formData} onChange={handleChange} />
                    <InputField label="Email Address" icon={Mail} name="email" type="email" placeholder="john@example.com" disabled={!!user} formData={formData} onChange={handleChange} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <InputField label="USN / ID" icon={Hash} name="usn" placeholder="1GT21CS001" formData={formData} onChange={handleChange} />
                    <InputField label="Phone Number" icon={Phone} name="phone" placeholder="+91 9876543210" formData={formData} onChange={handleChange} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <InputField label="Department" icon={Book} name="department" options={['CS', 'IS', 'AI/ML', 'EC', 'ME', 'CV', 'Other']} formData={formData} onChange={handleChange} />
                    <InputField label="Current Year" icon={Calendar} name="year" options={['1st Year', '2nd Year', '3rd Year', '4th Year']} formData={formData} onChange={handleChange} />
                  </div>

                  <button type="submit" className={`w-full py-5 rounded-2xl bg-${domain.color}-600 text-white font-black tracking-[0.2em] text-xs hover:bg-${domain.color}-700 transition-all shadow-xl shadow-${domain.color}-500/20 active:scale-95 flex items-center justify-center gap-3 group mt-4`}>
                    NEXT: ENTRY TEST <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Step 2: Entry Test */}
          {step === 'test' && (
            <div className="p-8 md:p-16 test-container animate-in slide-in-from-right-10 duration-500">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Domain Entry Test</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Question {currentQuestionIndex + 1} of {domain.questions.length}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                    <Trophy className="w-8 h-8" />
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-8">
                    {domain.questions[currentQuestionIndex].question}
                  </h3>
                  
                  <div className="grid gap-4">
                    {domain.questions[currentQuestionIndex].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        className={`w-full p-6 rounded-2xl text-left font-black uppercase text-xs tracking-widest transition-all border-2 flex items-center justify-between group ${
                          quizAnswers[currentQuestionIndex] === idx 
                          ? 'bg-brand text-white border-brand shadow-xl shadow-brand/20 scale-[1.02]' 
                          : 'bg-black/5 dark:bg-white/5 text-slate-500 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {opt}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${quizAnswers[currentQuestionIndex] === idx ? 'bg-white border-white' : 'border-slate-300'}`}>
                          {quizAnswers[currentQuestionIndex] === idx && <div className="w-2.5 h-2.5 bg-brand rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 pt-10 border-t border-black/5 dark:border-white/5">
                  <div className="flex-1 h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand transition-all duration-500" 
                      style={{ width: `${((currentQuestionIndex + 1) / domain.questions.length) * 100}%` }}
                    />
                  </div>
                  <button 
                    onClick={handleNextQuestion}
                    disabled={quizAnswers[currentQuestionIndex] === undefined || submitting}
                    className="px-10 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black tracking-widest shadow-xl disabled:opacity-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                    {submitting ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (
                      currentQuestionIndex === domain.questions.length - 1 ? 'FINISH & SUBMIT' : 'NEXT QUESTION'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="p-16 text-center flex flex-col items-center gap-10 animate-in zoom-in duration-700">
              <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Rocket className="w-16 h-16 animate-bounce" />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Application Submitted!</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto text-lg leading-relaxed">
                  Your interest in the <span className={`font-bold text-${domain.color}-600`}>{domain.title}</span> domain has been recorded. Our team will review your profile and test results shortly.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-md">
                <Link to={user ? "/profile" : "/"} className="flex-1 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black tracking-widest hover:scale-105 transition-transform shadow-xl uppercase">
                  {user ? 'View Status' : 'Back to Home'}
                </Link>
                <Link to="/" className="flex-1 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black tracking-widest hover:bg-slate-200 transition-colors uppercase">
                  Explore Club
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
