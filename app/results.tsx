import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type SeverityLevel = 'No DR' | 'Mild' | 'Moderate' | 'Severe' | 'Proliferative DR';

const severityDescriptions = {
  'No DR': 'No signs of diabetic retinopathy detected.',
  'Mild': 'Early signs of diabetic retinopathy. Monitor regularly.',
  'Moderate': 'Moderate diabetic retinopathy detected. Consult your doctor.',
  'Severe': 'Severe diabetic retinopathy. Immediate medical attention recommended.',
  'Proliferative DR': 'Advanced diabetic retinopathy. Urgent medical care required.'
};

const severityDetails = {
  'No DR': {
    title: 'No Diabetic Retinopathy',
    description: 'Your retinal scan shows no signs of diabetic retinopathy. Continue regular eye checkups.',
    action: 'Schedule annual eye exams'
  },
  'Mild': {
    title: 'Mild Non-Proliferative DR',
    description: 'Small areas of balloon-like swelling in blood vessels (microaneurysms). Early intervention can prevent progression.',
    action: 'Follow-up in 6-12 months'
  },
  'Moderate': {
    title: 'Moderate Non-Proliferative DR',
    description: 'Blood vessels nourishing the retina are blocked. This can lead to more severe forms without treatment.',
    action: 'Ophthalmologist consultation required'
  },
  'Severe': {
    title: 'Severe Non-Proliferative DR',
    description: 'Many blood vessels are blocked, depriving areas of the retina of blood supply. High risk of progression.',
    action: 'Immediate specialist referral needed'
  },
  'Proliferative DR': {
    title: 'Proliferative Diabetic Retinopathy',
    description: 'Advanced stage with new abnormal blood vessels growing. Can cause serious vision loss or blindness.',
    action: 'Urgent treatment required'
  }
};

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const imageUri = params.imageUri as string;
  const [isSaving, setIsSaving] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Get severity and confidence from params if available (from history), otherwise use simulated values
  const severity: SeverityLevel = (params.severity as SeverityLevel) || 'Moderate';
  const confidence = params.confidence ? parseFloat(params.confidence as string) : 87.5;
  const analysisDate = params.date ? new Date(params.date as string) : new Date();

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

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
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
            {/* LARGE SEVERITY BOX - HERO SECTION */}
            <LinearGradient
              colors={[
                getSeverityColor(severity),
                getSeverityColor(severity) + 'DD'
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroSeverityBox}
            >
              <View style={styles.heroSeverityContent}>
                <Ionicons
                  name={isHealthy ? 'checkmark-circle' : 'alert-circle'}
                  size={56}
                  color="#fff"
                />
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroSeverityLabel}>Severity Level</Text>
                  <Text style={styles.heroSeverityTitle}>{severityDetails[severity].title}</Text>
                  <Text style={styles.heroSeverityBadge}>{severity}</Text>
                </View>
              </View>
              <View style={styles.heroActionBox}>
                <Ionicons name="calendar" size={18} color="#fff" />
                <Text style={styles.heroActionText}>{severityDetails[severity].action}</Text>
              </View>
            </LinearGradient>

            {/* Decorative Separator */}
            <View style={styles.decorativeSeparator}>
              <View style={styles.separatorLine} />
              <Ionicons name="analytics" size={18} color="#2D9596" />
              <View style={styles.separatorLine} />
            </View>

            {/* CIRCULAR CONFIDENCE SCORE */}
            <View style={styles.confidenceSection}>
              <Text style={styles.largeSectionLabel}>AI Confidence Score</Text>
              <View style={styles.circularProgressContainer}>
                <Svg width={180} height={180}>
                  {/* Background Circle */}
                  <Circle
                    cx={90}
                    cy={90}
                    r={75}
                    stroke="#E8EFEF"
                    strokeWidth={12}
                    fill="none"
                  />
                  {/* Progress Circle */}
                  <Circle
                    cx={90}
                    cy={90}
                    r={75}
                    stroke="#2D9596"
                    strokeWidth={12}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 75}`}
                    strokeDashoffset={2 * Math.PI * 75 * (1 - confidence / 100)}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="90, 90"
                  />
                </Svg>
                <View style={styles.circularProgressText}>
                  <Text style={styles.confidencePercentage}>{confidence}%</Text>
                  <Text style={styles.confidenceLabel}>Accuracy</Text>
                </View>
              </View>
            </View>

            {/* Decorative Separator */}
            <View style={styles.decorativeSeparator}>
              <View style={styles.separatorLine} />
              <Ionicons name="information-circle" size={18} color="#2D9596" />
              <View style={styles.separatorLine} />
            </View>

            {/* Severity Description Card */}
            <View style={styles.severityDetailCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(249, 168, 38, 0.1)' }]}>
                  <Ionicons name="document-text" size={22} color="#F9A826" />
                </View>
                <Text style={styles.largeSectionLabel}>What This Means</Text>
              </View>
              <Text style={styles.severityDetailDescription}>{severityDetails[severity].description}</Text>
            </View>

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
                name={isHealthy ? 'checkmark-circle' : 'warning'}
                size={28}
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

            {/* Decorative Separator */}
            <View style={styles.decorativeSeparator}>
              <View style={styles.separatorLine} />
              <Ionicons name="time" size={18} color="#2D9596" />
              <View style={styles.separatorLine} />
            </View>

            {/* Date */}
            <View style={styles.dateSection}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(107, 114, 128, 0.1)' }]}>
                  <Ionicons name="calendar-outline" size={22} color="#6B7280" />
                </View>
                <Text style={styles.largeSectionLabel}>Analysis Date</Text>
              </View>
              <Text style={styles.dateText}>
                {analysisDate.toLocaleDateString('en-US', {
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

          {/* Find Ophthalmologist Button - Show if DR detected */}
          {severity !== 'No DR' && (
            <TouchableOpacity
              style={styles.recommendButton}
              onPress={() => router.push({
                pathname: '/ophthalmologists',
                params: { severity }
              })}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#34A853', '#45C464']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Ionicons name="location" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Find Ophthalmologist</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

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
      </Animated.View>
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
    aspectRatio: 1,
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
  heroSeverityBox: {
    padding: 24,
    borderRadius: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  heroSeverityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroTextContainer: {
    flex: 1,
    gap: 4,
  },
  heroSeverityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroSeverityTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 28,
  },
  heroSeverityBadge: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroActionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  heroActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  circularProgressText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidencePercentage: {
    fontSize: 44,
    fontWeight: '800',
    color: '#2D9596',
  },
  confidenceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  largeSectionLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 18,
    borderRadius: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  confidenceSection: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  decorativeSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8EFEF',
  },
  severityDetailCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8EFEF',
  },
  severityHeaderText: {
    flex: 1,
    gap: 4,
  },
  severityDetailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  severityDetailBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9A826',
  },
  severityDetailDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(45, 149, 150, 0.05)',
    padding: 10,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D9596',
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
  dateSection: {
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 50,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  recommendButton: {
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
