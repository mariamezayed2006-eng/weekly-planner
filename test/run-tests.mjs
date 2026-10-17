// Lightweight test suite for the planner's core logic.
// Runs with plain Node (no extra dependencies):  npm test

import assert from "node:assert/strict";

// Fake localStorage BEFORE importing schedule.js so the module's
// persistence functions exercise the same code path as the browser.
const backing = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (backing.has(k) ? backing.get(k) : null),
    setItem: (k, v) => backing.set(k, String(v)),
    removeItem: (k) => backing.delete(k),
    clear: () => backing.clear(),
  },
};

const {
  DAYS,
  ALL_TASK_IDS,
  STORAGE_KEY,
  CATEGORIES,
  dayIdFromDate,
  getDayStats,
  getWeekStats,
  clearDay,
  sanitizeCompleted,
  loadCompleted,
  saveCompleted,
} = await import("../src/data/schedule.js");

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log("Running planner tests…");

// ---- schedule integrity -------------------------------------

test("all seven days appear in order", () => {
  assert.deepEqual(
    DAYS.map((d) => d.id),
    ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  );
  assert.deepEqual(
    DAYS.map((d) => d.name),
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]
  );
});

test("every day has its exact task count", () => {
  const expected = { mon: 14, tue: 10, wed: 11, thu: 10, fri: 16, sat: 16, sun: 16 };
  for (const day of DAYS) {
    assert.equal(day.tasks.length, expected[day.id], `${day.name} count`);
  }
});

test("total scheduled entries = 93, all ids unique & stable", () => {
  assert.equal(ALL_TASK_IDS.length, 93);
  assert.equal(new Set(ALL_TASK_IDS).size, 93);
  for (const day of DAYS) {
    day.tasks.forEach((task, i) => {
      assert.equal(task.id, `${day.id}-${String(i + 1).padStart(2, "0")}`);
      assert.equal(typeof task.time, "string");
      assert.ok(task.time.length > 0);
      assert.ok(CATEGORIES[task.cat], `category ${task.cat} exists`);
    });
  }
});

test("overlapping entries are preserved (Mon 3–4:30 & 4:00–4:30)", () => {
  const mon = DAYS.find((d) => d.id === "mon");
  assert.equal(
    mon.tasks[5].time,
    "3:00–4:30 PM",
    "study block kept in order"
  );
  assert.equal(
    mon.tasks[6].time,
    "4:00–4:30 PM",
    "overlapping coffee block kept after it"
  );
});

test("Thursday coffee note keeps its condition", () => {
  const thu = DAYS.find((d) => d.id === "thu");
  const coffee = thu.tasks.find((t) => t.activity.startsWith("Coffee time"));
  assert.match(
    coffee.activity,
    /college break if possible; otherwise after getting home/
  );
});

// ---- progress math ------------------------------------------

test("getDayStats counts correctly", () => {
  const mon = DAYS.find((d) => d.id === "mon");
  const done5 = {
    "mon-01": true,
    "mon-02": true,
    "mon-03": true,
    "mon-04": true,
    "mon-05": true,
  };
  assert.deepEqual(getDayStats(mon, {}), { done: 0, total: 14, pct: 0 });
  assert.deepEqual(getDayStats(mon, done5), { done: 5, total: 14, pct: 36 });
  assert.deepEqual(
    getDayStats(mon, Object.fromEntries(mon.tasks.map((t) => [t.id, true]))),
    { done: 14, total: 14, pct: 100 }
  );
});

test("weekly stats count each entry exactly once (not a % average)", () => {
  const avgStyle = Math.round(
    DAYS.reduce((s, d) => s + getDayStats(d, {}), 0) / DAYS.length
  );
  const week = getWeekStats({});
  assert.equal(week.total, 93); // counts entries, not days
  assert.equal(week.done, 0);
  assert.equal(week.pct, 0);
  // half of Monday done ≠ anything averaged:
  const halfMon = Object.fromEntries(
    DAYS.find((d) => d.id === "mon").tasks.slice(0, 7).map((t) => [t.id, true])
  );
  const w2 = getWeekStats(halfMon);
  assert.equal(w2.done, 7);
  assert.equal(w2.pct, Math.round((7 / 93) * 100));
  assert.notEqual(w2.pct, avgStyle); // guards against naive equal averaging
});

// ---- persistence (localStorage) -----------------------------

test("save then load round-trips through localStorage", () => {
  const state = { "tue-05": true, "sun-16": true };
  assert.equal(saveCompleted(state), true);
  assert.deepEqual(loadCompleted(), state);
});

test("corrupt stored data never crashes — sanitized to {}", () => {
  backing.set(STORAGE_KEY, "{not json");
  assert.deepEqual(loadCompleted(), {});

  backing.set(STORAGE_KEY, JSON.stringify({ nonsense: true, 5: true }));
  assert.deepEqual(loadCompleted(), {});

  backing.set(STORAGE_KEY, "null");
  assert.deepEqual(loadCompleted(), {});
});

test("nonexistent / falsy ids are dropped by sanitizeCompleted", () => {
  assert.deepEqual(sanitizeCompleted(null), {});
  assert.deepEqual(sanitizeCompleted("junk"), {});
  assert.deepEqual(
    sanitizeCompleted({ "mon-01": true, "bogus-id": true, "tue-03": false }),
    { "mon-01": true }
  );
});

test("missing storage (no window) degrades safely", () => {
  const savedWindow = globalThis.window;
  delete globalThis.window;
  assert.deepEqual(loadCompleted(), {});
  assert.equal(saveCompleted({ "mon-01": true }), false);
  globalThis.window = savedWindow;
});

// ---- reset behavior ------------------------------------------

test("clearDay removes only that day's entries", () => {
  const state = {
    "sat-01": true,
    "sat-10": true,
    "mon-03": true,
    "sun-16": true,
  };
  const after = clearDay(state, "sat");
  assert.deepEqual(after, { "mon-03": true, "sun-16": true });
  // original map untouched (cancel-safe by construction)
  assert.deepEqual(state, {
    "sat-01": true,
    "sat-10": true,
    "mon-03": true,
    "sun-16": true,
  });
});

test("clearDay on empty/undefined input is safe", () => {
  assert.deepEqual(clearDay(null, "mon"), {});
  assert.deepEqual(clearDay(undefined, "sat"), {});
});

test("day id derived from Date uses device local weekday", () => {
  assert.equal(dayIdFromDate(new Date(2026, 9, 17)), "sat"); // Oct 17 2026 = Saturday
  assert.equal(dayIdFromDate(new Date(2026, 9, 12)), "mon"); // Monday
  assert.equal(dayIdFromDate(new Date(2026, 9, 18)), "sun"); // Sunday
});

console.log(`\nAll ${passed} tests passed 🎀`);
