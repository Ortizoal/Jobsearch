/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FreelancerProfile } from '../types';
import { 
  Star, 
  MapPin, 
  Mail, 
  DollarSign, 
  CheckCircle, 
  MessageSquare,
  Sparkles,
  Award,
  Link,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

interface FreelancerCardProps {
  key?: string | number;
  profile: FreelancerProfile;
  currentRole: 'freelancer' | 'client' | 'admin';
  highlightSkills?: string[];
  onContact?: (profile: FreelancerProfile) => void;
  onToggleVerify?: (id: string) => void;
  onDeleteProfile?: (id: string) => void;
}

export default function FreelancerCard({
  profile,
  currentRole,
  highlightSkills = [],
  onContact,
  onToggleVerify,
  onDeleteProfile
}: FreelancerCardProps) {
  return (
    <div 
      id={`freelancer-card-${profile.id}`}
      className="bg-white rounded-xl border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow hover:border-slate-300 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-slate-50">
        <div className="relative">
          <img 
            src={profile.avatar} 
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-50"
          />
          {profile.verified && (
            <span 
              className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1" 
              title="Verified Expert"
            >
              <CheckCircle className="w-3.5 h-3.5 fill-current text-white" />
            </span>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
            {profile.verified && (
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                <CheckCircle className="w-3 h-3 text-indigo-600" /> Professional
              </span>
            )}
          </div>
          <p className="text-sm text-indigo-600 font-medium">{profile.title}</p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <strong className="text-slate-700">{profile.rating}</strong> ({profile.completedJobs} completed jobs)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <strong className="text-slate-800">${profile.hourlyRate}/hr</strong> rate
            </span>
          </div>
        </div>
      </div>

      <div className="py-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">About Specialist</h4>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {profile.bio}
        </p>

        {profile.portfolio && profile.portfolio.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Portfolio links</h4>
            <div className="flex flex-wrap gap-2">
              {profile.portfolio.map((link, idx) => (
                <a 
                  key={idx}
                  href={link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition-all"
                >
                  <Link className="w-3 h-3" />
                  Portfolio #{idx+1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {profile.skills.map(skill => {
          const isHighlighted = highlightSkills.some(
            hs => hs.toLowerCase() === skill.toLowerCase()
          );
          return (
            <span 
              key={skill}
              className={`px-2.5 py-0.5 text-xs rounded border font-semibold flex items-center gap-1 transition ${
                isHighlighted 
                  ? 'bg-indigo-50 border-indigo-250 text-indigo-805 scale-102 shadow-xs' 
                  : 'bg-slate-50 text-slate-600 border-slate-100 font-medium'
              }`}
            >
              {isHighlighted && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
              {skill}
            </span>
          );
        })}
      </div>

      {/* Action panel footer */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-50 pt-4 gap-3">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Mail className="w-3.5 h-3.5" /> {profile.email}
        </span>

        <div className="flex items-center gap-2">
          {/* Admin badge toggle */}
          {currentRole === 'admin' && (
            <>
              {onToggleVerify && (
                <button
                  type="button"
                  onClick={() => onToggleVerify(profile.id)}
                  className={`p-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    profile.verified 
                      ? 'bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100' 
                      : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {profile.verified ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  {profile.verified ? 'Revoke Status' : 'Grant Verified'}
                </button>
              )}
              {onDeleteProfile && (
                <button
                  type="button"
                  onClick={() => onDeleteProfile(profile.id)}
                  className="p-1.5 px-3 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition"
                >
                  Delete
                </button>
              )}
            </>
          )}

          {/* Contact initiate */}
          {currentRole === 'client' && onContact && (
            <button
              type="button"
              onClick={() => onContact(profile)}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 shadow-sm transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Contact Specialist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
