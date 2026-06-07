/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Search, Tag, Check } from 'lucide-react';

// Predefined list of skill tags spanning development, design, and marketing
export const PREDEFINED_SKILLS = [
  'React',
  'Tailwind CSS',
  'TypeScript',
  'Node.js',
  'Express',
  'PostgreSQL',
  'Figma',
  'UI/UX Design',
  'Vite',
  'Recharts',
  'Jest',
  'Docker',
  'Redis',
  'AWS',
  'Next.js',
  'GraphQL',
  'REST API',
  'WebSockets',
  'Framer Motion',
  'Copywriting',
  'SEO Optimization',
  'Content Marketing',
  'Brand Identity',
  'Social Media Graphics',
  'Canva',
  'Video Editing'
];

interface SkillSelectorProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  label?: string;
  placeholder?: string;
}

export default function SkillSelector({
  selectedSkills,
  onChange,
  label,
  placeholder = 'Type to search or add skills...'
}: SkillSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter(s => s.toLowerCase() !== skillToRemove.toLowerCase()));
  };

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    
    // Avoid duplicates (case-insensitive check)
    const exists = selectedSkills.some(s => s.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      // Find matching casing from predefined list to look polished, otherwise keep user input
      const matchedPredefined = PREDEFINED_SKILLS.find(s => s.toLowerCase() === trimmed.toLowerCase());
      onChange([...selectedSkills, matchedPredefined || trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        // Add currently typed or the first filtered matches
        const trimmed = inputValue.trim();
        const firstMatch = filteredPredefined.find(s => s.toLowerCase().includes(trimmed.toLowerCase()));
        if (firstMatch && firstMatch.toLowerCase() === trimmed.toLowerCase()) {
          handleAddSkill(firstMatch);
        } else {
          handleAddSkill(trimmed);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Predefined skills that aren't already selected
  const availablePredefined = PREDEFINED_SKILLS.filter(
    skill => !selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  );

  // Filter based on typed input
  const filteredPredefined = availablePredefined.filter(skill =>
    skill.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Quick suggestions shown below the box
  const popularSuggestions = PREDEFINED_SKILLS.slice(0, 10).filter(
    skill => !selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  );

  return (
    <div className="space-y-2 text-left" ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          {label}
        </label>
      )}

      {/* Selected skill chips panel */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100 mb-2">
          {selectedSkills.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-700 text-xs font-semibold rounded-full shadow-xs"
            >
              <Tag className="w-3 h-3 text-indigo-500" />
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:bg-indigo-150 hover:text-indigo-900 rounded-full p-0.5 transition"
              >
                <X className="w-3 h-3 text-indigo-600" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main Autocomplete Input box */}
      <div className="relative">
        <div className="flex items-center border border-slate-200 rounded-lg px-3 bg-slate-50/50 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 focus-within:bg-white transition-all duration-150">
          <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full py-2 bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-800 font-medium"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => handleAddSkill(inputValue)}
              className="ml-2 hover:bg-slate-100 p-1 rounded-md text-indigo-600 hover:text-indigo-800"
              title="Add Custom Skill"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown popup */}
        {isOpen && (filteredPredefined.length > 0 || inputValue.trim()) && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-slate-50">
            {/* Filtered suggestions list */}
            {filteredPredefined.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleAddSkill(skill)}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs sm:text-sm text-slate-700 font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> {skill}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">Predefined</span>
              </button>
            ))}

            {/* Custom skill option */}
            {inputValue.trim() && !PREDEFINED_SKILLS.some(s => s.toLowerCase() === inputValue.trim().toLowerCase()) && (
              <button
                type="button"
                onClick={() => handleAddSkill(inputValue)}
                className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-xs sm:text-sm text-indigo-700 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-500" /> Add Custom Skill: <strong className="text-indigo-950 font-extrabold">"{inputValue.trim()}"</strong>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Suggested popular tags shortcuts */}
      {popularSuggestions.length > 0 && (
        <div className="pt-1 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            ✨ Quick Suggestions:
          </span>
          {popularSuggestions.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => handleAddSkill(skill)}
              className="px-2 py-0.5 bg-slate-150/70 hover:bg-slate-200 text-slate-655 text-[10px] font-bold rounded-md border border-slate-200/50 transition-all flex items-center gap-1"
            >
              <Plus className="w-2.5 h-2.5" /> {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
