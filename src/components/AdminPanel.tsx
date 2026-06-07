/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Job, FreelancerProfile, Application } from '../types';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  CheckSquare, 
  ShieldCheck, 
  Trash, 
  Star, 
  Heart,
  TrendingUp,
  Sliders,
  Sparkles,
  Award,
  Lock,
  Key,
  ShieldAlert,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  jobs: Job[];
  profiles: FreelancerProfile[];
  applications: Application[];
  totalMessagesCount: number;
  adminPasscode: string;
  onUpdatePasscode: (code: string) => void;
  onDeleteJob: (id: string) => void;
  onToggleFeatureJob: (id: string) => void;
  onDeleteProfile: (id: string) => void;
  onToggleVerifyProfile: (id: string) => void;
  onToggleAdminProfile: (id: string) => void;
}

export default function AdminPanel({
  jobs,
  profiles,
  applications,
  totalMessagesCount,
  adminPasscode,
  onUpdatePasscode,
  onDeleteJob,
  onToggleFeatureJob,
  onDeleteProfile,
  onToggleVerifyProfile,
  onToggleAdminProfile
}: AdminPanelProps) {
  const [activeSubtab, setActiveSubtab] = useState<'listings' | 'users' | 'security'>('listings');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [secSuccess, setSecSuccess] = useState<string | null>(null);
  const [secError, setSecError] = useState<string | null>(null);

  // Stats computation
  const totalJobs = jobs.length;
  const totalProfiles = profiles.length;
  const totalApps = applications.length;
  const averageHourlyRate = Math.round(
    profiles.reduce((acc, p) => acc + p.hourlyRate, 0) / (totalProfiles || 1)
  );

  const handleUpdateSecureKey = (e: React.FormEvent) => {
    e.preventDefault();
    setSecSuccess(null);
    setSecError(null);

    if (!newPasscode.trim()) {
      setSecError('The new passcode cannot be blank.');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setSecError('New passcode and confirmation mismatch. Please type carefully.');
      return;
    }
    if (newPasscode.length < 4) {
      setSecError('For safety, administrative passcodes must be at least 4 characters.');
      return;
    }

    onUpdatePasscode(newPasscode.trim());
    setSecSuccess('Administrative passcode successfully updated. The new key is now active!');
    setNewPasscode('');
    setConfirmPasscode('');
  };

  return (
    <div className="space-y-6">
      {/* Platform Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Total Jobs</span>
            <strong className="text-lg sm:text-xl font-bold text-slate-900 block">{totalJobs}</strong>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider font-semibold">Proposals</span>
            <strong className="text-lg sm:text-xl font-bold text-slate-900 block">{totalApps}</strong>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-pink-600" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider font-semibold">Specialists</span>
            <strong className="text-lg sm:text-xl font-bold text-slate-900 block">{totalProfiles}</strong>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider font-semibold">Chats Sent</span>
            <strong className="text-lg sm:text-xl font-bold text-slate-900 block">{totalMessagesCount}</strong>
          </div>
        </div>
      </div>

      {/* Admin Panel Console Layout */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="border-b border-slate-100 bg-slate-50/40 px-4 pt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">Moderator Console</h3>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveSubtab('listings')}
              className={`px-4 py-2 border-b-2 font-semibold text-xs text-slate-600 transition-all ${
                activeSubtab === 'listings'
                  ? 'border-indigo-600 text-indigo-650 bg-white'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Job Listings ({jobs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubtab('users')}
              className={`px-4 py-2 border-b-2 font-semibold text-xs text-slate-600 transition-all ${
                activeSubtab === 'users'
                  ? 'border-indigo-600 text-indigo-650 bg-white'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Freelancer Profiles ({profiles.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubtab('security');
                setSecSuccess(null);
                setSecError(null);
              }}
              className={`px-4 py-2 border-b-2 font-semibold text-xs text-slate-600 transition-all flex items-center gap-1.5 ${
                activeSubtab === 'security'
                  ? 'border-indigo-600 text-indigo-650 bg-white font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" /> Security Credentials
            </button>
          </div>
        </div>

        {/* Console Lists */}
        <div className="p-4 sm:p-6">
          {activeSubtab === 'listings' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs text-slate-400 font-medium">Delete inappropriate postings or toggle feature statuses.</span>
                <span className="text-xs text-slate-505 font-bold">Avg Developer Rate: ${averageHourlyRate}/hr</span>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No active job listings on the platform.</div>
              ) : (
                <div className="divide-y divide-slate-50 border border-slate-50 rounded-lg overflow-hidden">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="p-4 hover:bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition bg-white"
                    >
                      <div className="min-w-0 flex items-start gap-3">
                        <img 
                          src={job.clientAvatar} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded object-cover border"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{job.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <span className="truncate">{job.clientName}</span>
                            <span>•</span>
                            <span className="text-slate-500 font-semibold">${job.budget} • {job.type}</span>
                            {job.isFeatured && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold uppercase rounded px-1 flex items-center gap-0.5">
                                <Star className="w-2 h-2 fill-current" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => onToggleFeatureJob(job.id)}
                          className={`p-1.5 px-3 rounded text-xs font-semibold border flex items-center gap-1 transition ${
                            job.isFeatured 
                              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${job.isFeatured ? 'fill-amber-505 text-amber-500' : ''}`} />
                          {job.isFeatured ? 'Featured' : 'Feature'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => onDeleteJob(job.id)}
                          className="p-1.5 px-3 rounded text-xs font-semibold bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition flex items-center gap-1"
                        >
                          <Trash className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubtab === 'users' && (
            <div className="space-y-3">
              <span className="text-xs text-slate-400 font-medium block pb-2">Toggle verified badges, inspect credentials or delete spam accounts.</span>

              {profiles.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No profiles found on the platform.</div>
              ) : (
                <div className="divide-y divide-slate-50 border border-slate-50 rounded-lg overflow-hidden">
                  {profiles.map((profile) => (
                    <div 
                      key={profile.id} 
                      className="p-4 hover:bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition bg-white"
                    >
                      <div className="min-w-0 flex items-start gap-3">
                        <img 
                          src={profile.avatar} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 truncate">
                            {profile.name}
                            {profile.verified && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                            {profile.isAdmin && (
                              <span className="bg-purple-100 text-purple-800 text-[9px] font-extrabold uppercase rounded-full px-2 py-0.5 flex gap-0.5 items-center">
                                <Award className="w-2.5 h-2.5 text-purple-705 fill-purple-200 shrink-0" /> Admin
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-indigo-600 truncate">{profile.title}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <span>Rate: ${profile.hourlyRate}/hr</span>
                            <span>•</span>
                            <span>Rating: ★ {profile.rating}</span>
                            <span>•</span>
                            <span>Completed: {profile.completedJobs} projects</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap justify-end">
                        <button
                          type="button"
                          onClick={() => onToggleAdminProfile(profile.id)}
                          className={`p-1.5 px-3 rounded text-xs font-semibold border flex items-center gap-1 transition ${
                            profile.isAdmin 
                              ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100/70' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                          title={profile.isAdmin ? 'Revoke admin access rank' : 'Elevate user to platform administrator'}
                        >
                          <Award className={`w-3.5 h-3.5 ${profile.isAdmin ? 'text-purple-600 fill-purple-100' : ''}`} />
                          {profile.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleVerifyProfile(profile.id)}
                          className={`p-1.5 px-3 rounded text-xs font-semibold border flex items-center gap-1 transition ${
                            profile.verified 
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {profile.verified ? 'Verified' : 'Verify'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => onDeleteProfile(profile.id)}
                          className="p-1.5 px-3 rounded text-xs font-semibold bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition flex items-center gap-1"
                        >
                          <Trash className="w-3.5 h-3.5" />
                          Delete User
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubtab === 'security' && (
            <div className="max-w-xl mx-auto py-4 space-y-6">
              <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl space-y-3">
                <h4 className="text-sm font-bold text-slate-850 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" /> Change Control Console Passkey
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Update the passcode required to access administrative tools from any workspace browser session. Stored securely on your client engine.
                </p>

                {secSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-lg font-semibold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-650 shrink-0 mt-0.5" />
                    <span>{secSuccess}</span>
                  </div>
                )}

                {secError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs p-3.5 rounded-lg font-semibold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-650 shrink-0 mt-0.5" />
                    <span>{secError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateSecureKey} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        New Security Passcode
                      </label>
                      <input
                        type="password"
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        placeholder="Min. 4 characters"
                        className="w-full text-xs p-2.5 bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-850 font-medium placeholder-slate-350"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Confirm Passcode Set
                      </label>
                      <input
                        type="password"
                        value={confirmPasscode}
                        onChange={(e) => setConfirmPasscode(e.target.value)}
                        placeholder="Re-type passcode"
                        className="w-full text-xs p-2.5 bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-850 font-medium placeholder-slate-350"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Current passkey length: <strong className="text-slate-600 font-bold">{adminPasscode.length} chars</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                    >
                      Update Passkey
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-dashed border-slate-200 rounded-xl p-5 space-y-2.5">
                <h5 className="text-xs font-bold text-slate-850">⚠️ Admin Environment Security Logs</h5>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Sandbox credentials are saved in your local storage directory for instant simulation reload state. Clearing your browser cookies/storage resets the authorization key back to <strong className="text-indigo-600 font-semibold underline">admin123</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
