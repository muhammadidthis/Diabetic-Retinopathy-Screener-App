import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type SeverityLevel = 'No DR' | 'Mild' | 'Moderate' | 'Severe' | 'Proliferative DR';

const severityDescriptions = {
  'No DR': 'No signs of diabetic retinopathy detected.',
  'Mild': 'Early signs of diabetic retinopathy. Monitor regularly.',
  'Moderate': 'Moderate diabetic retinopathy detected. Consult your doctor.',
  'Severe': 'Severe diabetic retinopathy. Immediate medical attention recommended.',
  'Proliferative DR': 'Advanced diabetic retinopathy. Urgent medical care required.'
};

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const imageUri = params.imageUri as string;
  const [isSaving, setIsSaving] = useState(false);

  // Simulated AI analysis result (in real app, this would come from backend)
  const severity: SeverityLevel = 'Moderate';
  const confidence = 87.5;

  const getSeverityColor = (level: SeverityLevel) => {
    const colors = {
      'No DR': '#34A853',
      'Mild': '#FFCC00',
      'Moderate': '#F9A826',
      'Severe': '#EA4335',
      'Proliferative DR': '#8B0000'
    };
    return colors[level];
  };

  const isHealthy = severity === 'No DR';
  const isSevere = severity === 'Severe' || severity === 'Proliferative DR';

  const saveToHistory = async () => {
    setIsSaving(true);
    try {
      const result = {
        id: Date.now().toString(),
        imageUri,
        severity,
        confidence,
        date: new Date().toISOString(),
      };

      const existingHistory = await AsyncStorage.getItem('dr_history');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(result);

      await AsyncStorage.setItem('dr_history', JSON.stringify(history));
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsSaving(false);
      router.push('/(tabs)/explore');
    } catch (error) {
      setIsSaving(false);
      alert('Failed to save result');
    }
  };

  const shareResult = async () => {
    try {
      await Share.share({
        message: `DR Screening Result:\nSeverity: ${severity}\nConfidence: ${confidence}%\nDate: ${new Date().toLocaleDateString()}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    alert('Report download functionality would be implemented here');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2D9596', '#3AAFB0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Analysis Results</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Result Card */}
        <View style={styles.resultCard}>
          {/* Image with Badge */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.badgeContainer}>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(severity) }]}>
                <Text style={styles.severityText}>{severity}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            {/* Status Banner */}
            <View style={[
              styles.statusBanner,
              {
                backgroundColor: isHealthy
                  ? 'rgba(52, 168, 83, 0.1)'
                  : isSevere
                  ? 'rgba(234, 67, 53, 0.1)'
                  : 'rgba(249, 168, 38, 0.1)'
              }
            ]}>
              <Ionicons
                name={isHealthy ? 'checkmark-circle' : 'alert-circle'}
                size={24}
                color={isHealthy ? '#34A853' : isSevere ? '#EA4335' : '#F9A826'}
              />
              <View style={styles.statusTextContainer}>
                <Text style={[
                  styles.statusTitle,
                  { color: isHealthy ? '#34A853' : isSevere ? '#EA4335' : '#F9A826' }
                ]}>
                  {isHealthy
                    ? 'No Diabetic Retinopathy Detected'
                    : isSevere
                    ? 'Immediate Medical Attention Recommended'
                    : 'Follow-up Recommended'}
                </Text>
                <Text style={styles.statusDescription}>
                  {severityDescriptions[severity]}
                </Text>
              </View>
            </View>

            {/* Confidence Score */}
            <View style={styles.confidenceSection}>
              <Text style={styles.sectionLabel}>Confidence Score</Text>
              <View style={styles.confidenceRow}>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${confidence}%`, backgroundColor: '#2D9596' }
                    ]} 
                  />
                </View>
                <Text style={styles.confidenceValue}>{confidence}%</Text>
              </View>
            </View>

            {/* Severity Level Indicator */}
            <View style={styles.severitySection}>
              <Text style={styles.sectionLabel}>Severity Level</Text>
              <View style={styles.severityBar}>
                <View style={[styles.severityDot, { backgroundColor: '#34A853' }]}>
                  {severity === 'No DR' && <View style={styles.activeDot} />}
                </View>
                <View style={[styles.severityLine, { backgroundColor: severity !== 'No DR' ? '#2D9596' : '#E8EFEF' }]} />
                
                <View style={[styles.severityDot, { backgroundColor: '#FFCC00' }]}>
                  {severity === 'Mild' && <View style={styles.activeDot} />}
                </View>
                <View style={[styles.severityLine, { backgroundColor: severity === 'Moderate' || severity === 'Severe' || severity === 'Proliferative DR' ? '#2D9596' : '#E8EFEF' }]} />
                
                <View style={[styles.severityDot, { backgroundColor: '#F9A826' }]}>
                  {severity === 'Moderate' && <View style={styles.activeDot} />}
                </View>
                <View style={[styles.severityLine, { backgroundColor: severity === 'Severe' || severity === 'Proliferative DR' ? '#2D9596' : '#E8EFEF' }]} />
                
                <View style={[styles.severityDot, { backgroundColor: '#EA4335' }]}>
                  {(severity === 'Severe' || severity === 'Proliferative DR') && <View style={styles.activeDot} />}
                </View>
              </View>
            </View>

            {/* Date */}
            <View style={styles.dateSection}>
              <Text style={styles.sectionLabel}>Analysis Date</Text>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={saveToHistory}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2D9596', '#3AAFB0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {isSaving ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.primaryButtonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Save to History</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleDownload}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={20} color="#2D9596" />
              <Text style={styles.secondaryButtonText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={shareResult}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={20} color="#2D9596" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          This analysis is for screening purposes only and should not replace
          professional medical diagnosis. Please consult an ophthalmologist for
          confirmed results.
        </Text>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#2D9596',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8EFEF',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  severityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  detailsContainer: {
    padding: 20,
    gap: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  confidenceSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D9596',
  },
  severitySection: {
    gap: 8,
  },
  severityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  severityDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  severityLine: {
    flex: 1,
    height: 4,
    marginHorizontal: 4,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EFEF',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8EFEF',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D9596',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});
