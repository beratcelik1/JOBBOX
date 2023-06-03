// App.js
import React from 'react';
import { View, Button } from 'react-native';
import ChatRoom from './ChatRoom';
import ChatList from './ChatList';

const App = () => {
  const [currentChatId, setCurrentChatId] = React.useState(null);
  const chats = [{ id: 1, name: 'Chat 1' }, { id: 2, name: 'Chat 2' }];

  return currentChatId ? (
    <View style={{ flex: 1 }}>
      <Button title="Back" onPress={() => setCurrentChatId(null)} />
      <ChatRoom currentChatId={currentChatId} />
    </View>
  ) : (
    <ChatList navigateToChat={setCurrentChatId} />
  );
};

export default App;
