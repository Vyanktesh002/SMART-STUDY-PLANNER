/* ── Firebase Integration Example for app.js ────────────────────────────────── */

// Add these imports to the top of app.js (after other imports if any):
/*
import * as Firebase from './firebase-service.js';
import { auth } from './firebase-config.js';
import { 
  signInAnonymously, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

// Add this to STATE:
const STATE = {
  // ... existing state
  currentUserId: null,
  isFirebaseReady: false
};
*/

// ── AUTHENTICATION SETUP ────────────────────────────────────────────────────
// Add this function to initialize Firebase authentication:

/*
function setupFirebaseAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      STATE.currentUserId = user.uid;
      STATE.isFirebaseReady = true;
      console.log('✓ Firebase authenticated:', STATE.currentUserId);
      
      // Now load data from Firebase
      loadSubjectsFromFirebase();
      loadTimetableFromFirebase();
      loadProgressFromFirebase();
      loadSessionsFromFirebase();
    } else {
      // Sign in anonymously for demo purposes
      signInAnonymously(auth)
        .then((result) => {
          STATE.currentUserId = result.user.uid;
          STATE.isFirebaseReady = true;
          console.log('✓ Anonymous auth successful:', STATE.currentUserId);
        })
        .catch((error) => console.error('Auth error:', error));
    }
  });
}
*/

// ── LOAD FUNCTIONS ────────────────────────────────────────────────────────
// Replace or update these functions in app.js:

/*
async function loadSubjectsFromFirebase() {
  try {
    if (!STATE.currentUserId) return;
    
    STATE.subjects = await Firebase.getSubjects(STATE.currentUserId);
    renderSubjects();
    console.log('✓ Subjects loaded:', STATE.subjects.length);
  } catch (error) {
    console.error('Error loading subjects:', error);
    showToast('Error loading subjects', 'error');
  }
}

async function loadTimetableFromFirebase() {
  try {
    if (!STATE.currentUserId) return;
    
    STATE.timetable = await Firebase.getTimetable(STATE.currentUserId);
    renderTimetable();
    console.log('✓ Timetable loaded');
  } catch (error) {
    console.error('Error loading timetable:', error);
  }
}

async function loadProgressFromFirebase() {
  try {
    if (!STATE.currentUserId) return;
    
    STATE.progress = await Firebase.getProgress(STATE.currentUserId);
    renderProgress();
    console.log('✓ Progress loaded');
  } catch (error) {
    console.error('Error loading progress:', error);
  }
}

async function loadSessionsFromFirebase() {
  try {
    if (!STATE.currentUserId) return;
    
    STATE.sessions = await Firebase.getPomodoroSessions(STATE.currentUserId);
    console.log('✓ Sessions loaded:', STATE.sessions.length);
  } catch (error) {
    console.error('Error loading sessions:', error);
  }
}
*/

// ── SAVE FUNCTIONS ────────────────────────────────────────────────────────
// Update save operations to use Firebase:

/*
async function saveSubject(subjectData) {
  try {
    if (!STATE.currentUserId) {
      showToast('User not authenticated', 'error');
      return;
    }
    
    const newSubject = await Firebase.addSubject(STATE.currentUserId, subjectData);
    STATE.subjects.push(newSubject);
    renderSubjects();
    showToast('Subject saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving subject:', error);
    showToast('Error saving subject', 'error');
  }
}

async function updateSubjectData(subjectId, updates) {
  try {
    if (!STATE.currentUserId) {
      showToast('User not authenticated', 'error');
      return;
    }
    
    await Firebase.updateSubject(STATE.currentUserId, subjectId, updates);
    
    // Update local state
    const subject = STATE.subjects.find(s => s.id === subjectId);
    if (subject) {
      Object.assign(subject, updates);
    }
    renderSubjects();
    showToast('Subject updated!', 'success');
  } catch (error) {
    console.error('Error updating subject:', error);
    showToast('Error updating subject', 'error');
  }
}

async function deleteSubjectData(subjectId) {
  try {
    await Firebase.deleteSubject(subjectId);
    
    // Update local state
    STATE.subjects = STATE.subjects.filter(s => s.id !== subjectId);
    STATE.progress[subjectId] = null;
    renderSubjects();
    showToast('Subject deleted', 'success');
  } catch (error) {
    console.error('Error deleting subject:', error);
    showToast('Error deleting subject', 'error');
  }
}

async function saveProgressData(subjectId, progressData) {
  try {
    if (!STATE.currentUserId) {
      showToast('User not authenticated', 'error');
      return;
    }
    
    await Firebase.updateProgress(STATE.currentUserId, subjectId, progressData);
    
    // Update local state
    STATE.progress[subjectId] = progressData;
    renderProgress();
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

async function savePomodoroSessionData(sessionData) {
  try {
    if (!STATE.currentUserId) {
      showToast('User not authenticated', 'error');
      return;
    }
    
    await Firebase.savePomodoroSession(STATE.currentUserId, sessionData);
    STATE.sessions.push(sessionData);
    console.log('✓ Session saved');
  } catch (error) {
    console.error('Error saving pomodoro session:', error);
  }
}

async function saveTimetableData(timetableData) {
  try {
    if (!STATE.currentUserId) {
      showToast('User not authenticated', 'error');
      return;
    }
    
    await Firebase.saveTimetable(STATE.currentUserId, timetableData);
    STATE.timetable = timetableData;
    showToast('Timetable saved!', 'success');
  } catch (error) {
    console.error('Error saving timetable:', error);
    showToast('Error saving timetable', 'error');
  }
}
*/

// ── INITIALIZATION ──────────────────────────────────────────────────────
// Modify your DOMContentLoaded handler:

/*
document.addEventListener("DOMContentLoaded", () => {
  setupFirebaseAuth();  // Initialize Firebase first
  
  setupNav();
  setupModal();
  setupStars();
  setupColorPicker();
  setupTimetableButtons();
  setupProgressListener();
  setupPomodoro();
  
  loadQuote();
  loadStreak();
  
  // Don't load here - wait for Firebase auth in setupFirebaseAuth()
});
*/

// ── BENEFITS OF USING FIREBASE ──────────────────────────────────────────
console.log(`
✓ Cloud Firestore Integration Complete!

BENEFITS:
• Automatic data sync across devices
• Real-time updates (with listeners)
• Secure backend data storage
• Built-in user authentication
• Scalable to thousands of users
• Automatic backups
• No server maintenance needed

TO USE:
1. Follow the examples above to update your load/save functions
2. Initialize Firebase auth on page load
3. All data persists to the cloud
4. Users can access from any device

RESOURCES:
- DATABASE_SETUP.md - Full setup guide
- firebase-service.js - All available functions
- firebase-config.js - Firebase initialization
`);

export default {
  // Export functions to use in other modules
};
