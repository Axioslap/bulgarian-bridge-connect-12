
export const mockMembers = [
  {
    id: 1,
    name: "Maria Dimitrova",
    location: "Sofia, Bulgaria",
    education: "MBA, Stanford University",
    interests: ["Technology", "Startups", "Marketing"],
    skills: ["Digital Marketing", "Product Management", "Data Analytics"],
    role: "Entrepreneur",
    bio: "Tech entrepreneur building the next generation of fintech solutions for Eastern Europe."
  },
  {
    id: 2,
    name: "Alex Petrov",
    location: "Plovdiv, Bulgaria",
    education: "MS Computer Science, MIT",
    interests: ["AI", "Software Development", "Innovation"],
    skills: ["Machine Learning", "Python", "Cloud Architecture"],
    role: "Tech Professional",
    bio: "AI researcher and software architect with expertise in scalable systems."
  },
  {
    id: 3,
    name: "Elena Georgiev",
    location: "Varna, Bulgaria",
    education: "PhD Economics, Harvard University",
    interests: ["Finance", "Economics", "Policy"],
    skills: ["Economic Analysis", "Financial Modeling", "Policy Research"],
    role: "Academic",
    bio: "Economic policy researcher focused on EU-US trade relationships."
  }
];

export const mockMessages = [
  {
    id: 1,
    sender: "Maria Dimitrova",
    subject: "Networking Event Follow-up",
    preview: "Hi John, it was great meeting you at the Sofia networking event...",
    fullContent: "Hi John,\n\nIt was great meeting you at the Sofia networking event last week! I really enjoyed our conversation about digital marketing strategies for Bulgarian startups.\n\nI wanted to follow up on the collaboration opportunity we discussed. My team at TechSofia is currently working on a project that could benefit from your MBA expertise, particularly in the areas of business development and market analysis.\n\nWould you be available for a coffee meeting next week to discuss this further? I'm free Tuesday or Wednesday afternoon.\n\nBest regards,\nMaria Dimitrova\nCEO, TechSofia",
    time: "2 hours ago",
    unread: true
  },
  {
    id: 2,
    sender: "Alex Petrov",
    subject: "Business Partnership Opportunity",
    preview: "I saw your profile and think we could collaborate on...",
    fullContent: "Hi John,\n\nI saw your profile on the ABTC Bulgaria platform and was impressed by your background at Harvard Business School. I think we could collaborate on something exciting!\n\nI'm currently developing an AI-powered fintech solution for the Bulgarian market, and I'm looking for a business partner with strong strategic and financial expertise. Your experience could be exactly what we need to take this to the next level.\n\nThe opportunity involves:\n- Market strategy development\n- Investor relations\n- Business model optimization\n- Potential equity partnership\n\nWould you be interested in learning more? I'd love to set up a call to discuss the details.\n\nBest,\nAlex Petrov\nFounder, FinTech Innovations",
    time: "1 day ago",
    unread: true
  },
  {
    id: 3,
    sender: "ABTC Bulgaria",
    subject: "Upcoming Workshop Reminder",
    preview: "Don't forget about the U.S. Business Culture Workshop...",
    fullContent: "Dear John,\n\nThis is a friendly reminder about the upcoming U.S. Business Culture Workshop scheduled for July 3, 2023, at the American Corner Sofia.\n\nWorkshop Details:\n- Date: July 3, 2023\n- Time: 2:00 PM - 5:00 PM\n- Location: American Corner Sofia\n- Topic: Advanced Business Communication and Networking Strategies\n\nWhat to expect:\n- Interactive sessions on cross-cultural business communication\n- Networking best practices in the U.S. market\n- Case studies from successful Bulgarian-American business partnerships\n- Q&A session with industry experts\n\nPlease confirm your attendance by replying to this message. Light refreshments will be provided.\n\nWe look forward to seeing you there!\n\nBest regards,\nABTC Bulgaria Team",
    time: "3 days ago",
    unread: false
  }
];

