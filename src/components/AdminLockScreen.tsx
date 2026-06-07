/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Key, Eye, EyeOff, AlertCircle, Lock, ShieldCheck } from 'lucide-react';

interface AdminLockScreenProps {
  onAuthorize: () => void;
  savedPasscode: string;
  isProfileAdmin?: boolean;
  adminProfileName?: string;
}

export default function AdminLockScreen({ 
  onAuthorize, 
  savedPasscode,
  isProfileAdmin = false,
  adminProfileName = ''
}: AdminLockScreenProps) {
  const [enteredCode, setEnteredCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode === savedPasscode) {
      setErrorStatus(null);
      onAuthorize();
    } else {
      setErrorStatus('Invalid access passcode. Please enter the correct authorization key.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden mt-8">
      {/* Visual security header */}
      <div className="bg-slate-900 px-6 py-8 text-center text-white border-b border-slate-850">
        <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 border-2 border-indigo-500 mb-3 mx-auto">
          <Lock className="w-6 h-6 text-indigo-400" />
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-white uppercase sm:text-lg">
          Administrative Suite Gate
        </h2>
        <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
          This system contains confidential service records and system statistics. Verification is required.
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-5">
        {errorStatus && (
          <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg flex items-start gap-2.5 text-left text-rose-800 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{errorStatus}</span>
          </div>
        )}

        {isProfileAdmin && (
          <div className="bg-purple-50/60 border border-purple-200/80 p-4 rounded-xl space-y-2.5 text-left border-dashed">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-purple-650 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide">Admin Account Connected</h4>
                <p className="text-[11px] text-purple-800 mt-0.5 leading-relaxed">
                  You are exploring the simulator as <strong className="font-extrabold">{adminProfileName}</strong>, who has been granted administrator status. You can bypass the passcode check.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onAuthorize}
              className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg tracking-wider uppercase transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
            >
              🔓 Bypass & Unlock Terminal
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Enter Administrator Passcode
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Key className="w-4 h-4" />
              </span>
              <input
                type={showCode ? 'text' : 'password'}
                value={enteredCode}
                onChange={(e) => {
                  setEnteredCode(e.target.value);
                  if (errorStatus) setErrorStatus(null);
                }}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white placeholder-slate-350 text-slate-850 font-medium"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title={showCode ? 'Hide Passcode' : 'Show Passcode'}
              >
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs md:text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            Authenticate Credentials
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          <p className="font-semibold text-slate-500 mb-1 flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" /> Authorized personnel only
          </p>
          <p className="leading-relaxed">
            The passkey can be customized inside the console security tab once verified.
          </p>
        </div>
      </div>
    </div>
  );
}
