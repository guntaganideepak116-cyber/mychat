import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

/**
 * Normalizes Firebase Private Key string from any cloud environment formatting.
 */
function formatPrivateKey(rawKey: string): string {
  let key = rawKey.trim();

  // Strip leading & trailing quotes (single, double, or escaped)
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }

  // Convert escaped newlines (\n) to actual newlines
  key = key.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');

  // Ensure header and footer are correctly separated by newlines
  if (!key.startsWith('-----BEGIN PRIVATE KEY-----')) {
    key = `-----BEGIN PRIVATE KEY-----\n${key}`;
  }
  if (!key.endsWith('-----END PRIVATE KEY-----')) {
    key = `${key}\n-----END PRIVATE KEY-----`;
  }

  // Ensure there is a newline after header and before footer
  key = key
    .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
    .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');

  // Collapse consecutive newlines
  return key.replace(/\n+/g, '\n').trim();
}

function initFirebase(): Firestore {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && rawPrivateKey) {
      try {
        const privateKey = formatPrivateKey(rawPrivateKey);
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        console.log('[Firebase] Admin SDK initialized successfully with Service Account.');
      } catch (err) {
        console.error('[Firebase] Failed to initialize with Service Account credentials:', err);
        // Fallback to default
        initializeApp({ credential: applicationDefault() });
      }
    } else {
      initializeApp({ credential: applicationDefault() });
      console.log('[Firebase] Admin SDK initialized via Application Default Credentials.');
    }
  }

  return getFirestore();
}

export const db = initFirebase();
