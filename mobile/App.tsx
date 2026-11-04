//mobile/App.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginView from './starterPages/LoginView';
import DashboardView from './starterPages/DashboardView';
import DataEntryMongoView from './dataEntryMongoPages/DataEntryMongoView';
import DataEntryPostgresView from './dataEntryPostgresPages/DataEntryPostgresView';
import Sidebar from './components/Sidebar';
import type { RootStackParamList } from './navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
type NavProp = NativeStackNavigationProp<RootStackParamList>;

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();

  // Safely get the current route name
  const state = navigation.getState();
  const routeName = state?.routes[state.index ?? 0]?.name ?? '';

  // Explicitly type 'title' as string so we can map route names to human-readable titles
  let title: string = routeName;
  if (routeName === 'DataEntryPostgres') title = 'Postgres Entry';
  if (routeName === 'DataEntryMongo') title = 'Mongo Entry';
  if (routeName === 'Dashboard') title = 'Dashboard';

  return (
    <View style={styles.layoutContainer}>
      {/* Custom Header bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setSidebarOpen(true)}
          style={styles.hamburgerWrapper}
        >
          <Text style={styles.hamburger}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.spacer} />
      </View>

      {/* Main content area */}
      <View style={styles.contentArea}>{children}</View>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeRoute={routeName}
        navigate={route => navigation.navigate(route)}
      />
    </View>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginView} />
      ) : (
        <>
          <Stack.Screen name="Dashboard">
            {() => (
              <AuthenticatedLayout>
                <DashboardView />
              </AuthenticatedLayout>
            )}
          </Stack.Screen>
          <Stack.Screen name="DataEntryPostgres">
            {() => (
              <AuthenticatedLayout>
                <DataEntryPostgresView />
              </AuthenticatedLayout>
            )}
          </Stack.Screen>
          <Stack.Screen name="DataEntryMongo">
            {() => (
              <AuthenticatedLayout>
                <DataEntryMongoView />
              </AuthenticatedLayout>
            )}
          </Stack.Screen>
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

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#fff',
  },
  hamburgerWrapper: {
    width: 24,
    alignItems: 'flex-start',
  },
  hamburger: {
    fontSize: 24,
    lineHeight: 24,
  },
  headerTitle: {
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  spacer: {
    width: 24,
  },
  contentArea: {
    flex: 1,
  },
});
