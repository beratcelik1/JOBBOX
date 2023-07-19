import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArchivedJobsScreen from './ArchivedJobsScreen';
import FindTemplateScreen from '../FindTemplateScreen';
import HireApplicationsScreen from '../HireApplications';
import HireScreen from './HireScreen';
import PostJob from '../PostJob';

const HireStack = createStackNavigator();

function Hire() {
  return (
    <HireStack.Navigator initialRouteName="HireScreen">
      <HireStack.Screen name="HireScreen" component={HireScreen} options={{ headerShown: false }} />
      <HireStack.Screen
        name="PostJob"
        component={PostJob}
        options={{
          headerTitle: '',
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      />
      <HireStack.Screen
        name="HireApplicationsScreen"
        component={HireApplicationsScreen}
        options={{
          headerTitle: '',
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      />
      <HireStack.Screen
        name="FindTemplateScreen"
        component={FindTemplateScreen}
        options={{
          headerTitle: '',
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      />
      <HireStack.Screen name="ArchivedJobsScreen" component={ArchivedJobsScreen} options={{ headerTitle: '', headerBackTitleVisible: false }} />
    </HireStack.Navigator>
  );
}

export default Hire;
