import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>dashboard</Text>
        <Text style={styles.title}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('DataEntryPostgres')}
        >
          <Text style={styles.menuText}>→ data entry (postgres)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('DataEntryMongo')}
        >
          <Text style={styles.menuText}>→ data entry (mongo)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>logout</Text>
        </TouchableOpacity>
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
  header: {
    marginTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 24,
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
  email: {
    fontSize: 14,
    color: '#666',
  },
  menu: {
    marginTop: 24,
    gap: 16,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: 40,
  },
  logoutText: {
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    textAlign: 'center',
  },
});
