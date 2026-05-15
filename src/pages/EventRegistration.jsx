import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, Trash2, CheckCircle, 
  ArrowLeft, Sparkles, Shield, Mail, 
  CreditCard, Phone, Trophy, Crown
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([]);
  const [leaderIndex, setLeaderIndex] = useState(0);

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
      const res = await axios.get(`/api/events/${id}/my-registration`);
      if (res.data.success && res.data.registration) {
        const reg = res.data.registration;
        setTeamName(reg.teamName || '');
        setMembers(reg.members || []);
        setIsEditing(true);
        
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
      // If 404, it just means no registration yet
      if (err.response?.status !== 404) console.error(err);
      
      // Default for new reg if not found
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
      const res = await axios.get(`/api/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.event);
      }
    } catch (err) {
      console.error('Error fetching event', err);
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        teamName: event.maxTeamSize > 1 ? teamName : '',
        members,
        teamLeader: members[leaderIndex],
        additionalInfo: ''
      };

      const res = isEditing 
        ? await axios.put(`/api/events/${id}/register`, payload)
        : await axios.post(`/api/events/${id}/register`, payload);

      if (res.data.success) {
        navigate('/profile'); 
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Action failed';
      alert(message);
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
        {/* Header */}
        <div className="flex flex-col gap-6 mb-12">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Event
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                  {isEditing ? 'Refine Enrollment' : 'Registration Portal'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                {event.title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                {isEditing ? 'You are updating your existing squad details.' : (isTeamEvent ? `Team Event (${event.minTeamSize}-${event.maxTeamSize} Members)` : 'Individual Participation')}
              </p>
            </div>
            
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-black/5 dark:border-white/5">
                <Users className="w-8 h-8 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{event.registeredCount || 0}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Registrations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
                  placeholder="Enter a cool team name..."
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
                <button 
                  type="button"
                  onClick={addMember}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                >
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
                          type="button"
                          onClick={() => setLeaderIndex(idx)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                            leaderIndex === idx 
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                            : 'bg-black/5 dark:bg-white/5 text-slate-400 hover:text-amber-500'
                          }`}
                        >
                          <Crown className="w-3 h-3" /> Set Leader
                        </button>
                      )}
                      
                      {idx > 0 && (
                        <button 
                          type="button"
                          onClick={() => removeMember(idx)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Full Name</label>
                      <div className="relative">
                        <input 
                          required
                          placeholder="John Doe"
                          value={member.name}
                          onChange={(e) => updateMember(idx, 'name', e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                        />
                        <Shield className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">USN / ID</label>
                      <div className="relative">
                        <input 
                          required
                          placeholder="1GT21CS000"
                          value={member.usn}
                          onChange={(e) => updateMember(idx, 'usn', e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                        />
                        <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Email Address</label>
                      <div className="relative">
                        <input 
                          required
                          type="email"
                          placeholder="name@gmail.com"
                          value={member.email}
                          onChange={(e) => updateMember(idx, 'email', e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                        />
                        <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Phone Number</label>
                      <div className="relative">
                        <input 
                          required
                          placeholder="9876543210"
                          value={member.phone}
                          onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                        />
                        <Phone className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Section */}
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 leading-relaxed uppercase tracking-widest">
                By registering, you confirm that all member details are accurate. A confirmation notification will be sent to the team leader.
              </p>
            </div>

            <button 
              type="submit"
              disabled={submitting || members.length < (event?.minTeamSize || 1)}
              className="w-full py-6 rounded-[2rem] bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" /> {isEditing ? 'Save Changes' : 'Complete Registration'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
