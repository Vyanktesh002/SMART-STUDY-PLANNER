<!-- SMART STUDY PLANNER - DATABASE ARCHITECTURE -->

# 📊 Database Architecture & Flow Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     SMART STUDY PLANNER                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   FRONTEND (Browser)     │
│  ┌────────────────────┐  │
│  │  index.html        │  │
│  │  - UI Structure    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  style.css         │  │
│  │  - Styling         │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  app.js (Main)     │  │
│  │  - Navigation      │  │
│  │  - UI Logic        │  │
│  └────────────────────┘  │
└──────────────────────────┘
          ↓
┌──────────────────────────┐
│  Firebase Modules        │
│  ┌────────────────────┐  │
│  │firebase-config.js  │  │
│  │ - Initialize       │  │
│  │ - Setup SDKs       │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │firebase-service.js │  │
│  │ - CRUD Operations  │  │
│  │ - Query Helpers    │  │
│  └────────────────────┘  │
└──────────────────────────┘
          ↓
┌──────────────────────────┐
│  FIREBASE SERVICES       │
│  ┌────────────────────┐  │
│  │ Authentication     │  │
│  │ (Web SDK)          │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ Cloud Firestore    │  │
│  │ (Database)         │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ Cloud Storage      │  │
│  │ (Files)            │  │
│  └────────────────────┘  │
└──────────────────────────┘
          ↓
┌──────────────────────────────────────────────────────┐
│              CLOUD FIRESTORE DATABASE                │
│              (smart-study-planner-d7440)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │Subjects  │ │Timetable │ │Progress  │             │
│  │Collection│ │Collection│ │Collection│ ...         │
│  └──────────┘ └──────────┘ └──────────┘             │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│      BACKEND (Flask Server)              │
│  ┌────────────────────────────────────┐  │
│  │ app.py (Main Flask App)            │  │
│  │ - API Endpoints                    │  │
│  │ - Data Routing                     │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ firebase_storage.py                │  │
│  │ - Backend Firebase Integration     │  │
│  │ - Admin SDK Operations             │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ memory_storage.py (Fallback)       │  │
│  │ - Local Data Storage               │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Adding a New Subject

```
User enters subject name, color, priority
         ↓
    Clicks "Add Subject"
         ↓
    app.js triggers save
         ↓
Firebase.addSubject(userId, data)
         ↓
firebase-service.js → Firebase Web SDK
         ↓
   Cloud Firestore
         ↓
Document created in "subjects" collection
         ↓
Real-time listener updates UI
         ↓
Subject appears in sidebar
```

### Loading Existing Data

```
Page loads
         ↓
Firebase.auth initializes
         ↓
User authenticates (anonymous or email)
         ↓
app.js calls loadSubjects()
         ↓
Firebase.getSubjects(userId)
         ↓
Query: subjects where userId == currentUser
         ↓
   Cloud Firestore
         ↓
Documents returned
         ↓
app.js updates STATE.subjects
         ↓
UI renders with fresh data
```

### Saving Study Progress

```
User studies subject
         ↓
Pomodoro timer completes
         ↓
Session saved
         ↓
Firebase.savePomodoroSession(userId, data)
         ↓
   Document created in "pomodoro_sessions"
         ↓
Firebase.updateProgress(userId, subjectId, %)
         ↓
   Document updated in "progress"
         ↓
Firebase.updateUserStats(userId, stats)
         ↓
   Document updated in "user_stats"
         ↓
Analytics view updates with new data
```

---

## Collection Structure & Relationships

```
┌─ subjects (Collection)
│  ├─ docId1 (Document)
│  │  ├─ userId: "abc123"
│  │  ├─ name: "Mathematics"
│  │  ├─ color: "#6366f1"
│  │  ├─ priority: 8
│  │  ├─ createdAt: timestamp
│  │  └─ updatedAt: timestamp
│  │
│  └─ docId2 (Document)
│     ├─ userId: "abc123"
│     ├─ name: "Physics"
│     └─ ...
│
├─ timetable (Collection)
│  └─ abc123 (Document - userId as ID)
│     ├─ userId: "abc123"
│     ├─ schedule: [
│     │   { day: "Monday", time: "09:00", subject: "Math" },
│     │   { day: "Monday", time: "10:00", subject: "Physics" }
│     │ ]
│     └─ updatedAt: timestamp
│
├─ progress (Collection)
│  ├─ abc123_docId1 (Document - composite ID)
│  │  ├─ userId: "abc123"
│  │  ├─ subjectId: "docId1"
│  │  ├─ completed: 75
│  │  ├─ hoursSpent: 8.5
│  │  └─ status: "in-progress"
│  │
│  └─ abc123_docId2 (Document)
│     └─ ...
│
├─ pomodoro_sessions (Collection)
│  ├─ sessionId1 (Document)
│  │  ├─ userId: "abc123"
│  │  ├─ subjectId: "docId1"
│  │  ├─ duration: 25
│  │  ├─ completed: true
│  │  ├─ date: "2025-05-20"
│  │  └─ timestamp: serverTimestamp
│  │
│  └─ sessionId2 (Document)
│     └─ ...
│
└─ user_stats (Collection)
   └─ abc123 (Document - userId as ID)
      ├─ userId: "abc123"
      ├─ streak: 15
      ├─ totalSessions: 156
      ├─ totalHours: 234.5
      ├─ lastStudyDate: timestamp
      └─ updatedAt: timestamp
```

