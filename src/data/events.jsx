import RecruitmentBanner from '../assets/banners/gcc-club-recruitment-instagram.webp';
import WorkshopBanner1 from '../assets/banners/workshop 1.webp';

export const eventsData = [
  {
    id: 1,
    category: 'events',
    time: 'upcoming',
    title: 'Sub Core Recruitment Drive',
    type: 'RECRUITMENT',
    desc: 'GAT Coding Club is recruiting Sub Core members for 2nd and 3rd year students! Join our dynamic team to organize tech events and lead workshops.',
    img: RecruitmentBanner,
    date: '2026-03-10',
    location: 'GAT Campus',
  },
  {
    id: 2,
    category: 'workshops',
    time: 'past',
    title: 'Hands-On Generative AI',
    type: 'WORKSHOP',
    desc: "Unlocking the Power of AI: An interactive session introducing fundamentals of GenAI with hands-on practice using popular tools.",
    img: WorkshopBanner1,
    date: '7th March 2026',
    location: 'AIB-LAB-2, GAT Campus',
    participants: '70 participants'
  },
  {
    id: 3,
    category: 'events',
    time: 'upcoming',
    title: 'Bug Hunt 2026',
    type: 'COMPETITION',
    desc: 'Join our massive debugging competition. Find and fix errors in complex systems to win prizes.',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=640',
    date: 'TBA',
    location: 'GAT Campus'
  },
  {
    id: 4,
    category: 'workshops',
    time: 'upcoming',
    title: 'AWS Cloud Basics',
    type: 'WORKSHOP',
    desc: 'Learn how to host your projects on the cloud using AWS. We will show you how to get started.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=640',
    date: 'TBA',
    location: 'Online'
  },
  {
    id: 5,
    category: 'events',
    time: 'upcoming',
    title: 'Hack-a-Thon',
    type: 'HACKATHON',
    desc: '24 hours of non-stop building. Turn your wild ideas into reality and win grand prizes.',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=640',
    date: 'April 2026',
    location: 'GAT Main Hall'
  },
  {
    id: 6,
    category: 'workshops',
    time: 'past',
    title: 'React Fundamentals',
    type: 'WORKSHOP',
    desc: 'Learn the basics of React and how to build modern web interfaces.',
    img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=640',
    date: 'Feb 2026',
    location: 'AIB-LAB-1',
    participants: '45 participants'
  }
];
