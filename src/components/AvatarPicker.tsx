import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Check } from 'lucide-react';

export const AVATAR_PRESETS = [
  { name: "Agile Specialist Blue", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120" },
  { name: "Creative Expert Pink", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120" },
  { name: "Lead Architect Amber", url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120&h=120" },
  { name: "Fullstack Dev Beard", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120" },
  { name: "Visual Lead Glasses", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120" },
  { name: "Senior Dev Dark-Hair", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120" },
  { name: "Software Architect Gray", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120" },
  { name: "Creative Designer Green", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120" }
];

export const GRADIENT_PRESETS = [
  { key: "gradient:from-indigo-500 to-purple-600", label: "Midnight Velvet", classes: "from-indigo-500 to-purple-600" },
  { key: "gradient:from-emerald-400 to-teal-600", label: "Emerald Mint", classes: "from-emerald-400 to-teal-600" },
  { key: "gradient:from-pink-500 to-rose-600", label: "Crimson Rose", classes: "from-pink-500 to-rose-600" },
  { key: "gradient:from-amber-400 to-orange-600", label: "Amber Sun", classes: "from-amber-400 to-orange-600" },
  { key: "gradient:from-slate-700 to-slate-900", label: "Slate Carbon", classes: "from-slate-700 to-slate-900" }
];

export function renderAvatar(avatar: string | undefined, name: string, className = "w-12 h-12 rounded-lg object-cover") {
  const initials = name 
    ? name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : '?';
  
  if (!avatar) {
    return (
      <div className={`flex items-center justify-center font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 select-none ${className}`}>
        {initials}
      </div>
    );
  }

  if (avatar.startsWith('gradient:')) {
    const gradientClass = avatar.replace('gradient:', '') || 'from-indigo-500 to-purple-500';
    return (
      <div className={`flex items-center justify-center font-bold text-white bg-gradient-to-br ${gradientClass} select-none ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <img 
      src={avatar} 
      alt={name}
      referrerPolicy="no-referrer"
      className={className}
    />
  );
}

interface AvatarPickerProps {
  currentAvatar: string;
  onChange: (newAvatar: string) => void;
  userName: string;
  label?: string;
}

export default function AvatarPicker({ currentAvatar, onChange, userName, label = "Profile Picture" }: AvatarPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an active image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size exceeds 2MB limit.');
      return;
    }
    setUploadError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block">
        {label}
      </label>

      {/* Grid structure: Left side current layout, right side upload and choice options */}
      <div className="flex flex-col md:flex-row gap-5 items-start">
        
        {/* Left Side: Live Preview Area */}
        <div className="flex flex-col items-center p-4 bg-slate-50/50 border border-slate-100 rounded-xl w-full md:w-36 text-center select-none shrink-0">
          <div className="relative group">
            {renderAvatar(currentAvatar, userName, "w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50 shadow-inner")}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer" onClick={triggerFileBrowser}>
              <Upload className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-bold block mt-2 px-1.5 py-0.5 bg-slate-100 rounded">Preview</span>
        </div>

        {/* Right Side: Options Desk */}
        <div className="flex-grow space-y-4 w-full">
          
          {/* File drag-and-drop element */}
          <div 
            onClick={triggerFileBrowser}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              dragOver 
                ? 'border-indigo-500 bg-indigo-50/40' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/30'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-slate-700">Drag & drop profile picture or <span className="text-indigo-650 hover:underline">browse files</span></p>
            <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG (Max 2MB)</p>
            {uploadError && <p className="text-[10px] font-bold text-rose-500 mt-1.5">{uploadError}</p>}
          </div>

          {/* Preset Specialists Portraits selection */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Or Choose a Specialist Persona</span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {AVATAR_PRESETS.map((preset, idx) => {
                const isSelected = currentAvatar === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange(preset.url)}
                    className={`relative rounded-lg overflow-hidden border-2 w-full aspect-square focus:outline-none transition active:scale-95 ${
                      isSelected ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent hover:border-slate-300'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white font-black stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Color Gradients selection (for users who do not have any picture to upload) */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Or Dynamic Fallback Gradients</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {GRADIENT_PRESETS.map((preset) => {
                const isSelected = currentAvatar === preset.key;
                const initials = userName 
                  ? userName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                  : '?';
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => onChange(preset.key)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border transition text-left active:scale-95 text-[10px] font-semibold ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-100' 
                        : 'border-slate-200 hover:border-slate-350 bg-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white shrink-0 bg-gradient-to-br ${preset.classes}`}>
                      {initials}
                    </div>
                    <span className="truncate text-slate-700">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
