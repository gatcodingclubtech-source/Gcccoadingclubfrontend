import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ImageUpload({ value, onChange, label = 'Upload Image', className = '' }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large (max 5MB)');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        onChange(res.data.url);
        toast.success('Image uploaded successfully');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
      
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative h-40 rounded-[2rem] border-2 border-dashed border-black/5 dark:border-white/10 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden group transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5`}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <Camera className="w-6 h-6" />
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 backdrop-blur-md text-white hover:bg-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className={`p-4 rounded-[1.5rem] bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-xl transition-transform group-hover:scale-110 group-hover:shadow-emerald-500/20`}>
              {uploading ? <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /> : <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-500" />}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {uploading ? 'Beaming to Cloud...' : 'Select or Drag Image'}
            </span>
          </>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
          accept="image/*"
        />
      </div>
    </div>
  );
}
