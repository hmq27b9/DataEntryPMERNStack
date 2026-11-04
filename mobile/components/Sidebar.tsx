//mobile/components/Sidebar.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute: string;
  navigate: (route: keyof RootStackParamList) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  activeRoute,
  navigate,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const navItems: { label: string; route: keyof RootStackParamList }[] = [
    { label: 'dashboard', route: 'Dashboard' },
    { label: 'data entry (postgres)', route: 'DataEntryPostgres' },
    { label: 'data entry (mongo)', route: 'DataEntryMongo' },
  ];

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sidebar}>
          <View style={styles.brandSection}>
            <Text style={styles.brand}>DataEntryPMERNStack</Text>
            <Text style={styles.userInfo}>{user?.username}</Text>
          </View>

          <View style={styles.navSection}>
            {navItems.map(item => (
              <TouchableOpacity
                key={item.route}
                style={[
                  styles.navItem,
                  activeRoute === item.route && styles.navItemActive,
                ]}
                onPress={() => {
                  navigate(item.route);
                  onClose();
                }}
              >
                <Text style={styles.navText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutText}>logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backdrop: {
    flex: 1,
  },
  sidebar: {
    width: '75%',
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  brandSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 16,
    marginBottom: 24,
  },
  brand: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 12,
    color: '#666',
  },
  navSection: {
    flex: 1,
    gap: 16,
  },
  navItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navItemActive: {
    borderBottomColor: '#000',
  },
  navText: {
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerSection: {
    paddingVertical: 24,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
