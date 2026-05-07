import React from 'react';
import { Code, Sparkles, Terminal as TerminalIcon, Layers, Shield, Globe } from 'lucide-react';

export const domainsData = [
  { 
    id: 'web-development',
    title: 'Web Development', 
    icon: <Code className="w-6 h-6" />, 
    color: 'blue', 
    desc: 'Build modern, responsive websites using the latest frameworks and cloud technologies.' 
  },
  { 
    id: 'ai-ml',
    title: 'AI / ML', 
    icon: <Sparkles className="w-6 h-6" />, 
    color: 'purple', 
    desc: 'Dive into the world of Artificial Intelligence and Machine Learning to build smart systems.' 
  },
  { 
    id: 'competitive-coding',
    title: 'Competitive Coding', 
    icon: <TerminalIcon className="w-6 h-6" />, 
    color: 'cyan', 
    desc: 'Master algorithms and data structures to solve complex problems and win competitions.' 
  },
  { 
    id: 'app-development',
    title: 'App Development', 
    icon: <Layers className="w-6 h-6" />, 
    color: 'indigo', 
    desc: 'Create powerful mobile applications for iOS and Android using modern cross-platform tools.' 
  },
  { 
    id: 'cyber-security',
    title: 'Cyber Security', 
    icon: <Shield className="w-6 h-6" />, 
    color: 'red', 
    desc: 'Learn the essentials of network security, ethical hacking, and data protection.' 
  },
  { 
    id: 'cloud-computing',
    title: 'Cloud Computing', 
    icon: <Globe className="w-6 h-6" />, 
    color: 'emerald', 
    desc: 'Explore cloud architecture, serverless computing, and scalable infrastructure.' 
  }
];
