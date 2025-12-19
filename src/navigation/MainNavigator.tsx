import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import WorkNotesScreen from '../screens/notes/WorkNotesScreen';
import StudyNotesScreen from '../screens/notes/StudyNotesScreen';
import PersonalNotesScreen from '../screens/notes/PersonalNotesScreen';
import AddEditNoteScreen from '../screens/notes/AddEditNoteScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../constants/colors';
import { MainStackParamList, NotesTabParamList } from '../types';

const Tab = createBottomTabNavigator<NotesTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

function NotesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="NotesTabs"
        component={NotesTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddEditNote"
        component={AddEditNoteScreen}
        options={({ route }) => ({
          title: route.params?.noteId ? 'Edit Note' : 'Add Note',
        })}
      />
    </Stack.Navigator>
  );
}

function NotesTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Work') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Study') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Personal') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Work" component={WorkNotesScreen} />
      <Tab.Screen name="Study" component={StudyNotesScreen} />
      <Tab.Screen name="Personal" component={PersonalNotesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return <NotesStack />;
}

