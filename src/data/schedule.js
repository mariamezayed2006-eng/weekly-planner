// ============================================================
// Mariam's Little Weekly Planner 🎀 — schedule data (source of truth)
// Every entry below is preserved exactly as planned: labels, time
// strings, order, and overlapping entries are kept as written.
// ============================================================

export const STORAGE_KEY = "mariams-weekly-planner-v1";

// Category definitions — colors are soft accents for scanning, the
// activity wording itself is never changed.
export const CATEGORIES = {
  university: { label: "University & commute", color: "#B89A83" }, // latte beige
  course:     { label: "Online course",         color: "#E2C489" }, // warm cream / pale gold
  study:      { label: "Study & assignments",   color: "#CDB8DD" }, // muted dusty lavender
  pc:         { label: "PC project work",       color: "#CE93AC" }, // muted rose
  gym:        { label: "Gym",                   color: "#EFB0C2" }, // blush pink
  meals:      { label: "Meals",                 color: "#C08A72" }, // warm latte
  coffee:     { label: "Coffee time",           color: "#DEC3A8" }, // pale latte
  sleep:      { label: "Sleep",                 color: "#DCCBAD" }, // soft beige
  rest:       { label: "Rest & wind-down",      color: "#EFDCD6" }, // pale neutral pink
  free:       { label: "Free time & hobbies",   color: "#F3C8D2" }, // light blush
  chores:     { label: "Chores",                color: "#A99A8E" }, // muted warm neutral
  personal:   { label: "Personal prep",         color: "#F5C9CF" }, // pale pink
};

// Build stable ids like "mon-01" from the day id + position.
const t = (dayId, i, time, activity, cat) => ({
  id: `${dayId}-${String(i + 1).padStart(2, "0")}`,
  time,
  activity,
  cat,
});

