import React, { useState, useEffect } from 'react';
import { 
  Plus, Layers, Trash2, Edit2, 
  Search, Save, X, Palette, 
  Code, Sparkles, Terminal as TerminalIcon, 
  Globe, Shield, Loader2
} from 'lucide-react';
import axios from 'axios';

// Helper to map icon names to Lucide components
const IconMap = {
  Code: <Code className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
  Terminal: <TerminalIcon className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Globe: <Globe className="w-8 h-8" />
};

export default function DomainsManager() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    color: 'emerald',
    slug: '',
    icon: 'Layers'
  });

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/domains');
      if (res.data.success) {
        setDomains(res.data.domains);
      }
    } catch (err) {
      console.error('Error fetching domains', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (domain = null) => {
    if (domain) {
      setEditingDomain(domain);
      setFormData({ ...domain });
    } else {
      setEditingDomain(null);
      setFormData({
        title: '',
        desc: '',
        color: 'emerald',
        slug: '',
        icon: 'Layers'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDomain(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Auto-generate slug if not provided
    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-')
    };

    try {
      if (editingDomain) {
        const res = await axios.put(`/api/domains/${editingDomain._id}`, payload);
        if (res.data.success) {
          setDomains(domains.map(d => d._id === editingDomain._id ? res.data.domain : d));
        }
      } else {
        const res = await axios.post('/api/domains', payload);
        if (res.data.success) {
          setDomains([...domains, res.data.domain]);
        }
      }
      closeModal();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this domain?')) {
      try {
        const res = await axios.delete(`/api/domains/${id}`);
        if (res.data.success) {
          setDomains(domains.filter(d => d._id !== id));
        }
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const colors = [
    { name: 'emerald', bg: 'bg-emerald-500' },
    { name: 'purple', bg: 'bg-purple-500' },
    { name: 'cyan', bg: 'bg-cyan-500' },
    { name: 'red', bg: 'bg-red-500' },
    { name: 'blue', bg: 'bg-blue-500' },
    { name: 'amber', bg: 'bg-amber-500' },
    { name: 'slate', bg: 'bg-slate-500' },
  ];

  const icons = ['Layers', 'Code', 'Sparkles', 'Terminal', 'Shield', 'Globe'];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Domains</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Manage the different interest groups in the club.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" /> Add Domain
        </button>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass-panel h-64 animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl" />
          ))
        ) : domains.length === 0 ? (
           <div className="col-span-full py-20 text-center opacity-30 font-black uppercase tracking-widest text-slate-500">
             No domains found. Add your first domain!
           </div>
        ) : (
          domains.map((domain) => (
            <div key={domain._id} className="glass-panel p-6 md:p-8 group hover:border-emerald-500/30 transition-all flex flex-col gap-8">
              <div className="flex justify-between items-start">
                <div className={`p-5 rounded-2xl bg-${domain.color}-500/10 border border-${domain.color}-500/20 text-${domain.color}-500 shadow-sm transition-transform group-hover:scale-110 duration-500`}>
                  {IconMap[domain.icon] || <Layers className="w-8 h-8" />}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => openModal(domain)}
                    className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all shadow-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(domain._id)}
                    className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-emerald-500 transition-colors">
                  {domain.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                  {domain.desc}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-[0.2em]">SLUG: {domain.slug}</span>
                <div className={`w-3 h-3 rounded-full bg-${domain.color}-500 shadow-lg shadow-${domain.color}-500/50 animate-pulse`} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" onClick={closeModal} />
          <div data-lenis-prevent className="glass-panel w-full max-w-lg relative z-10 animate-in zoom-in duration-500 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-10 px-6 md:px-10 py-6 md:py-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {editingDomain ? 'Edit Domain' : 'Add Domain'}
                </h2>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Fill in the details below.</p>
              </div>
              <button onClick={closeModal} className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-10 flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Domain Name</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Icon</label>
                <div className="flex flex-wrap gap-3">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({...formData, icon})}
                      className={`p-3 rounded-xl border transition-all ${formData.icon === icon ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-black/5 dark:bg-white/5 border-transparent text-slate-400'}`}
                    >
                      {IconMap[icon]}
                      <span className="text-[8px] block mt-1 uppercase font-black">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Theme Color</label>
                <div className="flex flex-wrap gap-4 pt-2">
                  {colors.map((c) => (
                    <button 
                      key={c.name}
                      type="button"
                      onClick={() => setFormData({...formData, color: c.name})}
                      className={`w-10 h-10 rounded-full ${c.bg} border-4 transition-all shadow-sm ${
                        formData.color === c.name ? 'border-emerald-500 scale-125 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Description</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="pt-10 flex flex-col sm:flex-row justify-end gap-5 border-t border-black/5 dark:border-white/5">
                <button type="button" onClick={closeModal} className="px-8 py-4 rounded-2xl border border-black/5 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-10 py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <Save className="w-5 h-5" /> {editingDomain ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
