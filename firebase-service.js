/* ── Firebase Database Service ──────────────────────────────────────────────── */

import { db } from "./firebase-config.js";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  arrayUnion,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const COLLECTIONS = {
  SUBJECTS: "subjects",
  TIMETABLE: "timetable",
  PROGRESS: "progress",
  SESSIONS: "pomodoro_sessions",
  USER_STATS: "user_stats"
};

// ── Subjects ────────────────────────────────────────────────────────────────
export async function addSubject(userId, subjectData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SUBJECTS), {
      userId,
      ...subjectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...subjectData };
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
}

export async function getSubjects(userId) {
  try {
    const q = query(
      collection(db, COLLECTIONS.SUBJECTS),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}

export async function updateSubject(userId, subjectId, updates) {
  try {
    const docRef = doc(db, COLLECTIONS.SUBJECTS, subjectId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
}

export async function deleteSubject(subjectId) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SUBJECTS, subjectId));
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw error;
  }
}

// ── Timetable ──────────────────────────────────────────────────────────────
export async function saveTimetable(userId, timetableData) {
  try {
    const docRef = doc(db, COLLECTIONS.TIMETABLE, userId);
    await setDoc(docRef, {
      userId,
      schedule: timetableData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving timetable:", error);
    throw error;
  }
}

export async function getTimetable(userId) {
  try {
    const docRef = doc(db, COLLECTIONS.TIMETABLE, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().schedule || [] : [];
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return [];
  }
}

// ── Progress ────────────────────────────────────────────────────────────────
export async function updateProgress(userId, subjectId, progressData) {
  try {
    const progressDocId = `${userId}_${subjectId}`;
    const docRef = doc(db, COLLECTIONS.PROGRESS, progressDocId);
    await setDoc(docRef, {
      userId,
      subjectId,
      ...progressData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
}

export async function getProgress(userId) {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROGRESS),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const progress = {};
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      progress[data.subjectId] = data;
    });
    return progress;
  } catch (error) {
    console.error("Error fetching progress:", error);
    return {};
  }
}

// ── Pomodoro Sessions ───────────────────────────────────────────────────────
export async function savePomodoroSession(userId, sessionData) {
  try {
    await addDoc(collection(db, COLLECTIONS.SESSIONS), {
      userId,
      ...sessionData,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving pomodoro session:", error);
    throw error;
  }
}

export async function getPomodoroSessions(userId, limit = 50) {
  try {
    const q = query(
      collection(db, COLLECTIONS.SESSIONS),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .slice(0, limit)
      .map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching pomodoro sessions:", error);
    return [];
  }
}

// ── User Statistics ────────────────────────────────────────────────────────
export async function updateUserStats(userId, statsUpdate) {
  try {
    const docRef = doc(db, COLLECTIONS.USER_STATS, userId);
    await setDoc(docRef, {
      userId,
      ...statsUpdate,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
}

export async function getUserStats(userId) {
  try {
    const docRef = doc(db, COLLECTIONS.USER_STATS, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {};
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {};
  }
}

// ── Study Streak ───────────────────────────────────────────────────────────
export async function updateStudyStreak(userId, streakData) {
  try {
    const docRef = doc(db, COLLECTIONS.USER_STATS, userId);
    await updateDoc(docRef, {
      streak: streakData,
      lastStudyDate: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating study streak:", error);
    throw error;
  }
}

export default {
  addSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  saveTimetable,
  getTimetable,
  updateProgress,
  getProgress,
  savePomodoroSession,
  getPomodoroSessions,
  updateUserStats,
  getUserStats,
  updateStudyStreak
};
