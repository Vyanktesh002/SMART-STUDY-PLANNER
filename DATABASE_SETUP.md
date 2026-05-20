# SMART STUDY PLANNER - DATABASE SETUP GUIDE

## 📱 Overview

Your Smart Study Planner now has **Firebase Firestore** integrated for cloud-based data persistence. This guide explains the structure, how to use it, and how to set everything up.

---

## 🔧 Quick Setup

### 1. **Frontend Setup (Already Done)**

The following files have been added:

- **`firebase-config.js`** - Firebase initialization with your credentials
- **`firebase-service.js`** - Database service layer with helper functions
- **`package.json`** - Node dependencies (Firebase SDK)

### 2. **Backend Integration**

Your Flask backend supports both Firebase and in-memory storage. The app automatically:
- Tries to connect to Firebase via `firebase_storage.py`
- Falls back to `memory_storage.py` if Firebase is not configured

### 3. **Start Using Firebase**

No additional setup needed! Your Firebase project is already configured with the credentials in `firebase-config.js`.

---

## 📊 Database Collections

Your Firestore database has the following collections:

### **1. `subjects`** - Student Study Subjects
```javascript
{
  id: "doc-id",              // Auto-generated
  userId: "user-id",         // User identifier
  name: "Mathematics",       // Subject name
  color: "#6366f1",         // Display color
  priority: 8,              // Priority level (1-10)
  createdAt: timestamp,     // Firebase server timestamp
  updatedAt: timestamp      // Last modified
}
```

### **2. `timetable`** - Weekly Study Schedule
```javascript
{
  userId: "user-id",        // Document ID
  schedule: [
    {
      day: "Monday",
      time: "09:00",
      duration: 60,
      subject: "Mathematics"
    }
  ],
  updatedAt: timestamp
}
```

### **3. `progress`** - Subject Progress Tracking
```javascript
{
  userId: "user-id",
  subjectId: "subject-id",
  completed: 85,            // Completion percentage
  hoursSpent: 12.5,        // Total hours studied
  status: "in-progress",    // in-progress | completed
  updatedAt: timestamp
}
```

### **4. `pomodoro_sessions`** - Study Session Records
```javascript
{
  userId: "user-id",
  subjectId: "subject-id",
  duration: 25,             // Minutes
  completed: true,          // Session status
  date: "2025-05-20",      // Study date
  mode: "work",            // work | short_break | long_break
  timestamp: serverTimestamp
}
```

### **5. `user_stats`** - User Statistics
```javascript
{
  userId: "user-id",
  streak: 15,               // Current study streak days
  totalSessions: 156,       // All-time sessions
  totalHours: 234.5,       // Total study hours
  lastStudyDate: timestamp,
  updatedAt: timestamp
}
```

---

## 💻 Using Firebase in Your Code

### Import the Firebase Service

```javascript
import * as Firebase from './firebase-service.js';
```

### Common Operations

#### **Add a Subject**
```javascript
const subject = await Firebase.addSubject(userId, {
  name: "Mathematics",
  color: "#6366f1",
  priority: 8
});
```

#### **Get All Subjects**
```javascript
const subjects = await Firebase.getSubjects(userId);
```

#### **Update Subject**
```javascript
await Firebase.updateSubject(userId, subjectId, {
  priority: 9,
  name: "Advanced Mathematics"
});
```

#### **Delete Subject**
```javascript
await Firebase.deleteSubject(subjectId);
```

#### **Save Timetable**
```javascript
await Firebase.saveTimetable(userId, scheduleArray);
```

#### **Update Progress**
```javascript
await Firebase.updateProgress(userId, subjectId, {
  completed: 85,
  hoursSpent: 12.5,
  status: "in-progress"
});
```

#### **Save Pomodoro Session**
```javascript
await Firebase.savePomodoroSession(userId, {
  subjectId: "subject-id",
  duration: 25,
  completed: true,
  date: "2025-05-20"
});
```

#### **Update User Stats**
```javascript
await Firebase.updateUserStats(userId, {
  streak: 15,
  totalSessions: 156,
  totalHours: 234.5
});
```

---

## 🔑 User Authentication Setup

To properly use Firebase, you need to implement user authentication. Here's a basic example:

### Add to `app.js`:

```javascript
import { auth } from './firebase-config.js';
import { signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

let currentUser = null;

// Initialize authentication
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user.uid;
    console.log('Authenticated as:', currentUser);
    loadSubjects(); // Now load data with user ID
  } else {
    // Sign in anonymously for demo
    signInAnonymously(auth)
      .then((result) => {
        currentUser = result.user.uid;
        console.log('Signed in anonymously as:', currentUser);
        loadSubjects();
      })
      .catch((error) => {
        console.error('Authentication error:', error);
      });
  }
});
```

---

## 🔄 Backend Integration

Your Flask backend in `app.py` already handles data persistence. The backend:

1. **Receives requests** from your frontend (JS app)
2. **Stores data** to Firebase via `firebase_storage.py`
3. **Serves data** back to the frontend

Example endpoints in your Flask app:
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/<id>` - Update subject
- `DELETE /api/subjects/<id>` - Delete subject
- `GET /api/progress` - Get study progress
- `POST /api/sessions` - Save pomodoro session

---

## 📝 Environment Variables

Add a `.env` file to your project root (if needed for additional configuration):

```env
FLASK_ENV=development
FLASK_DEBUG=True
FIREBASE_CREDENTIALS_PATH=path/to/credentials.json
```

---

## 🚀 Deployment

### Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **smart-study-planner-d7440**
3. Enable Firestore Database
4. Set up Security Rules for your data access

### Example Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🧪 Testing Locally

1. **Option 1: Use Firebase Emulator**
   - Install: `npm install -g firebase-tools`
   - Start emulator: `firebase emulators:start`
   - Uncomment emulator lines in `firebase-config.js`

2. **Option 2: Use Live Firebase**
   - Use your credentials (already in `firebase-config.js`)
   - Data will persist to live Firestore

---

## ❌ Troubleshooting

### "Firebase is not configured"
- Check that `firebase-config.js` is loaded before other scripts
- Verify your API key is correct in `firebase-config.js`

### "User data not saving"
- Ensure user is authenticated (see User Authentication Setup)
- Check Firestore security rules allow your user

### "CORS errors"
- This is normal when calling your Flask backend
- Your Flask app is configured to handle CORS

---

## 📚 Useful Resources

- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)

---

## ✅ What's Included

✅ Cloud Firestore integration
✅ Firebase authentication setup
✅ Multiple collection schemas
✅ Backend/frontend sync capability
✅ Service layer for easy database operations
✅ Anonymous authentication support
✅ Timestamps and metadata tracking

---

**Your database is now ready to use!** 🎉
