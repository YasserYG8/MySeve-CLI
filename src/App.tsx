import React, { useState } from 'react';
import { Box, useInput, useApp } from 'ink';
import Header from './components/Header.js';
import ShortcutsBar from './components/ShortcutsBar.js';
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

  const { messages, isLoading, error, sendMessage } = useChat(handleViewChange);

  // Global keybindings
  useInput((input, key) => {
    const lowerInput = input.toLowerCase();

    if (activeView === 'chat') {
      // In chat view, ESC exits the application
      if (key.escape) {
        exit();
      }
    } else {
      // In other views, ESC returns to chat
      if (key.escape) {
        setActiveView('chat');
        return;
      }

      // Other navigation keybindings
      if (lowerInput === 'q') {
        exit();
      } else if (lowerInput === 'i') {
        setActiveView('chat');
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
    <Box flexDirection="column" width={columns} height={rows - 2}>
      {/* Top Header */}
      <Header />

      {/* Middle Content */}
      <Box flexGrow={1} flexDirection="column">
        {activeView === 'chat' && (
          <Chat
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSendMessage={sendMessage}
          />
        )}
        {activeView === 'projects' && <Projects />}
        {activeView === 'skills' && <Skills />}
        {activeView === 'experience' && <Experience />}
        {activeView === 'contact' && <Contact />}
        {activeView === 'help' && <Help />}
      </Box>

      {/* Bottom Shortcuts */}
      <Box>
        <ShortcutsBar activeView={activeView} />
      </Box>
    </Box>
  );
};
export default App;
