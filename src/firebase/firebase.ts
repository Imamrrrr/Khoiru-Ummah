import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ----------------------------------------------------------------------

const firebaseConfig = {
  apiKey: 'AIzaSyBxPJql8wma7D8PBpuQY1qKOZxSgkJGtEk',
  authDomain: 'project-khoiru-ummah.firebaseapp.com',
  projectId: 'project-khoiru-ummah',
  storageBucket: 'project-khoiru-ummah.appspot.com',
  messagingSenderId: '259852870123',
  appId: '1:259852870123:web:cac002fbf3de9cb50b39ae',
};

const app = initializeApp(firebaseConfig);

export const fbAuth = getAuth(app);

export const fbFirestore = getFirestore(app);
