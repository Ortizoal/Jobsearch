/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Job, FreelancerProfile, Application, Chat, Message } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'React & Tailwind Web Developer for SaaS Dashboard',
    clientName: 'ModernTech Ventures',
    clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120&h=120',
    category: 'Web Development',
    budget: 4500,
    type: 'Fixed',
    description: 'We need a highly skilled React developer to build our core SaaS dashboard analytics pages. You will be using React 18, Tailwind CSS, and Recharts. The design is finalized in Figma, and clean components are expected. Responsibilities include building responsive grid layouts, integration-ready forms, and interactive visualization charts. Excellent communication and state management knowledge are required.',
    skills: ['React', 'Tailwind CSS', 'TypeScript', 'Recharts'],
    duration: '1 - 3 months',
    createdAt: '2026-06-05T10:00:00Z',
    isFeatured: true
  },
  {
    id: 'job-2',
    title: 'Mobile App Designer (iOS & Android)',
    clientName: 'Bloom Health Inc.',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    category: 'Design & Creative',
    budget: 85,
    type: 'Hourly',
    description: 'Looking for an experienced UI/UX Mobile App Designer to help us refine our brand and build out design mockups for a mental-health check-in application. Experience in dark-mode layout designs, modern typographic hierarchy, and rapid Figma prototyping is essential. You must have a portfolio of shipped iOS and Android applications to be considered.',
    skills: ['Figma', 'UI/UX Design', 'Mobile Prototyping', 'User Research'],
    duration: 'Less than a month',
    createdAt: '2026-06-06T14:30:00Z',
    isFeatured: true
  },
  {
    id: 'job-3',
    title: 'Full-Stack Node.js Developer for API Refactoring',
    clientName: 'CloudSphere Solutions',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    category: 'Web Development',
    budget: 3500,
    type: 'Fixed',
    description: 'We are seeking a senior Node.js backend developer to optimize and rewrite our legacy Express API endpoints. The system requires refactoring SQL queries, adding robust validation middleware, and securing authorization. Experience with PostgreSQL and TypeScript is required. Must be able to deliver clean, documented, and unit-tested code.',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'TypeScript', 'Jest'],
    duration: '1 month',
    createdAt: '2026-06-04T08:15:00Z',
    isFeatured: false
  },
  {
    id: 'job-4',
    title: 'SEO Copywriter for Marketing Blog',
    clientName: 'GreenFlow Organics',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    category: 'Writing & Translation',
    budget: 45,
    type: 'Hourly',
    description: 'Seeking a proactive writer with deep knowledge of search engines and organic audience growth to produce high-quality, engaging content for our wellness blog. Topics include organic lifestyles, environmental impacts, and mindfulness practices. Looking for 3 long-form articles (1500 words each) weekly.',
    skills: ['Copywriting', 'SEO Optimization', 'Content Marketing', 'Research'],
    duration: '3 - 6 months',
    createdAt: '2026-06-07T09:00:00Z',
    isFeatured: false
  },
  {
    id: 'job-5',
    title: 'Social Media Brand Visual Consultant',
    clientName: 'Sora Retail & Co.',
    clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
    category: 'Design & Creative',
    budget: 1800,
    type: 'Fixed',
    description: 'Help us design a consistent visual style for our premium retail brand launch on Instagram and TikTok. We need visual asset templates, brand style guide documents (colors, typography, grid specs), and five styled promo video clips. Please showcase recent retail or lifestyle projects in your applications.',
    skills: ['Brand Identity', 'Social Media Graphics', 'Canva', 'Video Editing'],
    duration: '2 weeks',
    createdAt: '2026-06-03T11:20:00Z',
    isFeatured: false
  }
];

