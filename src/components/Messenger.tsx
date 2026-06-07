/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Chat, Message, UserRole } from '../types';
import { 
  Send, 
  MessageSquare, 
  CheckCircle, 
  ArrowLeft,
  User,
  Sparkles,
  Bot
} from 'lucide-react';

interface MessengerProps {
  chats: Chat[];
  messages: Message[];
  currentRole: UserRole;
  currentUserId: string; // 'free-1' or client name
  onSendMessage: (chatId: string, text: string) => void;
}

export default function Messenger({
  chats,
  messages,
  currentRole,
  currentUserId,
  onSendMessage
}: MessengerProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(chats[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set default chat if available and none selected
  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  // Scroll to bottom when messages or selected chat changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChatId]);

  const activeChat = chats.find(c => c.id === selectedChatId);
  const activeMessages = messages.filter(m => m.chatId === selectedChatId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChatId) return;
    
    onSendMessage(selectedChatId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[600px]">
      {/* Chats Sidebar - Left */}
      <div className={`md:col-span-4 border-r border-slate-100 flex flex-col h-full bg-slate-50/50 ${
        selectedChatId ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-slate-100 bg-white">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Active Conversations
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Simulate real freelancer & client interaction.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60 p-2 space-y-1">
          {chats.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm mt-8">
              <MessageSquare className="w-8 h-8 text-slate-350 mx-auto mb-2 opacity-50" />
              <span>No conversations yet. Apply to projects or click "Contact Specialist" on profiles to chat!</span>
            </div>
          ) : (
            chats.map((chat) => {
              const isSelected = chat.id === selectedChatId;
              const isFreelancer = currentRole === 'freelancer';
              
              // Determine display values based on current role
              const displayName = isFreelancer ? chat.clientName : chat.freelancerName;
              const displayAvatar = isFreelancer ? chat.clientAvatar : chat.freelancerAvatar;
              const displayTitle = isFreelancer ? 'Client' : chat.freelancerName === 'Sarah Connor' ? 'Front-End specialist' : 'Specialist';

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'hover:bg-slate-100/50 text-slate-800 bg-white border border-slate-100/50'
                  }`}
                >
                  <img 
                    src={displayAvatar} 
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-50' : 'text-slate-900'}`}>
                        {displayName}
                      </span>
                      <span className={`text-[10px] shrink-0 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className={`text-[10px] uppercase font-medium block truncate ${isSelected ? 'text-indigo-100' : 'text-indigo-600'}`}>
                      {chat.jobTitle}
                    </span>
                    <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {chat.lastMessageText}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Messages Canvas - Right */}
      <div className={`md:col-span-8 flex flex-col h-full bg-slate-50/20 ${
        !selectedChatId ? 'hidden md:flex' : 'flex'
      }`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedChatId(null)}
                  className="p-1 hover:bg-slate-50 rounded-lg text-slate-500 md:hidden"
                  title="Back to conversation list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img 
                  src={currentRole === 'freelancer' ? activeChat.clientAvatar : activeChat.freelancerAvatar} 
                  alt={currentRole === 'freelancer' ? activeChat.clientName : activeChat.freelancerName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 leading-none">
                    {currentRole === 'freelancer' ? activeChat.clientName : activeChat.freelancerName}
                    {currentRole !== 'freelancer' && activeChat.freelancerName === 'Sarah Connor' && (
                      <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold uppercase tracking-wider px-1.5 rounded">Verified</span>
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Job: <strong className="text-slate-600 font-semibold">{activeChat.jobTitle}</strong>
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
                <Bot className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                Auto-replies active
              </div>
            </div>

            {/* Bubble list */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-slate-300">•</span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className={`p-3 rounded-2xl max-w-sm sm:max-w-md text-sm leading-relaxed shadow-sm ring-1 ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-none ring-indigo-700' 
                        : 'bg-white text-slate-800 rounded-tl-none ring-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Editor footer */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-2 shrink-0">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message as ${currentRole === 'freelancer' ? 'Sarah Connor (Freelancer)' : currentRole === 'client' ? 'Acme Corp (Client)' : 'Admin'}...`}
                className="flex-1 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-55 text-white font-semibold rounded-lg p-2.5 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-50/10">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">No Conversation Selected</h3>
            <p className="text-slate-500 text-sm max-w-md mt-1 leading-relaxed">
              Choose an active dialogue from the sidebar. You can also start a new chat by applying to jobs or contacting freelancers on the market.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
