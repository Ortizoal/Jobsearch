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
  AlertCircle,
  Database,
  Search,
  FileJson,
  RotateCcw
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
  
  // Database fields
  accounts?: any[];
  chats?: any[];
  allMessages?: any[];
  notifications?: any[];
  onResetDatabase?: () => void;
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
  onToggleAdminProfile,
  accounts = [],
  chats = [],
  allMessages = [],
  notifications = [],
  onResetDatabase
}: AdminPanelProps) {
  const [activeSubtab, setActiveSubtab] = useState<'listings' | 'users' | 'security' | 'database'>('listings');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [secSuccess, setSecSuccess] = useState<string | null>(null);
  const [secError, setSecError] = useState<string | null>(null);

  // Local database states
  const [selectedTable, setSelectedTable] = useState<'accounts' | 'profiles' | 'jobs' | 'applications' | 'chats' | 'messages' | 'notifications'>('accounts');
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [dbWipeSuccess, setDbWipeSuccess] = useState(false);

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
            <button
              type="button"
              onClick={() => {
                setActiveSubtab('database');
              }}
              className={`px-4 py-2 border-b-2 font-semibold text-xs text-slate-600 transition-all flex items-center gap-1.5 ${
                activeSubtab === 'database'
                  ? 'border-indigo-600 text-indigo-650 bg-white font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-slate-500" /> Local Database Console
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

          {activeSubtab === 'database' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                    <Database className="w-4 h-4 text-indigo-600 animate-pulse" /> Relational Database Virtualizer (Schema &amp; Tables)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Under the hood, FlexiWorks relies on a schema-backed entity relational data engine to store accounts, bids and chats. Browse physical table rows or trigger hard factory resets here.
                  </p>
                </div>
                {onResetDatabase && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to completely reseed the database? This resets all changes, password associations, posted bids, and chats to default values.")) {
                        onResetDatabase();
                        setDbWipeSuccess(true);
                        setTimeout(() => setDbWipeSuccess(false), 3000);
                      }
                    }}
                    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-200 rounded-lg transition duration-200 shadow-sm cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" /> Force DB Factory Reset
                  </button>
                )}
              </div>

              {dbWipeSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-650 shrink-0" />
                  <span>The application database has been completely re-seeded and hard-reset. All core schemas, users, and session records have been rolled back to defaults!</span>
                </div>
              )}

              {/* Grid layout containing table select on left, records on right */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Tables / Entity List Menu */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">DB Schemas (Tables)</span>
                  <div className="flex flex-col gap-1">
                    {[
                      { id: 'accounts', name: 'dbo.UserAccounts', count: accounts.length, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                      { id: 'profiles', name: 'dbo.Freelancers', count: profiles.length, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                      { id: 'jobs', name: 'dbo.ProjectJobs', count: jobs.length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                      { id: 'applications', name: 'dbo.Applications', count: applications.length, color: 'text-yellow-650 bg-yellow-50 border-yellow-250' },
                      { id: 'chats', name: 'dbo.ChatRooms', count: chats.length, color: 'text-pink-600 bg-pink-50 border-pink-200' },
                      { id: 'messages', name: 'dbo.Messages', count: allMessages.length, color: 'text-teal-600 bg-teal-50 border-teal-200' },
                      { id: 'notifications', name: 'dbo.Notifications', count: notifications.length, color: 'text-purple-600 bg-purple-50 border-purple-200' }
                    ].map((tbl) => {
                      const isTblActive = selectedTable === tbl.id;
                      return (
                        <button
                          key={tbl.id}
                          type="button"
                          onClick={() => {
                            setSelectedTable(tbl.id as any);
                            setDbSearchQuery('');
                            setExpandedRowId(null);
                          }}
                          className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all duration-150 group cursor-pointer ${
                            isTblActive 
                              ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-md' 
                              : 'bg-white border-slate-100/70 text-slate-700 hover:bg-slate-50/70 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold leading-tight uppercase font-mono">{tbl.name}</span>
                            <span className={`text-[9px] mt-0.5 ${isTblActive ? 'text-slate-400 font-normal' : 'text-slate-400'}`}>
                              {tbl.id === 'accounts' ? 'User accounts context & credentials' : 
                               tbl.id === 'profiles' ? 'Specialist profile records' :
                               tbl.id === 'jobs' ? 'Client project job posts' :
                               tbl.id === 'applications' ? 'Proposal & bid details' :
                               tbl.id === 'chats' ? 'Active conversation channels' :
                               tbl.id === 'messages' ? 'Message transmission chunks' :
                               'Offline notifications log'}
                            </span>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase leading-none border shrink-0 ${
                            isTblActive ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}>
                            {tbl.count} rows
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DB View Panel on the Right */}
                <div className="lg:col-span-3 space-y-4">
                  
                  {/* Schema Inspector Definitions */}
                  <div className="bg-slate-50 rounded-xl border border-slate-250/50 p-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5 leading-none">
                      <FileJson className="w-3.5 h-3.5 text-slate-400" /> Table Schema Definition: <strong className="text-slate-800 font-bold">dbo.{selectedTable}</strong>
                    </h5>
                    <div className="flex flex-wrap gap-x-2.5 gap-y-1.5">
                      {(() => {
                        const scheme = selectedTable === 'accounts' ? [
                          { name: 'id', type: 'string (Primary Key)' },
                          { name: 'email', type: 'string (Indexed, Validated)' },
                          { name: 'name', type: 'string' },
                          { name: 'role', type: "'client' | 'freelancer' | 'admin'" },
                          { name: 'passwordHash', type: 'string (Security Pass Phrase)' },
                          { name: 'avatar', type: 'string (Gradient SVG/Vector)' }
                        ] : selectedTable === 'profiles' ? [
                          { name: 'id', type: 'string (Foreign Key: accounts.id)' },
                          { name: 'name', type: 'string' },
                          { name: 'title', type: 'string' },
                          { name: 'bio', type: 'string' },
                          { name: 'hourlyRate', type: 'number ($USD)' },
                          { name: 'skills', type: 'string[]' },
                          { name: 'verified', type: 'boolean' },
                          { name: 'email', type: 'string' },
                          { name: 'rating', type: 'number (out of 5)' },
                          { name: 'completedJobs', type: 'number' }
                        ] : selectedTable === 'jobs' ? [
                          { name: 'id', type: 'string (Primary Key)' },
                          { name: 'title', type: 'string' },
                          { name: 'clientName', type: 'string' },
                          { name: 'clientAvatar', type: 'string' },
                          { name: 'category', type: 'string' },
                          { name: 'budget', type: 'number ($USD)' },
                          { name: 'type', type: "'Fixed' | 'Hourly'" },
                          { name: 'description', type: 'string' },
                          { name: 'skills', type: 'string[]' },
                          { name: 'isFeatured', type: 'boolean' }
                        ] : selectedTable === 'applications' ? [
                          { name: 'id', type: 'string (Primary Key)' },
                          { name: 'jobId', type: 'string (Foreign Key)' },
                          { name: 'freelancerId', type: 'string (Foreign Key)' },
                          { name: 'coverLetter', type: 'string' },
                          { name: 'bidAmount', type: 'number ($USD)' },
                          { name: 'status', type: 'string' },
                          { name: 'createdAt', type: 'string' }
                        ] : selectedTable === 'chats' ? [
                          { name: 'id', type: 'string (Primary Key)' },
                          { name: 'jobId', type: 'string' },
                          { name: 'jobTitle', type: 'string' },
                          { name: 'clientId', type: 'string' },
                          { name: 'clientName', type: 'string' },
                          { name: 'freelancerId', type: 'string' },
                          { name: 'freelancerName', type: 'string' },
                          { name: 'lastMessageText', type: 'string' }
                        ] : selectedTable === 'messages' ? [
                          { name: 'id', type: 'string (Primary Key)' },
                          { name: 'chatId', type: 'string (Foreign Key)' },
                          { name: 'senderId', type: 'string' },
                          { name: 'senderName', type: 'string' },
                          { name: 'text', type: 'string' },
                          { name: 'createdAt', type: 'string' }
                        ] : [
                          { name: 'id', type: 'string (Primary Key)' },
                          { name: 'userId', type: 'string' },
                          { name: 'title', type: 'string' },
                          { name: 'message', type: 'string' },
                          { name: 'read', type: 'boolean' },
                          { name: 'type', type: 'string' }
                        ];

                        return scheme.map((col, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 rounded-lg p-1.5 px-2.5 text-[10px] font-mono shadow-sm flex items-center gap-1">
                            <span className="text-indigo-600 font-black">{col.name}</span>
                            <span className="text-slate-300">:</span>
                            <span className="text-slate-500 font-semibold">{col.type}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Search and Records listing header */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2">
                        <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                          SELECT * FROM dbo.{selectedTable}
                        </span>
                      </div>
                      
                      {/* Search records box */}
                      <div className="relative w-full sm:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Search className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          value={dbSearchQuery}
                          onChange={(e) => setDbSearchQuery(e.target.value)}
                          placeholder="Search rows or record tags..."
                          className="w-full pl-8 pr-4 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                        />
                      </div>
                    </div>

                    {/* Table Rows rendering */}
                    {(() => {
                      const getTableDataList = () => {
                        switch (selectedTable) {
                          case 'accounts': return accounts;
                          case 'profiles': return profiles;
                          case 'jobs': return jobs;
                          case 'applications': return applications;
                          case 'chats': return chats;
                          case 'messages': return allMessages;
                          case 'notifications': return notifications;
                          default: return [];
                        }
                      };

                      const rawData = getTableDataList();
                      const queryClean = dbSearchQuery.trim().toLowerCase();
                      const rows = queryClean === '' 
                        ? rawData 
                        : rawData.filter((row: any) => {
                            const stringified = JSON.stringify(row).toLowerCase();
                            return stringified.includes(queryClean);
                          });

                      if (rows.length === 0) {
                        return (
                          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-450 text-xs font-semibold">
                            {dbSearchQuery ? 'No matching query records found inside this table.' : 'This virtual datastore collection is empty.'}
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                          {rows.map((row: any, idx: number) => {
                            const rowId = row.id || `row-${idx}`;
                            const isExpanded = expandedRowId === rowId;
                            
                            let mainTitle = `Record ID: ${rowId}`;
                            let subtitle = '';

                            if (selectedTable === 'accounts') {
                              mainTitle = `${row.name || 'Unnamed'} [Role: ${row.role || 'User'}]`;
                              subtitle = `Email: ${row.email} | Secure String Hash: ${row.passwordHash ? (row.passwordHash.slice(0, 3) + '•'.repeat(Math.max(1, row.passwordHash.length - 2))) : '(none)'}`;
                            } else if (selectedTable === 'profiles') {
                              mainTitle = `${row.name || 'Anonymous'} [${row.title || 'Specialist'}]`;
                              subtitle = `Hourly Rate: $${row.hourlyRate}/hr | Contact: ${row.email || 'None'} | Completed: ${row.completedJobs} projects`;
                            } else if (selectedTable === 'jobs') {
                              mainTitle = `${row.title} [By: ${row.clientName}]`;
                              subtitle = `Budget: $${row.budget} | Type: ${row.type} | Duration: ${row.duration || 'Not specified'}`;
                            } else if (selectedTable === 'applications') {
                              mainTitle = `Proposal from Free ID: ${row.freelancerId}`;
                              subtitle = `Bid proposal for Job ID: ${row.jobId} | Bid amount: $${row.bidAmount}/hr | Status: ${row.status}`;
                            } else if (selectedTable === 'chats') {
                              mainTitle = `Chat: ${row.freelancerName} ↔ ${row.clientName}`;
                              subtitle = `Job topic: "${row.jobTitle || 'General Discussion'}" | Last text: "${row.lastMessageText || 'No messages yet'}"`;
                            } else if (selectedTable === 'messages') {
                              mainTitle = `Sent by: ${row.senderName} (${row.senderId})`;
                              subtitle = `Chat Channel ID: ${row.chatId} | Message Text: "${row.text || ''}"`;
                            } else if (selectedTable === 'notifications') {
                              mainTitle = `${row.title} [Alert for: ${row.userId}]`;
                              subtitle = `Notice Content: "${row.message}" | Read state: ${row.read ? 'Opened ✔' : 'Unread ✉'}`;
                            }

                            return (
                              <div key={rowId} className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/20 hover:bg-slate-50/45 hover:border-slate-250 transition-all duration-200">
                                <div 
                                  onClick={() => setExpandedRowId(isExpanded ? null : rowId)}
                                  className="p-3 cursor-pointer flex items-center justify-between gap-4 select-none"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 leading-tight shrink-0 font-bold">
                                        ID: {rowId}
                                      </span>
                                      <span className="text-xs font-bold text-slate-800 truncate">{mainTitle}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-450 mt-1 font-mono leading-none truncate">{subtitle}</p>
                                  </div>
                                  <button
                                    type="button"
                                    className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-white rounded-lg border border-slate-200 py-1.5 px-3 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition"
                                  >
                                    {isExpanded ? 'Hide Raw JSON' : 'View JSON Record'}
                                  </button>
                                </div>

                                {isExpanded && (
                                  <div className="border-t border-slate-100 bg-slate-900 p-3.5 select-text">
                                    <pre className="text-left select-all bg-slate-955 text-emerald-400 font-mono text-[10px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre">
                                      {JSON.stringify(row, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                </div>

              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
