
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getUserProfile, setOrMergeUserProfile, updateUserProfile as updateUserProfileInDb, updateUserJoinedChallenges } from "@/lib/firestore-service";

// Extend the Firebase User type to include our custom fields
export interface User extends FirebaseUser {
  onboardingCompleted?: boolean;
  baselineCo2?: number;
  country?: string;
  currency?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthYear?: number;
  level?: number;
  xp?: number;
  dailyStreak?: number;
  lastActivityDate?: string;
  joinedChallenges?: string[];
  avatarId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isFirebaseConfigured = !!auth;

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);

        if (userProfile) {
          // User profile exists, combine it with firebase user data
          setUser({ ...firebaseUser, ...userProfile });
        } else {
          // This is a new user (e.g., first time with Google), create their profile
          const newUserProfile = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            createdAt: new Date().toISOString(),
            onboardingCompleted: false,
            level: 1,
            xp: 0,
            dailyStreak: 0,
            joinedChallenges: [],
            avatarId: "sprout",
          };
          await setOrMergeUserProfile(firebaseUser.uid, newUserProfile);
          setUser({ ...firebaseUser, ...newUserProfile });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [isFirebaseConfigured]);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      alert("Authentication is disabled because Firebase is not configured.");
      console.error("Firebase is not configured. Cannot sign in.");
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // After creating the user in Auth, create their profile document in Firestore
    const newUserProfile = {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        createdAt: new Date().toISOString(),
        onboardingCompleted: false,
        level: 1,
        xp: 0,
        dailyStreak: 0,
        joinedChallenges: [],
        avatarId: "sprout",
    };
    await setOrMergeUserProfile(userCredential.user.uid, newUserProfile);
    setUser({ ...userCredential.user, ...newUserProfile });
  };
  
  const sendPasswordReset = async (email: string) => {
    if (!auth) throw new Error("Firebase not configured");
    await sendPasswordResetEmail(auth, email);
  }

  const signOut = async () => {
    if (!isFirebaseConfigured) {
      console.error("Firebase is not configured. Cannot sign out.");
      return;
    }
    try {
      await firebaseSignOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const updateUser = async (data: Partial<User>) => {
    if (!user || !auth) {
      console.warn("Cannot update profile: no user is signed in.");
      return;
    }
    
    // If the user object in auth is available, update it.
    if (auth.currentUser && data.displayName && data.displayName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
    }

    // Update the database
    await updateUserProfileInDb(user.uid, data);
    
    // Update the local state immediately
    setUser(currentUser => {
      if (!currentUser) return null;
      return { ...currentUser, ...data };
    });
  };
  
  const joinChallenge = async (challengeId: string) => {
    if (!user) throw new Error("User not logged in");
    
    await updateUserJoinedChallenges(user.uid, challengeId);
    
    // Update local state for immediate UI feedback
    setUser(currentUser => {
        if (!currentUser) return null;
        const newChallenges = [...(currentUser.joinedChallenges || []), challengeId];
        return { ...currentUser, joinedChallenges: newChallenges };
    });
  }

  const value = { user, isLoading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, updateUser, joinChallenge, isFirebaseConfigured, sendPasswordReset };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
