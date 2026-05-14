import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, ChevronLeft, Search, 
  Mail, Phone, User, GraduationCap,
  Download, Printer, Trash2
} from 'lucide-react';
import axios from 'axios';

export default function RegistrationsManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventRes, attendeesRes] = await Promise.all([
        axios.get(`/api/events/${id}`),
        axios.get(`/api/events/${id}/attendees`)
      ]);

      if (eventRes.data.success) setEvent(eventRes.data.event);
      if (attendeesRes.data.success) setAttendees(attendeesRes.data.attendees);
    } catch (err) {
      console.error('Error fetching registration data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendees = attendees.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.usn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Email,USN,Department,Year,Phone"].join(",") + "\n"
      + filteredAttendees.map(u => [u.name, u.email, u.usn, u.department, u.year, u.phone].join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations_${event?.title || 'event'}.csv`);
    document.body.appendChild(link);
    link.click();
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
          <span className="text-[10px] font-black uppercase text-slate-400">Total Registered: {filteredAttendees.length}</span>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="glass-panel overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">USN / ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Education</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
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
              ) : filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Users className="w-12 h-12" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">No registrations found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((user) => (
                  <tr key={user._id} className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                           <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase text-slate-900 dark:text-white">{user.name}</span>
                          <span className="text-[9px] text-slate-500 lowercase">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{user.usn || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{user.department || 'PENDING'}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold">{user.year || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <a href={`tel:${user.phone}`} className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-slate-400 hover:text-emerald-500 transition-all">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a href={`mailto:${user.email}`} className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-slate-400 hover:text-emerald-500 transition-all">
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 ml-2">{user.phone || 'No Phone'}</span>
                      </div>
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
