import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, MapPin, Trash2, Edit2, 
  Search, ExternalLink, Image as ImageIcon, 
  Save, X, Clock, ToggleLeft, ToggleRight, Users
} from 'lucide-react';
import axios from 'axios';

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDesc: '',
    date: '',
    venue: '',
    category: 'Workshop',
    image: '',
    registrationLink: '',
    maxParticipants: 0,
    minTeamSize: 1,
    maxTeamSize: 1,
    isActive: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error fetching events', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const res = await axios.put(`/api/events/${editingEvent._id}`, formData);
        if (res.data.success) {
          setEvents(events.map(ev => ev._id === editingEvent._id ? res.data.event : ev));
        }
      } else {
        const res = await axios.post('/api/events', formData);
        if (res.data.success) {
          setEvents([...events, res.data.event]);
        }
      }
      closeModal();
    } catch (err) {
      const message = err.response?.data?.message || 'Action failed';
      alert(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        const res = await axios.delete(`/api/events/${id}`);
        if (res.data.success) {
          setEvents(events.filter(ev => ev._id !== id));
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Delete failed';
        alert(message);
      }
    }
  };

  const openModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      const formattedDate = new Date(event.date).toISOString().split('T')[0];
      setFormData({ ...event, date: formattedDate });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        shortDesc: '',
        date: '',
        venue: 'Online',
        category: 'Workshop',
        image: '',
        registrationLink: '',
        maxParticipants: 0,
        minTeamSize: 1,
        maxTeamSize: 1,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Events</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Create and manage club events.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" /> Add Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass-panel h-96 animate-pulse bg-black/5 dark:bg-white/5" />
          ))
        ) : events.length === 0 ? (
          <div className="col-span-full py-24 glass-panel flex flex-col items-center justify-center gap-6 text-slate-500">
            <div className="p-6 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <Calendar className="w-12 h-12 opacity-30" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">No events found</span>
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="glass-panel group overflow-hidden flex flex-col hover:border-emerald-500/30 transition-all">
              <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-inner">
                {event.image ? (
                  <img src={event.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-800">
                    <ImageIcon className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-5 left-5 flex gap-3">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border shadow-lg ${
                    event.isActive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-500/20 border-slate-500/30 text-slate-500 dark:text-slate-400'
                  }`}>
                    {event.isActive ? 'Active' : 'Archived'}
                  </div>
                  <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 backdrop-blur-xl shadow-lg">
                    {event.category}
                  </div>
                </div>
              </div>
              
              <div className="p-8 flex flex-col gap-5 flex-1">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors uppercase leading-tight line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" /> 
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 
                      {event.venue}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed">
                  {event.shortDesc || event.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div className="flex gap-3">
                    <a 
                      href={`#/admin/events/${event._id}/registrations`}
                      className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"
                    >
                      <Users className="w-4 h-4" /> {event.registeredCount || 0}
                    </a>
                    <button 
                      onClick={() => openModal(event)}
                      className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id)}
                      className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <a 
                    href={event.registrationLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2 hover:underline group/link"
                  >
                    Direct Link <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" onClick={closeModal} />
          <div data-lenis-prevent className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in duration-500 shadow-2xl">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-10 px-6 md:px-10 py-6 md:py-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {editingEvent ? 'Edit Event' : 'New Event'}
                </h2>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Fill in the details below.</p>
              </div>
              <button onClick={closeModal} className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Event Name</label>
                <input 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Event Date</label>
                <input 
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Location</label>
                <input 
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all appearance-none font-bold"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Talk">Talk</option>
                  <option value="Competition">Competition</option>
                  <option value="Meetup">Meetup</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Image URL</label>
                <input 
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Min Team Size</label>
                <input 
                  name="minTeamSize"
                  type="number"
                  min="1"
                  value={formData.minTeamSize}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Max Team Size</label>
                <input 
                  name="maxTeamSize"
                  type="number"
                  min="1"
                  value={formData.maxTeamSize}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Max Participants</label>
                <input 
                  name="maxParticipants"
                  type="number"
                  min="0"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Registration Link</label>
                <input 
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Description</label>
                <textarea 
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="md:col-span-2 pt-10 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status:</span>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={`transition-all ${formData.isActive ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`}
                  >
                    {formData.isActive ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                  </button>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button type="button" onClick={closeModal} className="flex-1 sm:flex-none px-8 py-4 rounded-2xl border border-black/5 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 sm:flex-none px-10 py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    <Save className="w-5 h-5" /> {editingEvent ? 'Save' : 'Create'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
