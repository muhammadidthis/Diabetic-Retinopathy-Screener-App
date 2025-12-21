import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';

// Roboflow API Configuration
const ROBOFLOW_API_URL = 'https://serverless.roboflow.com/diabetic-retinopathy-gmqiq/2';
const ROBOFLOW_API_KEY = 'T2UrN530gJ5phQwdrMzW';

// Type definitions
export interface AnalysisResult {
  severity: string;
  confidence: number;
  imageUri: string;
  date: string;
}

interface RoboflowResponse {
  inference_id: string;
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: {
    class: string;
    class_id: number;
    confidence: number;
  }[];
  top: string;
  confidence: number;
}

// Severity mapping from API format to display format
const SEVERITY_MAPPING: { [key: string]: string } = {
  'No_DR': 'No DR',
  'Mild': 'Mild',
  'Moderate': 'Moderate',
  'Severe': 'Severe',
  'Proliferative_DR': 'Proliferative DR',
  'Proliferate_DR': 'Proliferative DR',  // Alternative API response format
};

/**
 * Converts image URI to base64 string
 * @param imageUri - Local file URI of the image
 * @returns Base64 encoded string
 */
async function convertImageToBase64(imageUri: string): Promise<string> {
  console.log('Step 1: Converting image to base64...');
  
  const base64Image = await FileSystem.readAsStringAsync(imageUri, {
    encoding: 'base64',
  });
  
  console.log('✓ Image converted to base64. Length:', base64Image.length, 'characters');
  console.log('First 100 chars:', base64Image.substring(0, 100) + '...');
  
  return base64Image;
}

/**
 * Calls Roboflow API to analyze retinal image
 * @param base64Image - Base64 encoded image string
 * @returns API response data
 */
async function callRoboflowAPI(base64Image: string): Promise<RoboflowResponse> {
  console.log('Step 2: Calling Roboflow API...');
  console.log('API URL:', ROBOFLOW_API_URL);
  
  const response = await axios({
    method: 'POST',
    url: ROBOFLOW_API_URL,
    params: { api_key: ROBOFLOW_API_KEY },
    data: base64Image,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  console.log('✓ API Response received!');
  console.log('Full Response Data:', JSON.stringify(response.data, null, 2));
  
  return response.data;
}

/**
 * Main function to analyze a retinal image for diabetic retinopathy
 * @param imageUri - Local file URI of the image to analyze
 * @param onProgress - Callback for progress updates
 * @returns Analysis result with severity, confidence, and metadata
 */
export async function analyzeRetinalImage(
  imageUri: string,
  onProgress?: (step: string) => void
): Promise<AnalysisResult> {
  console.log('========== ANALYSIS STARTED ==========');
  console.log('Image URI:', imageUri);
  
  try {
    // Step 1: Convert image to base64
    onProgress?.('Converting image to base64...');
    const base64Image = await convertImageToBase64(imageUri);

    // Step 2: Call Roboflow API
    onProgress?.('Sending to AI model...');
    const apiResponse = await callRoboflowAPI(base64Image);
    
    // Step 3: Process results
    onProgress?.('Processing results...');
    const { top, confidence } = apiResponse;
    
    // Map API response to display format
    const displaySeverity = SEVERITY_MAPPING[top] || top;
    
    console.log('Extracted Data:');
    console.log('  - Severity (API):', top);
    console.log('  - Severity (Display):', displaySeverity);
    console.log('  - Confidence:', confidence);
    console.log('  - Confidence %:', (confidence * 100).toFixed(1));
    
    console.log('========== ANALYSIS COMPLETED ==========\n');
    
    return {
      severity: displaySeverity,
      confidence: parseFloat((confidence * 100).toFixed(1)),
      imageUri,
      date: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('========== ANALYSIS FAILED ==========');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    
    if (error.response) {
      console.error('API Response Error:');
      console.error('  - Status:', error.response.status);
      console.error('  - Status Text:', error.response.statusText);
      console.error('  - Data:', JSON.stringify(error.response.data, null, 2));
      console.error('  - Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.error('No Response Received:');
      console.error('  - Request:', error.request);
    } else {
      console.error('Error Setting Up Request:', error.message);
    }
    
    console.error('Full Error Object:', JSON.stringify(error, null, 2));
    console.error('========== ERROR END ==========\n');
    
    throw error;
  }
}
