import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Filter, BookOpen, Video, FileText, 
  Link as LinkIcon, Code as CodeIcon, GraduationCap,
  ArrowRight, Sparkles, ExternalLink, Hash, Clock, Plus, X, User as UserIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Link',
    url: '',
    domain: 'General',
    tags: ''
  });

  const domains = ['All', 'Web Dev', 'AI / ML', 'Cyber Security', 'Data Science', 'Mobile Dev', 'Cloud Computing', 'General'];
  const types = ['All', 'Video', 'Document', 'Link', 'Code', 'Course'];

  const typeIcons = {
    Video: { icon: Video, color: 'text-red-500', bg: 'bg-red-500/10' },
    Document: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    Link: { icon: LinkIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    Code: { icon: CodeIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    Course: { icon: GraduationCap, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/resources`);
      setResources(res.data.resources || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch resources', err);
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      return toast.error('Only PDF files are supported');
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to share resources');
    
    setUploading(true);
    try {
      let finalUrl = formData.url;

      // If it's a document and a file is selected, upload it first
      if (formData.type === 'Document' && file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await axios.post(`${API_BASE_URL}/upload`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          finalUrl = uploadRes.data.url;
        }
      }

      const data = {
        ...formData,
        url: finalUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };

      await axios.post(`${API_BASE_URL}/resources`, data);
      toast.success('Resource shared! +50 XP Awarded 🚀');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', type: 'Link', url: '', domain: 'General', tags: '' });
      setFile(null);
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to share resource');
    } finally {
      setUploading(false);
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = activeDomain === 'All' || res.domain === activeDomain;
    const matchesType = activeType === 'All' || res.type === activeType;
    return matchesSearch && matchesDomain && matchesType;
  });

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex flex-col items-center">
      {/* Hero Section - Optimized for Mobile */}
      <section className="w-full py-20 md:py-32 px-6 relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-brand/[0.02] dark:bg-brand/[0.05]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-brand/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="w-full max-w-4xl relative z-10 flex flex-col items-center text-center gap-6 md:gap-8">
          <div className="flex flex-col gap-3 md:gap-4">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-brand flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" /> The Knowledge Hub
            </span>
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight uppercase">
              Curated <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand to-cyan-500">Resources</span> <br className="hidden md:block" /> for Engineers
            </h1>
            <p className="text-xs md:text-base font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
              Accelerate your learning with hand-picked tutorials, documentation, and source code.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-2xl px-2 md:px-0">
            <div className="w-full relative group">
              <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors w-4 md:w-5 h-4 md:h-5" />
              <input 
                type="text"
                placeholder="Search library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border-2 border-black/5 dark:border-white/5 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-12 md:pl-14 pr-6 md:pr-8 font-bold text-xs md:text-sm outline-none focus:border-brand/30 transition-all shadow-xl shadow-black/5"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <Link 
                to="/my-resources"
                className="px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-black/5 dark:bg-white/5 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-black/5 dark:border-white/5 flex items-center gap-2"
              >
                <BookOpen className="w-3 md:w-3.5 h-3 md:h-3.5" /> My Resources
              </Link>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-brand text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 md:w-4 h-3.5 md:h-4" /> Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Mobile Responsive Grid */}
      <section className="w-full max-w-7xl px-4 md:px-6 pb-24 md:pb-32">
        {/* Mobile Horizontal Filters - Only visible on small screens */}
        <div className="lg:hidden flex flex-col gap-6 mb-8 overflow-hidden">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Domains</span>
              <span className="text-[9px] font-bold text-brand uppercase">{activeDomain}</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
              {domains.map(d => (
                <button 
                  key={d}
                  onClick={() => setActiveDomain(d)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    activeDomain === d 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg' 
                      : 'bg-white dark:bg-slate-900 text-slate-500 border-black/5 dark:border-white/5'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Content Types</span>
              <span className="text-[9px] font-bold text-brand uppercase">{activeType}</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
              {types.map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                    activeType === t 
                      ? 'bg-brand/10 text-brand border-brand/20 shadow-lg shadow-brand/5' 
                      : 'bg-white dark:bg-slate-900 text-slate-500 border-black/5 dark:border-white/5'
                  }`}
                >
                  {t === 'All' ? 'All' : <>{(() => { const C = typeIcons[t]?.icon || LinkIcon; return <C className="w-3.5 h-3.5" />; })()} {t}</>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Desktop Sidebar Filters - Hidden on Mobile */}
          <aside className="hidden lg:flex lg:col-span-3 flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-brand" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter by Domain</span>
              </div>
              <div className="flex flex-col gap-2">
                {domains.map(d => (
                  <button 
                    key={d}
                    onClick={() => setActiveDomain(d)}
                    className={`flex items-center justify-between px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      activeDomain === d 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
                        : 'text-slate-500 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {d}
                    {activeDomain === d && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-brand" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Content Type</span>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {types.map(t => (
                  <button 
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      activeType === t 
                        ? 'bg-brand/10 text-brand border border-brand/20 shadow-lg shadow-brand/5' 
                        : 'text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {t === 'All' ? 'All Types' : <>{(() => { const C = typeIcons[t]?.icon || LinkIcon; return <C className="w-4 h-4" />; })()} {t}</>}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Resources Grid */}
          <main className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
              <span className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Showing {filteredResources.length} Results
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[1,2,3,4].map(i => <div key={i} className="glass-panel h-64 animate-pulse bg-black/5 dark:bg-white/5" />)}
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="py-20 md:py-24 flex flex-col items-center gap-6 text-slate-500 glass-panel mx-2 md:mx-0">
                <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5">
                  <BookOpen className="w-8 h-8 opacity-20" />
                </div>
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest opacity-60">No resources found</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {filteredResources.map((res) => (
                  <div 
                    key={res._id}
                    className="glass-panel p-5 md:p-6 flex flex-col gap-5 md:gap-6 group hover:border-brand/30 transition-all hover:scale-[1.01] mx-1 md:mx-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 md:p-3 rounded-xl ${typeIcons[res.type]?.bg || 'bg-slate-100'} ${typeIcons[res.type]?.color || 'text-slate-500'} group-hover:scale-110 transition-transform`}>
                        {(() => { const Icon = typeIcons[res.type]?.icon || LinkIcon; return <Icon className="w-4 md:w-5 h-4 md:h-5" />; })()}
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                        <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">{res.domain}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-brand transition-colors flex items-center gap-2">
                        {res.title}
                      </h3>
                      <p className="text-[11px] md:text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">
                        {res.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-5 md:pt-6 border-t border-black/5 dark:border-white/5 mt-auto">
                      <div className="flex items-center gap-2.5 md:gap-3">
                        <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden flex items-center justify-center">
                          {res.addedBy?.avatar ? (
                            <img src={res.addedBy.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-3 md:w-4 h-3 md:h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] md:text-[9px] font-black text-slate-900 dark:text-white uppercase leading-none">{res.addedBy?.name || 'GCC Member'}</span>
                          <span className="text-[7px] md:text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">Contributor</span>
                        </div>
                      </div>
                      <a 
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black text-brand uppercase tracking-widest group-hover:translate-x-1 transition-transform"
                      >
                        Explore <ExternalLink className="w-3 md:w-3.5 h-3 md:h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Share Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="glass-panel w-full max-w-lg relative z-10 p-8 md:p-10 animate-in zoom-in duration-300 flex flex-col gap-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Share a Resource</h3>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Earn +50 XP for contributing!</p>
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
                  placeholder="e.g. Advanced React Design Patterns"
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
                    {types.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
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

              {formData.type === 'Document' ? (
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Upload PDF Notes</label>
                  <div className="relative group">
                    <input 
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 rounded-2xl px-5 py-8 text-center transition-all group-hover:border-brand/50 flex flex-col items-center gap-2">
                      <FileText className="w-6 h-6 text-slate-400 group-hover:text-brand" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {file ? file.name : 'Select PDF File'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
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
              )}

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand/50 resize-none"
                  placeholder="Describe this resource..."
                />
              </div>

              <button 
                type="submit"
                disabled={uploading}
                className="w-full py-4 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Share & Earn XP'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
