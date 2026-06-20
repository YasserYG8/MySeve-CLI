import { useState, useEffect } from 'react';

const PLACEHOLDERS = [
  "Ask me about BarberGo, Yasser's booking platform...",
  "Try: what's his DevOps stack?",
  "Yasser is probably pushing to GitHub right now 👀",
  "Ask about his internship at Dream Tek Consulting...",
  "Try: is Yasser open to work?",
  "Ask why he contributes to open source...",
  "Type /projects to see what he built 🚀"
];

export const usePlaceholder = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % PLACEHOLDERS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return PLACEHOLDERS[index];
};
export default usePlaceholder;
