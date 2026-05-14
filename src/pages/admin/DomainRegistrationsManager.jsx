import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Mail, Phone, User, 
  CheckCircle2, XCircle, Clock, Filter,
  Layers, Download, ChevronRight, Briefcase, GraduationCap
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function DomainRegistrationsManager() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

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

      {/* Applications Table */}
      <div className="glass-panel overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Domain</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Education/Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-6">
                      <div className="h-10 bg-black/5 dark:bg-white/5 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Users className="w-12 h-12" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">No applications found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg._id} className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 border border-black/5 dark:border-white/5">
                           {reg.user?.avatar ? <img src={reg.user.avatar} className="w-full h-full object-cover rounded-2xl" /> : <User className="w-6 h-6" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase text-slate-900 dark:text-white">{reg.name}</span>
                          <span className="text-[9px] text-slate-500 lowercase">{reg.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg bg-${reg.domain?.color}-500/10 flex items-center justify-center text-${reg.domain?.color}-500 border border-${reg.domain?.color}-500/20`}>
                            <Layers className="w-4 h-4" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase text-slate-900 dark:text-white">{reg.domain?.title}</span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Applied: {new Date(reg.appliedAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                             <GraduationCap className="w-3 h-3 text-slate-400" />
                             <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">{reg.usn} • {reg.department}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Phone className="w-3 h-3 text-slate-400" />
                             <span className="text-[9px] font-medium text-slate-500">{reg.phone}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       {getStatusBadge(reg.status)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {reg.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => handleDecision(reg._id, 'approved')}
                             disabled={processingId === reg._id}
                             className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all active:scale-95 shadow-sm"
                             title="Approve Application"
                           >
                             <CheckCircle2 className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => handleDecision(reg._id, 'rejected')}
                             disabled={processingId === reg._id}
                             className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all active:scale-95 shadow-sm"
                             title="Reject Application"
                           >
                             <XCircle className="w-4 h-4" />
                           </button>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em]">PROCESSED</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
