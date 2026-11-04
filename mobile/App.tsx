import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import DataEntryMongoScreen from './pages/DataEntryMongoScreen';
import DataEntryPostgresScreen from './pages/DataEntryPostgresScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#000',
        headerTitleStyle: { fontWeight: '400', fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DataEntryPostgres"
            component={DataEntryPostgresScreen}
            options={{ title: 'Postgres Entry' }}
          />
          <Stack.Screen
            name="DataEntryMongo"
            component={DataEntryMongoScreen}
            options={{ title: 'Mongo Entry' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
