import React, { useState, useEffect } from 'react';
import { 
  Layers, CheckCircle2, XCircle, Clock, Filter,
  Users, Search, Plus, Edit2, Trash2, 
  Download, Layout, Settings, Activity
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DomainsManager from './DomainsManager';
import DomainRegistrationsManager from './DomainRegistrationsManager';

export default function DomainCentral() {
  const [activeTab, setActiveTab] = useState('applications'); // Default to apps as they need action
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const res = await axios.get('/api/domains/registrations/all');
      if (res.data.success) {
        const pending = res.data.registrations.filter(r => r.status === 'pending').length;
        setPendingCount(pending);
      }
    } catch (err) {
      console.error('Error fetching counts', err);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            Domain <span className="text-brand">Command</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
            Centralized hub for managing <span className="text-slate-900 dark:text-white">technical sectors</span> and <span className="text-slate-900 dark:text-white">membership flow</span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'applications' 
                ? 'bg-emerald-500 text-white shadow-xl' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" /> Applications 
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">{pendingCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'management' 
                ? 'bg-emerald-500 text-white shadow-xl' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Domain Config
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'applications' ? (
          <DomainRegistrationsManager />
        ) : (
          <DomainsManager />
        )}
      </div>
    </div>
  );
}
