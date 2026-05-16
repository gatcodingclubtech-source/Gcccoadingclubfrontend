import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Trophy, Clock, Users, ArrowLeft, 
  Crown, Medal, Star, Shield, 
  RefreshCw, CheckCircle2, ChevronRight,
  TrendingUp, Activity, Zap
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function TestResults() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/quiz-sessions/${id}/results`);
      if (res.data.success) {
        setSession(res.data.session);
      }
    } catch (err) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await axios.post(`/api/quiz-sessions/${id}/sync`);
      if (res.data.success) {
        toast.success('Leaderboard updated successfully!');
      }
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Calculating Rankings...</span>
      </div>
    </div>
  );

  if (!session) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
      <Shield className="w-16 h-16 text-slate-300" />
      <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">Session Not Found</h2>
      <Link to="/admin/test-sessions" className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase">Back to Sessions</Link>
    </div>
  );

  // Sorting logic: Score (desc), then TimeTaken (asc)
  const sortedResults = [...session.results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.timeTaken || 9999) - (b.timeTaken || 9999);
  });

  const winners = sortedResults.slice(0, 3);
  const participants = sortedResults.slice(3);

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-3">
          <Link to="/admin/test-sessions" className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sessions
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Test <span className="text-emerald-500">Analytics</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">{session.title}</span>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{session.results.length} Participants</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSync}
          disabled={syncing || session.results.length === 0}
          className="group px-8 py-4 rounded-2xl bg-emerald-500 text-white flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Sync Results</span>
            <span className="text-[8px] text-white/70 font-black uppercase tracking-widest mt-1">Update Global Leaderboard</span>
          </div>
        </button>
      </div>

      {/* Podium Section */}
      {winners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto w-full px-4">
          {/* 2nd Place */}
          {winners[1] && (
            <div className="flex flex-col items-center gap-6 order-2 md:order-1">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-white/5 border-2 border-slate-300 dark:border-slate-700 p-1 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-xl overflow-hidden">
                   <img src={winners[1].user?.avatar || '/default-avatar.png'} className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-slate-400 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 animate-bounce">
                   <Medal className="w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{winners[1].user?.name}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2nd Place</span>
                <div className="mt-2 px-4 py-1 rounded-full bg-slate-400/10 text-slate-500 text-[10px] font-black border border-slate-400/20">
                   {winners[1].score} PTS • {winners[1].timeTaken}s
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {winners[0] && (
            <div className="flex flex-col items-center gap-8 order-1 md:order-2 pb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-cyan-500 p-1.5 shadow-2xl shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-500 relative z-10 overflow-hidden">
                   <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[1.7rem] p-1 overflow-hidden">
                      <img src={winners[0].user?.avatar || '/default-avatar.png'} className="w-full h-full object-cover rounded-[1.5rem]" />
                   </div>
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-yellow-500 text-white flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-900 z-20 animate-wiggle">
                   <Crown className="w-7 h-7" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 text-center relative z-10">
                <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{winners[0].user?.name}</span>
                <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">Champion</span>
                <div className="mt-4 px-6 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                   {winners[0].score} PTS • {winners[0].timeTaken}s
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {winners[2] && (
            <div className="flex flex-col items-center gap-6 order-3 md:order-3">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-amber-900/10 dark:bg-white/5 border-2 border-amber-700/30 dark:border-amber-700/20 p-1 -rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-xl overflow-hidden">
                   <img src={winners[2].user?.avatar || '/default-avatar.png'} className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
                   <Star className="w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{winners[2].user?.name}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3rd Place</span>
                <div className="mt-2 px-4 py-1 rounded-full bg-amber-700/10 text-amber-700 text-[10px] font-black border border-amber-700/20">
                   {winners[2].score} PTS • {winners[2].timeTaken}s
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Participants Table */}
      <div className="glass-panel overflow-hidden">
        <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
           <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-500" /> All Participants
           </h3>
           <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Tier 1 Results</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
           </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Time Taken</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {sortedResults.map((res, idx) => (
                <tr key={idx} className={`group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all ${idx < 3 ? 'bg-emerald-500/[0.02]' : ''}`}>
                  <td className="px-8 py-6">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black ${
                      idx === 0 ? 'bg-yellow-500 text-white' : 
                      idx === 1 ? 'bg-slate-400 text-white' : 
                      idx === 2 ? 'bg-amber-700 text-white' : 
                      'bg-slate-100 dark:bg-white/5 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden shadow-sm group-hover:border-emerald-500/30 transition-all">
                        <img src={res.user?.avatar || '/default-avatar.png'} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-black text-slate-900 dark:text-white uppercase leading-tight">{res.user?.name}</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{res.user?.usn || 'NO USN'} • {res.user?.department || 'GEN'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-base font-black text-slate-900 dark:text-white">{res.score}</span>
                       <span className="text-[8px] text-slate-400 font-black uppercase">Correct</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-base font-black text-slate-900 dark:text-white">{res.timeTaken || '--'}s</span>
                       <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Duration</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                       <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          {new Date(res.timestamp).toLocaleDateString()}
                       </span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tabular-nums">
                          {new Date(res.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
