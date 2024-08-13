import { useEffect, useMemo, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
// context
import { useUserContext } from '/src/context/user';
// firebase
import { fbFirestore } from '/src/firebase';
// interfaces
import { CurrentUserInterface, UserInterface } from '/src/interfaces/user';
// config-global
import { USER_KEY } from '/src/config-global';
// utils
import { fDecrypt } from '/src/utils/format-encrypt';

// ----------------------------------------------------------------------

interface UseDatabaseUser {
  users: UserInterface[];
  isLoadingUser: boolean;
  currentUser: CurrentUserInterface | null;
}

// ----------------------------------------------------------------------

export const useDatabaseUser = (): UseDatabaseUser => {
  const [users, setUsers] = useState<UserInterface[]>([]);

  const [currentUser, setCurrentUser] = useState<CurrentUserInterface | null>(null);

  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  const { user, isLoading } = useUserContext();

  // GET USERS
  useEffect(() => {
    const q = query(collection(fbFirestore, 'users'), orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dbUsers: any = [];

      querySnapshot.forEach((doc) => {
        dbUsers.push({ id: doc.id, ...doc.data() });
      });

      setUsers(dbUsers);
    });

    return () => {
      unsubscribe();
      setUsers([]);
    };
  }, []);

  // GET CURRENT USER
  useEffect(() => {
    const getCurrentUser = () => {
      if (user) {
        const userDecrypted: CurrentUserInterface = fDecrypt(user, USER_KEY);

        const q = query(collection(fbFirestore, 'users'), where('userId', '==', userDecrypted.uid));

        onSnapshot(q, (querySnapshot) => {
          const dbUsers: any[] = [];

          querySnapshot.forEach((doc) => {
            dbUsers.push({ id: doc.id, ...doc.data() });
          });

          const filteredUsers = dbUsers?.find((us) => us.userId === userDecrypted.uid);

          setCurrentUser({ databaseUsers: filteredUsers, ...userDecrypted });

          setIsLoadingUser(isLoading);
        });
      } else {
        const autoUpdateIsLoading = async () => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setIsLoadingUser(false);
        };

        autoUpdateIsLoading();
      }
    };

    getCurrentUser();

    return () => {
      setCurrentUser(null);
    };
  }, [user, isLoading]);

  const memoizedValue = useMemo(
    () => ({
      users,
      currentUser,
      isLoadingUser,
    }),

    [users, currentUser, isLoadingUser]
  );

  return memoizedValue;
};
