/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Award, ShieldAlert, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { FreelancerProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: { id: string; name: string; email: string; role: 'client' | 'freelancer' | 'admin' }) => void;
  existingAccounts: Array<{ id: string; name: string; email: string; role: 'client' | 'freelancer' | 'admin'; passwordHash: string }>;
  onRegisterAccount: (newUser: { name: string; email: string; role: 'client' | 'freelancer' }) => void;
  profiles: FreelancerProfile[];
}

export default function AuthScreen({ onLoginSuccess, existingAccounts, onRegisterAccount, profiles }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'client' | 'freelancer'>('freelancer');
  
  // Password view toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Notification states
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorText('Please fill in both your email address and password.');
      return;
    }

    const matched = existingAccounts.find(
      (acc) => acc.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!matched || matched.passwordHash !== loginPassword) {
      setErrorText('Incorrect email address or password. Please verify your credentials and try again.');
      return;
    }

    setSuccessText(`Welcome back, ${matched.name}! Redirecting...`);
    setTimeout(() => {
      onLoginSuccess(matched);
    }, 850);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorText('All fields are mandatory. Please enter your name, email, and security password.');
      return;
    }

    if (regPassword.length < 5) {
      setErrorText('For account security, your password must contain at least 5 characters.');
      return;
    }

    const emailInUse = existingAccounts.some(
      (acc) => acc.email.toLowerCase() === regEmail.trim().toLowerCase()
    );

    if (emailInUse) {
      setErrorText('This email address is already registered. Please login instead.');
      return;
    }

    // Call registration handler in parent component to update state list dynamically
    onRegisterAccount({
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      role: regRole,
    });

    setSuccessText('Account successfully established! Accessing platform services now.');
    
    // Automatically trigger login of newly established user after a slight delay
    setTimeout(() => {
      // Find the account that was just appended
      const freshlyCreatedId = `user-${regRole === 'client' ? 'client' : 'free'}-${Date.now().toString().slice(-4)}`;
      onLoginSuccess({
        id: freshlyCreatedId,
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        role: regRole,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo and Headliner */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl shadow-lg border border-indigo-500 mb-4 animate-pulse">
          F
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          FlexiWorks Network
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Premium Hybrid Talent Marketplace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-100 shadow-xl overflow-hidden relative">
          
          {/* Subtle colored accent top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-800" />
          
          {/* Section Selector Tab Header */}
          <div className="flex border-b border-slate-100 pb-5 mb-6 justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorText(null);
                setSuccessText(null);
              }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg uppercase tracking-wider transition ${
                isLogin 
                  ? 'bg-indigo-50 text-indigo-750' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrorText(null);
                setSuccessText(null);
              }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg uppercase tracking-wider transition ${
                !isLogin 
                  ? 'bg-indigo-50 text-indigo-750' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Toast notifications */}
          {errorText && (
            <div className="mb-5 bg-rose-50 border border-rose-100 text-rose-800 text-xs p-3.5 rounded-xl font-semibold flex items-start gap-2 text-left animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorText}</span>
            </div>
          )}

          {successText && (
            <div className="mb-5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-xl font-semibold flex items-start gap-2 text-left animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successText}</span>
            </div>
          )}

          {isLogin ? (
            /* ======================================= */
            /* LOGIN FORM                              */
            /* ======================================= */
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (errorText) setErrorText(null);
                    }}
                    placeholder="sarah.connor@dev.io"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-350"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Security Password
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (errorText) setErrorText(null);
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-350"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2 cursor-pointer"
              >
                Let me in
              </button>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Developer Quick Logins</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('sarah.connor@dev.io');
                      setLoginPassword('password');
                    }}
                    className="p-1 px-2 border border-slate-200 hover:border-indigo-400 font-semibold text-slate-650 bg-slate-50 hover:bg-white rounded transition"
                  >
                    Freelancer Live Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('client@moderntech.io');
                      setLoginPassword('password');
                    }}
                    className="p-1 px-2 border border-slate-200 hover:border-indigo-400 font-semibold text-slate-650 bg-slate-50 hover:bg-white rounded transition"
                  >
                    Client Live Demo
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ======================================= */
            /* REGISTRATION FORM                       */
            /* ======================================= */
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Complete Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => {
                      setRegName(e.target.value);
                      if (errorText) setErrorText(null);
                    }}
                    placeholder="Sarah Connor"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-350"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (errorText) setErrorText(null);
                    }}
                    placeholder="sarah.connor@dev.io"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-350"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Security Passcode
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (errorText) setErrorText(null);
                    }}
                    placeholder="Min. 5 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-350"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Platform Role Setting *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole('freelancer')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition gap-1.5 ${
                      regRole === 'freelancer'
                        ? 'bg-indigo-50/70 border-indigo-500 text-indigo-750 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <User className={`w-5 h-5 ${regRole === 'freelancer' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs uppercase tracking-tight">I am Freelancer</span>
                    <span className="text-[9px] text-slate-400 font-normal">Offer web professional skills</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('client')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition gap-1.5 ${
                      regRole === 'client'
                        ? 'bg-indigo-50/70 border-indigo-500 text-indigo-750 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <Briefcase className={`w-5 h-5 ${regRole === 'client' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs uppercase tracking-tight">I am Client</span>
                    <span className="text-[9px] text-slate-400 font-normal">Post jobs &amp; book talent</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-3 cursor-pointer animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Complete Registration
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
