/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_JOBS, 
  INITIAL_PROFILES, 
  INITIAL_APPLICATIONS, 
  INITIAL_CHATS, 
  INITIAL_MESSAGES 
} from './data';
import { Job, FreelancerProfile, Application, Chat, Message, UserRole } from './types';
import JobCard from './components/JobCard';
import FreelancerCard from './components/FreelancerCard';
import ApplicationsList from './components/ApplicationsList';
import Messenger from './components/Messenger';
import AdminPanel from './components/AdminPanel';
import AdminLockScreen from './components/AdminLockScreen';
import SkillSelector from './components/SkillSelector';
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  CheckSquare, 
  TrendingUp, 
  PlusCircle, 
  User, 
  Search, 
  SlidersHorizontal, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  FileText,
  DollarSign,
  Tag,
  Clock,
  Sparkles,
  Award,
  Lightbulb,
  Star,
  Lock
} from 'lucide-react';

export default function App() {
  // Load data from localStorage or fallback to defaults
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('fm_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [profiles, setProfiles] = useState<FreelancerProfile[]>(() => {
    const saved = localStorage.getItem('fm_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('fm_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('fm_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('fm_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Simulator Contexts
  const [currentRole, setCurrentRole] = useState<UserRole>('freelancer');

  // Administrative Credentials Safety and Authorization
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return localStorage.getItem('fm_admin_passcode') || 'admin123';
  });
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('fm_is_admin_authorized') === 'true';
  });
  
  // Tabs trackers per role
  const [freelancerTab, setFreelancerTab] = useState<'find_work' | 'tracker' | 'profile' | 'messages'>('find_work');
  const [clientTab, setClientTab] = useState<'post_job' | 'my_listings' | 'browse_talents' | 'messages'>('my_listings');
  const [adminTab, setAdminTab] = useState<'console'>('console');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [budgetFilter, setBudgetFilter] = useState<number>(0);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  // Apply Modal state
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [applyBid, setApplyBid] = useState<number>(0);
  const [applyCoverLetter, setApplyCoverLetter] = useState('');
  const [applyError, setApplyError] = useState('');

  // Form State for Poster
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState('Web Development');
  const [newJobType, setNewJobType] = useState<'Fixed' | 'Hourly'>('Fixed');
  const [newJobBudget, setNewJobBudget] = useState<number>(1000);
  const [newJobDuration, setNewJobDuration] = useState('1 - 3 months');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobSkills, setNewJobSkills] = useState<string[]>([]);
  const [postSuccess, setPostSuccess] = useState(false);

  // Form State for Freelancer Profile Edit
  const [profileName, setProfileName] = useState('Sarah Connor');
  const [profileTitle, setProfileTitle] = useState('Lead Front-End Engineer & UI Specialist');
  const [profileBio, setProfileBio] = useState('Passionate frontend specialist with over 5 years of industry experience...');
  const [profileHourlyRate, setProfileHourlyRate] = useState(75);
  const [profileSkills, setProfileSkills] = useState<string[]>(['React', 'Tailwind CSS', 'TypeScript', 'Vite', 'Figma']);
  const [profileEmail, setProfileEmail] = useState('sarah.connor@dev.io');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Search & Filter state for Browse Specialists (Client role)
  const [talentSearchQuery, setTalentSearchQuery] = useState('');
  const [talentSelectedSkills, setTalentSelectedSkills] = useState<string[]>([]);

  // Skill Match filtering toggle for Finding Work (Freelancer role)
  const [matchMySkills, setMatchMySkills] = useState(false);

  // Initialize and load default freelancer profile settings based on free-1
  useEffect(() => {
    const sarahPrf = profiles.find(p => p.id === 'free-1');
    if (sarahPrf) {
      setProfileName(sarahPrf.name);
      setProfileTitle(sarahPrf.title);
      setProfileBio(sarahPrf.bio);
      setProfileHourlyRate(sarahPrf.hourlyRate);
      setProfileSkills(sarahPrf.skills || []);
      setProfileEmail(sarahPrf.email);
    }
  }, [profiles]);

  // Save changes to localStorage on every update
  useEffect(() => {
    localStorage.setItem('fm_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('fm_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('fm_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('fm_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('fm_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('fm_admin_passcode', adminPasscode);
  }, [adminPasscode]);

  useEffect(() => {
    sessionStorage.setItem('fm_is_admin_authorized', isAdminAuthorized ? 'true' : 'false');
  }, [isAdminAuthorized]);

  // Utility calculations
  const categories = ['All', 'Web Development', 'Design & Creative', 'Writing & Translation', 'Marketing & Sales'];

  // Current Users Simulation IDs
  const CURRENT_FREELANCER_ID = 'free-1';
  const CURRENT_CLIENT_ID = 'ModernTech Ventures';

  const getCurrentUserId = () => {
    if (currentRole === 'freelancer') return CURRENT_FREELANCER_ID;
    if (currentRole === 'client') return CURRENT_CLIENT_ID;
    return 'admin-user';
  };

  // Switch role callback helper
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    // Auto-align default tabs
    if (role === 'freelancer') {
      setFreelancerTab('find_work');
    } else if (role === 'client') {
      setClientTab('my_listings');
    } else {
      setAdminTab('console');
    }
  };

  // --- JOB CRUD ---
  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDesc.trim()) {
      alert('Please fill out Title and Description fields!');
      return;
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: newJobTitle.trim(),
      clientName: 'ModernTech Ventures', // Client session name
      clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120&h=120',
      category: newJobCategory,
      budget: Number(newJobBudget) || 500,
      type: newJobType,
      description: newJobDesc.trim(),
      skills: newJobSkills,
      duration: newJobDuration,
      createdAt: new Date().toISOString(),
      isFeatured: false
    };

    setJobs(prev => [newJob, ...prev]);
    setPostSuccess(true);
    
    // Clear Form
    setNewJobTitle('');
    setNewJobDesc('');
    setNewJobSkills([]);
    setNewJobBudget(1000);

    setTimeout(() => {
      setPostSuccess(false);
      setClientTab('my_listings');
    }, 1500);
  };

  const handleDeleteJob = (jobId: string) => {
    // Delete associated applications as well
    setJobs(prev => prev.filter(j => j.id !== jobId));
    setApplications(prev => prev.filter(app => app.jobId !== jobId));
    // Remove related chats & messages
    setChats(prev => prev.filter(c => c.jobId !== jobId));
  };

  const handleToggleFeatureJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isFeatured: !job.isFeatured } : job
    ));
  };

  // --- PROFILE EDIT ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfiles(prev => prev.map(p => {
      if (p.id === 'free-1') {
        return {
          ...p,
          name: profileName,
          title: profileTitle,
          bio: profileBio,
          hourlyRate: profileHourlyRate,
          email: profileEmail,
          skills: profileSkills
        };
      }
      return p;
    }));

    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
    }, 2000);
  };

  // --- PROFILE BACKEND SIMULATIONS (FOR ADMIN) ---
  const handleToggleVerifyProfile = (profileId: string) => {
    setProfiles(prev => prev.map(p => 
      p.id === profileId ? { ...p, verified: !p.verified } : p
    ));
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  // --- APPLICATION APPLYS ---
  const triggerApplyModal = (job: Job) => {
    setApplyJob(job);
    setApplyBid(job.budget);
    setApplyCoverLetter('');
    setApplyError('');
  };

  const submitApplication = () => {
    if (!applyJob) return;
    if (!applyCoverLetter.trim()) {
      setApplyError('Please write a brief cover letter or introduction!');
      return;
    }

    // Verify hasn't already applied
    const alreadyApplied = applications.some(
      app => app.jobId === applyJob.id && app.freelancerId === CURRENT_FREELANCER_ID
    );

    if (alreadyApplied) {
      setApplyError('You have already applied to this job listing!');
      return;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: applyJob.id,
      freelancerId: CURRENT_FREELANCER_ID,
      coverLetter: applyCoverLetter.trim(),
      bidAmount: Number(applyBid) || applyJob.budget,
      status: 'applied',
      createdAt: new Date().toISOString()
    };

    setApplications(prev => [newApp, ...prev]);
    
    // Auto initiate chat setup with the recruiter
    const chatExists = chats.some(c => c.jobId === applyJob.id && c.clientId === applyJob.clientName);
    
    if (!chatExists) {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        jobId: applyJob.id,
        jobTitle: applyJob.title,
        clientId: applyJob.clientName,
        clientName: applyJob.clientName,
        clientAvatar: applyJob.clientAvatar,
        freelancerId: CURRENT_FREELANCER_ID,
        freelancerName: profileName,
        freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
        lastMessageText: `Applied! Bid price: $${newApp.bidAmount.toLocaleString()}`,
        lastMessageAt: new Date().toISOString()
      };

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        chatId: newChat.id,
        senderId: CURRENT_FREELANCER_ID,
        senderName: profileName,
        text: `Hello! I have just applied to your project "${applyJob.title}". Here is a summary of my bid terms: Bid: $${newApp.bidAmount.toLocaleString()}. Thank you, and I look forward to your review!`,
        createdAt: new Date().toISOString()
      };

      setChats(prev => [newChat, ...prev]);
      setMessages(prev => [...prev, newMsg]);
    }

    setApplyJob(null);
    setFreelancerTab('tracker');
  };

  // --- APPLICATION TRACKER STAGE CONTROLS ---
  const handleUpdateApplicationStatus = (appId: string, status: Application['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status } : app
    ));

    // Send context message with status updates
    const app = applications.find(a => a.id === appId);
    if (app) {
      const job = jobs.find(j => j.id === app.jobId);
      const freelancer = profiles.find(p => p.id === app.freelancerId) || { name: 'Sarah Connor' };
      if (job) {
        // Find existing chat or create
        let chat = chats.find(c => c.jobId === job.id && c.freelancerId === app.freelancerId);
        
        let targetChatId = chat?.id;
        if (!chat) {
          const newChatId = `chat-${Date.now()}`;
          targetChatId = newChatId;
          const newChat: Chat = {
            id: newChatId,
            jobId: job.id,
            jobTitle: job.title,
            clientId: job.clientName,
            clientName: job.clientName,
            clientAvatar: job.clientAvatar,
            freelancerId: app.freelancerId,
            freelancerName: freelancer.name,
            freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
            lastMessageText: `Status update: ${status}`,
            lastMessageAt: new Date().toISOString()
          };
          setChats(prev => [newChat, ...prev]);
        }

        const msgTexts: Record<string, string> = {
          interviewing: `Hello ${freelancer.name}! We love your application and would like to invite you to an Interview. What is your availability next week?`,
          offered: `Incredible news, ${freelancer.name}! We would like to formally extend a project work offering at $${app.bidAmount}. Let us know if you accept!`,
          hired: `Contract Active! The billing milestone is started for "${job.title}". Welcome to the team!`,
          completed: `The contract for "${job.title}" has been successfully completed! Thank you for the collaboration. Both parties can now leave ratings and written feedback directly on the active application proposal.`,
          declined: `Thank you for your proposal, but we have chosen to go with another applicant for this specific gig. We wish you clean compiles in the future.`
        };

        const statusText = msgTexts[status] || `Proposal status updated to ${status}.`;

        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          chatId: targetChatId!,
          senderId: job.clientName,
          senderName: job.clientName,
          text: statusText,
          createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMsg]);
        setChats(prev => prev.map(c => 
          c.id === targetChatId ? {
            ...c,
            lastMessageText: statusText,
            lastMessageAt: new Date().toISOString()
          } : c
        ));
      }
    }
  };

  const getClientRating = (clientName: string) => {
    const clientJobs = jobs.filter(j => j.clientName === clientName);
    const clientJobIds = clientJobs.map(j => j.id);
    const clientCompletedApps = applications.filter(
      app => clientJobIds.includes(app.jobId) && app.status === 'completed'
    );
    const ratings = clientCompletedApps
      .map(app => app.freelancerRating)
      .filter((r): r is number => typeof r === 'number' && r > 0);
    
    if (ratings.length === 0) return 4.8; // default baseline rating for testing
    const avg = ratings.reduce((sum, val) => sum + val, 0) / ratings.length;
    return Number(avg.toFixed(1));
  };

  const handleRateContract = (appId: string, ratingType: 'client' | 'freelancer', rating: number, review: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const updated = { ...app };
      if (ratingType === 'client') {
        updated.clientRating = rating;
        updated.clientReview = review;
      } else {
        updated.freelancerRating = rating;
        updated.freelancerReview = review;
      }
      return updated;
    }));

    if (ratingType === 'client') {
      const app = applications.find(a => a.id === appId);
      if (app) {
        setProfiles(prev => prev.map(p => {
          if (p.id === app.freelancerId) {
            const otherCompletedApps = applications.filter(
              a => a.id !== appId && a.freelancerId === p.id && a.status === 'completed'
            );
            const allClientRatings = otherCompletedApps
              .map(a => a.clientRating)
              .filter((r): r is number => typeof r === 'number' && r > 0);
            
            allClientRatings.push(rating);
            
            const originProf = INITIAL_PROFILES.find(op => op.id === p.id) || p;
            const baselineCompleted = originProf.completedJobs || 0;
            const baselineRating = originProf.rating || 5.0;
            const baselineSum = baselineCompleted * baselineRating;
            
            const addedSum = allClientRatings.reduce((sum, v) => sum + v, 0);
            const totalCount = baselineCompleted + allClientRatings.length;
            const newAvg = Number(((baselineSum + addedSum) / totalCount).toFixed(1));
            
            return {
              ...p,
              rating: newAvg,
              completedJobs: totalCount
            };
          }
          return p;
        }));
      }
    }

    const app = applications.find(a => a.id === appId);
    if (app) {
      const job = jobs.find(j => j.id === app.jobId);
      if (job) {
        const ratingSender = ratingType === 'client' ? job.clientName : app.freelancerId;
        const ratingSenderName = ratingType === 'client' ? job.clientName : (profiles.find(p => p.id === app.freelancerId)?.name || 'Freelancer');
        const ratedName = ratingType === 'client' ? 'freelancer' : 'employer';
        
        let targetChatId = chats.find(c => c.jobId === job.id && c.freelancerId === app.freelancerId)?.id;
        
        if (targetChatId) {
          const newMsg: Message = {
            id: `msg-${Date.now()}`,
            chatId: targetChatId,
            senderId: ratingSender,
            senderName: ratingSenderName,
            text: `⭐ Review Posted! Left a ${rating}/5 star score for the ${ratedName}. "${review || 'No written comment'}"`,
            createdAt: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, newMsg]);
          setChats(prev => prev.map(c => 
            c.id === targetChatId ? {
              ...c,
              lastMessageText: `⭐ Review Posted: ${rating}/5`,
              lastMessageAt: new Date().toISOString()
            } : c
          ));
        }
      }
    }
  };

  // --- DETAILED CONTACT TRIGGERS ---
  const handleContactFreelancer = (freelancerId: string, jobId: string) => {
    const jobDetail = jobs.find(j => j.id === jobId) || jobs[0];
    const freeDetail = profiles.find(p => p.id === freelancerId);
    if (!freeDetail || !jobDetail) return;

    // Checks if chat exists
    let activeChat = chats.find(c => c.jobId === jobDetail.id && c.freelancerId === freelancerId);

    if (!activeChat) {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        jobId: jobDetail.id,
        jobTitle: jobDetail.title,
        clientId: 'ModernTech Ventures',
        clientName: 'ModernTech Ventures',
        clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120&h=120',
        freelancerId: freelancerId,
        freelancerName: freeDetail.name,
        freelancerAvatar: freeDetail.avatar,
        lastMessageText: "Sent recruitment inquiry list",
        lastMessageAt: new Date().toISOString()
      };

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        chatId: newChat.id,
        senderId: 'ModernTech Ventures',
        senderName: 'ModernTech Ventures',
        text: `Hello ${freeDetail.name}! We saw your portfolio and are highly interested in contracting you for "${jobDetail.title}". Let us discuss hourly expectations and your availability next week!`,
        createdAt: new Date().toISOString()
      };

      setChats(prev => [newChat, ...prev]);
      setMessages(prev => [...prev, newMsg]);
    }

    // Switch view to messages
    if (currentRole === 'client') {
      setClientTab('messages');
    } else {
      setFreelancerTab('messages');
    }
  };

  // Contact on profile browsing click
  const handleContactGeneral = (profile: FreelancerProfile) => {
    // Pick first available client job, or make placeholder text
    const defaultJob = jobs.find(j => j.clientName === 'ModernTech Ventures') || jobs[0];
    if (defaultJob) {
      handleContactFreelancer(profile.id, defaultJob.id);
    }
  };

  // --- MESSAGING TEXT DISPATCHER ---
  const handleSendMessage = (chatId: string, text: string) => {
    const senderId = getCurrentUserId();
    const senderName = currentRole === 'freelancer' ? profileName : currentRole === 'client' ? 'ModernTech Ventures' : 'System Staff';

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId,
      senderName,
      text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    
    // Update matching Chat lastMessage status
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, lastMessageText: text, lastMessageAt: new Date().toISOString() } : c
    ));

    // --- ENHANCED SIMULATED RESPONSE BOT AGENT ---
    // Simulates dynamic interaction when the user (freelancer or client) posts a text message.
    setTimeout(() => {
      const activeC = chats.find(c => c.id === chatId);
      if (!activeC) return;

      const botSenderId = currentRole === 'freelancer' ? activeC.clientName : activeC.freelancerId;
      const botSenderName = currentRole === 'freelancer' ? activeC.clientName : activeC.freelancerName;

      const clientReplies = [
        "That sounds highly specialized! Let me confer with the tech leadership team and I'll confirm back.",
        "Understood. If our rates align nicely, we can draft a formal milestones track by tomorrow afternoon.",
        "Perfect. Could you send over a link to similar apps or GitHub repos you've built?",
        "Sounds good! Do you have availability for a brief 15-minute Google Meet introduction call?",
        "Excellent points. I am reviewing this cover detail presently and will align stages accordingly."
      ];

      const freelancerReplies = [
        "I've fully updated the task list with those instructions! Let me know if we need another Git push.",
        "Sounds like a fantastic architecture goal. I can definitely build this using clean React hooks & Tailwind.",
        "That works for me! I'm ready to proceed with the milestone once the invoice contract is finalized.",
        "Yes, noon UTC tomorrow works exceptionally well for me! I will join the calendar event link.",
        "Thank you! I am reviewing the API specs and will design optimal TypeScript models."
      ];

      const chosenReply = currentRole === 'freelancer' 
        ? clientReplies[Math.floor(Math.random() * clientReplies.length)]
        : freelancerReplies[Math.floor(Math.random() * freelancerReplies.length)];

      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        chatId,
        senderId: botSenderId,
        senderName: botSenderName,
        text: chosenReply,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
      setChats(prev => prev.map(c => 
        c.id === chatId ? { ...c, lastMessageText: chosenReply, lastMessageAt: new Date().toISOString() } : c
      ));

    }, 1500);
  };

  // --- FILTERED AND SEARCH VALUES ---
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesBudget = job.budget >= budgetFilter;
    const matchesFeatured = !onlyFeatured || job.isFeatured;
    const matchesProfileSkills = !matchMySkills || job.skills.some(js => 
      profileSkills.some(ps => ps.toLowerCase() === js.toLowerCase())
    );
    return matchesSearch && matchesCategory && matchesBudget && matchesFeatured && matchesProfileSkills;
  }).sort((a, b) => {
    // Highly match overlapping skills first
    const aMatchCount = a.skills.filter(js => profileSkills.some(ps => ps.toLowerCase() === js.toLowerCase())).length;
    const bMatchCount = b.skills.filter(js => profileSkills.some(ps => ps.toLowerCase() === js.toLowerCase())).length;
    // Featured first, then highest overlap
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }
    return bMatchCount - aMatchCount;
  });

  const freelancerApplications = applications.filter(app => app.freelancerId === CURRENT_FREELANCER_ID);
  const clientApplications = applications.filter(app => {
    const jobOfClient = jobs.find(j => j.id === app.jobId && j.clientName === 'ModernTech Ventures');
    return !!jobOfClient;
  });

  const templateInvoices = [
    { title: "Brief Intro", text: "Hello! I saw your post and with over 4 years of web practice translating robust mockups to pristine functional elements, I have exactly the skill array needed. I specialize in fast, responsive, and robust code. Let's arrange a brief call!" },
    { title: "Dashboard Spec", text: "Hi team! Dashboard graphs and data streams are my specialized core skill. I have integrated extensive REST APIs with interactive Recharts graphics and smooth layouts, which completely aligns with your vision. I am ready to start immediately." },
    { title: "Figma to Frontend", text: "I can slice and convert Figma layouts to pure React/Tailwind component hierarchies flawlessly. Every margins, typographic weight, and flex container alignment is highly faithful to your draft specs." }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans antialiased">
      
      {/* Visual Workspace Sandbox Notice Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-950 text-white py-3.5 px-4 text-center border-b border-indigo-900 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-500/35 border border-indigo-400/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> SIMULATOR MODE
          </span>
          <p className="text-sm font-medium text-slate-100">
            Switch current actor views instantly at the right using the responsive control deck:
          </p>
          
          <div className="flex bg-indigo-900/50 border border-indigo-700/60 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => handleRoleChange('freelancer')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                currentRole === 'freelancer' 
                  ? 'bg-white text-indigo-950 shadow' 
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" /> Freelancer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('client')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                currentRole === 'client' 
                  ? 'bg-white text-indigo-950 shadow' 
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <Briefcase className="w-3 h-3" /> Client
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                currentRole === 'admin' 
                  ? 'bg-white text-indigo-950 shadow' 
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <Award className="w-3 h-3" /> Admin Staff
            </button>
          </div>
        </div>
      </div>

      {/* Primary Dashboard Navigation Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              F
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none">Marketplace Deck</h1>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 uppercase tracking-wide">
                Role: <strong className="text-indigo-600">{currentRole} simulation</strong>
              </span>
            </div>
          </div>

          {/* Dynamic Tabs list based on Active Role */}
          <nav className="flex items-center gap-1">
            {currentRole === 'freelancer' && (
              <>
                <button
                  type="button"
                  onClick={() => setFreelancerTab('find_work')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-250 ${
                    freelancerTab === 'find_work' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Find Work
                </button>
                <button
                  type="button"
                  onClick={() => setFreelancerTab('tracker')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-250 flex items-center gap-1 ${
                    freelancerTab === 'tracker' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Job Tracker
                  {freelancerApplications.length > 0 && (
                    <span className="bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center">
                      {freelancerApplications.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setFreelancerTab('profile')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-250 ${
                    freelancerTab === 'profile' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => setFreelancerTab('messages')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-250 ${
                    freelancerTab === 'messages' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Messenger
                </button>
              </>
            )}

            {currentRole === 'client' && (
              <>
                <button
                  type="button"
                  onClick={() => setClientTab('my_listings')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-250 ${
                    clientTab === 'my_listings' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Active Jobs List
                </button>
                <button
                  type="button"
                  onClick={() => setClientTab('post_job')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-250 flex items-center gap-1 ${
                    clientTab === 'post_job' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Post Job Offer
                </button>
                <button
                  type="button"
                  onClick={() => setClientTab('browse_talents')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-250 ${
                    clientTab === 'browse_talents' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Browse Specialists
                </button>
                <button
                  type="button"
                  onClick={() => setClientTab('messages')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition duration-250 ${
                    clientTab === 'messages' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Messenger
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <button
                type="button"
                onClick={() => setAdminTab('console')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs bg-indigo-50 text-indigo-700`}
              >
                Moderator Console
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ======================================= */}
        {/* ROLE 1: FREELANCER SUITE ============ */}
        {/* ======================================= */}
        {currentRole === 'freelancer' && (
          <div className="space-y-6">
            
            {/* FIND WORK VIEW */}
            {freelancerTab === 'find_work' && (
              <div className="space-y-6">
                
                {/* Visual Header panel */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 max-w-2xl">
                    <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded inline-block mb-3">
                      Specialist Work Deck
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      Find your perfect contract project today
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      Search premium verified postings, coordinate budgets, and send detailed terms straight to client recruiter systems. Current Profile set as: <strong>Sarah Connor (${profileHourlyRate}/hr)</strong>.
                    </p>
                  </div>
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-indigo-50/40 hidden md:block" />
                </div>

                {/* Filter and Search Bar Control Group */}
                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    
                    {/* Plain Text search */}
                    <div className="md:col-span-3 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search keywords, stack tools..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs md:text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 font-medium"
                      />
                    </div>

                    {/* Category Selection Filter */}
                    <div className="md:col-span-2">
                       <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs md:text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 font-medium"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Minimal rate slider */}
                    <div className="md:col-span-3 flex items-center gap-3">
                      <span className="text-xs text-slate-400 whitespace-nowrap font-medium flex-shrink-0">
                        Min Budget: <strong className="text-slate-700">${budgetFilter}</strong>
                      </span>
                      <input 
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={budgetFilter}
                        onChange={(e) => setBudgetFilter(Number(e.target.value))}
                        className="w-full tracking-wide rounded-lg cursor-pointer accent-indigo-600"
                      />
                    </div>

                    {/* Featured toggle helper */}
                    <div className="md:col-span-2 flex items-center gap-2">
                      <input 
                        type="checkbox"
                        id="featuredToggle"
                        checked={onlyFeatured}
                        onChange={(e) => setOnlyFeatured(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-200 rounded cursor-pointer"
                      />
                      <label htmlFor="featuredToggle" className="text-xs text-slate-500 font-semibold cursor-pointer select-none">
                        Only Featured
                      </label>
                    </div>

                    {/* Fit My Profile Skills toggle helper */}
                    <div className="md:col-span-2 flex items-center gap-2 border-l border-slate-100 pl-2">
                      <input 
                        type="checkbox"
                        id="matchSkillsToggle"
                        checked={matchMySkills}
                        onChange={(e) => setMatchMySkills(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-200 rounded cursor-pointer"
                      />
                      <label htmlFor="matchSkillsToggle" className="text-xs text-slate-700 font-bold cursor-pointer select-none flex items-center gap-1" title="Only show jobs matching your profile's skills">
                        🎯 Fit My Skills
                      </label>
                    </div>
                  </div>
                </div>

                {/* Job Cards View Grid */}
                {filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-100 p-12 text-center max-w-md mx-auto">
                    <AlertCircle className="w-10 h-10 text-slate-350 mx-auto mb-2 opacity-60" />
                    <h3 className="text-base font-bold text-slate-800">No Job Listings Match</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Adjust your category tags, deselect "Fit My Skills", decrease the minimum rate constraint, or search a different phrase.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => {
                      const hasApplied = applications.some(
                        app => app.jobId === job.id && app.freelancerId === CURRENT_FREELANCER_ID
                      );
                      return (
                        <JobCard 
                          key={job.id}
                          job={job}
                          currentRole="freelancer"
                          hasApplied={hasApplied}
                          profileSkills={profileSkills}
                          clientRating={getClientRating(job.clientName)}
                          onApply={triggerApplyModal}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* MY JOB TRACKER VIEW */}
            {freelancerTab === 'tracker' && (
              <div className="space-y-6">
                <div className="pb-2">
                  <h2 className="text-xl font-bold text-slate-950">Active Applications Tracker</h2>
                  <p className="text-xs text-slate-505">
                    Track details matching all contract bids you have loaded to employer listings.
                  </p>
                </div>

                <ApplicationsList 
                  applications={freelancerApplications}
                  jobs={jobs}
                  freelancers={profiles}
                  currentRole="freelancer"
                  onUpdateStatus={handleUpdateApplicationStatus}
                  onDeleteApplication={(id) => setApplications(prev => prev.filter(app => app.id !== id))}
                  onRateContract={handleRateContract}
                />
              </div>
            )}

            {/* MY SPECIALIST PROFILE VIEW */}
            {freelancerTab === 'profile' && (
              <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8">
                <div className="pb-4 border-b border-slate-50 mb-6">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <User className="text-indigo-600 w-5 h-5" /> Profile settings
                  </h2>
                  <p className="text-xs text-slate-400">
                    Your profile describes your hourly bids, bio details, and skills to client listings.
                  </p>
                </div>

                {/* Profile Completeness Strength Progress Bar Widget */}
                {(() => {
                  let score = 0;
                  const steps = [];

                  const hasTitle = profileTitle && profileTitle.trim().length > 0;
                  if (hasTitle) score += 25;
                  steps.push({ name: 'Professional Title', done: hasTitle });

                  const hasHourlyRate = typeof profileHourlyRate === 'number' && profileHourlyRate > 0;
                  if (hasHourlyRate) score += 25;
                  steps.push({ name: 'Hourly Service Rate', done: hasHourlyRate });

                  const hasSkills = Array.isArray(profileSkills) && profileSkills.length > 0;
                  if (hasSkills) score += 25;
                  steps.push({ name: 'Skills Tag Portfolio', done: hasSkills });

                  const hasBio = profileBio && profileBio.trim().length > 0;
                  if (hasBio) score += 25;
                  steps.push({ name: 'Specialist Bio Details', done: hasBio });

                  return (
                    <div className="bg-slate-50/70 border border-slate-100/80 rounded-xl p-4 sm:p-5 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Profile Strength Index</span>
                          <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full ${
                            score === 100 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : score >= 75 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : score >= 50 
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {score === 100 ? 'Outstanding' : score >= 75 ? 'Strong' : score >= 50 ? 'Intermediate' : 'Incomplete'}
                          </span>
                        </div>
                        <span className="text-base font-black text-indigo-650 tracking-tight">{score}%</span>
                      </div>

                      {/* Progress Track */}
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative shadow-inner mb-4">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${score}%` }}
                        />
                      </div>

                      {/* Criteria Checklist grids */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {steps.map((step, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition duration-200 ${
                              step.done 
                                ? 'bg-white text-slate-700 border-slate-200/60 shadow-xs' 
                                : 'bg-slate-50 text-slate-400 border-dashed border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle className={`w-4 h-4 flex-shrink-0 ${step.done ? 'text-emerald-500 fill-emerald-50' : 'text-slate-300'}`} />
                              <span className={`font-semibold truncate ${step.done ? 'text-slate-750' : 'text-slate-400 font-medium'}`}>{step.name}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ml-1.5 flex-shrink-0 ${step.done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                              {step.done ? '+25%' : '0%'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Dynamic Help tip */}
                      <div className="mt-3.5 pt-3.5 border-t border-slate-200/50 flex gap-2 items-start text-xs">
                        {score === 100 ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <p className="text-slate-600 font-medium leading-normal">
                              🎉 Your profile is 100% complete! Fully ready to rank higher in browse search feeds and attract top client contracts.
                            </p>
                          </>
                        ) : (
                          <>
                            <Lightbulb className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5 animate-pulse" />
                            <p className="text-slate-500 font-medium leading-normal">
                              💡 Complete your profile to build client trust. Unfinished sections: <span className="text-indigo-600 font-bold">{steps.filter(s => !s.done).map(s => s.name).join(', ')}</span>.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {profileSaveSuccess && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-lg font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Profile edits updated successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Full Specialist Name *</label>
                      <input 
                        type="text" 
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        className="w-full border border-slate-200 rounded-lg p-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Target Contact Email *</label>
                      <input 
                        type="email" 
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        required
                        className="w-full border border-slate-200 rounded-lg p-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Professional Title *</label>
                    <input 
                      type="text" 
                      value={profileTitle}
                      onChange={(e) => setProfileTitle(e.target.value)}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Hourly Service Rate ($) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input 
                          type="number" 
                          value={profileHourlyRate}
                          onChange={(e) => setProfileHourlyRate(Number(e.target.value))}
                          required
                          min="1"
                          className="w-full border border-slate-200 rounded-lg p-2 pl-7 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 pt-5 leading-relaxed">
                      This represents your base bid fee displayed on listing hubs.
                    </div>
                  </div>

                  <div>
                    <SkillSelector
                      selectedSkills={profileSkills}
                      onChange={setProfileSkills}
                      label="Your Skills Tag Portfolio *"
                      placeholder="Search, add, or customize your list of skills..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Specialist Bio / Cover Details *</label>
                    <textarea 
                      rows={4}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition"
                    >
                      Save Profile Updates
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* COMMUNICATIONS LAB */}
            {freelancerTab === 'messages' && (
              <Messenger 
                chats={chats}
                messages={messages}
                currentRole="freelancer"
                currentUserId={CURRENT_FREELANCER_ID}
                onSendMessage={handleSendMessage}
              />
            )}

          </div>
        )}

        {/* ======================================= */}
        {/* ROLE 2: CLIENT SUITE ================ */}
        {/* ======================================= */}
        {currentRole === 'client' && (
          <div className="space-y-6">

            {/* WORK POSTINGS LISTINGS HEAD */}
            {clientTab === 'my_listings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Your Posted Gig Offers</h2>
                    <p className="text-xs text-slate-505">
                      Review talent requests and candidate bid submissions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setClientTab('post_job')}
                    className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm hover:shadow transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Post New Job
                  </button>
                </div>

                {jobs.filter(j => j.clientName === 'ModernTech Ventures').length === 0 ? (
                  <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center max-w-lg mx-auto">
                    <Briefcase className="w-12 h-12 text-slate-350 mx-auto mb-2 opacity-50" />
                    <h3 className="font-bold text-base text-slate-800">No Postings Active</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Wait, click "Post New Job" above to create listing offers on this marketplace.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Postings list */}
                    <div className="lg:col-span-6 space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Manage Posted Openings</h3>
                      <div className="space-y-4">
                        {jobs.filter(j => j.clientName === 'ModernTech Ventures').map(job => (
                          <JobCard 
                            key={job.id}
                            job={job}
                            currentRole="client"
                            canManage={true}
                            clientRating={getClientRating(job.clientName)}
                            onDelete={handleDeleteJob}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Applicants reviews */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                          Review Received Proposals ({clientApplications.length})
                        </h3>
                      </div>

                      <ApplicationsList 
                        applications={clientApplications}
                        jobs={jobs}
                        freelancers={profiles}
                        currentRole="client"
                        onUpdateStatus={handleUpdateApplicationStatus}
                        onContactFreelancer={handleContactFreelancer}
                        onRateContract={handleRateContract}
                      />
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* CREATION WORKFLOW FORM */}
            {clientTab === 'post_job' && (
              <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8">
                <div className="pb-4 border-b border-slate-50 mb-6">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <PlusCircle className="text-indigo-600 w-5 h-5" /> Post Job Offer
                  </h2>
                  <p className="text-xs text-slate-400">
                    List high-quality openings on the marketplace hub for immediate specialist application.
                  </p>
                </div>

                <form onSubmit={handlePostJob} className="space-y-4">
                  {postSuccess && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-lg font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Gig opening posted successfully! Redirecting list...
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Contract Job Title *</label>
                    <input 
                      type="text" 
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      required
                      placeholder="e.g. Senior Frontend specialist (React/Vite)"
                      className="w-full border border-slate-200 rounded-lg p-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 grayscale-0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Corporate Segment Category</label>
                      <select 
                        value={newJobCategory}
                        onChange={(e) => setNewJobCategory(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                      >
                        {categories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Expected Duration</label>
                      <select 
                        value={newJobDuration}
                        onChange={(e) => setNewJobDuration(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                      >
                        <option value="Less than a month">Less than a month</option>
                        <option value="1 month">1 month</option>
                        <option value="1 - 3 months">1 - 3 months</option>
                        <option value="3 - 6 months">3 - 6 months</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Payment Method</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setNewJobType('Fixed')}
                          className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                            newJobType === 'Fixed' 
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                              : 'border-slate-200 hover:bg-slate-55 bg-white text-slate-600'
                          }`}
                        >
                          Fixed Pay
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewJobType('Hourly')}
                          className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                            newJobType === 'Hourly' 
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                              : 'border-slate-200 hover:bg-slate-55 bg-white text-slate-600'
                          }`}
                        >
                          Hourly Rate
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Budget ($) *</label>
                      <input 
                        type="number" 
                        value={newJobBudget}
                        onChange={(e) => setNewJobBudget(Number(e.target.value))}
                        required
                        min="5"
                        className="w-full border border-slate-200 rounded-lg p-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <SkillSelector
                      selectedSkills={newJobSkills}
                      onChange={setNewJobSkills}
                      label="Required Gig Skills *"
                      placeholder="Type or select required skills for this job..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Gig Description details * (Detailed tasks)</label>
                    <textarea 
                      rows={5}
                      value={newJobDesc}
                      onChange={(e) => setNewJobDesc(e.target.value)}
                      required
                      placeholder="List technical components, team structures, design milestones, and deliverables expected..."
                      className="w-full border border-slate-200 rounded-lg p-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition"
                    >
                      Publish Project Offer
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* BROWSE ALL TALENTS */}
            {clientTab === 'browse_talents' && (() => {
              const filteredFreelancers = profiles.filter(profile => {
                const matchesText = profile.name.toLowerCase().includes(talentSearchQuery.toLowerCase()) ||
                                    profile.title.toLowerCase().includes(talentSearchQuery.toLowerCase()) ||
                                    profile.bio.toLowerCase().includes(talentSearchQuery.toLowerCase());
                
                if (talentSelectedSkills.length === 0) {
                  return matchesText;
                }
                
                // Matches at least one selected skill tag
                const hasOverlap = profile.skills.some(pSkill => 
                  talentSelectedSkills.some(tSkill => tSkill.toLowerCase() === pSkill.toLowerCase())
                );
                return matchesText && hasOverlap;
              }).sort((a, b) => {
                // Keep highest overlap count first
                if (talentSelectedSkills.length === 0) return 0;
                const aOverlap = a.skills.filter(ps => talentSelectedSkills.some(ts => ts.toLowerCase() === ps.toLowerCase())).length;
                const bOverlap = b.skills.filter(ps => talentSelectedSkills.some(ts => ts.toLowerCase() === ps.toLowerCase())).length;
                return bOverlap - aOverlap;
              });

              return (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Browse Available Specialists</h2>
                      <p className="text-xs text-slate-500">
                        Consult professional profiles, experiences, filter by required tags and initiate direct communication.
                      </p>
                    </div>
                  </div>

                  {/* Filter and Search Bar Control Group for Talents */}
                  <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Search Box */}
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                          Search by Name or Keywords
                        </label>
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text" 
                            value={talentSearchQuery}
                            onChange={(e) => setTalentSearchQuery(e.target.value)}
                            placeholder="Type freelancer name, professional title, bio details..."
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs md:text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white placeholder-slate-401 text-slate-800 font-medium"
                          />
                        </div>
                      </div>

                      {/* Skill selector */}
                      <div>
                        <SkillSelector
                          selectedSkills={talentSelectedSkills}
                          onChange={setTalentSelectedSkills}
                          label="Filter Specialists by Core Skills"
                          placeholder="Search or add tools to filter profiles..."
                        />
                      </div>
                    </div>

                    {talentSelectedSkills.length > 0 && (
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-50">
                        <span className="flex items-center gap-1.5">
                          💡 Sorted by <strong className="text-indigo-650 font-bold">highest skill overlap</strong> matching your filters.
                        </span>
                        <button
                          type="button"
                          onClick={() => setTalentSelectedSkills([])}
                          className="hover:text-indigo-805 text-indigo-600 font-bold tracking-wide transition"
                        >
                          Clear Skill Filters
                        </button>
                      </div>
                    )}
                  </div>

                  {filteredFreelancers.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-100 p-12 text-center max-w-md mx-auto">
                      <AlertCircle className="w-10 h-10 text-slate-350 mx-auto mb-2 opacity-60" />
                      <h3 className="text-base font-bold text-slate-800">No Specialists Match</h3>
                      <p className="text-slate-500 text-xs mt-1">
                        Try modifying your keyword search query, clearing some filter tags, or browsing our full list of experts.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredFreelancers.map(profile => (
                        <FreelancerCard 
                          key={profile.id}
                          profile={profile}
                          currentRole="client"
                          highlightSkills={talentSelectedSkills}
                          onContact={handleContactGeneral}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* MESSAGING LAB */}
            {clientTab === 'messages' && (
              <Messenger 
                chats={chats}
                messages={messages}
                currentRole="client"
                currentUserId={CURRENT_CLIENT_ID}
                onSendMessage={handleSendMessage}
              />
            )}

          </div>
        )}

        {/* ======================================= */}
        {/* ROLE 3: ADMIN SUITE ================== */}
        {/* ======================================= */}
        {currentRole === 'admin' && (
          !isAdminAuthorized ? (
            <AdminLockScreen 
              onAuthorize={() => setIsAdminAuthorized(true)}
              savedPasscode={adminPasscode}
            />
          ) : (
            <div className="space-y-6">
              {/* Authorized session status strip */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-md flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">Administrative Console Authorized</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Confidential database, user listing controls, and system statistics console.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdminAuthorized(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 tracking-wide transition shadow-sm cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-450" /> Lock Admin Terminal
                </button>
              </div>

              <AdminPanel 
                jobs={jobs}
                profiles={profiles}
                applications={applications}
                totalMessagesCount={messages.length}
                adminPasscode={adminPasscode}
                onUpdatePasscode={(newCode) => setAdminPasscode(newCode)}
                onDeleteJob={handleDeleteJob}
                onToggleFeatureJob={handleToggleFeatureJob}
                onDeleteProfile={handleDeleteProfile}
                onToggleVerifyProfile={handleToggleVerifyProfile}
              />
            </div>
          )
        )}

      </main>

      {/* ======================================= */}
      {/* GLOBAL APPLY FORM MODAL ============== */}
      {/* ======================================= */}
      {applyJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-4">
            
            <div className="flex items-start justify-between border-b border-slate-50 pb-4">
              <div>
                <span className="text-xs font-semibold text-indigo-600 block">Submit Work Bid</span>
                <h3 className="font-extrabold text-slate-900 text-lg">{applyJob.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Recruiter: {applyJob.clientName}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setApplyJob(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 border rounded hover:bg-slate-50 text-xs"
              >
                ✕
              </button>
            </div>

            {applyError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 rounded-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" /> {applyError}
              </div>
            )}

            <div className="space-y-4">
              
              {/* Bid price box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-700 block">Configure Bid Amount</span>
                    <span className="text-[11px] text-slate-400">Employer budget terms: ${applyJob.budget} ({applyJob.type})</span>
                  </div>

                  <div className="relative max-w-[170px]">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="number"
                      value={applyBid}
                      onChange={(e) => setApplyBid(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white font-bold text-indigo-650"
                    />
                    {applyJob.type === 'Hourly' && (
                      <span className="text-[10px] text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 font-medium">/hr</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Template shortcuts */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 block">Click draft cover templates (saves typing):</span>
                <div className="flex gap-1.5 flex-wrap">
                  {templateInvoices.map((tmpl) => (
                    <button
                      key={tmpl.title}
                      type="button"
                      onClick={() => setApplyCoverLetter(tmpl.text)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 text-[11px] font-bold rounded"
                    >
                      {tmpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 block mb-1">Cover letter / pitch terms *</label>
                <textarea
                  rows={6}
                  value={applyCoverLetter}
                  onChange={(e) => setApplyCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, list relevant dashboard software or projects you've created, and describe why you match the requirements perfectly..."
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-4">
              <button
                type="button"
                onClick={() => setApplyJob(null)}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitApplication}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Submit Proposal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Humble Footer */}
      <footer className="footer bg-white border-t border-slate-100 mt-12 py-6 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Freelancer Marketplace Core. Created with visual precision.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
