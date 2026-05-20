/* ── Firebase Configuration ─────────────────────────────────────────────────── */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage, connectStorageEmulator } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs-F1M9oGAqkOLN6iJYaBQ5hkEtzwoJp4",
  authDomain: "smart-study-planner-d7440.firebaseapp.com",
  projectId: "smart-study-planner-d7440",
  storageBucket: "smart-study-planner-d7440.firebasestorage.app",
  messagingSenderId: "154705886692",
  appId: "1:154705886692:web:44076ab04c2da3ded05bf1",
  measurementId: "G-2EBCHYHVGN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

// Optional: Connect to emulators for local development
// Uncomment these lines if you're running Firebase emulator suite
/*
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}
*/

export default app;
