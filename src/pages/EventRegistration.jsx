import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Calendar, MapPin, Users, Send, User as UserIcon, Mail, Book, Hash, Phone } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

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

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
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
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        if (res.data.success) {
          setEvent(res.data.event);
          // Check if already registered
          if (user && res.data.event.attendees?.includes(user._id)) {
            setSuccess(true);
          }
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

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
    if (loading || !event) return;
    
    gsap.fromTo(cardRef.current, 
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power4.out' }
    );
  }, [loading, event]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');

    try {
      // If logged in, use the standard register endpoint
      // If not logged in, we'll use a new guest-register endpoint
      const endpoint = user ? `/api/events/${id}/register` : `/api/events/${id}/register-guest`;
      const res = await axios.post(endpoint, formData);
      
      if (res.data.success) {
        setSuccess(true);
        gsap.fromTo('.success-check', 
          { scale: 0, rotate: -45 },
          { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' }
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Event Not Found</h1>
          <Link to="/" className="text-brand font-bold hover:underline mt-4 inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to={`/event/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-brand font-bold mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Event Details
        </Link>

        <div ref={cardRef} className="glass-panel overflow-hidden border border-black/5 dark:border-white/10 shadow-2xl">
          {!success ? (
            <div className="grid lg:grid-cols-5">
              {/* Event Info Sidebar */}
              <div className="lg:col-span-2 p-8 md:p-12 bg-brand/5 border-r border-black/5 dark:border-white/5">
                <div className="flex flex-col gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand mb-2 block">Event Registration</span>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                      {event.title}
                    </h1>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm"><Calendar className="w-4 h-4 text-brand" /></div>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm"><MapPin className="w-4 h-4 text-brand" /></div>
                      {event.venue}
                    </div>
                  </div>
                  <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                      "Join our community of innovators and creators. This event is a great opportunity to network and learn new skills."
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-3 p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Registration Details</h2>
                  {user && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Logged In
                    </span>
                  )}
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-6 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <InputField label="Full Name" icon={UserIcon} name="name" placeholder="John Doe" disabled={!!user} formData={formData} onChange={handleChange} />
                    <InputField label="Email Address" icon={Mail} name="email" type="email" placeholder="john@example.com" disabled={!!user} formData={formData} onChange={handleChange} />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <InputField label="USN / ID" icon={Hash} name="usn" placeholder="1GT21CS001" formData={formData} onChange={handleChange} />
                    <InputField label="Phone Number" icon={Phone} name="phone" placeholder="+91 9876543210" formData={formData} onChange={handleChange} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <InputField 
                      label="Department" 
                      icon={Book} 
                      name="department" 
                      options={['CS', 'IS', 'AI/ML', 'EC', 'ME', 'CV', 'Other']} 
                      formData={formData} 
                      onChange={handleChange}
                    />
                    <InputField 
                      label="Current Year" 
                      icon={Calendar} 
                      name="year" 
                      options={['1st Year', '2nd Year', '3rd Year', '4th Year']} 
                      formData={formData} 
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed mb-6">
                      * Please ensure all details are correct. By clicking register, you agree to our community guidelines and code of conduct.
                    </p>
                    
                    <button 
                      type="submit"
                      disabled={registering}
                      className="w-full py-5 rounded-2xl bg-brand text-white font-black tracking-[0.2em] text-xs hover:bg-emerald-600 transition-all hover:shadow-2xl hover:shadow-brand/20 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                      {registering ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>CONFIRM REGISTRATION <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                </form>

                {!user && (
                  <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Already have an account? <Link to="/auth" className="text-brand hover:underline">Log in for faster registration</Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center flex flex-col items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 success-check">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Registration Confirmed!</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto text-lg leading-relaxed">
                  You have successfully registered for <span className="font-bold text-slate-900 dark:text-white">{event.title}</span>. We've sent a confirmation to your email.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-md">
                <Link to={user ? "/profile" : "/"} className="flex-1 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black tracking-widest hover:scale-105 transition-transform shadow-xl">
                  {user ? 'VIEW IN DASHBOARD' : 'BACK TO HOME'}
                </Link>
                <Link to="/events" className="flex-1 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black tracking-widest hover:bg-slate-200 transition-colors">
                  EXPLORE EVENTS
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
