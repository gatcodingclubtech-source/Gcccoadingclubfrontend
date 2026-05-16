import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, BookOpen, Video, FileText, 
  Link as LinkIcon, Code as CodeIcon, GraduationCap,
  ExternalLink, Edit2, Trash2, X, Plus, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function MyResources() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  // ... rest of state
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const domains = ['Web Dev', 'AI / ML', 'Cyber Security', 'Data Science', 'Mobile Dev', 'Cloud Computing', 'General'];
  const types = ['Video', 'Document', 'Link', 'Code', 'Course'];

  const typeIcons = {
    Video: { icon: Video, color: 'text-red-500', bg: 'bg-red-500/10' },
    Document: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    Link: { icon: LinkIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    Code: { icon: CodeIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    Course: { icon: GraduationCap, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  };

  useEffect(() => {
    if (user) {
      fetchMyResources();
    }
  }, [user]);

  const fetchMyResources = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/resources`);
      // Filter only resources added by the current user
      const myRes = res.data.resources.filter(r => r.addedBy?._id === user._id);
      setResources(myRes);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch resources', err);
      setLoading(false);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource({
      ...resource,
      tags: resource.tags?.join(', ') || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...editingResource,
        tags: editingResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };
      await axios.put(`${API_BASE_URL}/resources/${editingResource._id}`, data);
      toast.success('Resource updated successfully');
      setIsEditModalOpen(false);
      fetchMyResources();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/resources/${resourceToDelete._id}`);
      toast.success('Resource deleted');
      setIsDeleteModalOpen(false);
      fetchMyResources();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex flex-col items-center pt-24 md:pt-32 px-4 md:px-6 pb-20">
      <div className="w-full max-w-5xl flex flex-col gap-8 md:gap-10">
        <button 
          onClick={() => navigate('/resources')}
          className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-brand transition-all group self-start"
        >
          <ArrowLeft className="w-3.5 md:w-4 h-3.5 md:h-4 group-hover:-translate-x-1 transition-transform" /> Back to Hub
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
          <div className="flex flex-col gap-3 md:gap-4">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-brand">My Contributions</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
              Your <span className="text-brand">Resources</span>
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-500 max-w-xl leading-relaxed">
              Manage the knowledge you've shared with the community.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-panel px-5 md:px-6 py-3 md:py-4 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px]">
              <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{resources.length}</span>
              <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Shared</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1,2,3].map(i => <div key={i} className="glass-panel h-56 md:h-64 animate-pulse bg-black/5 dark:bg-white/5" />)}
          </div>
        ) : resources.length === 0 ? (
          <div className="py-16 md:py-24 flex flex-col items-center gap-6 md:gap-8 glass-panel border-dashed border-2 mx-1 md:mx-0">
            <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <BookOpen className="w-8 md:w-10 h-8 md:h-10 text-slate-300" />
            </div>
            <div className="flex flex-col items-center text-center gap-2 px-6">
              <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No resources yet</h3>
              <p className="text-xs md:text-sm text-slate-500">Contribute to the library and help your peers grow!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {resources.map((res) => (
              <div 
                key={res._id}
                className="glass-panel p-5 md:p-6 flex flex-col gap-5 md:gap-6 group hover:border-brand/30 transition-all hover:scale-[1.01] mx-1 md:mx-0"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 md:p-3 rounded-xl ${typeIcons[res.type]?.bg || 'bg-slate-100'} ${typeIcons[res.type]?.color || 'text-slate-500'}`}>
                    {(() => { const Icon = typeIcons[res.type]?.icon || LinkIcon; return <Icon className="w-4 md:w-5 h-4 md:h-5" />; })()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleEdit(res)}
                      className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-slate-500 hover:text-brand hover:bg-brand/10 transition-all"
                    >
                      <Edit2 className="w-3.5 md:w-4 h-3.5 md:h-4" />
                    </button>
                    <button 
                      onClick={() => { setResourceToDelete(res); setIsDeleteModalOpen(true); }}
                      className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 md:w-4 h-3.5 md:h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">
                    {res.title}
                  </h3>
                  <p className="text-[10px] md:text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5 mt-auto">
                  <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{res.domain}</span>
                  <a 
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[8px] md:text-[9px] font-black text-brand uppercase tracking-widest"
                  >
                    View <ExternalLink className="w-2.5 md:w-3 h-2.5 md:h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
          <div className="glass-panel w-full max-w-lg relative z-10 p-8 md:p-10 animate-in zoom-in duration-300 flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Update Resource</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                <input 
                  required
                  type="text"
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({...editingResource, title: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                  <select 
                    value={editingResource.type}
                    onChange={(e) => setEditingResource({...editingResource, type: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none appearance-none"
                  >
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Domain</label>
                  <select 
                    value={editingResource.domain}
                    onChange={(e) => setEditingResource({...editingResource, domain: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white outline-none appearance-none"
                  >
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea 
                  required
                  rows="3"
                  value={editingResource.description}
                  onChange={(e) => setEditingResource({...editingResource, description: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand/50 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="glass-panel w-full max-w-sm relative z-10 p-8 flex flex-col items-center text-center gap-6 animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Are you sure?</h3>
              <p className="text-xs text-slate-500">This action will permanently remove this resource and cannot be undone.</p>
            </div>
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={handleDelete}
                className="w-full py-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
              >
                Yes, Delete it
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-4 bg-black/5 dark:bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
