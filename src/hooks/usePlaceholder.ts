import { useState, useEffect } from 'react';

export interface Suggestion {
  hint: string; // shown in the empty input
  fill: string; // put in the input when the visitor presses Tab
}

const SUGGESTIONS: Suggestion[] = [
  { hint: "Type /about and I'll introduce myself 👋", fill: '/about' },
  { hint: 'Ask me about Specter, my live logs CLI in Go...', fill: 'Tell me about Specter' },
  { hint: "Try: what's your DevOps stack?", fill: "What's your DevOps stack?" },
  { hint: "I'm probably pushing to GitHub right now 👀", fill: 'What are you working on right now?' },
  { hint: 'Ask about my internship at Dream Tek Consulting...', fill: 'Tell me about your internship at Dream Tek Consulting' },
  { hint: 'Try: are you open to work?', fill: 'Are you open to work?' },
  { hint: 'Ask me why I contribute to open source...', fill: 'Why do you contribute to open source?' },
  { hint: 'Type /projects to see what I built 🚀', fill: '/projects' },
];

export const usePlaceholder = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % SUGGESTIONS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return SUGGESTIONS[index];
};
export default usePlaceholder;
