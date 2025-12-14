import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const [userName] = useState('Dr. Muhammad');

  const quickActions = [
    { icon: 'camera', iconLib: 'Ionicons', label: 'Capture Image', desc: 'Use camera to scan', path: '/(tabs)/capture', color: '#2D9596' },
    { icon: 'cloud-upload-outline', iconLib: 'Ionicons', label: 'Upload Image', desc: 'From gallery', path: '/(tabs)/capture', color: '#34A853' },
    { icon: 'bar-chart-outline', iconLib: 'Ionicons', label: 'View History', desc: '12 scans', path: '/(tabs)/explore', color: '#F9A826' },
    { icon: 'person-outline', iconLib: 'Ionicons', label: 'My Profile', desc: 'Settings & info', path: '/(tabs)/profile', color: '#5F6368' },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2D9596', '#3AAFB0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="eye" size={32} color="#fff" />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Quick Overview</Text>
            <Ionicons name="trending-up" size={20} color="#2D9596" />
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <Text style={[styles.statNumber, { color: '#34A853' }]}>8</Text>
              <Text style={styles.statLabel}>Healthy</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#F9A826' }]}>4</Text>
              <Text style={styles.statLabel}>Flagged</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => router.push(action.path as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionDesc}>{action.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
    marginTop: -24,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#2D9596',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statsGrid: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E8EFEF',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D9596',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    shadowColor: '#2D9596',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
});
