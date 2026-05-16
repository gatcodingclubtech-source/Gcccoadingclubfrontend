import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, ChevronLeft, Search, 
  Mail, Phone, User, GraduationCap,
  Download, Printer, Trash2, CheckCircle, XCircle, Eye, ExternalLink, Image as ImageIcon,
  Clock, ShieldCheck
} from 'lucide-react';
import axios from 'axios';

export default function RegistrationsManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventRes, regsRes] = await Promise.all([
        axios.get(`/api/events/${id}`),
        axios.get(`/api/events/${id}/registrations`)
      ]);

      if (eventRes.data.success) setEvent(eventRes.data.event);
      if (regsRes.data.success) setRegistrations(regsRes.data.registrations);
    } catch (err) {
      console.error('Error fetching registration data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.teamLeader?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.members?.some(m => m.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExport = () => {
    const headers = ["Team Name", "Leader Name", "Leader Email", "Leader USN", "Leader Phone", "Members Count"];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + filteredRegistrations.map(r => [
          r.teamName || 'Solo', 
          r.teamLeader?.name, 
          r.teamLeader?.email, 
          r.teamLeader?.usn, 
          r.teamLeader?.phone, 
          r.members?.length
        ].join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations_${event?.title || 'event'}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleUpdateStatus = async (regId, newStatus) => {
    setVerifying(true);
    try {
      const res = await axios.put(`/api/events/registrations/${regId}/status`, { paymentStatus: newStatus });
      if (res.data.success) {
        toast.success(`Registration ${newStatus}!`);
        fetchData();
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/admin/events')}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-emerald-500 transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Events
          </button>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Registrations</h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
              Event: <span className="text-emerald-500">{event?.title || 'Loading...'}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-black/5 dark:bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-black/5 dark:border-white/10 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 py-5 px-8 glass-panel">
        <div className="flex items-center gap-3 px-5 py-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white w-full"
          />
        </div>
        
        <div className="sm:ml-auto flex items-center gap-3">
          <span className="text-[10px] font-black uppercase text-slate-400">Total Teams: {filteredRegistrations.length}</span>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="glass-panel overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Leader</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-6">
                      <div className="h-10 bg-black/5 dark:bg-white/5 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Users className="w-12 h-12" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">No registrations found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg._id} className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase text-slate-900 dark:text-white">
                          {reg.teamName || 'Solo Participation'}
                        </span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                          ID: {reg._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                           <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase text-slate-900 dark:text-white">{reg.teamLeader?.name}</span>
                          <span className="text-[9px] text-slate-500 lowercase">{reg.teamLeader?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className={`w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          reg.paymentStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' :
                          reg.paymentStatus === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {reg.paymentStatus || 'Unpaid'}
                        </div>
                        {reg.transactionId && (
                          <span className="text-[8px] text-slate-400 font-bold uppercase mt-1">UTR: {reg.transactionId}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => {
                          setSelectedReg(reg);
                          setIsModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-emerald-500/50 hover:text-emerald-500 transition-all shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {isModalOpen && selectedReg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Payment Review</h2>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{selectedReg.teamName || selectedReg.teamLeader?.name}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: Details */}
                <div className="flex flex-col gap-8">
                  <div className="p-6 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction UTR / Order ID</span>
                       <span className="text-sm font-black text-slate-900 dark:text-white break-all">{selectedReg.transactionId || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Info</span>
                       <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedReg.teamLeader?.phone}</span>
                       <span className="text-xs font-bold text-slate-500">{selectedReg.teamLeader?.email}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Status</span>
                       <span className={`text-[10px] font-black uppercase ${
                         selectedReg.paymentStatus === 'Verified' ? 'text-emerald-500' :
                         selectedReg.paymentStatus === 'Rejected' ? 'text-red-500' : 'text-amber-500'
                       }`}>{selectedReg.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-4">
                     <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Squad Members</h4>
                     <div className="flex flex-col gap-2">
                        {selectedReg.members?.map((m, i) => (
                          <div key={i} className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400 py-1 border-b border-emerald-500/5">
                             <span>{m.name}</span>
                             <span className="text-[8px] opacity-50 uppercase">{m.usn}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Right: Screenshot */}
                <div className="flex flex-col gap-4">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment Proof</span>
                  {selectedReg.paymentScreenshot ? (
                    <div className="relative group overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 shadow-xl bg-black/5">
                      <img 
                        src={selectedReg.paymentScreenshot} 
                        alt="Payment Proof" 
                        className="w-full h-auto max-h-[400px] object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      <a 
                        href={selectedReg.paymentScreenshot} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-[10px] font-black uppercase tracking-widest"
                      >
                        <ExternalLink className="w-5 h-5" /> View Full Image
                      </a>
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-4 text-slate-400">
                      <ImageIcon className="w-10 h-10 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50">No screenshot provided</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5 flex items-center justify-end gap-4">
              <button 
                onClick={() => handleUpdateStatus(selectedReg._id, 'Rejected')}
                disabled={verifying}
                className="px-8 py-4 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                Reject Payment
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedReg._id, 'Verified')}
                disabled={verifying}
                className="px-8 py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                {verifying ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Confirm & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
