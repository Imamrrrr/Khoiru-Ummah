import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, query, onSnapshot, orderBy, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// firebase
import { fbFirestore } from '/src/firebase';
// interfaces
import { AssessmentInterface, PayloadCreateAssessmentInterface, PayloadUpdateAssessmentInterface } from '/src/interfaces/assessment';

// ----------------------------------------------------------------------

interface UseDatabaseAssessment {
  assessments: AssessmentInterface[];
  onCreateAssessment: (payload: PayloadCreateAssessmentInterface) => Promise<void>;
  onUpdateAssessment: (payload: PayloadUpdateAssessmentInterface) => Promise<void>;
  onDeleteAssessment: (id: string) => Promise<void>;
}

// ----------------------------------------------------------------------

export const useDatabaseAssessment = (): UseDatabaseAssessment => {
  const [assessments, setAssessments] = useState<AssessmentInterface[]>([]);

  // GET ASSESSMENTS
  useEffect(() => {
    const q = query(collection(fbFirestore, 'assessments'), orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dbResults: any = [];

      querySnapshot.forEach((doc) => {
        dbResults.push({ id: doc.id, ...doc.data() });
      });

      setAssessments(dbResults);
    });

    return () => {
      unsubscribe();
      setAssessments([]);
    };
  }, []);

  // CREATE ASSESSMENT
  const onCreateAssessment = useCallback(async (payload: PayloadCreateAssessmentInterface) => {
    try {
      await addDoc(collection(fbFirestore, 'assessments'), {
        formId: payload.formId,
        studentName: payload.studentName,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        class: payload.class,
        phoneNumber: payload.phoneNumber,
        questionPoints: payload.questionPoints,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  // UPDATE ASSESSMENT
  const onUpdateAssessment = useCallback(async (payload: PayloadUpdateAssessmentInterface) => {
    try {
      await updateDoc(doc(fbFirestore, 'assessments', payload.id), {
        studentName: payload.studentName,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        class: payload.class,
        phoneNumber: payload.phoneNumber,
        questionPoints: payload.questionPoints,
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  // DELETE ASSESSMENT
  const onDeleteAssessment = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(fbFirestore, 'assessments', id));
    } catch (error: any) {
      throw new Error(error);
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      assessments,
      onCreateAssessment,
      onUpdateAssessment,
      onDeleteAssessment,
    }),

    [assessments, onCreateAssessment, onUpdateAssessment, onDeleteAssessment]
  );

  return memoizedValue;
};
