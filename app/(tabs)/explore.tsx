import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HistoryItem {
  id: string;
  imageUri: string;
  severity: string;
  confidence: number;
  date: string;
}

// Dummy data for preview
const DUMMY_DATA: HistoryItem[] = [
  {
    id: '1',
    imageUri: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop',
    severity: 'No DR',
    confidence: 95,
    date: new Date(2025, 11, 14).toISOString(),
  },
  {
    id: '2',
    imageUri: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop',
    severity: 'Mild',
    confidence: 88,
    date: new Date(2025, 11, 12).toISOString(),
  },
  {
    id: '3',
    imageUri: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop',
    severity: 'Moderate',
    confidence: 92,
    date: new Date(2025, 11, 10).toISOString(),
  },
  {
    id: '4',
    imageUri: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop',
    severity: 'No DR',
    confidence: 97,
    date: new Date(2025, 10, 28).toISOString(),
  },
  {
    id: '5',
    imageUri: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop',
    severity: 'Severe',
    confidence: 85,
    date: new Date(2025, 10, 25).toISOString(),
  },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>(DUMMY_DATA);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('dr_history');
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: { [key: string]: string } = {
      'No DR': '#34A853',
      'Mild': '#FFCC00',
      'Moderate': '#F9A826',
      'Severe': '#EA4335',
      'Proliferative DR': '#8B0000'
    };
    return colors[severity] || '#666';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const groupByMonth = () => {
    const groups: { [key: string]: HistoryItem[] } = {};
    history.forEach((item) => {
      const key = getMonthYear(item.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  };

  const grouped = groupByMonth();

  const renderMonthSection = (month: string, items: HistoryItem[]) => (
    <View key={month} style={styles.monthSection}>
      <View style={styles.monthHeader}>
        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        <Text style={styles.monthTitle}>{month}</Text>
      </View>
      <View style={styles.monthItems}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.historyItem}
            onPress={() => router.push({
              pathname: '/results',
              params: { 
                imageUri: item.imageUri,
                severity: item.severity,
                confidence: item.confidence.toString(),
                date: item.date
              }
            })}
            activeOpacity={0.7}
          >
            <View style={styles.thumbnail}>
              <Image source={{ uri: item.imageUri }} style={styles.thumbnailImage} />
            </View>
            
            <View style={styles.itemDetails}>
              <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
              <View style={styles.itemRow}>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
                  <Text style={styles.severityText}>{item.severity}</Text>
                </View>
              </View>
              <Text style={styles.confidenceText}>{item.confidence}% confidence</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="eye-outline" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyTitle}>No Scans Yet</Text>
          <Text style={styles.emptyText}>
            Your scan history will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(grouped)}
          renderItem={({ item }) => renderMonthSection(item[0], item[1])}
          keyExtractor={(item) => item[0]}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFA',
  },
  header: {
    backgroundColor: '#2D9596',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  monthSection: {
    marginBottom: 24,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  monthItems: {
    gap: 8,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#2D9596',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8EFEF',
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
  },
  itemDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  confidenceText: {
    fontSize: 13,
    color: '#2D9596',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