---

## API Integration Points

### Frontend → Firebase Direct (via SDK)
```
app.js (Frontend)
   ↓
firebase-service.js (Helper functions)
   ↓
Firebase Web SDK (JavaScript SDK)
   ↓
Cloud Firestore (Database)
```

### Frontend → Backend → Firebase
```
Frontend (fetch/AJAX)
   ↓
Flask API Endpoint (app.py)
   ↓
firebase_storage.py (Backend integration)
   ↓
Firebase Admin SDK (Python SDK)
   ↓
Cloud Firestore (Database)
```

---

## User Authentication Flow

```
Page Load
   ↓
firebase-config.js initializes auth
   ↓
onAuthStateChanged() listener activates
   ↓
Firebase checks for existing session
   ├─ If logged in → Use uid
   └─ If not logged in → Offer sign-in
         ↓
    User chooses auth method:
    ├─ Email/Password
    ├─ Google
    ├─ Anonymous (Demo)
    └─ Custom Token
         ↓
    Firebase returns user.uid
         ↓
    Store in STATE.currentUserId
         ↓
    Load all user-specific data
```

---

## File Dependencies & Initialization Order

```
HTML loads scripts in order:
   ↓
1. External Libraries (Chart.js, Fonts)
   ↓
2. firebase-config.js
   ├─ Initialize Firebase app
   ├─ Initialize Auth
   ├─ Initialize Firestore
   └─ Export instances
   ↓
3. firebase-service.js
   ├─ Import from firebase-config
   ├─ Define CRUD functions
   └─ Export functions
   ↓
4. style.css (Styles)
   ↓
5. app.js (Main Application)
   ├─ Import firebase-service
   ├─ Setup event listeners
   ├─ Initialize authentication
   └─ Load and render data
```

---

## Real-time Update Pattern

```
User A updates a subject
         ↓
Firebase.updateSubject()
         ↓
Document updated in Firestore
         ↓
Firestore triggers real-time listeners
         ↓
User B's app gets notified
         ↓
STATE updates automatically
         ↓
UI re-renders
         ↓
User B sees changes immediately
(Without page refresh!)
```

---

## Security & Data Access

### Firestore Security Rules
```
┌──────────────────────────────────┐
│   User A (uid: abc123)           │
│   Can only read/write:           │
│   - Documents where             │
│     userId == "abc123"          │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│   User B (uid: xyz789)           │
│   Cannot see User A's data       │
│   Can only read/write:           │
│   - Documents where             │
│     userId == "xyz789"          │
└──────────────────────────────────┘
```

---

## Scalability

### How Many Users?
- **1-1000 users**: Works great with defaults
- **1000-10,000 users**: May need indexed queries
- **10,000+ users**: Consider sharding/partitioning

### How Much Data?
- **Subjects**: Typically 5-20 per user
- **Sessions**: Grows over time (100+ per year)
- **Documents**: Firestore can handle millions

### Firestore Pricing
- **Free tier**: 50,000 reads/day, 20,000 writes/day
- **Paid**: $0.06 per 100K reads, $0.18 per 100K writes

---

## Monitoring & Debugging

### Firebase Console
- View collections and documents
- Check for errors
- Monitor usage statistics
- Adjust security rules

### Browser DevTools
```javascript
// Check if Firebase is initialized
console.log(window.firebase)

// View current user
console.log(auth.currentUser)

// Test a query
db.collection('subjects').get()
  .then(snap => console.log(snap.docs.map(d => d.data())))
```

---

**This architecture provides:**
- ✅ Real-time data synchronization
- ✅ Automatic scaling
- ✅ Built-in security
- ✅ No server maintenance
- ✅ Global distribution
- ✅ Offline support (with offline persistence enabled)
