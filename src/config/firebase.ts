import admin from 'firebase-admin';
import env from './env';

const serviceAccount = {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: env.STORAGE_BUCKET,
});

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
export const messaging = admin.messaging();

// Enable offline persistence for better performance
db.settings({ ignoreUndefinedProperties: true });
export default admin;