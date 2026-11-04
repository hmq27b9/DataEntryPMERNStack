//mobile/starterPages/DashboardView.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardView() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.kicker}>dashboard</Text>
        <Text style={styles.title}>{user.username}</Text>
        <Text style={styles.meta}>{user.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  content: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 24,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: '#666',
  },
});
