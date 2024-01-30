import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getStorage } from 'firebase/storage';

// Configure and initialise Firebase
// Config variables are pulled from the environment at build time
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
console.log(JSON.stringify(config));

/**
 * Module API
 * @see https://firebase.google.com/docs/reference/js
 */
const app = initializeApp(config);
const functions = getFunctions(app, 'europe-west2');

if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
  connectFunctionsEmulator(functions ,'http://localhost', 5001);
}

// Initialise Firestore
const firestore = getFirestore(app);

// App check
let appCheck;
if (import.meta.env.VITE_RECAPTCHA_TOKEN) {
  /**
  * @see https://firebase.google.com/docs/app-check/web/recaptcha-provider#initialize
  */
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_TOKEN),
  });
}

// Other firebase exports
const auth = getAuth(app);
const storage = getStorage(app);

export { firestore, auth, functions, appCheck, storage };
export default app;
