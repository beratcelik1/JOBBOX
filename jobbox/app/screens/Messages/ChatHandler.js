// ChatHandler.js
import React from 'react';
import { View, Button } from 'react-native';
import ChatRoom from './ChatRoom';
import ChatList from './ChatList';

const App = ({ navigation }) => {
  const [currentChatId, setCurrentChatId] = React.useState(null);

  return currentChatId ? (
    <View style={{ flex: 1 }}>
      <Button title="Back" onPress={() => setCurrentChatId(null)} />
      <ChatRoom currentChatId={currentChatId} />
    </View>
  ) : (
    <ChatList navigateToChat={setCurrentChatId} navigation={navigation} />
  );
};

export default App;