export const DAYS = [
  {
    id: "mon",
    name: "Monday",
    emoji: "🎀",
    tasks: [
      t("mon", 0, "10:30–11:00 AM", "Wake up, wash up and breakfast", "personal"),
      t("mon", 1, "11:00 AM–1:30 PM", "Gym + travel", "gym"),
      t("mon", 2, "1:30–2:00 PM", "Shower", "personal"),
      t("mon", 3, "2:00–2:30 PM", "Lunch", "meals"),
      t("mon", 4, "2:30–3:00 PM", "Rest", "rest"),
      t("mon", 5, "3:00–4:30 PM", "Study / course homework", "study"),
      t("mon", 6, "4:00–4:30 PM", "Coffee time ☕", "coffee"),
      t("mon", 7, "4:30–5:00 PM", "Break and snack", "rest"),
      t("mon", 8, "5:00–5:50 PM", "PC project work", "pc"),
      t("mon", 9, "5:50–6:00 PM", "Prepare for course", "personal"),
      t("mon", 10, "6:00–9:00 PM", "Online course", "course"),
      t("mon", 11, "9:00–9:30 PM", "Dinner", "meals"),
      t("mon", 12, "9:30–10:00 PM", "Wind down", "rest"),
      t("mon", 13, "10:00 PM", "Sleep", "sleep"),
    ],
  },
  {
    id: "tue",
    name: "Tuesday",
    emoji: "🌸",
    tasks: [
      t("tue", 0, "6:00–6:30 AM", "Wake up and get ready", "personal"),
      t("tue", 1, "6:30–7:10 AM", "Breakfast and leave preparation", "meals"),
      t("tue", 2, "7:10 AM–7:00 PM", "College and commute", "university"),
      t("tue", 3, "7:00–7:30 PM", "Dinner", "meals"),
      t("tue", 4, "7:30–8:00 PM", "Rest and decompress", "rest"),
      t("tue", 5, "8:00–8:30 PM", "Coffee time ☕", "coffee"),
      t("tue", 6, "8:00–8:45 PM", "Optional light PC task", "pc"),
      t("tue", 7, "8:45–9:30 PM", "Free time", "free"),
      t("tue", 8, "9:30–10:00 PM", "Prepare for tomorrow and wind down", "personal"),
      t("tue", 9, "10:00 PM", "Sleep", "sleep"),
    ],
  },
  {
    id: "wed",
    name: "Wednesday",
    emoji: "📚",
    tasks: [
      t("wed", 0, "6:00–6:30 AM", "Wake up and get ready", "personal"),
      t("wed", 1, "6:30–7:10 AM", "Breakfast and leave preparation", "meals"),
      t("wed", 2, "7:10 AM–7:00 PM", "College and commute", "university"),
      t("wed", 3, "7:00–7:30 PM", "Dinner", "meals"),
      t("wed", 4, "7:30–8:00 PM", "Rest", "rest"),
      t("wed", 5, "8:00–8:30 PM", "Coffee time ☕", "coffee"),
      t("wed", 6, "8:00–8:30 PM", "Check deadlines and review notes", "study"),
      t("wed", 7, "8:30–9:15 PM", "Free time", "free"),
      t("wed", 8, "9:15–9:30 PM", "Prepare bag and clothes", "personal"),
      t("wed", 9, "9:30–10:00 PM", "Wind down", "rest"),
      t("wed", 10, "10:00 PM", "Sleep", "sleep"),
    ],
  },
  {
    id: "thu",
    name: "Thursday",
    emoji: "☕",
    tasks: [
      t("thu", 0, "6:00–6:30 AM", "Wake up and get ready", "personal"),
      t("thu", 1, "6:30–7:10 AM", "Breakfast and leave preparation", "meals"),
      t("thu", 2, "7:10 AM–6:00 PM", "College and commute", "university"),
      t("thu", 3, "4:30–5:00 PM", "Coffee time ☕ during a college break if possible; otherwise after getting home", "coffee"),
      t("thu", 4, "6:00–7:00 PM", "Attend course on your phone", "course"),
      t("thu", 5, "7:00–7:30 PM", "Get home and eat", "meals"),
      t("thu", 6, "7:30–9:00 PM", "Continue online course", "course"),
      t("thu", 7, "9:00–9:30 PM", "Dinner / finish eating", "meals"),
      t("thu", 8, "9:30–10:00 PM", "Wind down", "rest"),
      t("thu", 9, "10:00 PM", "Sleep", "sleep"),
    ],
  },
  {
    id: "fri",
    name: "Friday",
    emoji: "✨",
    tasks: [
      t("fri", 0, "10:30–11:00 AM", "Wake up and breakfast", "personal"),
      t("fri", 1, "11:00 AM–1:30 PM", "Gym + travel", "gym"),
      t("fri", 2, "1:30–2:00 PM", "Shower", "personal"),
      t("fri", 3, "2:00–2:30 PM", "Lunch", "meals"),
      t("fri", 4, "2:30–3:00 PM", "Rest", "rest"),
      t("fri", 5, "3:00–5:00 PM", "Focused PC project work", "pc"),
      t("fri", 6, "5:00–5:30 PM", "Break", "rest"),
      t("fri", 7, "5:30–6:30 PM", "Assignments or course homework", "study"),
      t("fri", 8, "6:30–7:00 PM", "Chores", "chores"),
      t("fri", 9, "7:00–7:30 PM", "Dinner", "meals"),
      t("fri", 10, "7:30–10:00 PM", "Free time, friends or hobbies", "free"),
      t("fri", 11, "8:00–8:30 PM", "Coffee time ☕", "coffee"),
      t("fri", 12, "10:00 PM–12:00 AM", "Optional PC work or entertainment", "pc"),
      t("fri", 13, "12:00–1:30 AM", "Relax and enjoy your evening", "free"),
      t("fri", 14, "1:30–2:30 AM", "Wind down", "rest"),
      t("fri", 15, "2:30 AM", "Sleep", "sleep"),
    ],
  },
  {
    id: "sat",
    name: "Saturday",
    emoji: "🎀",
    tasks: [
      t("sat", 0, "10:30–11:00 AM", "Wake up and breakfast", "personal"),
      t("sat", 1, "11:00 AM–1:30 PM", "Gym + travel", "gym"),
      t("sat", 2, "1:30–2:00 PM", "Shower", "personal"),
      t("sat", 3, "2:00–2:30 PM", "Lunch", "meals"),
      t("sat", 4, "2:30–3:00 PM", "Rest", "rest"),
      t("sat", 5, "3:00–4:00 PM", "Study or course homework", "study"),
      t("sat", 6, "4:00–4:30 PM", "Coffee time ☕", "coffee"),
      t("sat", 7, "4:00–5:00 PM", "Free time", "free"),
      t("sat", 8, "5:00–5:45 PM", "PC work — small task", "pc"),
      t("sat", 9, "5:45–6:00 PM", "Prepare for course", "personal"),
      t("sat", 10, "6:00–9:00 PM", "Online course", "course"),
      t("sat", 11, "9:00–9:30 PM", "Dinner", "meals"),
      t("sat", 12, "9:30 PM–12:30 AM", "Free time", "free"),
      t("sat", 13, "12:30–1:30 AM", "Optional light study or entertainment", "study"),
      t("sat", 14, "1:30–2:30 AM", "Wind down", "rest"),
      t("sat", 15, "2:30 AM", "Sleep", "sleep"),
    ],
  },
  {
    id: "sun",
    name: "Sunday",
    emoji: "💤",
    tasks: [
      t("sun", 0, "10:30–11:00 AM", "Wake up and breakfast", "personal"),
      t("sun", 1, "11:00 AM–1:30 PM", "Gym + travel", "gym"),
      t("sun", 2, "1:30–2:00 PM", "Shower", "personal"),
      t("sun", 3, "2:00–2:30 PM", "Lunch", "meals"),
      t("sun", 4, "2:30–3:00 PM", "Rest", "rest"),
      t("sun", 5, "3:00–4:30 PM", "Study and assignments", "study"),
      t("sun", 6, "4:00–4:30 PM", "Coffee time ☕", "coffee"),
      t("sun", 7, "4:30–5:00 PM", "Break and snack", "rest"),
      t("sun", 8, "5:00–7:00 PM", "Focused PC project work", "pc"),
      t("sun", 9, "7:00–7:30 PM", "Dinner", "meals"),
      t("sun", 10, "7:30–8:30 PM", "Chores and prepare for the week", "chores"),
      t("sun", 11, "8:30–10:30 PM", "Free time", "free"),
      t("sun", 12, "10:30 PM–12:30 AM", "Optional PC work or entertainment", "pc"),
      t("sun", 13, "12:30–1:30 AM", "Relax", "free"),
      t("sun", 14, "1:30–2:30 AM", "Wind down", "rest"),
      t("sun", 15, "2:30 AM", "Sleep", "sleep"),
    ],
  },
];

