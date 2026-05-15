import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Filter,
  Users, Search, Plus, Edit2, Trash2, 
  Download, Layout, Settings, Activity,
  MoreVertical, Check, X, User, GraduationCap, Layers, Phone,
  ChevronDown, ChevronUp, Mail, Calendar, Trophy
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function DomainRegistrationsManager() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [processingId, setProcessingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/domains/registrations/all');
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      console.error('Error fetching domain registrations', err);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, status) => {
    setProcessingId(id);
    try {
      const res = await axios.put(`/api/domains/registrations/${id}/decide`, { status });
      if (res.data.success) {
        toast.success(`Application ${status} successfully!`);
        // Update local state
        setRegistrations(prev => prev.map(reg => 
          reg._id === id ? { ...reg, status, decidedAt: new Date() } : reg
        ));
      }
    } catch (err) {
      console.error('Error processing application', err);
      toast.error(err.response?.data?.message || 'Failed to process application');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.usn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.domain?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-1.5 w-fit"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest border border-amber-500/20 flex items-center gap-1.5 w-fit"><Clock className="w-3 h-3" /> Pending Review</span>;
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Email,USN,Department,Year,Phone,Domain,Status,Applied At"].join(",") + "\n"
      + filteredRegistrations.map(r => [
          r.name, r.email, r.usn, r.department, r.year, r.phone, 
          r.domain?.title, r.status, new Date(r.appliedAt).toLocaleDateString()
        ].join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `domain_applications_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Domain Applications</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
            Manage student enrollment for <span className="text-brand">Technical Domains</span>
          </p>
        </div>
        
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-black/5 dark:bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-black/5 dark:border-white/10 hover:bg-brand hover:text-white hover:border-brand transition-all shadow-sm"
        >
          <Download className="w-4 h-4" /> Export Applications
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 py-5 px-8 glass-panel shadow-xl">
        <div className="flex items-center gap-3 px-5 py-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, USN or domain..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white w-full"
          />
        </div>
        
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-brand text-white shadow-lg' : 'text-slate-500 hover:text-brand'}`}
              >
                {status}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400 ml-4">Total: {filteredRegistrations.length}</span>
        </div>
      </div>

      {/* Applications List (Expandable Cards) */}
      <div className="flex flex-col gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass-panel h-24 animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl" />
          ))
        ) : filteredRegistrations.length === 0 ? (
          <div className="glass-panel py-24 text-center border border-black/5 dark:border-white/5 shadow-2xl">
            <div className="flex flex-col items-center gap-4 opacity-30">
              <Users className="w-12 h-12" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">No applications found</span>
            </div>
          </div>
        ) : (
          filteredRegistrations.map((reg) => (
            <div 
              key={reg._id} 
              className={`glass-panel border transition-all duration-500 overflow-hidden ${
                expandedId === reg._id 
                  ? 'border-brand/40 shadow-2xl shadow-brand/10 ring-1 ring-brand/20 scale-[1.01]' 
                  : 'border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'
              }`}
            >
              {/* Summary Header (Clickable) */}
              <div 
                onClick={() => setExpandedId(expandedId === reg._id ? null : reg._id)}
                className="p-6 md:p-8 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 border border-black/5 dark:border-white/5 overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500">
                     {reg.user?.avatar ? <img src={reg.user.avatar} className="w-full h-full object-cover" /> : <User className="w-7 h-7" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-black uppercase text-slate-900 dark:text-white tracking-tight">{reg.name}</span>
                      {getStatusBadge(reg.status)}
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full bg-${reg.domain?.color || 'emerald'}-500 shadow-[0_0_8px_rgba(var(--color-brand),0.5)]`} />
                       <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">{reg.domain?.title}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Applied On</span>
                    <span className="text-[11px] font-black uppercase text-slate-900 dark:text-white tracking-tighter">{new Date(reg.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`p-3 rounded-xl bg-black/5 dark:bg-white/5 text-slate-400 group-hover:text-brand transition-all ${expandedId === reg._id ? 'rotate-180 bg-brand/10 text-brand' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Expanded Content (Drawer) */}
              {expandedId === reg._id && (
                <div className="px-5 md:px-8 pb-8 animate-in slide-in-from-top-4 duration-500">
                  <div className="pt-8 border-t border-black/5 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Education */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Education Details</span>
                      <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <GraduationCap className="w-4 h-4 text-brand" />
                        <span className="text-[11px] font-black uppercase tracking-tight">{reg.usn}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <Layout className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{reg.department} • {reg.year}</span>
                      </div>
                    </div>

                    {/* Test Results */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Test Results</span>
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-slate-900 dark:text-white leading-none">
                            {reg.testScore} / {reg.totalQuestions}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Accuracy: {reg.totalQuestions > 0 ? Math.round((reg.testScore / reg.totalQuestions) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                         <div 
                           className={`h-full transition-all duration-1000 ${reg.testScore / reg.totalQuestions > 0.7 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                           style={{ width: `${reg.totalQuestions > 0 ? (reg.testScore / reg.totalQuestions) * 100 : 0}%` }}
                         />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Contact Info</span>
                      <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <Mail className="w-4 h-4 text-brand" />
                        <span className="text-[11px] font-bold tracking-tight lowercase">{reg.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <Phone className="w-4 h-4" />
                        <span className="text-[11px] font-bold tracking-widest">{reg.phone}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-end sm:col-span-1 lg:col-span-1">
                      {reg.status === 'pending' ? (
                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                          <button 
                            onClick={() => handleDecision(reg._id, 'approved')}
                            disabled={processingId === reg._id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </button>
                          <button 
                            onClick={() => handleDecision(reg._id, 'rejected')}
                            disabled={processingId === reg._id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-red-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Final Status</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${reg.status === 'approved' ? 'text-emerald-500' : 'text-red-500'}`}>{reg.status}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Processed On</span>
                            <span className="text-[9px] font-black uppercase text-slate-900 dark:text-white">{new Date(reg.decidedAt || reg.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
