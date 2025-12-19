import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const captureInstructions = [
  'Ensure good lighting conditions',
  'Position the eye at center of frame',
  'Keep the camera steady',
  'Avoid reflections and glare',
];

export default function CaptureScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [mode, setMode] = useState<'capture' | 'upload'>('capture');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(cameraPermission.granted && mediaPermission.granted);
    return cameraPermission.granted && mediaPermission.granted;
  };

  const captureImage = async () => {
    // Navigate to custom camera screen
    router.push('/camera');
  };

  const pickImage = async () => {
    const permitted = hasPermission || await requestPermissions();
    
    if (!permitted) {
      Alert.alert('Permission Required', 'Media library access is needed to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please capture or upload an image first.');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
    
    // Navigate to results page with the image
    router.push({
      pathname: '/results',
      params: { imageUri: selectedImage }
    });
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2D9596', '#3AAFB0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Scan Retina</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'capture' && styles.modeButtonActive]}
            onPress={() => setMode('capture')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="camera" 
              size={16} 
              color={mode === 'capture' ? '#2D9596' : '#6B7280'} 
            />
            <Text style={[styles.modeButtonText, mode === 'capture' && styles.modeButtonTextActive]}>
              Capture
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'upload' && styles.modeButtonActive]}
            onPress={() => setMode('upload')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="cloud-upload-outline" 
              size={16} 
              color={mode === 'upload' ? '#2D9596' : '#6B7280'} 
            />
            <Text style={[styles.modeButtonText, mode === 'upload' && styles.modeButtonTextActive]}>
              Upload
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview Area */}
        <View style={styles.previewArea}>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearImage}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
              <View style={styles.readyBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.readyText}>Image ready for analysis</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyPreview}>
              <View style={styles.emptyIcon}>
                <Ionicons 
                  name={mode === 'capture' ? 'camera' : 'cloud-upload-outline'} 
                  size={40} 
                  color="#2D9596" 
                />
              </View>
              <Text style={styles.emptyTitle}>
                {mode === 'capture' ? 'Capture Retinal Image' : 'Upload Retinal Image'}
              </Text>
              <Text style={styles.emptyText}>
                {mode === 'capture'
                  ? 'Use your camera to capture a retinal scan'
                  : 'Select an image from your device'}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {!selectedImage && (
          <View style={styles.actionButtons}>
            {mode === 'capture' ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={captureImage}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#2D9596', '#3AAFB0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Open Camera</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#2D9596', '#3AAFB0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Choose Image</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Analyze Button */}
        {selectedImage && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={analyzeImage}
            disabled={isAnalyzing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2D9596', '#3AAFB0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {isAnalyzing ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.primaryButtonText}>Analyzing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Analyze Image</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <Ionicons name="alert-circle-outline" size={20} color="#2D9596" />
            <Text style={styles.instructionsTitle}>Capture Guidelines</Text>
          </View>
          <View style={styles.instructionsList}>
            {captureInstructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.bullet} />
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modeButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#2D9596',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  modeButtonTextActive: {
    color: '#2D9596',
    fontWeight: '600',
  },
  previewArea: {
    marginTop: 8,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#34A853',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  readyText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  emptyPreview: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8EFEF',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(45, 149, 150, 0.05)',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(45, 149, 150, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: 8,
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
  instructionsCard: {
    backgroundColor: 'rgba(45, 149, 150, 0.05)',
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  instructionsList: {
    gap: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2D9596',
  },
  instructionText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#E6F4FE',
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
  },
  uploadButton: {
    backgroundColor: '#34C759',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  previewContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