// ---- Derived helpers (pure, testable) ------------------------

export const ALL_TASK_IDS = DAYS.flatMap((d) => d.tasks.map((task) => task.id));

/** Map a JS Date to a schedule day id ("sun".."sat" per device local date). */
export function dayIdFromDate(date) {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][date.getDay()];
}

/**
 * Stats for one day: { done, total, pct }.
 * pct = completed / total × 100, rounded.
 */
export function getDayStats(day, completed) {
  const total = day.tasks.length;
  const done = day.tasks.reduce((n, task) => n + (completed?.[task.id] ? 1 : 0), 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}

/**
 * Weekly stats across ALL days — every scheduled entry counts exactly
 * once (never an average of daily percentages).
 */
export function getWeekStats(completed) {
  const total = ALL_TASK_IDS.length;
  const done = ALL_TASK_IDS.reduce((n, id) => n + (completed?.[id] ? 1 : 0), 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}

/**
 * Removes every completed entry belonging to one day (prefix match on
 * the stable id, e.g. "sat-…"). Returns a new map; the original is
 * untouched so a cancelled reset can never affect saved progress.
 */
export function clearDay(completed, dayId) {
  const next = {};
  const prefix = `${dayId}-`;
  for (const [id, value] of Object.entries(completed || {})) {
    if (!id.startsWith(prefix) && value) next[id] = true;
  }
  return next;
}

/**
 * Keeps only entries whose id exists in the schedule with a truthy
 * value — invalid or missing stored data degrades gracefully to {}.
 */
export function sanitizeCompleted(value) {
  if (!value || typeof value !== "object") return {};
  const clean = {};
  for (const id of ALL_TASK_IDS) {
    if (value[id]) clean[id] = true;
  }
  return clean;
}

export function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage || null;
  } catch {
    return null;
  }
}

/** Load + sanitize saved progress; any storage error is swallowed. */
export function loadCompleted() {
  const ls = getStorage();
  if (!ls) return {};
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return {};
    return sanitizeCompleted(JSON.parse(raw));
  } catch {
    return {};
  }
}

/** Persist progress; a storage failure never crashes the app. */
export function saveCompleted(completed) {
  const ls = getStorage();
  if (!ls) return false;
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(completed || {}));
    return true;
  } catch {
    return false;
  }
}