export const mockDiscussionPosts = [
  {
    id: 1,
    author: "Maria Dimitrova",
    title: "Seeking Beta Testers for New Fintech App",
    content: "Hi everyone! I'm launching a new fintech app focused on cross-border payments between Bulgaria and the US. Looking for fellow entrepreneurs who'd be interested in beta testing. Would love to get feedback from this amazing community!",
    tags: ["Fintech", "Beta Testing", "Entrepreneurship"],
    likes: 12,
    comments: 5,
    timeAgo: "2 hours ago",
    isLiked: false,
    hasUserCommented: true
  },
  {
    id: 2,
    author: "Alex Petrov",
    title: "AI Ethics Discussion - Thoughts?",
    content: "Just attended an amazing conference on AI ethics at MIT. The discussions around bias in machine learning were particularly eye-opening. What are your thoughts on how we can ensure more ethical AI development in Bulgaria?",
    tags: ["AI", "Ethics", "Technology"],
    likes: 8,
    comments: 12,
    timeAgo: "1 day ago",
    isLiked: true,
    hasUserCommented: false
  },
  {
    id: 3,
    author: "Elena Georgiev",
    title: "Research Collaboration Opportunity",
    content: "Working on a research paper about economic impacts of US-Bulgaria tech partnerships. Looking for data points and case studies. Anyone interested in contributing or collaborating?",
    tags: ["Research", "Economics", "Collaboration"],
    likes: 6,
    comments: 3,
    timeAgo: "3 days ago",
    isLiked: false,
    hasUserCommented: true
  },
  {
    id: 4,
    author: "Viktor Stoilov",
    title: "Startup Funding Landscape in Bulgaria",
    content: "Has anyone noticed the changes in startup funding in Bulgaria lately? VCs seem more interested in deep tech and AI companies. What's your experience with recent funding rounds?",
    tags: ["Startup", "Funding", "Investment"],
    likes: 15,
    comments: 8,
    timeAgo: "5 days ago",
    isLiked: false,
    hasUserCommented: true
  },
  {
    id: 5,
    author: "Kristina Radeva",
    title: "Digital Marketing Trends for 2024",
    content: "Just finished analyzing our Q4 marketing data. Some interesting trends emerging - video content is still king, but AI-powered personalization is becoming crucial. Thoughts?",
    tags: ["Marketing", "Digital", "Trends"],
    likes: 9,
    comments: 6,
    timeAgo: "1 week ago",
    isLiked: true,
    hasUserCommented: false
  },
  {
    id: 6,
    author: "Dimitar Nachev",
    title: "Remote Work Policies - Best Practices",
    content: "Our company is updating remote work policies. Looking for insights from other leaders - what policies work best for maintaining productivity and team culture?",
    tags: ["Remote Work", "Leadership", "HR"],
    likes: 11,
    comments: 14,
    timeAgo: "1 week ago",
    isLiked: false,
    hasUserCommented: true
  }
];

export const mockCuratedNews = [
  {
    id: 1,
    title: "AI Startup from Sofia Raises $2M Series A",
    category: "AI",
    date: "2 hours ago",
    isNew: true
  },
  {
    id: 2,
    title: "Bulgarian Tech Companies Expand to US Markets",
    category: "Technology",
    date: "1 day ago",
    isNew: true
  },
  {
    id: 3,
    title: "Startup Accelerator Opens in Plovdiv",
    category: "Startups",
    date: "3 days ago",
    isNew: false
  }
];

export const upcomingEvents = [
  {
    title: "Networking Mixer in Sofia",
    date: "June 15, 2023",
    location: "Sofia Tech Park"
  },
  {
    title: "U.S. Business Culture Workshop",
    date: "July 3, 2023",
    location: "American Corner Sofia"
  }
];

export const resourceLinks = [
  { title: "Guide to U.S. Business Etiquette", type: "PDF" },
  { title: "Pitch Deck Templates", type: "Templates" },
  { title: "Entrepreneurship Resources", type: "Links" }
];
