const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const convertTimestamps = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (obj.toDate) return obj.toDate().toISOString();
  if (Array.isArray(obj)) return obj.map(convertTimestamps);
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, convertTimestamps(v)]));
};

const docToObj = (doc) => ({ _id: doc.id, id: doc.id, ...convertTimestamps(doc.data()) });

module.exports = { admin, db, docToObj };
