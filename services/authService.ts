import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Type definitions
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  specialty?: string;
  phone?: string;
  createdAt: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  console.log('========== SIGNUP STARTED ==========');
  console.log('Email:', email);
  console.log('Display Name:', displayName);

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✓ User account created:', user.uid);

    // Update profile with display name
    await updateProfile(user, { displayName });
    console.log('✓ Profile updated with display name');

    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log('✓ User profile saved to Firestore');

    console.log('========== SIGNUP COMPLETED ==========\n');
    return userCredential;
  } catch (error: any) {
    console.error('========== SIGNUP FAILED ==========');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('========== ERROR END ==========\n');
    throw error;
  }
}

/**
 * Sign in existing user with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  console.log('========== LOGIN STARTED ==========');
  console.log('Email:', email);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✓ User logged in:', userCredential.user.uid);
    console.log('========== LOGIN COMPLETED ==========\n');
    return userCredential;
  } catch (error: any) {
    console.error('========== LOGIN FAILED ==========');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('========== ERROR END ==========\n');
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function logOut(): Promise<void> {
  console.log('========== LOGOUT STARTED ==========');
  try {
    await signOut(auth);
    console.log('✓ User logged out');
    console.log('========== LOGOUT COMPLETED ==========\n');
  } catch (error: any) {
    console.error('========== LOGOUT FAILED ==========');
    console.error('Error:', error.message);
    console.error('========== ERROR END ==========\n');
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  console.log('========== PASSWORD RESET STARTED ==========');
  console.log('Email:', email);

  try {
    await sendPasswordResetEmail(auth, email);
    console.log('✓ Password reset email sent');
    console.log('========== PASSWORD RESET COMPLETED ==========\n');
  } catch (error: any) {
    console.error('========== PASSWORD RESET FAILED ==========');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('========== ERROR END ==========\n');
    throw error;
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, updates, { merge: true });
    console.log('✓ User profile updated');
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Get Firebase error message in user-friendly format
 */
export function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/invalid-credential': 'Invalid email or password.',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}
