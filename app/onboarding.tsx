import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  color1: string;
  color2: string;
  points?: { icon: string; text: string }[];
  disclaimer?: boolean;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Early Diabetic Retinopathy',
    subtitle: 'Screening',
    icon: 'eye',
    description: 'Detect early signs of diabetic retinopathy using AI-powered retinal image analysis — directly from your phone.',
    color1: '#2D9596',
    color2: '#1E7A7B',
  },
  {
    id: '2',
    title: 'How It Works',
    subtitle: 'Upload → Analyze → Review',
    icon: 'layers',
    description: 'Results are generated within seconds.',
    color1: '#2D9596',
    color2: '#1E7A7B',
    points: [
      { icon: 'camera', text: 'Upload a retinal fundus image' },
      { icon: 'analytics', text: 'AI analyzes the image securely' },
      { icon: 'stats-chart', text: 'Get severity level & confidence score' },
      { icon: 'people', text: 'Consult with doctors' },
    ],
  },
  {
    id: '3',
    title: 'Medical Disclaimer',
    subtitle: 'Important Notice',
    icon: 'warning',
    description: 'This application is intended for screening purposes only and does not replace professional medical diagnosis.',
    color1: '#2D9596',
    color2: '#1E7A7B',
    disclaimer: true,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Complete onboarding and go to home
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      router.replace('/login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/login');
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      router.replace('/login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/login');
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(index);
  };

  const videoSource = require('../assets/videos/onboarding-background.mp4');
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <LinearGradient
      colors={[`${item.color1}40`, `${item.color2}40`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.slide}
    >
      <View style={styles.slideContent}>
        {/* Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                {
                  scale: scrollX.interpolate({
                    inputRange: [
                      (slides.indexOf(item) - 1) * width,
                      slides.indexOf(item) * width,
                      (slides.indexOf(item) + 1) * width,
                    ],
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name={item.icon as any} size={70} color="#fff" />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>{item.title}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        {/* Description */}
        <Text style={styles.description}>{item.description}</Text>

        {/* Points */}
        {item.points && (
          <View style={styles.pointsContainer}>
            {item.points.map((point, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.point,
                  {
                    opacity: scrollX.interpolate({
                      inputRange: [
                        (slides.indexOf(item) - 1) * width,
                        slides.indexOf(item) * width,
                        (slides.indexOf(item) + 1) * width,
                      ],
                      outputRange: [0, 1, 0],
                      extrapolate: 'clamp',
                    }),
                    transform: [
                      {
                        translateY: scrollX.interpolate({
                          inputRange: [
                            (slides.indexOf(item) - 1) * width,
                            slides.indexOf(item) * width,
                            (slides.indexOf(item) + 1) * width,
                          ],
                          outputRange: [20, 0, -20],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons
                  name={point.icon as any}
                  size={24}
                  color="#fff"
                  style={styles.pointIcon}
                />
                <Text style={styles.pointText}>{point.text}</Text>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Disclaimer Checkbox */}
        {item.disclaimer && (
          <TouchableOpacity
            style={styles.disclaimerCheckbox}
            onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, disclaimerAccepted && styles.checkboxChecked]}>
              {disclaimerAccepted && (
                <Ionicons name="checkmark" size={18} color="#fff" />
              )}
            </View>
            <Text style={styles.disclaimerCheckboxText}>
              I understand this is not a medical diagnosis
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );

  const progressPercentage = ((currentIndex + 1) / slides.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Background - Single instance for all slides */}
      <VideoView
        player={player}
        style={styles.videoBackground}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled
        bounces={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      />

      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: currentIndex === index ? 24 : 8,
                opacity: currentIndex === index ? 1 : 0.5,
              },
            ]}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          slides[currentIndex].disclaimer && !disclaimerAccepted && styles.nextButtonDisabled
        ]}
        onPress={handleNext}
        activeOpacity={0.8}
        disabled={slides[currentIndex].disclaimer && !disclaimerAccepted}
      >
        <View style={styles.nextButtonContent}>
          <Text style={[
            styles.nextButtonText,
            slides[currentIndex].disclaimer && !disclaimerAccepted && styles.nextButtonTextDisabled
          ]}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <Ionicons
            name={
              currentIndex === slides.length - 1
                ? 'checkmark-circle'
                : 'arrow-forward'
            }
            size={20}
            color={slides[currentIndex].disclaimer && !disclaimerAccepted ? '#999' : '#2D9596'}
            style={styles.nextButtonIcon}
          />
        </View>
      </TouchableOpacity>

      {/* Skip to Login Button */}
      <TouchableOpacity
        style={styles.skipToLoginButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.skipToLoginText}>Skip to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D9596',
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  slide: {
    width,
    height: height * 0.72,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pointsContainer: {
    marginTop: 8,
    width: '100%',
    maxHeight: 200,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pointIcon: {
    marginRight: 14,
    minWidth: 24,
  },
  pointText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    flexWrap: 'wrap',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  nextButton: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  nextButtonContent: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#2D9596',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
  nextButtonIcon: {
    marginLeft: 4,
  },
  disclaimerCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#fff',
  },
  disclaimerCheckboxText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  skipToLoginButton: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  skipToLoginText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
