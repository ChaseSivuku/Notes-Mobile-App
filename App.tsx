import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';

function RootNavigator(): React.ReactElement | null {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer children={user ? <MainNavigator /> : <AuthNavigator />} />
  );
}

export default function App(): React.ReactElement {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

