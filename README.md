# Smart Study Planner

A full-stack web application for intelligent study scheduling, built with Python (Flask), Firebase Firestore, and vanilla HTML/CSS/JS.

---

## Features

| Feature | Description |
|---|---|
| **Subject Manager** | Add, edit, delete subjects with difficulty, prep level, exam date, required hours |
| **Smart Scheduler** | Priority-score algorithm distributes daily study time by urgency |
| **Timetable** | Day-wise schedule with collapse/expand, export to `.txt` |
| **Progress Tracker** | Log studied hours, visual progress bars, per-subject Pomodoro history |
| **Analytics** | Doughnut + bar charts (Chart.js), SVG progress rings |
| **Pomodoro Timer** | 25/5/15-min cycles, circular SVG countdown, Web Audio bell, session logging |
| **Study Streak** | Consecutive active days calculated from Pomodoro session history |
| **Firebase Sync** | Real-time Firestore storage (falls back to in-memory if not configured) |

---

## Setup

### 1. Install Python dependencies

```bash
pip install flask firebase-admin
```

### 2. Firebase Configuration (optional but recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Firestore Database** (start in test mode for development).
3. Go to **Project Settings → Service Accounts → Generate new private key**.
4. Save the downloaded JSON file as `serviceAccountKey.json` in the project root.

> **Without Firebase**: The app runs fine using in-memory storage. Data resets on server restart.

### 3. Run the app

```bash
python app.py
```

Open your browser at **http://localhost:5000**

---

## File Structure

```
smart_study_planner/
├── app.py                 # Flask routes & REST API
├── scheduler.py           # Priority algorithm & timetable generator
├── firebase_storage.py    # Firestore read/write
├── memory_storage.py      # In-memory fallback (no Firebase required)
├── serviceAccountKey.json # Your Firebase credentials (not committed)
├── static/
│   ├── style.css          # Dark editorial theme, DM Serif + DM Sans
│   └── app.js             # SPA logic, Pomodoro, charts, API calls
├── templates/
│   └── index.html         # Single-page app shell
└── README.md
```

---

## Priority Algorithm

The scheduler uses a urgency-weighted formula:

```python
priority_score = (difficulty * 2 + adjusted_hours) / max(days_left, 1)
```

Where:

- **difficulty** (1–5): Higher difficulty subjects get more weight
- **adjusted_hours**: `required_hours × (1 + (5 - prep_level) × 0.15)` — subjects where you're less prepared get more time
- **days_left**: Subjects with fewer days until exam get higher scores (urgency)

### Daily time allocation

Each day, the available hours (`max_daily_hours`) are distributed **proportionally** to priority scores:

```python
daily_hours_for_subject = (score / total_score) × max_daily_hours
```

Subjects that have already met their required hours are excluded from future days. The schedule runs day-by-day until the latest exam date.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/subjects` | List all subjects with priority scores |
| POST | `/api/subjects` | Add a subject |
| PUT | `/api/subjects/<id>` | Update a subject |
| DELETE | `/api/subjects/<id>` | Delete a subject |
| GET | `/api/timetable` | Get stored timetable |
| POST | `/api/timetable/generate` | Generate new timetable `{max_daily_hours}` |
| GET | `/api/timetable/export` | Download timetable as `.txt` |
| GET | `/api/progress` | Get all progress records |
| PUT | `/api/progress/<id>` | Update progress for a subject |
| GET | `/api/pomodoro/sessions` | Get Pomodoro sessions (optional `?subject_id=`) |
| POST | `/api/pomodoro/sessions` | Log a completed Pomodoro session |
| GET | `/api/streak` | Get current study streak (days) |
| GET | `/api/quote` | Get a random motivational quote |

---

## Firebase Collections

| Collection | Description |
|---|---|
| `subjects` | One document per subject |
| `timetable` | Single document `"current"` with `days` array |
| `progress` | One document per subject ID with studied hours & % |
| `pomodoro_sessions` | One document per completed session |

---

## Design

- **Theme**: Dark editorial, near-black backgrounds, sage green accent (`#7fb685`)
- **Typography**: DM Serif Display (headings) + DM Sans (body)
- **Layout**: Fixed sidebar navigation, fluid main content area
- **Responsive**: Collapses sidebar icons on narrow screens
