import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

/**
 * Initialize Firebase Admin SDK.
 * Supports environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
 * or Application Default Credentials (ADC) when running on GCP / Cloud hosting.
 */
function initFirebase(): Firestore {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && rawPrivateKey) {
      // Unescape newlines in private key if passed as single-line string
      const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('[Firebase] Admin SDK initialized via Service Account credentials.');
    } else {
      // Fallback to Application Default Credentials
      initializeApp({
        credential: applicationDefault(),
      });
      console.log('[Firebase] Admin SDK initialized via Application Default Credentials.');
    }
  }

  return getFirestore();
}

export const db = initFirebase();
