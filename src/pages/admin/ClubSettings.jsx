import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Save, Shield, 
  CreditCard, Globe, Mail, Phone, 
  CheckCircle, AlertCircle, Info
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ClubSettings() {
  const [settings, setSettings] = useState({
    clubName: '',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    upiId: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings');
      if (res.data.success) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('/api/settings', settings);
      if (res.data.success) {
        toast.success('Club settings updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Club Central</h1>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Master configuration & core identity.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        {/* Basic Config */}
        <div className="glass-panel p-8 flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Identity & Branding</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Club Name</label>
              <input 
                name="clubName"
                value={settings.clubName}
                onChange={handleChange}
                className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Contact Email</label>
              <input 
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
                className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
              />
            </div>
          </div>
        </div>

        {/* Automated Payments */}
        <div className="glass-panel p-8 flex flex-col gap-8 border-emerald-500/20 bg-emerald-500/[0.02]">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Shield className="w-5 h-5 text-emerald-500" />
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Automated Gateway (Razorpay)</h3>
             </div>
             <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest">Secure Link</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
             <Info className="w-5 h-5 text-amber-500 shrink-0" />
             <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase leading-relaxed tracking-widest">
               Keys entered here will override .env values. Use 'rzp_test_...' for development. Never share these keys with anyone.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Razorpay Key ID</label>
              <input 
                name="razorpayKeyId"
                placeholder="rzp_live_..."
                value={settings.razorpayKeyId}
                onChange={handleChange}
                className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Razorpay Key Secret</label>
              <input 
                name="razorpayKeySecret"
                type="password"
                placeholder="••••••••••••••••"
                value={settings.razorpayKeySecret}
                onChange={handleChange}
                className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
              />
            </div>
          </div>
        </div>

        {/* Manual Payments */}
        <div className="glass-panel p-8 flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Fallback Payments (UPI)</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Default Club UPI ID</label>
            <input 
              name="upiId"
              placeholder="club@upi"
              value={settings.upiId}
              onChange={handleChange}
              className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={saving}
            className="px-12 py-5 rounded-[2rem] bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            Save Club Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
