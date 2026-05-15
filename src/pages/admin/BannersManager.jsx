import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon, Link as LinkIcon, Calendar, Sparkles, Layout, Activity } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';

export default function BannersManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    type: 'EVENT',
    targetDate: '',
    color: 'emerald',
    isActive: true,
    priority: 0
  });

  const fetchBanners = async () => {
    try {
      const res = await axios.get('/api/banners');
      if (res.data.success) setBanners(res.data.banners);
    } catch (err) {
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await axios.put(`/api/banners/${editingBanner._id}`, formData);
        toast.success('Banner updated successfully');
      } else {
        await axios.post('/api/banners', formData);
        toast.success('Banner created successfully');
      }
      setIsModalOpen(false);
      setEditingBanner(null);
      setFormData({ title: '', subtitle: '', image: '', link: '', type: 'EVENT', targetDate: '', color: 'emerald', isActive: true, priority: 0 });
      fetchBanners();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await axios.delete(`/api/banners/${id}`);
      toast.success('Banner removed');
      fetchBanners();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      type: banner.type,
      targetDate: banner.targetDate ? new Date(banner.targetDate).toISOString().split('T')[0] : '',
      color: banner.color,
      isActive: banner.isActive,
      priority: banner.priority
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Layout className="w-6 h-6 text-emerald-500" /> Banner Spotlights
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Manage high-impact promotional banners</p>
        </div>
        <button 
          onClick={() => { setEditingBanner(null); setIsModalOpen(true); }}
          className="px-6 py-3 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Hoist New Banner
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="glass-panel p-6 border-black/5 dark:border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <div className={`px-2 py-1 rounded-md bg-${banner.color}-500/10 text-${banner.color}-500 text-[8px] font-black uppercase tracking-widest border border-${banner.color}-500/20`}>
                  {banner.type}
                </div>
              </div>
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase truncate">{banner.title}</h3>
              <p className="text-[10px] font-medium text-slate-500 truncate mb-4">{banner.subtitle}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  <Activity className={`w-3 h-3 ${banner.isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
                  {banner.isActive ? 'Active' : 'Paused'}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(banner)} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-sm bg-black/40">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2rem] shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" /> {editingBanner ? 'Refine' : 'Hoist'} Spotlight
                </h2>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Configuration Panel</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banner Title</label>
                  <input 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="E.g. Web Dev Bootcamp" 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none font-bold text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banner Subtitle</label>
                  <input 
                    value={formData.subtitle} 
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    placeholder="Short punchy description" 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none font-bold text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={(url) => setFormData({...formData, image: url})}
                    label="Banner Visual (High-Res)"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Action Link (Redirect)</label>
                  <input 
                    value={formData.link} 
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    placeholder="E.g. /event/web-dev-101" 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none font-bold text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Countdown Date</label>
                  <input 
                    type="date"
                    value={formData.targetDate} 
                    onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none font-bold text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Theme Color</label>
                  <select 
                    value={formData.color} 
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5 focus:border-emerald-500 outline-none font-bold text-sm"
                  >
                    <option value="emerald">Emerald Green</option>
                    <option value="blue">Deep Blue</option>
                    <option value="purple">Vibrant Purple</option>
                    <option value="amber">Amber Gold</option>
                    <option value="rose">Rose Red</option>
                  </select>
                </div>
                
                <button type="submit" className="md:col-span-2 w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4">
                  {editingBanner ? 'UPDATE SPOTLIGHT' : 'LAUNCH SPOTLIGHT'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
