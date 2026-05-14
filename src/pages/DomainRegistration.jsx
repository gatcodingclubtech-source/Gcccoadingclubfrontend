import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Shield, Code, Layers, Globe, Terminal as TerminalIcon, Users, Rocket, User as UserIcon, Mail, Book, Hash, Phone, Send } from 'lucide-react';
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

export default function DomainRegistration() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form states for guest registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    usn: '',
    department: '',
    year: '',
    phone: ''
  });

  const cardRef = useRef(null);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await axios.get(`/api/domains/${slug}`);
        if (res.data.success) {
          setDomain(res.data.domain);
          // Check if already joined
          if (user && user.joinedDomains?.includes(res.data.domain._id)) {
            setSuccess(true);
          }
        }
      } catch (err) {
        console.error('Error fetching domain:', err);
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

  useEffect(() => {
    if (loading || !domain) return;
    
    gsap.fromTo(cardRef.current, 
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power4.out' }
    );
  }, [loading, domain]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setJoining(true);
    setError('');

    try {
      // If logged in, use the standard join endpoint
      // If not logged in, we'll use a new guest-join endpoint
      const endpoint = user ? `/api/domains/${domain._id}/join` : `/api/domains/${domain._id}/join-guest`;
      const res = await axios.post(endpoint, formData);

      if (res.data.success) {
        setSuccess(true);
        gsap.fromTo('.success-rocket', 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(2)' }
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join domain. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!domain && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Domain Not Found</h1>
          <Link to="/" className="text-brand font-bold hover:underline mt-4 inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  const InputField = ({ label, icon: Icon, name, type = "text", placeholder, required = true, disabled = false, options = null }) => (
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
            onChange={handleChange}
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
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link to={`/domain/${slug}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-brand font-bold mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Domain Details
        </Link>

        <div ref={cardRef} className="glass-panel overflow-hidden border border-black/5 dark:border-white/10 shadow-2xl">
          {!success ? (
            <div className="grid lg:grid-cols-5">
              {/* Left Side: Domain Info */}
              <div className={`lg:col-span-2 p-8 md:p-12 bg-${domain.color}-500/5 dark:bg-${domain.color}-500/10 border-r border-black/5 dark:border-white/5`}>
                <div className={`w-20 h-20 rounded-[2rem] bg-${domain.color}-500/10 flex items-center justify-center text-${domain.color}-600 mb-8`}>
                  {IconMap[domain.icon] || <Layers className="w-12 h-12" />}
                </div>
                <span className={`text-xs font-black uppercase tracking-widest text-${domain.color}-600 mb-2 block`}>Interest Group</span>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                  {domain.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                  {domain.desc}
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className={`w-5 h-5 text-${domain.color}-500`} /> Exclusive Workshops
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className={`w-5 h-5 text-${domain.color}-500`} /> Expert Mentorship
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className={`w-5 h-5 text-${domain.color}-500`} /> Community Projects
                  </div>
                </div>
              </div>

              {/* Right Side: Detailed Join Form */}
              <div className="lg:col-span-3 p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Application Details</h2>
                  {user && (
                    <span className={`px-3 py-1 rounded-full bg-${domain.color}-500/10 text-${domain.color}-500 text-[9px] font-black uppercase tracking-widest border border-${domain.color}-500/20`}>
                      Authenticated
                    </span>
                  )}
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-6 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}

                <form onSubmit={handleJoin} className="flex flex-col gap-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <InputField label="Full Name" icon={UserIcon} name="name" placeholder="John Doe" disabled={!!user} />
                    <InputField label="Email Address" icon={Mail} name="email" type="email" placeholder="john@example.com" disabled={!!user} />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <InputField label="USN / ID" icon={Hash} name="usn" placeholder="1GT21CS001" />
                    <InputField label="Phone Number" icon={Phone} name="phone" placeholder="+91 9876543210" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <InputField 
                      label="Department" 
                      icon={Book} 
                      name="department" 
                      options={['CS', 'IS', 'AI/ML', 'EC', 'ME', 'CV', 'Other']} 
                    />
                    <InputField 
                      label="Current Year" 
                      icon={Calendar} 
                      name="year" 
                      options={['1st Year', '2nd Year', '3rd Year', '4th Year']} 
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed mb-6">
                      * Membership in a domain allows you to access exclusive resources and participate in advanced projects. Please provide accurate information.
                    </p>
                    
                    <button 
                      type="submit"
                      disabled={joining}
                      className={`w-full py-5 rounded-2xl bg-${domain.color}-600 text-white font-black tracking-[0.2em] text-xs hover:bg-${domain.color}-700 transition-all hover:shadow-2xl hover:shadow-${domain.color}-500/20 active:scale-95 flex items-center justify-center gap-3 group`}
                    >
                      {joining ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>JOIN INTEREST GROUP <Rocket className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                </form>

                {!user && (
                  <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Member of GCC? <Link to="/auth" className={`text-${domain.color}-600 hover:underline`}>Log in for instant approval</Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center flex flex-col items-center gap-10">
              <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 success-rocket">
                <Rocket className="w-16 h-16" />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">You're on the Team!</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto text-lg leading-relaxed">
                  Welcome to the <span className={`font-bold text-${domain.color}-600`}>{domain.title}</span> interest group. We've added you to the roster!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-md">
                <Link to={user ? "/profile" : "/"} className="flex-1 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black tracking-widest hover:scale-105 transition-transform shadow-xl">
                  {user ? 'VIEW MY DOMAINS' : 'BACK TO HOME'}
                </Link>
                <Link to="/" className="flex-1 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black tracking-widest hover:bg-slate-200 transition-colors">
                  EXPLORE CLUB
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
