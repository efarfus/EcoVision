// src/firebase.ts
import { initializeApp, getApps } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyDrf2oXm-VmNyvnCox8pJTU769PnHwR1Xc',
  authDomain: 'ecovision-c6691.firebaseapp.com',
  projectId: 'ecovision-c6691',
  storageBucket: 'ecovision-c6691.appspot.com',
  messagingSenderId: '896514486231',
  appId: '1:896514486231:android:f50cdab613628a1c676592',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export default app
