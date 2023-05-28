import React, { useState, createContext } from 'react';

export const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversationsData, setConversationsData] = useState({
    '1': {
      sender: {
        id: '1',
        name: 'John Doe',
        avatar: 'https://example.com/path-to-avatar-image.jpg',
      },
      messages: [
        { id: '1', message: 'Hello, this is John Doe.', time: '10:45 PM' },
        { id: '2', message: 'How are you?', time: '11:00 PM' },
        // More messages...
      ],
    },
    '2': {
      sender: {
        id: '2',
        name: 'Jane Smith',
        avatar: 'https://example.com/path-to-avatar-image.jpg',
      },
      messages: [
        { id: '1', message: 'Hello, this is Jane Smith.', time: '09:30 AM' },
        { id: '2', message: 'Nice to meet you!', time: '09:35 AM' },
        // More messages...
      ],
    },
    // More data...
  });

  return (
    <ConversationContext.Provider value={[conversationsData, setConversationsData]}>
      {children}
    </ConversationContext.Provider>
  );
};