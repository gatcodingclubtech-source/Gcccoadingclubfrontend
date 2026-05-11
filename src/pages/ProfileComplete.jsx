import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Hash, BookOpen, GraduationCap, Code, 
  ArrowRight, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

const Github = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const steps = [
  { id: 1, title: 'Personal info', icon: <User className="w-5 h-5" /> },
  { id: 2, title: 'College details', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 3, title: 'Coding profile', icon: <Code className="w-5 h-5" /> }
];

export default function ProfileComplete() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    usn: '',
    department: '',
    year: '',
    domainInterest: '',
    githubUrl: '',
    phone: ''
  });
  const { completeProfile, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If no user, they shouldn't be here
      // But we might be loading, so check user from useAuth
    } else if (user.profileComplete) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    gsap.fromTo('.step-content', 
      { opacity: 0, x: 20 }, 
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [currentStep]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const result = await completeProfile(formData);
    if (result.success) {
      navigate('/');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative">
        <div className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl -z-10" />
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase font-cyber mb-2">
              Complete Your Profile
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Just a few more details to get you started in the terminal.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-10" />
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-brand -translate-y-1/2 -z-10 transition-all duration-500" 
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20 scale-110' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'
                }`}>
                  {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-2 ${
                  currentStep >= step.id ? 'text-brand' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="step-content min-h-[250px]">
            {currentStep === 1 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">USN / Student ID</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
                    <input 
                      name="usn"
                      value={formData.usn}
                      onChange={handleChange}
                      placeholder="1GA21CS001"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-xs font-black text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Phone Number</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-xs font-black text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Department</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
                    <select 
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-xs font-black text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="">Select Department</option>
                      <option value="CS">Computer Science</option>
                      <option value="IS">Information Science</option>
                      <option value="AI/ML">AI & ML</option>
                      <option value="EC">Electronics & Comm.</option>
                      <option value="ME">Mechanical</option>
                      <option value="CV">Civil</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Current Year</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
                    <select 
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-xs font-black text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Domain of Interest</label>
                  <div className="relative group">
                    <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
                    <select 
                      name="domainInterest"
                      value={formData.domainInterest}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-xs font-black text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="">Select Domain</option>
                      <option value="web-development">Web Development</option>
                      <option value="ai-ml">AI / ML</option>
                      <option value="competitive-coding">Competitive Coding</option>
                      <option value="app-development">App Development</option>
                      <option value="cyber-security">Cyber Security</option>
                      <option value="cloud-computing">Cloud Computing</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">GitHub URL (Optional)</label>
                  <div className="relative group">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
                    <input 
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-xs font-black text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mt-12 pt-6 border-t border-slate-100 dark:border-slate-800">
            {currentStep > 1 && (
              <button 
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={loading}
              className={`flex-[2] py-3 rounded-xl bg-brand text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {currentStep === 3 ? 'Complete Setup' : 'Next Step'} 
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
