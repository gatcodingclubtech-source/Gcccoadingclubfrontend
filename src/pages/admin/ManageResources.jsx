import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, Trash2, Search, Filter, AlertCircle, 
  ExternalLink, Clock, User, Hash, Plus, X,
  Video, FileText, Link as LinkIcon, Code as CodeIcon, GraduationCap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Link',
    url: '',
    domain: 'General',
    tags: ''
  });

  const domains = ['All', 'Web Dev', 'AI / ML', 'Cyber Security', 'Data Science', 'Mobile Dev', 'Cloud Computing', 'General'];
  const resourceTypes = [
    { value: 'Video', icon: Video, color: 'text-red-500' },
    { value: 'Document', icon: FileText, color: 'text-blue-500' },
    { value: 'Link', icon: LinkIcon, color: 'text-emerald-500' },
    { value: 'Code', icon: CodeIcon, color: 'text-purple-500' },
    { value: 'Course', icon: GraduationCap, color: 'text-amber-500' }
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/resources`);
      setResources(res.data.resources || []);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load resources');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };
      await axios.post(`${API_BASE_URL}/resources`, data);
      toast.success('Resource added successfully');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', type: 'Link', url: '', domain: 'General', tags: '' });
      fetchResources();
    } catch (err) {
      toast.error('Failed to add resource');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/resources/${id}`);
      toast.success('Resource deleted');
      fetchResources();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = activeDomain === 'All' || res.domain === activeDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Library <span className="text-brand">Resources</span></h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Curate Educational Assets</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-brand text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" /> Add Resource
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Resources', value: resources.length, icon: BookOpen, color: 'bg-blue-500' },
          { label: 'Video Tutorials', value: resources.filter(r => r.type === 'Video').length, icon: Video, color: 'bg-red-500' },
          { label: 'Tech Docs', value: resources.filter(r => r.type === 'Document').length, icon: FileText, color: 'bg-emerald-500' },
          { label: 'Source Code', value: resources.filter(r => r.type === 'Code').length, icon: CodeIcon, color: 'bg-purple-500' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl ${stat.color}/10 flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-12 gap-6">
         <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search resources by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none focus:border-brand/50 transition-all shadow-sm"
            />
         </div>
         <div className="md:col-span-4">
            <div className="relative">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <select 
                 value={activeDomain}
                 onChange={(e) => setActiveDomain(e.target.value)}
                 className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 font-bold text-sm outline-none appearance-none focus:border-brand/50 transition-all shadow-sm"
               >
                 {domains.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>
         </div>
      </div>

      {/* Resources List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-xl shadow-black/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resource</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Domain</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tags</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {loading ? (
                     <tr>
                        <td colSpan="5" className="px-8 py-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Accessing Library Database...</td>
                     </tr>
                  ) : filteredResources.length === 0 ? (
                     <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest flex flex-col items-center gap-4">
                           <AlertCircle className="w-12 h-12 opacity-20" />
                           No resources found in this shelf.
                        </td>
                     </tr>
                  ) : (
                     filteredResources.map((res) => (
                        <tr key={res._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex flex-col gap-1 max-w-md">
                                 <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-brand transition-colors line-clamp-1">{res.title}</span>
                                 <span className="text-xs font-medium text-slate-400 line-clamp-1 leading-relaxed">{res.description}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                 {(() => {
                                   const type = resourceTypes.find(t => t.value === res.type);
                                   const Icon = type?.icon || LinkIcon;
                                   return <><Icon className={`w-3.5 h-3.5 ${type?.color}`} /> {res.type}</>;
                                 })()}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5">
                                 {res.domain}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                 {res.tags?.slice(0, 3).map(tag => (
                                   <span key={tag} className="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-md border border-black/5">#{tag}</span>
                                 ))}
                                 {res.tags?.length > 3 && <span className="text-[9px] font-black text-slate-400">+{res.tags.length - 3}</span>}
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                 <button 
                                   onClick={() => window.open(res.url, '_blank')}
                                   className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand hover:bg-brand/10 transition-all shadow-sm"
                                   title="Open Link"
                                 >
                                    <ExternalLink className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(res._id)}
                                   className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all shadow-sm"
                                   title="Delete"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Add Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="glass-panel w-full max-w-lg relative z-10 p-8 md:p-10 animate-in zoom-in duration-300 flex flex-col gap-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">New Library Asset</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Add resources to the public hub.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Title</label>
                <input 
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand/50"
                  placeholder="e.g. Master Clean Code Principles"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none appearance-none"
                  >
                    {resourceTypes.map(t => <option key={t.value} value={t.value}>{t.value}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Domain</label>
                  <select 
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none appearance-none"
                  >
                    {domains.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">URL / Link</label>
                <input 
                  required
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand/50"
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand/50 resize-none"
                  placeholder="Short brief about this resource..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Tags (Comma Separated)</label>
                <input 
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand/50"
                  placeholder="e.g. javascript, tutorial, coding"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all mt-4"
              >
                Archive Asset
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
