import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [userName] = useState('Dr. Muhammad');

  const quickActions = [
    { icon: 'scan', iconLib: 'Ionicons', label: 'Scan Retina', desc: 'Capture or upload', path: '/(tabs)/capture', color: '#2D9596' },
    { icon: 'bar-chart-outline', iconLib: 'Ionicons', label: 'View History', desc: '12 scans', path: '/(tabs)/explore', color: '#F9A826' },
    { icon: 'medkit', iconLib: 'Ionicons', label: 'Find Doctors', desc: 'Ophthalmologists', path: '/ophthalmologists', color: '#34A853' },
    { icon: 'school', iconLib: 'Ionicons', label: 'Learn About DR', desc: 'Education', path: '/education', color: '#3AAFB0' },
  ];

  const newsArticles = [
    {
      id: '1',
      title: 'What is Diabetic Retinopathy?',
      subtitle: 'Understanding the silent threat to your vision',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      readTime: 3,
      color: '#2D9596',
    },
    {
      id: '2',
      title: 'The 4 Stages of DR',
      subtitle: 'From mild to sight-threatening',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
      readTime: 4,
      color: '#F9A826',
    },
    {
      id: '3',
      title: 'Blood Sugar: The Main Culprit',
      subtitle: 'Why HbA1c levels matter',
      image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800',
      readTime: 3,
      color: '#2D9596',
    },
  ];

  return (
    <View style={styles.container}>
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

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
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

        {/* News Feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Articles</Text>
            <TouchableOpacity onPress={() => router.push('/education')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.newsGrid}>
            {newsArticles.map((article, index) => (
              <TouchableOpacity
                key={article.id}
                style={styles.newsCard}
                onPress={() => router.push('/education')}
                activeOpacity={0.7}
              >
                <Image source={{ uri: article.image }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <View style={[styles.newsBadge, { backgroundColor: article.color }]}>
                    <Ionicons name="book-outline" size={10} color="#fff" />
                    <Text style={styles.newsBadgeText}>{article.readTime} min</Text>
                  </View>
                  <Text style={styles.newsTitle} numberOfLines={2}>{article.title}</Text>
                  <Text style={styles.newsSubtitle} numberOfLines={2}>{article.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingTop: 8,
  },
  content: {
    marginBottom: 24,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D9596',
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
  newsGrid: {
    gap: 12,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2D9596',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    flexDirection: 'row',
  },
  newsImage: {
    width: 110,
    height: 110,
    backgroundColor: '#E8EFEF',
  },
  newsContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  newsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newsBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 18,
  },
  newsSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
});
