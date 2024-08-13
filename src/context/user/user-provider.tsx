import React, { useMemo, useCallback, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, updateProfile } from 'firebase/auth';
// utils
import { fEncrypt } from '/src/utils/format-encrypt';
// firebase
import { fbAuth, fbFirestore } from '/src/firebase';
// hooks
import { useLocalStorage } from '/src/hooks/use-local-storage';
// config-global
import { USER_KEY } from '/src/config-global';
// interfaces
import { PayloadLoginEmailAuthInterface, PayloadRegisterAuthInterface, PayloadUpdateAuthInterface } from '/src/interfaces/authentication';
//
import { UserContext } from './user-context';

// ----------------------------------------------------------------------

type Value = string | number | object | boolean | any[] | null;

interface InitialState {
  isLoading: boolean;
  user: string;
}

interface UserProviderProps {
  children: React.ReactNode;
}

export interface UseContextProps {
  isLoading: boolean;
  user: string;
  onLoginEmail: (payload: PayloadLoginEmailAuthInterface) => Promise<void>;
  onRegister: (payload: PayloadRegisterAuthInterface) => Promise<void>;
  onUpdate: (payload: PayloadUpdateAuthInterface) => Promise<void>;
  onLoginGoogle: () => Promise<void>;
  onLogout: () => void;
  onReset: () => void;
}

// ----------------------------------------------------------------------

const initialState: InitialState = {
  isLoading: true,
  user: '',
};

// ----------------------------------------------------------------------

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { state, update, reset } = useLocalStorage(USER_KEY, initialState) as { state: InitialState; update: (name: string, updateValue: Value) => void; reset: () => void };

  // ----------------------------------------------------------------------

  // AUTO UPDATE ISLOADING
  useEffect(() => {
    const autoUpdateIsLoading = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      update('isLoading', false);
    };

    autoUpdateIsLoading();
  }, [update]);

  // ----------------------------------------------------------------------

  // LOGIN EMAIL
  const onLoginEmail = useCallback(
    async ({ email, password }: PayloadLoginEmailAuthInterface) => {
      try {
        const userCredential = await signInWithEmailAndPassword(fbAuth, email, password);

        const { user } = userCredential;

        if (user) {
          const accessToken = await user.getIdToken();

          const encrypted = fEncrypt(user, USER_KEY);

          sessionStorage.setItem('accessToken', accessToken);
          update('user', encrypted);
        }

        update('isLoading', false);
      } catch (error: any) {
        update('isLoading', false);
        throw new Error(error);
      }
    },
    [update]
  );

  // LOGIN & REGISTER GOOGLE
  const onLoginGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();

      const userCredential = await signInWithPopup(fbAuth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(userCredential);

      const { user } = userCredential;

      if (credential) {
        const { accessToken } = credential;

        const encrypted = fEncrypt(user, USER_KEY);

        sessionStorage.setItem('accessToken', accessToken!);
        update('user', encrypted);
        update('isLoading', false);
      }
    } catch (error: any) {
      update('isLoading', false);
      throw new Error(error);
    }
  }, [update]);

  // REGISTER
  const onRegister = useCallback(
    async (payload: PayloadRegisterAuthInterface) => {
      try {
        const response = await createUserWithEmailAndPassword(fbAuth, payload.email, payload.password);

        const { user } = response;

        await updateProfile(user, {
          displayName: payload.fullName,
        });

        await addDoc(collection(fbFirestore, 'users'), {
          userId: user.uid,
          studentId: payload.studentId || '',
          role: payload.role,
          phoneNumber: payload.phoneNumber || '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        onLoginEmail({ email: payload.email, password: payload.password });
        update('isLoading', false);
      } catch (error: any) {
        update('isLoading', false);
        throw new Error(error);
      }
    },
    [onLoginEmail, update]
  );

  // UPDATE
  const onUpdate = useCallback(
    async (payload: PayloadUpdateAuthInterface) => {
      try {
        const dbUser = payload?.currentUser?.databaseUsers;

        if (dbUser) {
          await updateProfile(fbAuth.currentUser!, {
            displayName: payload?.fullName,
          });

          await updateDoc(doc(fbFirestore, 'users', dbUser?.id), {
            userId: payload?.currentUser.uid,
            studentId: payload?.studentId || '',
            role: payload?.role,
            phoneNumber: payload?.phoneNumber || '',
            updatedAt: Date.now(),
          });
        } else {
          await updateProfile(fbAuth.currentUser!, {
            displayName: payload?.fullName,
          });

          await addDoc(collection(fbFirestore, 'users'), {
            userId: payload?.currentUser.uid,
            studentId: payload?.studentId || '',
            role: payload?.role,
            phoneNumber: payload?.phoneNumber || '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }

        update('isLoading', false);
      } catch (error: any) {
        update('isLoading', false);
        throw new Error(error);
      }
    },
    [update]
  );

  // LOGOUT
  const onLogout = useCallback(async () => {
    try {
      await signOut(fbAuth);
      sessionStorage.removeItem('accessToken');
      update('user', '');
      update('isLoading', false);
    } catch (error: any) {
      update('isLoading', false);
      throw new Error(error);
    }
  }, [update]);

  // RESET STATE
  const onReset = useCallback(() => {
    reset();
  }, [reset]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      onLoginEmail,
      onLoginGoogle,
      onRegister,
      onUpdate,
      onLogout,
      onReset,
    }),
    [onLoginEmail, onLoginGoogle, onRegister, onUpdate, onLogout, onReset, state]
  );

  return <UserContext.Provider value={memoizedValue}>{children}</UserContext.Provider>;
};
