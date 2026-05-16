import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, Trash2, CheckCircle, 
  ArrowLeft, Sparkles, Shield, Mail, 
  CreditCard, Phone, Trophy, Crown,
  ArrowRight, QrCode, Upload, Info, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Registration Data
  const [step, setStep] = useState(0); // 0: Details, 1: Payment
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([]);
  const [leaderIndex, setLeaderIndex] = useState(0);
  
  // Payment Data
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const init = async () => {
      await fetchEvent();
      await fetchMyRegistration();
    };
    init();
  }, [id, user]);

  const fetchMyRegistration = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/events/${id}/my-registration`);
      if (res.data.success && res.data.registration) {
        const reg = res.data.registration;
        setTeamName(reg.teamName || '');
        setMembers(reg.members || []);
        setIsEditing(true);
        setTransactionId(reg.transactionId || '');
        setPaymentScreenshot(reg.paymentScreenshot || '');
        
        // Find leader index
        const idx = reg.members.findIndex(m => m.email === reg.teamLeader?.email);
        if (idx !== -1) setLeaderIndex(idx);
      } else {
        // New registration defaults
        setMembers([{
          name: user.name || '',
          email: user.email || '',
          usn: user.usn || '',
          phone: user.phone || '',
          isRegisteredUser: true
        }]);
      }
    } catch (err) {
      if (err.response?.status !== 404) console.error(err);
      if (user && members.length === 0) {
        setMembers([{
          name: user.name || '',
          email: user.email || '',
          usn: user.usn || '',
          phone: user.phone || '',
          isRegisteredUser: true
        }]);
      }
    }
  };

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.event);
      }
    } catch (err) {
      console.error('Error fetching event', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    const uploadToast = toast.loading('Uploading payment proof...');

    try {
      const { data } = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        setPaymentScreenshot(data.url);
        toast.success('Screenshot uploaded successfully!', { id: uploadToast });
      }
    } catch (error) {
      toast.error('Upload failed. Try again.', { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const addMember = () => {
    if (members.length >= (event?.maxTeamSize || 1)) return;
    setMembers([...members, { name: '', email: '', usn: '', phone: '', isRegisteredUser: false }]);
  };

  const removeMember = (index) => {
    if (members.length <= 1) return;
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
    if (leaderIndex === index) setLeaderIndex(0);
    else if (leaderIndex > index) setLeaderIndex(leaderIndex - 1);
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (event.price > 0) {
      setStep(1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        teamName: event.maxTeamSize > 1 ? teamName : '',
        members,
        teamLeader: members[leaderIndex],
        additionalInfo: '',
        transactionId,
        paymentScreenshot
      };

      const res = isEditing 
        ? await axios.put(`${API_BASE_URL}/events/${id}/register`, payload)
        : await axios.post(`${API_BASE_URL}/events/${id}/register`, payload);

      if (res.data.success) {
        toast.success(isEditing ? 'Registration updated!' : 'Successfully registered!');
        navigate('/profile'); 
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Action failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 gap-4">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Event Not Found</h2>
      <button onClick={() => navigate(-1)} className="text-emerald-500 font-bold flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );

  const isTeamEvent = event.maxTeamSize > 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050811] py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Progress Bar */}
        {event.price > 0 && (
          <div className="flex items-center gap-4 mb-12">
            <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= 0 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-200 dark:bg-slate-800'}`} />
            <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-200 dark:bg-slate-800'}`} />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-6 mb-12">
          <button 
            onClick={() => step === 1 ? setStep(0) : navigate(-1)} 
            className="group flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            {step === 1 ? 'Back to Details' : 'Back to Event'}
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                  {step === 0 ? (isEditing ? 'Refine Enrollment' : 'Registration Portal') : 'Payment Verification'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                {step === 0 ? event.title : 'Secure Payment'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                {step === 0 
                  ? (isEditing ? 'Update your squad details.' : (isTeamEvent ? `Team Event (${event.minTeamSize}-${event.maxTeamSize} Members)` : 'Individual Participation'))
                  : `Total Amount to Pay: ₹${event.price}`
                }
              </p>
            </div>
          </div>
        </div>

        {step === 0 ? (
          <form onSubmit={handleProceedToPayment} className="flex flex-col gap-8">
            {/* Team Basic Info */}
            {isTeamEvent && (
              <div className="glass-panel p-8 flex flex-col gap-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Team Identity</h3>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Team Name</label>
                  <input 
                    required
                    placeholder="Enter team name..."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                  />
                </div>
              </div>
            )}

            {/* Members List */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Member Details</h3>
                </div>
                {isTeamEvent && members.length < event.maxTeamSize && (
                  <button type="button" onClick={addMember} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
                    <UserPlus className="w-4 h-4" /> Add Member
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {members.map((member, idx) => (
                  <div key={idx} className="glass-panel p-8 relative animate-in zoom-in duration-300">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg ${leaderIndex === idx ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'} flex items-center justify-center text-white text-xs font-black`}>
                          {idx + 1}
                        </div>
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                          Member {idx + 1} {leaderIndex === idx && <span className="ml-2 text-amber-500">(Leader)</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {isTeamEvent && (
                          <button 
                            type="button" onClick={() => setLeaderIndex(idx)}
                            className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${leaderIndex === idx ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-400 hover:text-amber-500'}`}
                          >
                            <Crown className="w-3 h-3" /> Set Leader
                          </button>
                        )}
                        {idx > 0 && (
                          <button type="button" onClick={() => removeMember(idx)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {['name', 'usn', 'email', 'phone'].map((field) => (
                        <div key={field} className="flex flex-col gap-3">
                          <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{field.replace('usn', 'USN / ID').replace('name', 'Full Name').replace('email', 'Email Address').replace('phone', 'Phone Number')}</label>
                          <div className="relative">
                            <input 
                              required
                              placeholder={`Enter ${field}...`}
                              value={member[field]}
                              onChange={(e) => updateMember(idx, field, e.target.value)}
                              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                            />
                            {field === 'name' && <Shield className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />}
                            {field === 'usn' && <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />}
                            {field === 'email' && <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />}
                            {field === 'phone' && <Phone className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-6 rounded-[2rem] bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4">
              {event.price > 0 ? (
                <>Proceed to Payment <ArrowRight className="w-6 h-6" /></>
              ) : (
                <>Complete Registration <CheckCircle className="w-6 h-6" /></>
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right duration-500">
            {/* Payment Card */}
            <div className="glass-panel p-8 md:p-12 flex flex-col items-center gap-10 text-center">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                     <QrCode className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Scan to Pay</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Please pay exactly ₹{event.price}</p>
                  </div>
               </div>

               {/* QR Code Display */}
               <div className="relative p-6 bg-white rounded-3xl shadow-2xl border border-slate-100">
                  <img 
                    src={event.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${event.upiId || 'gcc@upi'}&pn=GATCodingClub&am=${event.price}&cu=INR`} 
                    alt="Payment QR" 
                    className="w-48 h-48 md:w-64 md:h-64 object-contain"
                  />
                  <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-3xl pointer-events-none" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Transaction ID / UTR</label>
                    <input 
                      required
                      placeholder="Enter 12-digit UTR number..."
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Payment Screenshot</label>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border-2 border-dashed transition-all font-bold text-xs uppercase tracking-widest ${
                        paymentScreenshot 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
                        : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-400 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Upload className="w-4 h-4" />
                        {paymentScreenshot ? 'Screenshot Uploaded' : 'Upload Screenshot'}
                      </div>
                      {paymentScreenshot && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  </div>
               </div>

               <div className="w-full p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-start gap-4 text-left">
                  <Info className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-relaxed tracking-widest">
                    Your registration will be verified by our team within 24 hours. Ensure the Transaction ID matches the screenshot to avoid rejection.
                  </p>
               </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={submitting || !transactionId || !paymentScreenshot || isUploading}
              className="w-full py-6 rounded-[2rem] bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Submit & Verify <CheckCircle className="w-6 h-6" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
