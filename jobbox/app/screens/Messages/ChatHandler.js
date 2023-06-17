import React from 'react';
import { View, Button } from 'react-native';
import ChatRoom from './ChatRoom';
import ChatList from './ChatList';

const App = ({ navigation, route }) => {
  const [currentChatId, setCurrentChatId] = React.useState(null);
  const { userId, postedBy } = route.params;
  
  return currentChatId ? (
    <View style={{ flex: 1 }}>
      <Button title="Back" onPress={() => setCurrentChatId(null)} />
      <ChatRoom currentChatId={currentChatId} userId={userId} postedBy={postedBy} />
    </View>
  ) : (
    <ChatList navigateToChat={setCurrentChatId} navigation={navigation} userId={userId} postedBy={postedBy} />
  );
};

export default App;

