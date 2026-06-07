/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Job } from '../types';
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  Tag, 
  Star, 
  Trash, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  Share2
} from 'lucide-react';

interface JobCardProps {
  key?: string | number;
  job: Job;
  currentRole: 'freelancer' | 'client' | 'admin';
  hasApplied?: boolean;
  canManage?: boolean;
  onApply?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  onToggleFeatured?: (jobId: string) => void;
}

export default function JobCard({
  job,
  currentRole,
  hasApplied = false,
  canManage = false,
  onApply,
  onDelete,
  onToggleFeatured
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatBudget = (amount: number, type: 'Fixed' | 'Hourly') => {
    if (type === 'Fixed') {
      return `$${amount.toLocaleString()}`;
    }
    return `$${amount}/hr`;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/#job-${job.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id={`job-card-${job.id}`}
      className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
        job.isFeatured 
          ? 'border-amber-300 shadow-md ring-1 ring-amber-100 hover:shadow-lg' 
          : 'border-slate-100 hover:border-slate-300 shadow-sm hover:shadow'
      }`}
    >
      {/* Top Accent for Featured jobs */}
      {job.isFeatured && (
        <div className="bg-amber-400 text-amber-950 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-950" /> Featured Premium Opportunity
        </div>
      )}

      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <img 
            src={job.clientAvatar} 
            alt={job.clientName}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-lg object-cover ring-2 ring-slate-100 flex-shrink-0"
          />
          <div className="flex-grow min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-medium text-slate-500 truncate">{job.clientName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400">
                {new Date(job.createdAt).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mt-1 hover:text-indigo-600 transition-colors line-clamp-2">
              {job.title}
            </h3>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-3 gap-2 border-y border-slate-50 my-4 py-3 text-slate-600 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 min-w-0">
            <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="font-semibold text-slate-900 truncate">
              {formatBudget(job.budget, job.type)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="text-slate-700 truncate">{job.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-700 truncate">{job.type}</span>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-2">
          <p className={`text-sm text-slate-600 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
            {job.description}
          </p>
          <button 
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-2"
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Read More <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

        {/* Skills Tag Cloud */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.skills.map((skill) => (
            <span 
              key={skill}
              className="px-2.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs rounded-full flex items-center gap-1 font-medium"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              {skill}
            </span>
          ))}
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between border-t border-slate-50 mt-5 pt-4 gap-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded">
            Category: <strong className="text-slate-700">{job.category}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg border border-slate-250 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-xs flex items-center gap-1.5"
              title="Copy Job Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? 'Copied' : <span className="hidden sm:inline">Share</span>}
            </button>

            {/* Admin Controls */}
            {currentRole === 'admin' && (
              <>
                {onToggleFeatured && (
                  <button
                    type="button"
                    onClick={() => onToggleFeatured(job.id)}
                    className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                      job.isFeatured 
                        ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${job.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span className="hidden sm:inline">Feature</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(job.id)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 hover:text-rose-700 transition-colors text-xs flex items-center gap-1"
                    title="Delete listing"
                  >
                    <Trash className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                )}
              </>
            )}

            {/* Client (Creator) Controls */}
            {currentRole === 'client' && canManage && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(job.id)}
                className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 hover:text-rose-700 transition-colors text-xs flex items-center gap-1"
              >
                <Trash className="w-3.5 h-3.5" />
                <span>Delete Job</span>
              </button>
            )}

            {/* Freelancer Action */}
            {currentRole === 'freelancer' && onApply && (
              hasApplied ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-lg text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" /> Applied
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onApply(job)}
                  className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Apply Now
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
