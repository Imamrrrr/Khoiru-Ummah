import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, query, onSnapshot, orderBy, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// firebase
import { fbFirestore } from '/src/firebase';
// interfaces
import { FormInterface, PayloadCreateFormInterface, PayloadUpdateFormInterface } from '/src/interfaces/form';

// ----------------------------------------------------------------------

interface UseDatabaseForm {
  forms: FormInterface[];
  onCreateForm: (payload: PayloadCreateFormInterface) => Promise<void>;
  onUpdateForm: (payload: PayloadUpdateFormInterface) => Promise<void>;
  onDeleteForm: (id: string) => Promise<void>;
}

// ----------------------------------------------------------------------

export const useDatabaseForm = (): UseDatabaseForm => {
  const [forms, setForms] = useState<FormInterface[]>([]);

  // GET FORMS
  useEffect(() => {
    const q = query(collection(fbFirestore, 'forms'), orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dbUsers: any = [];

      querySnapshot.forEach((doc) => {
        dbUsers.push({ id: doc.id, ...doc.data() });
      });

      setForms(dbUsers);
    });

    return () => {
      unsubscribe();
      setForms([]);
    };
  }, []);

  // CREATE FORM
  const onCreateForm = useCallback(async (payload: PayloadCreateFormInterface) => {
    try {
      await addDoc(collection(fbFirestore, 'forms'), {
        title: payload?.title,
        desc: payload?.desc,
        class: payload?.class,
        notes: payload?.notes,
        questions: payload?.questions,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  // UPDATE FORM
  const onUpdateForm = useCallback(async (payload: PayloadUpdateFormInterface) => {
    try {
      await updateDoc(doc(fbFirestore, 'forms', payload.id), {
        title: payload?.title,
        desc: payload?.desc,
        class: payload?.class,
        notes: payload?.notes,
        questions: payload?.questions,
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  // DELETE FORM
  const onDeleteForm = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(fbFirestore, 'forms', id));
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      forms,
      onCreateForm,
      onUpdateForm,
      onDeleteForm,
    }),

    [forms, onCreateForm, onUpdateForm, onDeleteForm]
  );

  return memoizedValue;
};
