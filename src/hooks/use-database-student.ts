import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, query, onSnapshot, orderBy, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// firebase
import { fbFirestore } from '/src/firebase';
// interfaces
import { PayloadCreateStudentInterface, PayloadUpdateStudentInterface, StudentInterface } from '/src/interfaces/student';

// ----------------------------------------------------------------------

interface UseDatabaseStudent {
  students: StudentInterface[];
  onCreateStudent: (payload: PayloadCreateStudentInterface) => Promise<void>;
  onUpdateStudent: (payload: PayloadUpdateStudentInterface) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
}

// ----------------------------------------------------------------------

export const useDatabaseStudent = (): UseDatabaseStudent => {
  const [students, setStudents] = useState<StudentInterface[]>([]);

  // GET STUDENTS
  useEffect(() => {
    const q = query(collection(fbFirestore, 'students'), orderBy('name'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dbUsers: any = [];

      querySnapshot.forEach((doc) => {
        dbUsers.push({ id: doc.id, ...doc.data() });
      });

      setStudents(dbUsers);
    });

    return () => {
      unsubscribe();
      setStudents([]);
    };
  }, []);

  // CREATE STUDENT
  const onCreateStudent = useCallback(async (payload: PayloadCreateStudentInterface) => {
    try {
      await addDoc(collection(fbFirestore, 'students'), {
        nis: payload?.nis,
        name: payload?.name,
        class: payload?.class,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  // UPDATE STUDENT
  const onUpdateStudent = useCallback(async (payload: PayloadUpdateStudentInterface) => {
    try {
      await updateDoc(doc(fbFirestore, 'students', payload.id), {
        nis: payload?.nis,
        name: payload?.name,
        class: payload?.class,
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  // DELETE STUDENT
  const onDeleteStudent = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(fbFirestore, 'students', id));
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      students,
      onCreateStudent,
      onUpdateStudent,
      onDeleteStudent,
    }),

    [students, onCreateStudent, onUpdateStudent, onDeleteStudent]
  );

  return memoizedValue;
};
