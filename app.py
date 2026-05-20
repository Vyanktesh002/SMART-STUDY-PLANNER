from flask import Flask, request, jsonify, render_template
from datetime import datetime, date
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
app = Flask(
    __name__,
    template_folder=str(BASE_DIR),
    static_folder=str(BASE_DIR),
    static_url_path="/static",
)

# Try to import Firebase storage, fall back to in-memory if not configured
try:
    from firebase_storage import (
        get_subjects, save_subject, delete_subject, update_subject,
        get_timetable, save_timetable,
        get_progress, update_progress,
        save_pomodoro_session, get_pomodoro_sessions,
        get_study_streak
    )
    FIREBASE_ENABLED = True
except Exception as e:
    print(f"Firebase not configured, using in-memory storage: {e}")
    FIREBASE_ENABLED = False
    from memory_storage import (
        get_subjects, save_subject, delete_subject, update_subject,
        get_timetable, save_timetable,
        get_progress, update_progress,
        save_pomodoro_session, get_pomodoro_sessions,
        get_study_streak
    )

from scheduler import generate_timetable, calculate_priority_scores

QUOTES = [
    {"text": "The secret of getting ahead is getting started.", "author": "Mark Twain"},
    {"text": "It always seems impossible until it's done.", "author": "Nelson Mandela"},
    {"text": "Don't watch the clock; do what it does. Keep going.", "author": "Sam Levenson"},
    {"text": "Success is the sum of small efforts, repeated day in and day out.", "author": "Robert Collier"},
    {"text": "Study hard, for the well is deep and our brains are shallow.", "author": "Richard Baxter"},
    {"text": "The expert in anything was once a beginner.", "author": "Helen Hayes"},
    {"text": "Push yourself, because no one else is going to do it for you.", "author": "Unknown"},
    {"text": "Great things never come from comfort zones.", "author": "Unknown"},
    {"text": "Dream it. Wish it. Do it.", "author": "Unknown"},
    {"text": "Little by little, one travels far.", "author": "J.R.R. Tolkien"},
]

@app.route("/")
def index():
    return render_template("index.html")

# ── Subjects ──────────────────────────────────────────────────────────────────

@app.route("/api/subjects", methods=["GET"])
def api_get_subjects():
    subjects = get_subjects()
    scores = calculate_priority_scores(subjects)
    for s in subjects:
        s["priority_score"] = round(scores.get(s["id"], 0), 2)
    return jsonify({"subjects": subjects})

@app.route("/api/subjects", methods=["POST"])
def api_add_subject():
    data = request.json
    required = ["name", "exam_date", "difficulty", "prep_level", "required_hours"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400
    subject = {
        "name": data["name"],
        "exam_date": data["exam_date"],
        "difficulty": int(data["difficulty"]),
        "prep_level": int(data["prep_level"]),
        "required_hours": float(data["required_hours"]),
        "color": data.get("color", "#6366f1"),
        "created_at": datetime.utcnow().isoformat()
    }
    doc_id = save_subject(subject)
    subject["id"] = doc_id
    return jsonify({"subject": subject}), 201

@app.route("/api/subjects/<subject_id>", methods=["PUT"])
def api_update_subject(subject_id):
    data = request.json
    update_subject(subject_id, data)
    return jsonify({"success": True})

@app.route("/api/subjects/<subject_id>", methods=["DELETE"])
def api_delete_subject(subject_id):
    delete_subject(subject_id)
    return jsonify({"success": True})

# ── Timetable ─────────────────────────────────────────────────────────────────

@app.route("/api/timetable", methods=["GET"])
def api_get_timetable():
    timetable = get_timetable()
    return jsonify({"timetable": timetable})

@app.route("/api/timetable/generate", methods=["POST"])
def api_generate_timetable():
    data = request.json or {}
    max_daily_hours = float(data.get("max_daily_hours", 6))
    subjects = get_subjects()
    if not subjects:
        return jsonify({"error": "No subjects added yet"}), 400
    timetable = generate_timetable(subjects, max_daily_hours)
    save_timetable(timetable)
    return jsonify({"timetable": timetable})

@app.route("/api/timetable/export", methods=["GET"])
def api_export_timetable():
    timetable = get_timetable()
    if not timetable:
        return jsonify({"error": "No timetable generated"}), 400
    lines = ["SMART STUDY PLANNER — TIMETABLE", "=" * 50, ""]
    for day_plan in timetable:
        lines.append(f"📅  {day_plan['date']}  ({day_plan['day_name']})")
        lines.append("-" * 40)
        for slot in day_plan["slots"]:
            lines.append(f"  • {slot['subject']}  —  {slot['hours']:.1f} hrs  [{slot['start_time']}–{slot['end_time']}]")
        lines.append(f"  Total: {day_plan['total_hours']:.1f} hrs")
        lines.append("")
    return "\n".join(lines), 200, {
        "Content-Type": "text/plain",
        "Content-Disposition": "attachment; filename=study_timetable.txt"
    }

# ── Progress ──────────────────────────────────────────────────────────────────

@app.route("/api/progress", methods=["GET"])
def api_get_progress():
    progress = get_progress()
    return jsonify({"progress": progress})

@app.route("/api/progress/<subject_id>", methods=["PUT"])
def api_update_progress(subject_id):
    data = request.json
    update_progress(subject_id, data)
    return jsonify({"success": True})

# ── Pomodoro ──────────────────────────────────────────────────────────────────

@app.route("/api/pomodoro/sessions", methods=["GET"])
def api_get_pomodoro_sessions():
    subject_id = request.args.get("subject_id")
    sessions = get_pomodoro_sessions(subject_id)
    return jsonify({"sessions": sessions})

@app.route("/api/pomodoro/sessions", methods=["POST"])
def api_save_pomodoro_session():
    data = request.json
    session = {
        "subject_id": data.get("subject_id", ""),
        "subject_name": data.get("subject_name", "General"),
        "duration_minutes": int(data.get("duration_minutes", 25)),
        "type": data.get("type", "work"),  # work | short_break | long_break
        "timestamp": datetime.utcnow().isoformat()
    }
    doc_id = save_pomodoro_session(session)
    session["id"] = doc_id
    return jsonify({"session": session}), 201

@app.route("/api/streak", methods=["GET"])
def api_get_streak():
    streak = get_study_streak()
    return jsonify({"streak": streak})

# ── Misc ──────────────────────────────────────────────────────────────────────

@app.route("/api/quote", methods=["GET"])
def api_get_quote():
    import random
    quote = random.choice(QUOTES)
    return jsonify(quote)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
