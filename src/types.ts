/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'freelancer' | 'client' | 'admin';

export interface Job {
  id: string;
  title: string;
  clientName: string;
  clientAvatar: string;
  category: string;
  budget: number;
  type: 'Fixed' | 'Hourly';
  description: string;
  skills: string[];
  duration: string;
  createdAt: string;
  isFeatured: boolean;
}

export interface FreelancerProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  hourlyRate: number;
  skills: string[];
  avatar: string;
  verified: boolean;
  portfolio: string[];
  email: string;
  rating: number;
  completedJobs: number;
}

export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  bidAmount: number;
  status: 'applied' | 'interviewing' | 'offered' | 'hired' | 'declined';
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string; // matches sender's user ID (e.g. client ID or freelancer ID)
  senderName: string;
  text: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  lastMessageText: string;
  lastMessageAt: string;
}