export const INITIAL_PROFILES: FreelancerProfile[] = [
  {
    id: 'free-1',
    name: 'Sarah Connor',
    title: 'Lead Front-End Engineer & UI Specialist',
    bio: 'Passionate frontend specialist with over 5 years of industry experience. I focus on crafting interactive, fluid, and highly accessible React environments with Tailwind CSS. I write clean, robust TypeScript and have worked with teams ranging from agile early-stage setups to venture-backed platforms.',
    hourlyRate: 75,
    skills: ['React', 'Tailwind CSS', 'TypeScript', 'Vite', 'Figma'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    verified: true,
    portfolio: ['https://example.com/project1', 'https://example.com/project2'],
    email: 'sarah.connor@dev.io',
    rating: 4.9,
    completedJobs: 24
  },
  {
    id: 'free-2',
    name: 'Marcus Vance',
    title: 'Expert UI/UX & Mobile App Designer',
    bio: 'Interactive designer dedicating my life to craft beautiful user experiences across responsive webs and native iOS/Android screens. I pair strict minimalist typography with bold accent colors to build memorable layouts. Expert Figma team workflow and brand design.',
    hourlyRate: 65,
    skills: ['Figma', 'UI/UX Design', 'Brand Identity', 'Mobile Prototyping'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    verified: true,
    portfolio: ['https://figma.com/file/mock-mobile-app', 'https://marcus.design'],
    email: 'marcus@designer.com',
    rating: 4.8,
    completedJobs: 18
  },
  {
    id: 'free-3',
    name: 'Siddharth Nair',
    title: 'Senior Node.js & Database Architect',
    bio: 'Specialist in scaling reliable backend structures and writing efficient queries. I build web microservices, robust REST APIs, and handle relational/non-relational database design (PostgreSQL, Redis). Enthusiastic about unit testing and Docker deployments.',
    hourlyRate: 90,
    skills: ['Node.js', 'Express', 'PostgreSQL', 'TypeScript', 'Docker'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    verified: false,
    portfolio: ['https://github.com/sidnair/core-api'],
    email: 'sidnair@backend.net',
    rating: 4.7,
    completedJobs: 11
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    freelancerId: 'free-1',
    coverLetter: 'Hello ModernTech Ventures team! I saw your post for a React dashboard developer and immediately knew I was the right fit. I have built three different SaaS dashboards in the custom fintech sector using Vite, Tailwind, and Recharts. I specialize in fast performance and fluid interactions. I can start immediately and work within your budget.',
    bidAmount: 4200,
    status: 'interviewing',
    createdAt: '2026-06-06T11:00:00Z'
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    freelancerId: 'free-2',
    coverLetter: 'Hi Bloom Health team! Mental health tools are extremely close to my heart, and I have actually designed a custom tracking concept in Figma last month. I excel in visual storytelling, accessibility standards, and clean Figma structure ready for developers. I would love to talk about your vision.',
    bidAmount: 65,
    status: 'applied',
    createdAt: '2026-06-06T15:00:00Z'
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    freelancerId: 'free-3',
    coverLetter: 'We can optimize that legacy Express code fast. I understand SQL query refactoring and index optimization. I have rewritten multiple Node servers for high peak volumes. Looking forward to reviewing the database scheme.',
    bidAmount: 3500,
    status: 'offered',
    createdAt: '2026-06-05T09:30:00Z'
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat-1',
    jobId: 'job-1',
    jobTitle: 'React & Tailwind Web Developer for SaaS Dashboard',
    clientId: 'ModernTech Ventures',
    clientName: 'ModernTech Ventures',
    clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120&h=120',
    freelancerId: 'free-1',
    freelancerName: 'Sarah Connor',
    freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    lastMessageText: 'That works, looking forward to our call tomorrow!',
    lastMessageAt: '2026-06-06T12:15:00Z'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    chatId: 'chat-1',
    senderId: 'ModernTech Ventures',
    senderName: 'ModernTech Ventures',
    text: 'Hello Sarah! We reviewed your cover letter and dashboard portfolio. We are highly impressed by your style.',
    createdAt: '2026-06-06T11:30:00Z'
  },
  {
    id: 'msg-2',
    chatId: 'chat-1',
    senderId: 'free-1',
    senderName: 'Sarah Connor',
    text: "Thank you so much! It sounds like an amazing project. I'd love to learn more about the dataset sizes for the graphs.",
    createdAt: '2026-06-06T11:45:00Z'
  },
  {
    id: 'msg-3',
    chatId: 'chat-1',
    senderId: 'ModernTech Ventures',
    senderName: 'ModernTech Ventures',
    text: 'Great. Let’s do a quick intro call tomorrow at noon UTC. Does that work for you?',
    createdAt: '2026-06-06T12:00:00Z'
  },
  {
    id: 'msg-4',
    chatId: 'chat-1',
    senderId: 'free-1',
    senderName: 'Sarah Connor',
    text: 'That works, looking forward to our call tomorrow!',
    createdAt: '2026-06-06T12:15:00Z'
  }
];
