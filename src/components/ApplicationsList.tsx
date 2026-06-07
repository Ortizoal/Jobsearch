/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Application, Job, FreelancerProfile } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Calendar, 
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';

interface RatingFormProps {
  label: string;
  placeholder?: string;
  onSubmit: (rating: number, review: string) => void;
}

function RatingForm({ label, onSubmit, placeholder = 'Describe your experience...' }: RatingFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [review, setReview] = useState('');

  return (
    <div className="bg-slate-50/75 p-3.5 sm:p-4 rounded-lg border border-slate-100 flex flex-col gap-2.5 text-left transition-all duration-200 shadow-xs">
      <h5 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">{label}</h5>
      
      {/* 5 Star Picker */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isGold = (hoverRating !== null ? starValue <= hoverRating : starValue <= rating);
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-0.5 hover:scale-115 transition duration-150 text-slate-200"
            >
              <Star 
                className={`w-5 h-5 ${isGold ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
              />
            </button>
          );
        })}
        <span className="text-[11px] sm:text-xs font-bold text-slate-400 ml-2">
          {rating === 5 ? 'Excellent (5.0)' : rating === 4 ? 'Very Good (4.0)' : rating === 3 ? 'Good (3.0)' : rating === 2 ? 'Fair (2.0)' : 'Poor (1.0)'}
        </span>
      </div>

      <div>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full text-xs sm:text-sm p-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
        />
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={() => onSubmit(rating, review.trim())}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] sm:text-xs font-semibold shadow-xs transition"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

interface ApplicationsListProps {
  applications: Application[];
  jobs: Job[];
  freelancers: FreelancerProfile[];
  currentRole: 'freelancer' | 'client' | 'admin';
  onUpdateStatus?: (applicationId: string, newStatus: Application['status']) => void;
  onContactFreelancer?: (freelancerId: string, jobId: string) => void;
  onDeleteApplication?: (applicationId: string) => void;
  onRateContract?: (applicationId: string, ratingType: 'client' | 'freelancer', rating: number, review: string) => void;
}

export default function ApplicationsList({
  applications,
  jobs,
  freelancers,
  currentRole,
  onUpdateStatus,
  onContactFreelancer,
  onDeleteApplication,
  onRateContract
}: ApplicationsListProps) {

  const getJobDetail = (jobId: string) => jobs.find(j => j.id === jobId);
  const getFreelancerDetail = (freeId: string): FreelancerProfile => {
    return freelancers.find(f => f.id === freeId) || {
      id: freeId,
      name: 'Unknown Freelancer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120',
      title: 'Specialist',
      bio: '',
      hourlyRate: 50,
      skills: [],
      portfolio: [],
      email: 'member@marketplace.io',
      rating: 4.8,
      completedJobs: 0,
      verified: false
    };
  };

  const getStatusBadge = (status: Application['status']) => {
    const defaultStyles = 'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ';
    switch (status) {
      case 'applied':
        return <span className={defaultStyles + 'bg-blue-50 border-blue-100 text-blue-700'}>Applied</span>;
      case 'interviewing':
        return <span className={defaultStyles + 'bg-indigo-50 border-indigo-150 text-indigo-700 animate-pulse'}>Interviewing</span>;
      case 'offered':
        return <span className={defaultStyles + 'bg-amber-50 border-amber-100 text-amber-700'}>Offer Sent</span>;
      case 'hired':
        return <span className={defaultStyles + 'bg-emerald-50 border-emerald-100 text-emerald-700'}><CheckCircle className="w-3 h-3 text-emerald-600" /> Contract Active</span>;
      case 'completed':
        return <span className={defaultStyles + 'bg-purple-50 border-purple-100 text-purple-700'}><CheckCircle className="w-3 h-3 text-purple-600" /> Contract Completed</span>;
      case 'declined':
        return <span className={defaultStyles + 'bg-slate-100 border-slate-200 text-slate-600'}><XCircle className="w-3 h-3 text-slate-500" /> Declined</span>;
      default:
        return <span className={defaultStyles + 'bg-slate-50 border-slate-150 text-slate-600'}>Applied</span>;
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center max-w-lg mx-auto">
        <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Applications Found</h3>
        <p className="text-slate-500 text-sm mt-1">
          {currentRole === 'freelancer' 
            ? "When you apply to job offers, your proposals and interview statuses will be listed here."
            : "No proposals have been received yet for your active projects."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const job = getJobDetail(app.jobId);
        const freelancer = getFreelancerDetail(app.freelancerId);

        if (!job) return null; // Defensive check if job was deleted

        return (
          <div 
            key={app.id}
            id={`app-item-${app.id}`}
            className="bg-white rounded-xl border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow transition-all duration-300"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold bg-slate-50 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider">
                    Proposal #{app.id}
                  </span>
                  {getStatusBadge(app.status)}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  {job.title}
                </h3>
                
                <span className="text-xs text-slate-500 block">
                  Employer: <strong className="text-slate-700">{job.clientName}</strong> | Budget: <strong className="text-slate-800">${job.budget.toLocaleString()} ({job.type})</strong>
                </span>
              </div>

              {/* Bid context */}
              <div className="bg-indigo-50/50 border border-indigo-50 rounded-lg p-3 text-right flex flex-row md:flex-col justify-between items-center md:items-end gap-2 shrink-0 self-stretch md:self-auto">
                <span className="text-xs text-slate-500">Proposal Bid Price</span>
                <span className="text-lg font-bold text-indigo-700 flex items-center">
                  <DollarSign className="w-4 h-4" />
                  {app.bidAmount.toLocaleString()}
                  {job.type === 'Hourly' && <span className="text-xs text-indigo-500">/hr</span>}
                </span>
              </div>
            </div>

            {/* Main info based on Role */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-4">
              {/* Cover Letter side */}
              <div className="md:col-span-7 space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Cover Letter / Proposal Bio
                </h4>
                <div className="bg-slate-50 p-3.5 rounded-lg text-sm text-slate-600 leading-relaxed border border-slate-100 whitespace-pre-line">
                  {app.coverLetter}
                </div>
              </div>

              {/* Applicant side (visible to Admin and Client) */}
              <div className="md:col-span-5 flex flex-col justify-between border-t md:border-t-0 border-slate-100 md:border-l md:border-slate-50 pl-0 md:pl-5 pt-4 md:pt-0">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    Specialist Profile
                  </h4>
                  <div className="flex items-center gap-3">
                    <img 
                      src={freelancer.avatar} 
                      alt={freelancer.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div className="min-w-0">
                      <h5 className="text-sm font-bold text-slate-900 truncate flex items-center gap-1">
                        {freelancer.name}
                        {freelancer.verified && <CheckCircle className="w-3 h-3 text-indigo-600 fill-indigo-100" />}
                      </h5>
                      <p className="text-xs text-slate-500 truncate">{freelancer.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Rating: ★ {freelancer.rating} | Rating Jobs: {freelancer.completedJobs}</p>
                    </div>
                  </div>
                </div>

                {/* Live Management Actions (FOR CLIENTS & ADMINS) */}
                {(currentRole === 'client' || currentRole === 'admin') && onUpdateStatus && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
                      Manage Proposal Stage
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {app.status === 'applied' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(app.id, 'interviewing')}
                          className="px-2.5 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 transition"
                        >
                          Interview Applicant
                        </button>
                      )}
                      
                      {app.status === 'interviewing' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(app.id, 'offered')}
                          className="px-2.5 py-1 bg-amber-500 text-white rounded text-xs font-medium hover:bg-amber-600 transition"
                        >
                          Extend Work Offer
                        </button>
                      )}

                      {app.status === 'offered' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(app.id, 'hired')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition"
                        >
                          Hire Freelancer
                        </button>
                      )}

                      {app.status !== 'hired' && app.status !== 'declined' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(app.id, 'declined')}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium hover:bg-slate-200 transition"
                        >
                          Decline
                        </button>
                      )}

                      {app.status === 'hired' && (
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1.5 rounded inline-flex items-center gap-1 border border-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Active Contract
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(app.id, 'completed')}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold shadow-xs transition"
                          >
                            Complete & Rate Specialist
                          </button>
                        </div>
                      )}

                      {app.status === 'completed' && (
                        <span className="text-xs text-purple-700 font-semibold bg-purple-50 border border-purple-150 px-2.5 py-1.5 rounded inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-purple-650" /> Contract Completed
                        </span>
                      )}

                      {app.status === 'declined' && (
                        <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded">
                          Proposal was archived.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Freelancer withdraw application / complete contract actions */}
                {currentRole === 'freelancer' && (
                  <div className="mt-4 text-right">
                    {app.status === 'hired' && (
                      <div className="flex flex-wrap gap-2 items-center justify-end">
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-100 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Contract Active
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus?.(app.id, 'completed')}
                          className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold shadow-xs transition"
                        >
                          Complete Contract & Rate Client
                        </button>
                      </div>
                    )}

                    {onDeleteApplication && app.status !== 'hired' && app.status !== 'completed' && app.status !== 'declined' && (
                      <button
                        type="button"
                        onClick={() => onDeleteApplication(app.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-medium transition"
                      >
                        Withdraw Proposal
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Star rating feedback section for Completed Contracts */}
            {app.status === 'completed' && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5 pointer-events-auto">
                {/* CLIENT FEEDBACK BLOCK */}
                <div className="space-y-2 text-left">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    👑 Client's Review for Freelancer
                  </h4>
                  {app.clientRating ? (
                    <div className="bg-slate-50/70 p-3 sm:p-4 rounded-lg border border-slate-100 flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${s <= app.clientRating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                          />
                        ))}
                        <span className="text-[11px] sm:text-xs font-bold text-slate-700 ml-1.5">{app.clientRating}.0 / 5.0</span>
                      </div>
                      {app.clientReview ? (
                        <p className="text-xs sm:text-sm text-slate-600 italic mt-1">"{app.clientReview}"</p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No written comments left.</p>
                      )}
                    </div>
                  ) : (
                    currentRole === 'client' || currentRole === 'admin' ? (
                      <RatingForm 
                        label="Rate Freelancer's Contribution"
                        placeholder="How was the freelancer's communication, speed, and deliverables quality?"
                        onSubmit={(rating, review) => onRateContract?.(app.id, 'client', rating, review)}
                      />
                    ) : (
                      <div className="bg-slate-50/50 p-4 rounded-lg border border-dashed border-slate-200 text-center py-5">
                        <span className="text-xs text-slate-400 italic font-medium">Pending feedback from the client</span>
                      </div>
                    )
                  )}
                </div>

                {/* FREELANCER FEEDBACK BLOCK */}
                <div className="space-y-2 text-left">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    💼 Freelancer's Review for Client
                  </h4>
                  {app.freelancerRating ? (
                    <div className="bg-slate-50/70 p-3 sm:p-4 rounded-lg border border-slate-100 flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${s <= app.freelancerRating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                          />
                        ))}
                        <span className="text-[11px] sm:text-xs font-bold text-slate-700 ml-1.5">{app.freelancerRating}.0 / 5.0</span>
                      </div>
                      {app.freelancerReview ? (
                        <p className="text-xs sm:text-sm text-slate-600 italic mt-1">"{app.freelancerReview}"</p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No written comments left.</p>
                      )}
                    </div>
                  ) : (
                    currentRole === 'freelancer' || currentRole === 'admin' ? (
                      <RatingForm 
                        label="Rate Employer Experience"
                        placeholder="How clear were directions, response rates, and milestones handling?"
                        onSubmit={(rating, review) => onRateContract?.(app.id, 'freelancer', rating, review)}
                      />
                    ) : (
                      <div className="bg-slate-50/50 p-4 rounded-lg border border-dashed border-slate-200 text-center py-5">
                        <span className="text-xs text-slate-400 italic font-medium">Pending feedback from the freelancer</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Interactive communication shortcuts */}
            <div className="border-t border-slate-50 mt-2 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Apply terms: {job.duration} engagement duration
              </span>
              
              {currentRole !== 'freelancer' && onContactFreelancer && (
                <button
                  type="button"
                  onClick={() => onContactFreelancer(app.freelancerId, app.jobId)}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold py-1 px-2.5 rounded hover:bg-indigo-50 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat about this proposal
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
