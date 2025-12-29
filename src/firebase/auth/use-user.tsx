'use client';
import { useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/firebase';

export interface UserAuthHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export function useUser(): UserAuthHookResult {
  const auth = useAuth();
  const [userAuthState, setUserAuthState] = useState<UserAuthHookResult>({
    user: auth.currentUser, // Initialize with current user if available
    isUserLoading: !auth.currentUser, // If no user, we are likely loading
    userError: null,
  });

  useEffect(() => {
    // If there's no auth instance, we can't do anything.
    if (!auth) {
       setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not available.") });
       return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => {
        console.error("useUser: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]); // Re-run effect if auth instance changes

  return userAuthState;
}
