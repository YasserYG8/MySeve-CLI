import React, { useState } from 'react';
import { Box, useInput, useApp } from 'ink';
import Header, { getHeaderHeight, LOGO_WIDTH } from './components/Header.js';
import ShortcutsBar from './components/ShortcutsBar.js';
import { SCROLL_GUTTER } from './components/ScrollBar.js';
import Chat from './views/Chat.js';
import Projects from './views/Projects.js';
import Skills from './views/Skills.js';
import Experience from './views/Experience.js';
import Contact from './views/Contact.js';
import Help from './views/Help.js';
import useChat from './hooks/useChat.js';
import useStdoutDimensions from './hooks/useStdoutDimensions.js';

const MAX_WIDTH = 80;
const MIN_ROWS_FOR_LOGO = 30;
const MIN_ROWS_FOR_LOGO_ON_LANDING = 22;
const BAR_ROWS = 2; // one gap, one row

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('chat');
  const { exit } = useApp();
  const { columns, rows } = useStdoutDimensions();
  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const { messages, isLoading, isHiring, sendMessage, interruptChat } = useChat(handleViewChange, exit);

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

  // The first screen keeps the logo on small terminals. After that, the content needs the rows.
  const isLanding = activeView === 'chat' && messages.length === 0;
  const frameWidth = Math.max(20, Math.min(MAX_WIDTH, columns - 4));
  const innerWidth = frameWidth - 4;
  const minRowsForLogo = isLanding ? MIN_ROWS_FOR_LOGO_ON_LANDING : MIN_ROWS_FOR_LOGO;
  const compact = frameWidth < LOGO_WIDTH || rows < minRowsForLogo;
  const totalRows = rows - 1;
  const contentHeight = Math.max(3, totalRows - getHeaderHeight(frameWidth, compact) - BAR_ROWS);
  const viewProps = { width: innerWidth - SCROLL_GUTTER, height: contentHeight };

  return (
    <Box flexDirection="column" width={columns} height={totalRows} alignItems="center" overflow="hidden">
      <Box flexDirection="column" width={frameWidth} height={totalRows}>
        <Box
          flexDirection="column"
          flexGrow={1}
          justifyContent={isLanding ? 'center' : 'flex-start'}
          overflow="hidden"
        >
          <Header width={frameWidth} compact={compact} />

          {activeView === 'chat' && (
            <Chat
              messages={messages}
              isLoading={isLoading}
              isHiring={isHiring}
              onSendMessage={sendMessage}
              onInterrupt={interruptChat}
              width={innerWidth}
              height={contentHeight}
            />
          )}
          {activeView === 'projects' && <Projects {...viewProps} />}
          {activeView === 'skills' && <Skills {...viewProps} />}
          {activeView === 'experience' && <Experience {...viewProps} />}
          {activeView === 'contact' && <Contact {...viewProps} />}
          {activeView === 'help' && <Help {...viewProps} />}
        </Box>

        <ShortcutsBar activeView={activeView} width={innerWidth} />
      </Box>
    </Box>
  );
};

export default App;
