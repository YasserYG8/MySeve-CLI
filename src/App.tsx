import React, { useState } from 'react';
import { Box, useInput, useApp } from 'ink';
import Header from './components/Header.js';
import Chat from './views/Chat.js';
import Projects from './views/Projects.js';
import Skills from './views/Skills.js';
import Experience from './views/Experience.js';
import Contact from './views/Contact.js';
import Help from './views/Help.js';
import useChat from './hooks/useChat.js';
import useStdoutDimensions from './hooks/useStdoutDimensions.js';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('chat');
  const { exit } = useApp();
  const { columns, rows } = useStdoutDimensions();
  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const { messages, isLoading, error, sendMessage, interruptChat } = useChat(handleViewChange);

  // Global keybindings
  useInput((input, key) => {
    const lowerInput = input.toLowerCase();

    if (activeView !== 'chat') {
      // In other views, ESC or I returns to chat
      if (key.escape || lowerInput === 'i') {
        setActiveView('chat');
        return;
      }

      // Other navigation keybindings
      if (lowerInput === 'q') {
        exit();
      } else if (lowerInput === 'p') {
        setActiveView('projects');
      } else if (lowerInput === 's') {
        setActiveView('skills');
      } else if (lowerInput === 'e') {
        setActiveView('experience');
      } else if (lowerInput === 'c') {
        setActiveView('contact');
      } else if (lowerInput === 'h') {
        setActiveView('help');
      }
    }
  });
  return (
    <Box
      flexDirection="column"
      width={columns}
      height={rows - 1}
      alignItems="center"
      justifyContent="center"
    >
      {/* Centered container mimicking a div */}
      <Box
        flexDirection="column"
        width={Math.min(80, columns - 4)}
      >
        <Header />

        {/* Middle Content */}
        <Box flexDirection="column">
          {activeView === 'chat' && (
            <Chat
              messages={messages}
              isLoading={isLoading}
              error={error}
              onSendMessage={sendMessage}
              onInterrupt={interruptChat}
            />
          )}
          {activeView === 'projects' && <Projects />}
          {activeView === 'skills' && <Skills />}
          {activeView === 'experience' && <Experience />}
          {activeView === 'contact' && <Contact />}
          {activeView === 'help' && <Help />}
        </Box>
      </Box>
    </Box>
  );
};

export default App;
