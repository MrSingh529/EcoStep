
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, getDoc, setDoc, updateDoc, writeBatch, limit, arrayUnion, where, deleteDoc } from 'firebase/firestore';
import { differenceInCalendarDays } from 'date-fns';
import type { ActivityData } from '@/lib/calculations';

// A type that mirrors ActivityData but uses Firestore's Timestamp for date handling
interface ActivityDocument extends Omit<ActivityData, 'date'> {
    date: Timestamp;
}

export interface UserProfile {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    createdAt: string;
    onboardingCompleted: boolean;
    baselineCo2?: number;
    country?: string;
    currency?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    birthYear?: number;
    level: number;
    xp: number;
    dailyStreak: number;
    lastActivityDate?: string;
    joinedChallenges?: string[];
    avatarId?: string;
}

const XP_PER_LOG = 25;
const calculateRequiredXp = (level: number) => Math.floor(level * level * 100);

/**
 * Creates or updates a user's profile in the `users` collection.
 * Uses set with merge to avoid overwriting existing fields.
 * @param userId The ID of the user.
 * @param data The data to set or merge.
 */
export async function setOrMergeUserProfile(userId: string, data: Partial<Omit<UserProfile, 'uid'>>) {
    if (!db) throw new Error("Firestore is not initialized.");
    const userDocRef = doc(db, 'users', userId);
    const profileData = {
        ...data,
        level: data.level || 1,
        xp: data.xp || 0,
        dailyStreak: data.dailyStreak || 0,
        joinedChallenges: data.joinedChallenges || [],
        avatarId: data.avatarId || "sprout",
    }
    await setDoc(userDocRef, profileData, { merge: true });
}

/**
 * Creates or updates a user's profile in the `users` collection.
 * @param userId The ID of the user.
 * @param data The data to update.
 */
export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
    if (!db) throw new Error("Firestore is not initialized.");
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, data);
}


/**
 * Retrieves a user's profile from Firestore.
 * @param userId The ID of the user.
 * @returns The user profile data or null if not found.
 */
export async function getUserProfile(userId: string): Promise<Omit<UserProfile, 'uid'> | null> {
    if (!db) throw new Error("Firestore is not initialized.");
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        return docSnap.data() as Omit<UserProfile, 'uid'>;
    } else {
        return null;
    }
}


/**
 * Saves a user's activity data and updates their gamification stats.
 * @param userId The ID of the logged-in user.
 * @param activityData The activity data from the form.
 * @returns A promise that resolves with the gamification update object.
 */
export async function saveActivity(userId: string, activityData: Omit<ActivityData, 'date'>): Promise<Partial<UserProfile> | null> {
    if (!db || !userId) {
        throw new Error('Firestore is not initialized or user is not logged in.');
    }
    
    const batch = writeBatch(db);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    // 1. Add new activity document
    const activitiesRef = collection(db, 'users', userId, 'activities');
    const newActivityRef = doc(activitiesRef);
    const docToSave = {
        ...activityData,
        date: Timestamp.fromDate(today),
    };
    batch.set(newActivityRef, docToSave);
    
    // 2. Update user profile with gamification stats
    const userRef = doc(db, 'users', userId);
    const userProfile = await getUserProfile(userId);

    let profileUpdate: Partial<UserProfile> | null = null;

    if (userProfile) {
        // Daily Streak Logic
        const lastDate = userProfile.lastActivityDate ? new Date(userProfile.lastActivityDate) : null;
        let newStreak = userProfile.dailyStreak || 0;
        if (lastDate) {
            lastDate.setHours(0, 0, 0, 0); // Normalize
            const daysDiff = differenceInCalendarDays(today, lastDate);
            if (daysDiff === 1) {
                newStreak += 1; // It was yesterday, increment streak
            } else if (daysDiff > 1) {
                newStreak = 1; // It was not yesterday, reset streak
            }
            // if daysDiff is 0, do nothing, streak remains same
        } else {
            newStreak = 1; // First ever log
        }
        
        // XP and Level Logic
        let newXp = (userProfile.xp || 0) + XP_PER_LOG;
        let newLevel = userProfile.level || 1;
        let requiredXp = calculateRequiredXp(newLevel);
        
        if (newXp >= requiredXp) {
            newLevel += 1;
            newXp = newXp - requiredXp; // Reset XP for new level
        }

        profileUpdate = {
            xp: newXp,
            level: newLevel,
            dailyStreak: newStreak,
            lastActivityDate: today.toISOString(),
        };
        batch.update(userRef, profileUpdate);
    }

    // Commit all changes atomically
    await batch.commit();
    return profileUpdate;
}

/**
 * Retrieves all activities for a given user, ordered by date.
 * @param userId The ID of the logged-in user.
 * @returns A promise that resolves to an array of ActivityData.
 */
export async function getActivities(userId:string): Promise<ActivityData[]> {
    if (!db || !userId) {
        console.error('Firestore not available or user not logged in.');
        return [];
    }
    const activitiesCol = collection(db, 'users', userId, 'activities');
    const q = query(activitiesCol, orderBy('date', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    // Map Firestore documents to the app's ActivityData type, converting Timestamps to ISO strings
    return snapshot.docs.map(doc => {
        const data = doc.data() as ActivityDocument;
        return {
            ...data,
            date: data.date.toDate().toISOString(),
        } as ActivityData;
    });
}

/**
 * Retrieves top users for the leaderboard.
 * @returns A promise that resolves to an array of simplified user profiles.
 */
export async function getLeaderboardUsers(): Promise<UserProfile[]> {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const usersCol = collection(db, 'users');
  const q = query(usersCol, where('xp', '>', 0), orderBy('xp', 'desc'), limit(5));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
}


/**
 * Adds a challenge ID to a user's list of joined challenges.
 * @param userId The ID of the user.
 * @param challengeId The ID of the challenge to join.
 */
export async function updateUserJoinedChallenges(userId: string, challengeId: string) {
    if (!db) throw new Error("Firestore is not initialized.");
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
        joinedChallenges: arrayUnion(challengeId)
    });
}


/**
 * Deletes a user's profile and all their sub-collection data from Firestore.
 * @param userId The ID of the user to delete.
 */
export async function deleteUserAndData(userId: string) {
  if (!db) throw new Error("Firestore is not initialized.");

  const batch = writeBatch(db);

  // 1. Delete all documents in the 'activities' sub-collection
  const activitiesCol = collection(db, 'users', userId, 'activities');
  const activitiesSnapshot = await getDocs(activitiesCol);
  activitiesSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // 2. Delete the main user profile document
  const userDocRef = doc(db, 'users', userId);
  batch.delete(userDocRef);

  // Commit the batch
  await batch.commit();
}
